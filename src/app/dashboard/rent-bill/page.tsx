import { getCurrentUser } from "@/auth/nextjs/currentUser";
import { db } from "@/drizzle/db";
import {
  ApartmentTable,
  FloorTable,
  RoomTable,
  UserTable,
  PaymentPlanTable,
  RentTable,
} from "@/drizzle/schema";
import { asc, eq, and, gte, lt } from "drizzle-orm";
import { Check, Send, CircleDollarSign } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import App from "@/components/Sidebar/App";
import Link from "next/link";
import ApartmentSelectForm from "@/components/ApartmentSelectForm";

// Save rent bills for each room for the selected month/year
async function saveRentBills(formData: FormData) {
  "use server";
  try {
    const currentUser = await getCurrentUser({ withFullUser: true, redirectIfNotFound: true });
    const now = new Date();
    const selectedMonth = formData.get("selectedMonth")?.toString();
    const selectedYear = formData.get("selectedYear")?.toString();
    const apartmentIndex = formData.get("apartmentIndex")?.toString();
    if (!selectedMonth || !selectedYear || !apartmentIndex) {
      throw new Error("Missing month/year/apartment");
    }
    // Calculate the start and end of the selected month
    const year = parseInt(selectedYear) - 543; // Thai year to Gregorian
    const month = parseInt(selectedMonth) - 1;
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 1);

    // Get all form data
    const entries = Array.from(formData.entries());
    const rentData: { [key: string]: any } = {};
    entries.forEach(([key, value]) => {
      if (key.startsWith("rent_")) {
        const [, roomId] = key.split("_");
        rentData[roomId] = Number(value);
      }
    });

    // Save rent for each room
    for (const [roomId, rentValue] of Object.entries(rentData)) {
      // Get payment plan for this room
      const paymentPlan = await db.query.PaymentPlanTable.findFirst({
        where: eq(PaymentPlanTable.roomId, parseInt(roomId)),
        with: {
          room: true,
          tenant: true
        }
      });
      
      // If payment plan exists, update it
      if (paymentPlan) {
        await db.update(PaymentPlanTable)
          .set({ 
            fee: rentValue, 
            updatedAt: now 
          })
          .where(eq(PaymentPlanTable.id, paymentPlan.id));
        
        // Check if a rent record exists for this month
        const existingRent = await db.query.RentTable.findFirst({
          where: (table, { and, eq, gte, lt }) =>
            and(
              eq(table.paymentPlanId, paymentPlan.id),
              gte(table.createdAt, monthStart),
              lt(table.createdAt, monthEnd)
            ),
        });
        if (existingRent) {
          await db.update(RentTable)
            .set({ 
              fee: rentValue, 
              updatedAt: now 
            })
            .where(eq(RentTable.id, existingRent.id));
        } else {
          await db.insert(RentTable).values({
            paymentPlanId: paymentPlan.id,
            fee: rentValue,
            paid: false,
            late: false,
            createdAt: monthStart,
            updatedAt: now,
          });
        }
      } else {
        // Create a new payment plan for this room if it doesn't exist
        const newPaymentPlan = await db.insert(PaymentPlanTable).values({
          roomId: parseInt(roomId),
          fee: rentValue,
          createdAt: now,
          updatedAt: now,
        }).returning();
        
        if (newPaymentPlan[0]) {
          // Create rent record for the new payment plan
          await db.insert(RentTable).values({
            paymentPlanId: newPaymentPlan[0].id,
            fee: rentValue,
            paid: false,
            late: false,
            createdAt: monthStart,
            updatedAt: now,
          });
        }
      }
    }
    redirect("/dashboard/rent-bill");
  } catch (error) {
    console.error("Error saving rent bills:", error);
    redirect("/dashboard/rent-bill");
  }
}

