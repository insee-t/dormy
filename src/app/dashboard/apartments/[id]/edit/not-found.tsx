import React from "react";
import App from "@/components/Sidebar/App";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home } from "lucide-react";
import Link from "next/link";

export default function EditApartmentNotFound() {
  return (
    <App title="ไม่พบหอพัก" userName="...">
      <div className="bg-white shadow-md rounded-2xl p-8 h-fit">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">ไม่พบหอพัก</h1>
            <p className="text-gray-600 mb-6">
              หอพักที่คุณต้องการแก้ไขไม่พบหรือคุณไม่มีสิทธิ์เข้าถึง
            </p>
          </div>
          
          <div className="space-y-4">
            <Button asChild className="bg-[#01BCB4] hover:bg-cyan-700">
              <Link href="/dashboard">
                <Home className="h-4 w-4 mr-2" />
                กลับไปหน้าแดชบอร์ด
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </App>
  );
} 