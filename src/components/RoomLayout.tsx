"use client";

import React, { useState, useMemo } from "react";
import { User } from "lucide-react";
import RoomSearch from "./RoomSearch";

interface Room {
  id: number;
  roomNumber: string;
  status: string;
  color: string;
}

interface RoomLayoutProps {
  roomsWithStatus: Array<{
    id: number;
    roomNumber: string;
    floorId: number;
    floorNumber: number | null;
    apartmentId: number | null;
    apartmentName: string | null;
    tenantId?: string | null;
    tenantName?: string | null;
    paymentPlanId: number | null;
    availability_status: string;
    apartment_number: string;
    floor_number: number;
    status: string;
  }>;
  summaryData: Array<{
    label: string;
    count: number;
    color: string;
  }>;
}

const statusOptions = [
  { value: "vacant", label: "ว่าง", color: "bg-gray-400" },
  { value: "occupied", label: "มีผู้เช่า", color: "bg-green-500" },
  { value: "under_maintenance", label: "ปิดปรับปรุง", color: "bg-red-500" },
];

export default function RoomLayout({ roomsWithStatus, summaryData }: RoomLayoutProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roomStatusMap, setRoomStatusMap] = useState(() =>
    Object.fromEntries(roomsWithStatus.map(room => [room.id, room.status]))
  );
  const [loadingRoomId, setLoadingRoomId] = useState<number | null>(null);

  // Filter rooms based on search query
  const filteredRooms = useMemo(() => {
    return roomsWithStatus.filter((room) =>
      room.apartment_number.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [roomsWithStatus, searchQuery]);

  // Group filtered rooms by floor
  const floorData: Record<number, Room[]> = useMemo(() => {
    return filteredRooms.reduce((acc, room) => {
      const floor = room.floor_number || 1;
      if (!acc[floor]) acc[floor] = [];
      acc[floor].push({
        id: room.id,
        roomNumber: room.roomNumber,
        status: roomStatusMap[room.id] || room.availability_status,
        color:
          (roomStatusMap[room.id] || room.availability_status) === "occupied"
            ? "bg-green-500"
            : (roomStatusMap[room.id] || room.availability_status) === "vacant"
              ? "bg-gray-400"
              : "bg-red-500",
      });
      return acc;
    }, {} as Record<number, Room[]>);
  }, [filteredRooms, roomStatusMap]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = () => {
    // Implement filter functionality
    console.log("Filter rooms");
  };

  const handleSettings = () => {
    // Implement settings functionality
    console.log("Settings");
  };

  const handleStatusChange = async (roomId: number, status: string) => {
    setLoadingRoomId(roomId);
    try {
      const res = await fetch(`/api/rooms/${roomId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setRoomStatusMap(prev => ({ ...prev, [roomId]: status }));
    } catch (e) {
      alert("เปลี่ยนสถานะห้องไม่สำเร็จ");
    } finally {
      setLoadingRoomId(null);
    }
  };

  return (
    <div className="w-full">
      {/* สรุปข้อมูลห้องพัก */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 px-4">
        {summaryData.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-4 bg-white rounded-lg shadow"
          >
            <div
              className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center`}
            >
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-lg font-semibold">{item.count} ห้อง</div>
              <div className="text-sm text-gray-600">{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ส่วนค้นหาและฟิลเตอร์ */}
      <RoomSearch
        onSearch={handleSearch}
        onFilter={handleFilter}
        onSettings={handleSettings}
      />

      {/* แสดงห้องพักแต่ละชั้น */}
      <div className="space-y-6 px-4">
        {Object.entries(floorData).map(([floor, rooms]) => (
          <div key={floor} className="bg-white rounded-lg shadow w-full">
            <div className="p-4 bg-[#01BCB4] text-white rounded-t-lg">
              ชั้นที่ {floor}
            </div>
            <div className="flex gap-6 p-6 overflow-x-auto">
              {rooms.map((room) => (
                <div key={room.id} className="aspect-square flex flex-col items-center">
                  <div
                    className={`${room.color} w-full h-full rounded-lg flex items-center justify-center`}
                  >
                    <div className="w-24 h-24 bg-white/90 rounded-lg flex flex-col items-center justify-center">
                      <div className="text-lg font-semibold">{room.roomNumber}</div>
                      <User className="w-12 h-12 mt-1" />
                    </div>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {statusOptions.map(opt => (
                      <button
                        key={opt.value}
                        className={`px-2 py-1 cursor-pointer rounded text-xs font-medium border ${opt.color} text-white transition-all duration-150 ${room.status === opt.value ? 'ring-2 ring-blue-400' : ''}`}
                        disabled={loadingRoomId === room.id}
                        onClick={() => handleStatusChange(room.id, opt.value)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 