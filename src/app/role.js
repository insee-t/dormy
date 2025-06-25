import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  Building,
  Plus,
  FileText,
  BellRing,
  MessageCircle,
  DollarSign,
  Users,
} from "lucide-react";

const RoleSelection = () => {
  const router = useRouter();

  const handleAddLayer = () => {
    router.push("/newDorm");
  };

  return (
    <div className="min-h-screen bg-#EEEFF2 flex items-center justify-center">
      <div className="w-full max-w-7xl px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="bg-[#586576] p-6 flex items-center justify-between">
              <div>
                <h2 className="text-[#FFD700] text-lg font-semibold">สำหรับ</h2>
                <h1 className="text-[#ffffff] text-3xl font-bold">เจ้าของหอ</h1>
              </div>
              <Image
                src="/assets/1.png"
                alt="Dormitory"
                width={150}
                height={150}
                className="object-contain"
              />
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <Building className="w-6 h-6 mr-2 text-#ff5757" />
                  <span>ค้างชำระ 1 ห้อง</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-6 h-6 mr-2 text-#2FAB73" />
                  <span>มีผู้เช่า 5 ห้อง</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FileText className="w-6 h-6 mr-2 text-purple-500" />
                  <span>ค้างชำระ 0 ห้อง</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-6 h-6 mr-2 text-#DDDDDD" />
                  <span>มีผู้เช่า 2 ห้อง</span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <button className="flex items-center px-4 py-2 bg-[#FF9800] text-white rounded-md">
                  <Building className="w-4 h-4 mr-2" />
                  จัดการหอ
                </button>
                <button className="flex items-center px-4 py-2 bg-[#4CAF50] text-white rounded-md">
                  <FileText className="w-4 h-4 mr-2" />
                  ดูบิล
                </button>
                <button className="flex items-center px-4 py-2 bg-[#E91E63] text-white rounded-md">
                  <DollarSign className="w-4 h-4 mr-2" />
                  จ่ายบิล
                </button>
              </div>

              <button
                onClick={handleAddLayer}
                className="w-full mt-6 bg-[#4CAF50] text-white py-3 rounded-md flex items-center justify-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                เพิ่มตึกใหม่
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="bg-[#586576] p-6 flex items-center justify-between">
              <div>
                <h2 className="text-[#FFD700] text-lg font-semibold">สำหรับ</h2>
                <h1 className="text-[#ffffff] text-3xl font-bold">ผู้เช่า</h1>
              </div>
              <Image
                src="/assets/2.png"
                alt="Dormitory"
                width={150}
                height={150}
                className="object-contain"
              />
            </div>

            <div className="p-6">
              <div className="text-gray-600 mb-6">
                <span>ที่อยู่</span>
                <div className="border-b border-gray-300 mt-1"></div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <button className="flex items-center px-4 py-2 bg-[#9E9E9E] text-white rounded-md">
                  <FileText className="w-4 h-4 mr-2" />
                  บิลค่าเช่า
                </button>
                <button className="flex items-center px-4 py-2 bg-[#9E9E9E] text-white rounded-md">
                  <BellRing className="w-4 h-4 mr-2" />
                  แจ้งเรื่อง
                </button>
                <button className="flex items-center px-4 py-2 bg-[#9E9E9E] text-white rounded-md">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  ข่าวสาร
                </button>
              </div>

              <button className="w-full bg-[#4CAF50] text-white py-3 rounded-md flex items-center justify-center">
                <Plus className="w-5 h-5 mr-2" />
                เข้าหอพัก
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;