// Send all bills for selected rooms - update rent records with userId
async function sendAllBillsAction(formData: FormData) {
  "use server";
  
  try {
    const currentUser = await getCurrentUser({ withFullUser: true, redirectIfNotFound: true });
    const now = new Date();
    const selectedMonth = formData.get("selectedMonth")?.toString();
    const selectedYear = formData.get("selectedYear")?.toString();
    
    if (!selectedMonth || !selectedYear) {
      console.error("Missing month/year");
      return;
    }
    
    // Calculate the start and end of the selected month
    const year = parseInt(selectedYear) - 543; // Thai year to Gregorian
    const month = parseInt(selectedMonth) - 1;
    const selectedMonthStart = new Date(year, month, 1);
    const selectedMonthEnd = new Date(year, month + 1, 1);
    
    // Get apartment ID from form data
    const apartmentIndex = formData.get("apartmentIndex")?.toString();
    if (!apartmentIndex) {
      console.error("No apartment index provided");
      return;
    }
    
    const apartments = await getApartments(currentUser.id);
    const currentApartmentId = apartments[parseInt(apartmentIndex)]?.id;
    if (!currentApartmentId) {
      console.error("Invalid apartment");
      return;
    }
    
    // Get all rooms with their tenants and payment plans
    const roomsData = await getRooms(currentApartmentId, now, selectedMonth, selectedYear);
    
    for (const floor of roomsData) {
      for (const room of floor.rooms) {
        if (!room.paymentPlan) continue;
        
        // Check if room has a tenant
        if (!room.paymentPlan.tenant) continue;
        
        const userId = room.paymentPlan.tenant.id;
        const paymentPlanId = room.paymentPlan.id;
        
        // Update selected month rent records with userId
        const selectedMonthRents = await db.query.RentTable.findMany({
          where: (table, { and, eq, gte, lt, isNull }) => and(
            eq(table.paymentPlanId, paymentPlanId),
            gte(table.createdAt, selectedMonthStart),
            lt(table.createdAt, selectedMonthEnd),
            isNull(table.userId)
          )
        });
        for (const rentRecord of selectedMonthRents) {
          await db.update(RentTable)
            .set({ userId: userId })
            .where(eq(RentTable.id, rentRecord.id));
        }
      }
    }
    
    console.log("ส่งบิลค่าเช่าทั้งหมดเรียบร้อยแล้ว");
    redirect('/dashboard/rent-bill');
  } catch (error) {
    console.error("Error sending all rent bills:", error);
    redirect('/dashboard/rent-bill');
  }
}

// Fetch all rooms for the selected apartment, grouped by floor
async function getRooms(apartment: number, now: Date, selectedMonth?: string, selectedYear?: string) {
  // Calculate the start and end of the selected month if provided
  let monthStart: Date | undefined;
  let monthEnd: Date | undefined;
  
  if (selectedMonth && selectedYear) {
    const year = parseInt(selectedYear) - 543; // Thai year to Gregorian
    const month = parseInt(selectedMonth) - 1;
    monthStart = new Date(year, month, 1);
    monthEnd = new Date(year, month + 1, 1);
  }
  
  return db.query.FloorTable.findMany({
    columns: { id: true, floor: true },
    where: (table, { eq }) => eq(table.apartmentId, apartment),
    orderBy: (table, { asc }) => asc(table.floor),
    with: {
      rooms: {
        columns: { createdAt: false, updatedAt: false },
        orderBy: (table, { asc }) => asc(table.roomNumber),
        with: {
          paymentPlan: {
            columns: { fee: true, id: true },
            with: {
              tenant: {
                columns: { id: true, name: true },
              },
              rentBills: monthStart && monthEnd ? {
                columns: { fee: true, paid: true, createdAt: true, userId: true },
                where: (table, { and, gte, lt }) => and(
                  gte(table.createdAt, monthStart!),
                  lt(table.createdAt, monthEnd!)
                ),
                orderBy: (table, { desc }) => desc(table.createdAt),
                limit: 1,
              } : {
                columns: { fee: true, paid: true, createdAt: true, userId: true },
                orderBy: (table, { desc }) => desc(table.createdAt),
                limit: 1,
              },
            },
          },
        },
      },
    },
  });
}

