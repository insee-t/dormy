import React from "react";
import App from "../../../components/Sidebar/App";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const currentUser = await getCurrentUser({ 
    withFullUser: true, 
    redirectIfNotFound: true 
  });

  return (
    <App title="โปรไฟล์" userName={currentUser.name}>
      <div className="bg-white min-h-screen shadow-md rounded-xl p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">แก้ไขโปรไฟล์</h1>
            <p className="text-gray-600">อัปเดตข้อมูลส่วนตัวของคุณ</p>
          </div>
          
          <ProfileForm user={currentUser} />
        </div>
      </div>
    </App>
  );
} 