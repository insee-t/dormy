import { db } from "@/drizzle/db";
import { CircleCheck, CircleX, Clock5, BookOpen } from 'lucide-react';
import React from "react";
import getApartments from "@/lib/getApartments";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import ApartmentSelectForm from "@/components/ApartmentSelectForm";
import { notFound } from "next/navigation";
import ComplaintsTable from "./ComplaintsTable";
import App from "@/components/Sidebar/App";

async function getComplaints(apartmentId: number) {
  // Fetch complaints with tenant info
  const complaints = await db.query.ComplainTable.findMany({
    with: {
      tenant: {
        columns: { name: true, email: true },
      },
    },
    orderBy: (table, { desc }) => desc(table.createdAt),
  });

  // Get payment plans for all users to find their rooms
  const paymentPlans = await db.query.PaymentPlanTable.findMany({
    with: {
      tenant: {
        columns: { id: true },
      },
      room: {
        columns: { roomNumber: true },
        with: {
          floor: {
            columns: { apartmentId: true },
          },
        },
      },
    },
  });

  // Create a map of userId to room info
  const userRoomMap = new Map();
  paymentPlans.forEach(plan => {
    if (plan.tenant && plan.room) {
      userRoomMap.set(plan.tenant.id, plan.room);
    }
  });

  // Filter complaints by apartment and add room info
  return complaints
    .map(complaint => ({
      ...complaint,
      tenant: {
        ...complaint.tenant,
        room: userRoomMap.get(complaint.userId),
      },
    }))
    .filter(complaint => complaint.tenant?.room?.floor?.apartmentId === apartmentId);
}

function statusDisplay(status: string) {
  switch (status) {
    case "complete":
      return { label: "ดำเนินการเรียบร้อย", color: "text-[#2FAB73]", icon: <CircleCheck className="bg-green-400 rounded-full size-fit" /> };
    case "in_progress":
      return { label: "กำลังดำเนินการ", color: "text-blue-400", icon: <Clock5 className="w-4 h-4" /> };
    case "waiting_for_inventory":
      return { label: "รอวัสดุ อุปกรณ์", color: "text-red-400", icon: <CircleX className="w-4 h-4" /> };
    default:
      return { label: status, color: "", icon: null };
  }
}

export default async function ComplaintsPage({ searchParams }: { searchParams: Promise<{ apartment?: string }> }) {
  const currentUser = await getCurrentUser({ withFullUser: true, redirectIfNotFound: true });
  let apartmentsRaw = await getApartments(currentUser.id);
  // Filter out apartments with null id, name, or address
  const apartments = (apartmentsRaw || []).filter(a => a.id !== null && a.name !== null && a.address !== null)
    .map(a => ({ id: a.id as number, name: a.name as string, address: a.address as string }));
  if (!apartments || apartments.length === 0) {
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

  
  const resolvedSearchParams = await searchParams;
  let selectedApartmentIdx = Number(resolvedSearchParams?.apartment) || 0;
  if (selectedApartmentIdx < 0 || selectedApartmentIdx >= apartments.length) selectedApartmentIdx = 0;
  const selectedApartment = apartments[selectedApartmentIdx];
  const complaints = await getComplaints(selectedApartment.id);

  // Summary counts
  const total = complaints.length;
  const complete = complaints.filter(c => c.status === "complete").length;
  const inProgress = complaints.filter(c => c.status === "in_progress").length;
  const waiting = complaints.filter(c => c.status === "waiting_for_inventory").length;

  return (
    <App title="ร้องเรียน" userName={currentUser.name}>
    <div className="bg-white min-h-screen rounded-2xl shadow-md">
      <div className="flex flex-col gap-2 bg-slate-50 rounded-xl shadow-sm px-6 py-4 mb-4 items-center md:flex-row md:justify-between md:items-center">
        <ApartmentSelectForm apartments={apartments} currentApartment={selectedApartmentIdx} />
      </div>
      {/* Summary cards */}
      <div className="mt-3 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="py-3 px-6 flex bg-[#01BCB4] rounded-lg items-center justify-center gap-4">
            <div className="flex flex-col text-lg text-white">
              <div className="whitespace-nowrap">รายการทั้งหมด</div>
              <div className="flex gap-2 items-baseline whitespace-nowrap"><p className="text-2xl font-bold text-white">{total}</p> รายการ</div>
              <div className="flex gap-1 text-sm items-center"><CircleCheck className="bg-green-400 rounded-full size-fit" /> สถานะปัจจุบัน</div>
            </div>
            <div className="text-[#3491b4] bg-[#EEEFF2] p-2 rounded-lg">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
          <div className="py-3 px-6 flex bg-[#2FAB73] rounded-lg items-center justify-center gap-4">
            <div className="flex flex-col text-lg text-white">
              <div className="whitespace-nowrap">ดำเนินการเรียบร้อย</div>
              <div className="flex gap-2 items-baseline whitespace-nowrap"><p className="text-2xl font-bold text-white">{complete}</p> รายการ</div>
              <div className="flex gap-1 text-sm items-center"><CircleCheck className="bg-green-400 rounded-full size-fit" /> สถานะปัจจุบัน</div>
            </div>
            <div className="text-[#2FAB73] bg-[#EEEFF2] p-2 rounded-lg">
              <CircleCheck className="w-6 h-6" />
            </div>
          </div>
          <div className="py-3 px-6 flex bg-yellow-400 rounded-lg items-center justify-center gap-4">
            <div className="flex flex-col text-lg text-white">
              <div className="whitespace-nowrap">กำลังดำเนินการ</div>
              <div className="flex gap-2 items-baseline whitespace-nowrap"><p className="text-2xl font-bold text-white">{inProgress}</p> รายการ</div>
              <div className="flex gap-1 text-sm items-center"><CircleCheck className="bg-green-400 rounded-full size-fit" /> สถานะปัจจุบัน</div>
            </div>
            <div className="text-yellow-500 bg-[#EEEFF2] p-2 rounded-lg">
              <Clock5 className="w-6 h-6" />
            </div>
          </div>
          <div className="py-3 px-6 flex bg-red-400 rounded-lg items-center justify-center gap-4">
            <div className="flex flex-col text-lg text-white">
              <div className="whitespace-nowrap">รอวัสดุ อุปกรณ์</div>
              <div className="flex gap-2 items-baseline whitespace-nowrap"><p className="text-2xl font-bold text-white">{waiting}</p> รายการ</div>
              <div className="flex gap-1 text-sm items-center"><CircleCheck className="bg-green-400 rounded-full size-fit" /> สถานะปัจจุบัน</div>
            </div>
            <div className="text-[#ff5757] bg-[#EEEFF2] p-2 rounded-lg">
              <CircleX className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="mt-10 shadow w-full bg-white p-4">
        <ComplaintsTable complaints={complaints} />
      </div>
    </div>
    </App>
  );
}
