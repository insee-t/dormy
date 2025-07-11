import { getCurrentUser } from "@/auth/nextjs/currentUser";
import { db } from "@/drizzle/db";
import { ElectricTable, PaymentPlanTable, WaterTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { Check, Droplets, Send, Zap } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import App from "@/components/Sidebar/App";
import Link from "next/link";
import getApartments from "@/lib/getApartments";
import ApartmentSelectForm from "@/components/ApartmentSelectForm";
import PrintInvoiceButton from "@/components/PrintInvoiceButton";

async function saveMeterReadings(formData: FormData) {
  "use server"

  try {
    const currentUser = await getCurrentUser({ withFullUser: true, redirectIfNotFound: true });
    const now = new Date();
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15); // Middle of previous month
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 15); // Middle of current month
    const prevMonthStart = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 1);
    const prevMonthEnd = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 1);
    const currentMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const currentMonthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

    // Get all form data
    const entries = Array.from(formData.entries());
    const meterData: { [key: string]: any } = {};

    // Parse form data
    entries.forEach(([key, value]) => {
      if (key.startsWith('meter_')) {
        const [type, roomId, period] = key.split('_');
        if (!meterData[roomId]) {
          meterData[roomId] = { water: {}, electric: {} };
        }
        if (type === 'meter') {
          if (period === 'water') {
            meterData[roomId].water.current = Number(value);
          } else if (period === 'waterPrev') {
            meterData[roomId].water.previous = Number(value);
          } else if (period === 'electric') {
            meterData[roomId].electric.current = Number(value);
          } else if (period === 'electricPrev') {
            meterData[roomId].electric.previous = Number(value);
          }
        }
      }
    });

    // Save meter readings for each room
    for (const [roomId, readings] of Object.entries(meterData)) {
      // Get payment plan for this room
      const paymentPlan = await db.query.PaymentPlanTable.findFirst({
        where: eq(PaymentPlanTable.roomId, parseInt(roomId)),
        with: {
          electrics: {
            orderBy: (table, { desc }) => desc(table.createdAt),
            limit: 1
          },
          waters: {
            orderBy: (table, { desc }) => desc(table.createdAt),
            limit: 1
          }
        }
      });

      if (!paymentPlan) continue;

      // --- PREVIOUS MONTH WATER ---
      if (readings.water.previous !== undefined && readings.water.previous > 0) {
        const existingPrevWater = await db.query.WaterTable.findFirst({
          where: (table, { and, eq, gte, lt }) => and(
            eq(table.paymentPlanId, paymentPlan.id),
            gte(table.createdAt, prevMonthStart),
            lt(table.createdAt, prevMonthEnd)
          )
        });
        if (existingPrevWater) {
          await db.update(WaterTable)
            .set({
              meter: readings.water.previous,
              updatedAt: prevMonth,
            })
            .where(eq(WaterTable.id, existingPrevWater.id));
        } else {
          await db.insert(WaterTable).values({
            meter: readings.water.previous,
            paymentPlanId: paymentPlan.id,
            paid: false,
            late: false,
            createdAt: prevMonth,
            updatedAt: prevMonth,
          });
        }
      }

      // --- PREVIOUS MONTH ELECTRIC ---
      if (readings.electric.previous !== undefined && readings.electric.previous > 0) {
        const existingPrevElectric = await db.query.ElectricTable.findFirst({
          where: (table, { and, eq, gte, lt }) => and(
            eq(table.paymentPlanId, paymentPlan.id),
            gte(table.createdAt, prevMonthStart),
            lt(table.createdAt, prevMonthEnd)
          )
        });
        if (existingPrevElectric) {
          await db.update(ElectricTable)
            .set({
              meter: readings.electric.previous,
              updatedAt: prevMonth,
            })
            .where(eq(ElectricTable.id, existingPrevElectric.id));
        } else {
          await db.insert(ElectricTable).values({
            meter: readings.electric.previous,
            paymentPlanId: paymentPlan.id,
            paid: false,
            late: false,
            createdAt: prevMonth,
            updatedAt: prevMonth,
          });
        }
      }

      // --- CURRENT MONTH WATER ---
      if (readings.water.current !== undefined && readings.water.current > 0) {
        const existingCurrentWater = await db.query.WaterTable.findFirst({
          where: (table, { and, eq, gte, lt }) => and(
            eq(table.paymentPlanId, paymentPlan.id),
            gte(table.createdAt, currentMonthStart),
            lt(table.createdAt, currentMonthEnd)
          )
        });
        if (existingCurrentWater) {
          await db.update(WaterTable)
            .set({
              meter: readings.water.current,
              updatedAt: currentMonth,
            })
            .where(eq(WaterTable.id, existingCurrentWater.id));
        } else {
          await db.insert(WaterTable).values({
            meter: readings.water.current,
            paymentPlanId: paymentPlan.id,
            paid: false,
            late: false,
            createdAt: currentMonth,
            updatedAt: currentMonth,
          });
        }
      }

      // --- CURRENT MONTH ELECTRIC ---
      if (readings.electric.current !== undefined && readings.electric.current > 0) {
        const existingCurrentElectric = await db.query.ElectricTable.findFirst({
          where: (table, { and, eq, gte, lt }) => and(
            eq(table.paymentPlanId, paymentPlan.id),
            gte(table.createdAt, currentMonthStart),
            lt(table.createdAt, currentMonthEnd)
          )
        });
        if (existingCurrentElectric) {
          await db.update(ElectricTable)
            .set({
              meter: readings.electric.current,
              updatedAt: currentMonth,
            })
            .where(eq(ElectricTable.id, existingCurrentElectric.id));
        } else {
          await db.insert(ElectricTable).values({
            meter: readings.electric.current,
            paymentPlanId: paymentPlan.id,
            paid: false,
            late: false,
            createdAt: currentMonth,
            updatedAt: currentMonth,
          });
        }
      }
    }

    console.log("บันทึกข้อมูลมิเตอร์เรียบร้อยแล้ว");
    redirect('/dashboard/meter');
  } catch (error) {
    console.error("Error saving meter readings:", error);
    redirect('/dashboard/meter');
  }
}

