import React from "react";
import App from "../../components/Sidebar/App";
import RoomLayout from "../../components/RoomLayout";
import { db } from "@/drizzle/db";
import { 
  ApartmentTable, 
  FloorTable, 
  RoomTable, 
  PaymentPlanTable, 
  UserTable
} from "@/drizzle/schema";
import { asc, eq } from "drizzle-orm";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import { redirect } from "next/navigation";
import getApartments from "@/lib/getApartments";
import ApartmentSelectForm from "../../components/ApartmentSelectForm";

export default async function DashboardPage({ searchParams }: { searchParams: any }) {
  const { apartment } = await searchParams;
  const currentApartment = apartment ? parseInt(apartment) : 0;
  const currentUser = await getCurrentUser({ withFullUser:true, redirectIfNotFound: true });
  const apartments = await getApartments(currentUser.id);

  if (!apartments[currentApartment].id) {
    return (
      <App title="ผังห้อง" userName={currentUser.name}>
        <div className="flex flex-col items-center justify-center h-full p-10">
          <p className="text-xl mb-4">คุณยังไม่มีหอพักในระบบ</p>
          <a
            href="/dashboard/new-apartment"
            className="bg-[#01BCB4] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            สร้างหอพักใหม่
          </a>
        </div>
      </App>
    );
  }

  // Fetch all rooms for the selected apartment
  const roomsWithData = await db
    .select({
      id: RoomTable.id,
      roomNumber: RoomTable.roomNumber,
      floorId: RoomTable.floorId,
      floorNumber: FloorTable.floor,
      apartmentId: FloorTable.apartmentId,
      apartmentName: ApartmentTable.name,
      paymentPlanId: PaymentPlanTable.id,
      status: RoomTable.status,
    })
    .from(RoomTable)
    .leftJoin(FloorTable, eq(RoomTable.floorId, FloorTable.id))
    .leftJoin(ApartmentTable, eq(FloorTable.apartmentId, ApartmentTable.id))
    .leftJoin(PaymentPlanTable, eq(RoomTable.id, PaymentPlanTable.roomId))
    .where(eq(FloorTable.apartmentId, apartments[currentApartment].id))
    .orderBy(asc(RoomTable.roomNumber));

  const uniqueRoomsMap = new Map();
  for (const room of roomsWithData) {
    uniqueRoomsMap.set(room.id, room);
  }

  const roomsWithStatus = Array.from(uniqueRoomsMap.values()).map(room => ({
    ...room,
    availability_status: room.status,
    apartment_number: room.roomNumber,
    floor_number: room.floorNumber || 1,
  }));

  const summaryData = [
    {
      label: "ห้องว่าง",
      count: roomsWithStatus.filter((room) => room.availability_status === "vacant").length,
      color: "bg-gray-400",
    },
    {
      label: "ห้องมีผู้เช่า",
      count: roomsWithStatus.filter((room) => room.availability_status === "occupied").length,
      color: "bg-green-500",
    },
    {
      label: "ห้องปิดปรับปรุง",
      count: roomsWithStatus.filter((room) => room.availability_status === "under_maintenance").length,
      color: "bg-red-500",
    },
  ];

  return (
    <App title="ผังห้อง" userName={currentUser.name}>
      <div className="bg-white min-h-screen shadow-md rounded-xl">
      <div className="flex flex-col gap-2 bg-slate-50 rounded-xl shadow-sm px-6 py-4 mb-4 items-center md:flex-row md:justify-between md:items-center">
        <ApartmentSelectForm 
          apartments={apartments as any} 
          currentApartment={currentApartment} 
        />
      </div>
      <RoomLayout 
        roomsWithStatus={roomsWithStatus}
        summaryData={summaryData}
      />
      </div>
    </App>
  );
}
