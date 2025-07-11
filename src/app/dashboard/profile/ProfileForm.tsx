"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, User, Mail, Phone, Lock } from "lucide-react";

interface User {
  id: string;
  name: string;
  realName?: string | null;
  email: string;
  phone?: string | null;
  role: string;
}

interface ProfileFormProps {
  user: User;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: user.name || "",
    realName: user.realName || "",
    email: user.email || "",
    phone: user.phone || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          realName: formData.realName,
          email: formData.email,
          phone: formData.phone,
        }),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "อัปเดตโปรไฟล์สำเร็จแล้ว"
        });
      } else {
        const error = await response.json();
        setMessage({
          type: "error",
          text: error.message || "เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์"
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "เกิดข้อผิดพลาดในการเชื่อมต่อ"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({
        type: "error",
        text: "รหัสผ่านใหม่ไม่ตรงกัน"
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร"
      });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/profile/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "เปลี่ยนรหัสผ่านสำเร็จแล้ว"
        });
        setFormData(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        const error = await response.json();
        setMessage({
          type: "error",
          text: error.message || "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน"
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "เกิดข้อผิดพลาดในการเชื่อมต่อ"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <Alert className={message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          {message.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            ข้อมูลส่วนตัว
          </CardTitle>
          <CardDescription>
            อัปเดตข้อมูลส่วนตัวของคุณ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">ชื่อที่แสดง</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="ชื่อที่แสดง"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="realName">ชื่อจริง (ไม่บังคับ)</Label>
                <Input
                  id="realName"
                  name="realName"
                  type="text"
                  value={formData.realName}
                  onChange={handleInputChange}
                  placeholder="ชื่อจริง"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">อีเมล</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="อีเมล"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">เบอร์โทรศัพท์ (ไม่บังคับ)</Label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="เบอร์โทรศัพท์"
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full md:w-auto bg-[#01BCB4] hover:bg-cyan-700 cursor-pointer text-white"
            >
              {isLoading ? "กำลังอัปเดต..." : "อัปเดตข้อมูลส่วนตัว"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            เปลี่ยนรหัสผ่าน
          </CardTitle>
          <CardDescription>
            เปลี่ยนรหัสผ่านของคุณ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">รหัสผ่านปัจจุบัน</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleInputChange}
                required
                placeholder="รหัสผ่านปัจจุบัน"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">รหัสผ่านใหม่</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  required
                  placeholder="รหัสผ่านใหม่"
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">ยืนยันรหัสผ่านใหม่</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  placeholder="ยืนยันรหัสผ่านใหม่"
                  minLength={6}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              variant="outline"
              className="w-full md:w-auto bg-[#01BCB4] hover:bg-cyan-700 cursor-pointer text-white"
            >
              {isLoading ? "กำลังเปลี่ยนรหัสผ่าน..." : "เปลี่ยนรหัสผ่าน"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 