async function getRooms(apartment: number, now: Date) {
  "use server"

  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  // Fetch all records from the start of previous month (covers prev and current month)
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
            columns: {fee: true, id: true },
            with: {
              tenant: {
                columns: { id: true, name: true }
              },
              electrics: {
                columns: {meter: true, id: true, late: true, paid: true, updatedAt: true, createdAt: true},
                where: (table, { gte }) => gte(table.createdAt, prevMonthStart),
                orderBy: (table, { desc }) => desc(table.createdAt)
              },
              waters: {
                columns: {meter: true, id: true, late: true, paid: true, updatedAt: true, createdAt: true},
                where: (table, { gte }) => gte(table.createdAt, prevMonthStart),
                orderBy: (table, { desc }) => desc(table.createdAt)
              }
            }
          }
        }
      }
    }
  })
}

async function sendAllBillsAction(formData: FormData) {
  "use server"

  try {
    const currentUser = await getCurrentUser({ withFullUser: true, redirectIfNotFound: true });
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);

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
    const roomsData = await getRooms(currentApartmentId, now);

    for (const floor of roomsData) {
      for (const room of floor.rooms) {
        if (!room.paymentPlan) continue;

        // Check if room has a tenant
        if (!room.paymentPlan.tenant) continue;

        const tenantId = room.paymentPlan.tenant.id;
        const paymentPlanId = room.paymentPlan.id;
        // --- WATER ---
        // Update current month water records with userId
        const currentMonthWaters = await db.query.WaterTable.findMany({
          where: (table, { and, eq, gte, lt, isNull }) => and(
            eq(table.paymentPlanId, paymentPlanId),
            gte(table.createdAt, currentMonthStart),
            lt(table.createdAt, nextMonthStart),
            isNull(table.userId)
          )
        });
        for (const waterRecord of currentMonthWaters) {
          await db.update(WaterTable)
            .set({ userId: tenantId })
            .where(eq(WaterTable.id, waterRecord.id));
        }
        // Update previous month water records with userId
        const prevMonthWaters = await db.query.WaterTable.findMany({
          where: (table, { and, eq, gte, lt, isNull }) => and(
            eq(table.paymentPlanId, paymentPlanId),
            gte(table.createdAt, prevMonthStart),
            lt(table.createdAt, prevMonthEnd),
            isNull(table.userId)
          )
        });
        for (const waterRecord of prevMonthWaters) {
          await db.update(WaterTable)
            .set({ userId: tenantId })
            .where(eq(WaterTable.id, waterRecord.id));
        }
        // --- ELECTRIC ---
        // Update current month electric records with userId
        const currentMonthElectrics = await db.query.ElectricTable.findMany({
          where: (table, { and, eq, gte, lt, isNull }) => and(
            eq(table.paymentPlanId, paymentPlanId),
            gte(table.createdAt, currentMonthStart),
            lt(table.createdAt, nextMonthStart),
            isNull(table.userId)
          )
        });
        for (const electricRecord of currentMonthElectrics) {
          await db.update(ElectricTable)
            .set({ userId: tenantId })
            .where(eq(ElectricTable.id, electricRecord.id));
        }
        // Update previous month electric records with userId
        const prevMonthElectrics = await db.query.ElectricTable.findMany({
          where: (table, { and, eq, gte, lt, isNull }) => and(
            eq(table.paymentPlanId, paymentPlanId),
            gte(table.createdAt, prevMonthStart),
            lt(table.createdAt, prevMonthEnd),
            isNull(table.userId)
          )
        });
        for (const electricRecord of prevMonthElectrics) {
          await db.update(ElectricTable)
            .set({ userId: tenantId })
            .where(eq(ElectricTable.id, electricRecord.id));
        }
      }
    }

    console.log("ส่งบิลทั้งหมดเรียบร้อยแล้ว");
    redirect('/dashboard/meter');
  } catch (error) {
    console.error("Error sending all bills:", error);
    redirect('/dashboard/meter');
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: any
}) {
  const { apartment, search } = await searchParams;
  const currentApartment = apartment ? parseInt(apartment) : 0;
  const currentUser = await getCurrentUser({ withFullUser:true, redirectIfNotFound: true });
  const apartments = await getApartments(currentUser.id);

  if (!apartments[currentApartment].id) {
    return (
      <App title="ส่งบิลค่าน้ำ-ค่าไฟ" userName={currentUser.name}>
        <div className="flex flex-col items-center justify-center h-full p-10">
          <p className="text-xl mb-4">คุณยังไม่มีหอพักในระบบ</p>
          <Link
            href="/dashboard/new-apartment"
            className="bg-[#01BCB4] hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
          >
            สร้างหอพักใหม่
          </Link>
        </div>
      </App>
    );
  }
  const now = new Date();
  const currentMonthString = now.toLocaleString('th-TH', { month: 'long' });
  const currentYear = now.getFullYear();
  let data = await getRooms(apartments[currentApartment].id, now);

  // Server-side filter by tenant name if search param is present
  let searchValue = typeof search === 'string' ? search.trim().toLowerCase() : '';
  if (searchValue) {
    data = data.map(floor => ({
      ...floor,
      rooms: floor.rooms.filter(room =>
        room.paymentPlan && room.paymentPlan.tenant &&
        room.paymentPlan.tenant.name.toLowerCase().includes(searchValue)
      )
    })).filter(floor => floor.rooms.length > 0);
  }

  // Check if there are any rooms in the apartment
  const hasRooms = data && data.length > 0 && data.some(floor => floor.rooms && floor.rooms.length > 0);
  if (!hasRooms) {
    // No rooms found - redirect to create-rooms page
    redirect(`/dashboard/create-rooms?apartmentId=${apartments[currentApartment].id}&from=meter`);
  }

  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1)
  const currentMonth = new Date(now.getFullYear(), now.getMonth())
  // we need to make the prevMonth of the meter really between 1-30 of that previous montn.



  return <>
           <App title="ส่งบิลค่าน้ำ-ค่าไฟ" userName={currentUser.name}>
           <div className="bg-white min-h-screen shadow-md rounded-2xl">
             <div className="flex flex-col gap-2 bg-slate-50 rounded-xl shadow-sm px-6 py-4 mb-4 items-center md:flex-row md:justify-between md:items-center">
               <div className="flex flex-col gap-2 md:flex-row md:items-center">
                 <form method="get" className="flex gap-2 items-center">
                   <input
                     type="hidden"
                     name="apartment"
                     value={currentApartment}
                   />
                   <input
                     type="text"
                     name="search"
                     placeholder="ค้นหาชื่อผู้เช่า..."
                     defaultValue={searchValue}
                     className="border border-slate-300 placeholder-slate-500 rounded-md px-2 py-1"
                   />
                   <button type="submit" className="bg-slate-800 hover:bg-[#3491b4] text-white px-3 py-1 rounded-md">ค้นหา</button>
                 </form>
                 <div className="hidden md:block w-px h-8 bg-slate-300 mx-4" />
                 <ApartmentSelectForm
                   apartments={apartments as any}
                   currentApartment={currentApartment}
                 />
               </div>
               <div>
                 {currentMonthString} {currentYear}
               </div>
             </div>
             <div className="sticky top-0 z-10 flex bg-white px-7 py-2 border-b border-slate-300 justify-end">
               <div className="flex gap-2 items-center mt-2 md:mt-0">
                 <button
                   type="submit"
                   className="flex px-5 py-2 bg-slate-800 hover:bg-slate-600 rounded-lg text-white items-center"
                   form="meterForm"
                 >
                   <Check className="text-white mr-3"/>
                   บันทึก
                 </button>
                 <form action={sendAllBillsAction} className="inline">
                   <input type="hidden" name="apartmentIndex" value={currentApartment} />
                   <button
                     type="submit"
                     className="flex px-5 py-2 bg-slate-800 hover:bg-[#3491b4] rounded-lg text-white items-center"
                   >
                     <Send className="text-white mr-3"/>
                     ส่งทั้งหมด
                   </button>
                 </form>
               </div>
             </div>

             <form action={saveMeterReadings} id="meterForm">
             <div className="rounded-lg shadow-sm mx-4 my-7">
               <table className="w-full">
                 <thead className="px-4 py-0.25 text-center border-x border-slate-300">
                   <tr className="border-b border-slate-300 bg-slate-200 border-x border-slate-300">
                     <td className="px-4 py-0.25 text-center">ชั้น</td>
                     <td className="px-4 py-0.25 text-center">ห้อง</td>
                     <td className="px-4 py-0.25 text-center">ผู้เช่า</td>
                     <td className="flex flex-col sm:items-center text-center">
                       <div className="m-1 flex">
                        <Droplets className="text-[#01BCB4]"/>
                         เลขมิเตอร์น้ำ
                       </div>
                       <div>ครั้งก่อน</div>
                     </td>
                     <td className="px-4 py-0.25 text-center">ครั้งนี้</td>
                     <td className="px-4 py-0.25 flex flex-col sm:items-center text-center">
                       <div className="m-1 flex">
                       <Zap className="text-[#f6c445]"/>
                         เลขมิเตอร์ไฟฟ้า
                       </div>
                       <div>ครั้งก่อน</div>
                     </td>
                     <td className="px-4 py-0.25 text-center">ครั้งนี้</td>
                     <td className="px-4 py-0.25 text-center">ปริ้นท์บิล</td>
                     <td className="px-4 py-0.25 text-center">สถานะชำระ</td>
                   </tr>
                 </thead>
                 <tbody>
                   {
                     data.map((floor, floorIndex) => (
                       <React.Fragment key={`floor-${floor.id}`}>
                         {
                           floor.rooms.map((room, index) => (
                             <tr
                               key={`${floor.id}-${room.id}`}
                               className="border-b border-slate-300 even:bg-slate-200"
                             >
                               {index === 0 && (
                                 <td
                                   rowSpan={floor.rooms.length}
                                   className="border border-slate-300 px-4 py-0.25"
                                 >
                                   {floor.floor}
                                 </td>
                               )}
                               <td className="border border-slate-300 px-4 py-0.25">
                                 {room.roomNumber}
                               </td>
                               <td className="px-4 py-0.25">
                                 {room.paymentPlan && room.paymentPlan.tenant ?
                                   room.paymentPlan.tenant.name :
                                   <span className="text-gray-500 italic">ลูกเช่ายังไม่สมัครเว็ปไซต์</span>
                                 }
                               </td>
                               <td className="px-4 py-0.25 text-center">
                                   {(() => {
                                     const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                                     const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);
                                     const prevMonthRecord = room?.paymentPlan?.waters?.find(water =>
                                       water.createdAt >= prevMonthStart && water.createdAt < prevMonthEnd
                                     );
                                     if (prevMonthRecord && prevMonthRecord.meter !== undefined && prevMonthRecord.meter !== null) {
                                       return <div>{prevMonthRecord.meter}</div>;
                                     } else {
                                       return (
                                         <input
                                           type="number"
                                           name={`meter_${room.id}_waterPrev`}
                                           defaultValue={0}
                                           className="text-center border border-slate-300 w-22 bg-white rounded-md"/>
                                       );
                                     }
                                   })()}
                               </td>
                               <td className="px-4 py-0.25 text-center">
                                   <input
                                   type="number"
                                   name={`meter_${room.id}_water`}
                                   defaultValue={room?.paymentPlan?.waters?.[0]?.meter ?? 0}
                                   className="text-center border border-slate-300 w-28 bg-white rounded-md"/>
                               </td>
                               <td className="px-4 py-0.25 text-center">
                                   {(() => {
                                     const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                                     const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);
                                     const prevMonthRecord = room?.paymentPlan?.electrics?.find(electric =>
                                       electric.createdAt >= prevMonthStart && electric.createdAt < prevMonthEnd
                                     );
                                     if (prevMonthRecord && prevMonthRecord.meter !== undefined && prevMonthRecord.meter !== null) {
                                       return <div>{prevMonthRecord.meter}</div>;
                                     } else {
                                       return (
                                         <input
                                           type="number"
                                           name={`meter_${room.id}_electricPrev`}
                                           defaultValue={0}
                                           className="text-center border border-slate-300 w-22 bg-white rounded-md"/>
                                       );
                                     }
                                   })()}
                               </td>
                               <td className="px-4 py-0.25 text-center">
                                   <input
                                   type="number"
                                   name={`meter_${room.id}_electric`}
                                   defaultValue={room?.paymentPlan?.electrics?.[0]?.meter ?? 0}
                                   className="text-center border border-slate-300 w-28 bg-white rounded-md"/>
                               </td>
                               <td className="px-4 py-0.25 text-center">
                                 {room.paymentPlan?.tenant ? (
                                   <PrintInvoiceButton 
                                     roomId={room.id}
                                     month={(now.getMonth() + 1).toString()}
                                     year={now.getFullYear().toString()}
                                   />
                                 ) : (
                                   <span className="text-gray-400 text-sm">ไม่มีผู้เช่า</span>
                                 )}
                               </td>
                               <td className="px-4 py-0.25 text-center">
                                   {room?.paymentPlan?.electrics ? "N/A" : (room?.paymentPlan?.electrics[0].paid ? "ชำระแล้ว": "ยังไม่ชำระ") }
                               </td>
                             </tr>
                           ))}
                       </React.Fragment>
                     ))
                   }
                 </tbody>
               </table>
               <div className="flex justify-end p-4">
               </div>
             </div>
             </form>
           </div>
           </App>
         </>
}