// Fetch all apartments for the current user
async function getApartments(user: string) {
  return db.select({
    id: ApartmentTable.id,
    name: ApartmentTable.name,
    address: ApartmentTable.address,
  })
    .from(UserTable)
    .where(eq(UserTable.id, user))
    .leftJoin(ApartmentTable, eq(UserTable.id, ApartmentTable.userId));
}

export default async function Page({ searchParams }: { searchParams: any }) {
  const { apartment, search, selectedMonth, selectedYear } = await searchParams;
  const currentApartment = apartment ? parseInt(apartment) : 0;
  const now = new Date();
  const currentUser = await getCurrentUser({ withFullUser: true, redirectIfNotFound: true });
  const apartments = await getApartments(currentUser.id);
  if (!apartments[currentApartment]?.id) {
    return (
      <App title="บิลค่าเช่า" userName={currentUser.name}>
        <div className="flex flex-col items-center justify-center h-full p-10">
          <p className="text-xl mb-4">คุณยังไม่มีหอพักในระบบ</p>
          <Link
            href="/dashboard/new-apartment"
            className="bg-[#01BCB4] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            สร้างหอพักใหม่
          </Link>
        </div>
      </App>
    );
  }
  // Month/year selection
  const currentDate = new Date();
  const monthValue = selectedMonth || String(currentDate.getMonth() + 1).padStart(2, "0");
  const yearValue = selectedYear || String(currentDate.getFullYear() + 543);
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2023, i, 1);
    return {
      value: String(i + 1).padStart(2, "0"),
      label: date.toLocaleString("th-TH", { month: "long" }),
    };
  });
  const years = Array.from({ length: 11 }, (_, i) => {
    const year = currentDate.getFullYear() + 543 - 10 + i;
    return {
      value: String(year),
      label: String(year),
    };
  });
  let data = await getRooms(apartments[currentApartment].id, now, monthValue, yearValue);
  // Server-side filter by tenant name if search param is present
  let searchValue = typeof search === "string" ? search.trim().toLowerCase() : "";
  if (searchValue) {
    data = data.map(floor => ({
      ...floor,
      rooms: floor.rooms.filter(room =>
        room.paymentPlan?.tenant &&
        room.paymentPlan.tenant.name.toLowerCase().includes(searchValue)
      ),
    })).filter(floor => floor.rooms.length > 0);
  }
  // Check if there are any rooms in the apartment
  const hasRooms = data && data.length > 0 && data.some(floor => floor.rooms && floor.rooms.length > 0);
  if (!hasRooms) {
    redirect(`/dashboard/create-rooms?apartmentId=${apartments[currentApartment].id}&from=rent-bill`);
  }
  // Table rendering
  return (
    <App title="บิลค่าเช่า" userName={currentUser.name}>
      <div className="bg-white min-h-screen shadow-md rounded-2xl">
        <div className="flex flex-col gap-2 bg-slate-50 rounded-xl shadow-sm px-6 py-4 mb-4 items-center md:flex-row md:justify-between md:items-center">
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <form method="get" className="flex gap-2 items-center">
              <input type="hidden" name="apartment" value={currentApartment} />
              <input type="text" name="search" placeholder="ค้นหาชื่อผู้เช่า..." defaultValue={searchValue} className="border border-slate-300 placeholder-slate-500 rounded-md px-2 py-1" />
              <button type="submit" className="bg-slate-800 hover:bg-[#3491b4] text-white px-3 py-1 rounded-md">ค้นหา</button>
            </form>
            <div className="hidden md:block w-px h-8 bg-slate-300 mx-4" />
            <ApartmentSelectForm 
              apartments={apartments as any} 
              currentApartment={currentApartment} 
            />
          </div>
          <form method="get" className="flex gap-2 items-center">
            <input type="hidden" name="apartment" value={currentApartment} />
            {searchValue && <input type="hidden" name="search" value={searchValue} />}
            <select name="selectedMonth" defaultValue={monthValue} className="border rounded-md px-2 py-1">
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
            <select name="selectedYear" defaultValue={yearValue} className="border rounded-md px-2 py-1">
              {years.map(year => (
                <option key={year.value} value={year.value}>{year.label}</option>
              ))}
            </select>
            <button type="submit" className="bg-slate-800 hover:bg-[#3491b4] text-white px-3 py-1 rounded-md">เปลี่ยนเดือน/ปี</button>
          </form>
        </div>
        <div className="sticky top-0 z-10 flex bg-white px-7 py-2 border-b border-slate-300 justify-end">
          <div className="flex gap-2 items-center mt-2 md:mt-0">
            <button type="submit" className="flex px-5 py-2 bg-slate-800 hover:bg-[#3491b4] rounded-lg text-white items-center" form="rentBillForm">
              <Check className="text-white mr-3" />บันทึก
            </button>
            <form action={sendAllBillsAction} className="inline">
              <input type="hidden" name="apartmentIndex" value={currentApartment} />
              <button type="submit" className="flex px-5 py-2 bg-slate-800 hover:bg-[#3491b4] rounded-lg text-white items-center">
                <Send className="text-white mr-3" />ส่งทั้งหมด
              </button>
            </form>
          </div>
        </div>
        <form action={saveRentBills} id="rentBillForm">
          <input type="hidden" name="apartmentIndex" value={currentApartment} />
          <input type="hidden" name="selectedMonth" value={monthValue} />
          <input type="hidden" name="selectedYear" value={yearValue} />
          <div className="rounded-lg shadow-sm mx-4 my-7">
            <table className="w-full">
              <thead className="px-4 py-0.25 text-center border-x border-slate-300">
                <tr className="border-b border-slate-300 bg-slate-200 border-x border-slate-300">
                  <td className="px-4 py-0.25 text-center">ชั้น</td>
                  <td className="px-4 py-0.25 text-center">ห้อง</td>
                  <td className="px-4 py-0.25 text-center">ผู้เช่า</td>
                  <td className="px-4 py-0.25 flex flex-col sm:items-center text-center">
                    <div className="m-1 flex">
                      <CircleDollarSign className="text-[#FFAC3E]" />ค่าเช่า
                    </div>
                    <div>กรอกค่าเช่า</div>
                  </td>
                  <td className="px-4 py-0.25 text-center">สถานะชำระ</td>
                  <td className="px-4 py-0.25 text-center">ปริ้นท์บิล</td>
                </tr>
              </thead>
              <tbody>
                {data.map((floor, floorIndex) => (
                  <React.Fragment key={`floor-${floor.id}`}>
                    {floor.rooms.map((room, index) => (
                      <tr key={`${floor.id}-${room.id}`} className="border-b border-slate-300 even:bg-slate-200">
                        {index === 0 && (
                          <td rowSpan={floor.rooms.length} className="border border-slate-300 px-4 py-0.25">{floor.floor}</td>
                        )}
                        <td className="border border-slate-300 px-4 py-0.25">{room.roomNumber}</td>
                        <td className="px-4 py-0.25">
                          {room.paymentPlan?.tenant ? (
                            <div>{room.paymentPlan.tenant.name}</div>
                          ) : (
                            <span className="text-gray-500 italic">ลูกเช่ายังไม่สมัครเว็ปไซต์</span>
                          )}
                        </td>
                        <td className="px-4 py-0.25 text-center">
                          <input
                            type="number"
                            name={`rent_${room.id}`}
                            defaultValue={room.paymentPlan?.fee ?? 0}
                            className="text-center border border-slate-300 w-28 bg-white rounded-md"
                          />
                        </td>
                        <td className="px-4 py-0.25 text-center">
                          {room.paymentPlan?.rentBills?.[0] ? 
                            (room.paymentPlan.rentBills[0].paid ? "ชำระแล้ว" : "ยังไม่ชำระ") : 
                            "ยังไม่ส่ง"
                          }
                        </td>
                        <td className="px-4 py-0.25 text-center">
                          <Link href="/" target="_blank" rel="noopener" className="bg-[#FFAC3E] hover:bg-[#FFAC3E] rounded-lg text-white py-0.25 px-2">พิมพ์</Link>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end p-4"></div>
          </div>
        </form>
      </div>
    </App>
  );
}
