"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AvailableRoom {
  id: number;
  roomNumber: string;
  floor: {
    floor: number;
    apartment: {
      id: number;
      name: string;
      address: string;
    };
  };
}

interface Apartment {
  id: number;
  name: string;
  address: string;
}

export default function TenantRegister() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"apartment" | "room">("apartment");
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [availableRooms, setAvailableRooms] = useState<AvailableRoom[]>([]);
  const [selectedApartment, setSelectedApartment] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const fetchApartments = async () => {
    try {
      const response = await fetch("/api/apartments");
      if (response.ok) {
        const apartmentsData = await response.json();
        setApartments(apartmentsData);
      }
    } catch (error) {
      console.error("Error fetching apartments:", error);
    }
  };

  const fetchAvailableRooms = async (apartmentId: string) => {
    try {
      const response = await fetch(`/api/available-rooms?apartmentId=${apartmentId}`);
      if (response.ok) {
        const rooms = await response.json();
        setAvailableRooms(rooms);
      }
    } catch (error) {
      console.error("Error fetching available rooms:", error);
    }
  };

  // Fetch apartments on component mount
  useEffect(() => {
    fetchApartments();
  }, []);

  // Fetch rooms when apartment is selected
  useEffect(() => {
    if (selectedApartment) {
      fetchAvailableRooms(selectedApartment);
    }
  }, [selectedApartment]);

  const handleApartmentSelect = (apartmentId: string) => {
    setSelectedApartment(apartmentId);
    setSelectedRoom(""); // Reset room selection
    setStep("room");
  };

  const handleBackToApartment = () => {
    setStep("apartment");
    setSelectedApartment("");
    setSelectedRoom("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("รหัสไม่ตรงกัน");
      return;
    }

    if (!selectedRoom) {
      alert("โปรดเลือกห้องพัก");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch("/api/tenant/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          roomId: parseInt(selectedRoom),
        }),
      });

      if (response.ok) {
        alert("สร้างบัญชีสำเร็จ! โปรดล็อคอิน");
        router.push("/sign-in");
      } else {
        const error = await response.json();
        alert(error.message || "สร้างบัญชีล้มเหลว");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("สร้างบัญชีล้มเหลว");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedApartmentData = apartments.find(apt => apt.id.toString() === selectedApartment);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            สมัครบัญชี
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === "apartment" 
              ? "โปรดเลือกหอพัก"
              : `เลือกห้องพักใน ${selectedApartmentData?.name}`
            }
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center space-x-4">
          <div className={`flex items-center ${step === "apartment" ? "text-[#018c98]" : "text-gray-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === "apartment" ? "border-[#018c98] bg-[#018c98] text-white" : "border-gray-300"}`}>
              1
            </div>
            <span className="ml-2 text-sm font-medium">หอพัก</span>
          </div>
          <div className="w-8 h-0.5 bg-gray-300"></div>
          <div className={`flex items-center ${step === "room" ? "text-[#018c98]" : "text-gray-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === "room" ? "border-[#018c98] bg-[#018c98] text-white" : "border-gray-300"}`}>
              2
            </div>
            <span className="ml-2 text-sm font-medium">ห้องพัก</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === "apartment" ? "เลือกหอพัก" : "สร้างบัญชี"}
            </CardTitle>
            <CardDescription>
              {step === "apartment" 
                ? "ระบุหอพักที่คุณอาศัย"
                : "ระบุข้อมูลของคุณและเลือกห้องที่อาศัย"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "apartment" ? (
              <div className="space-y-4">
                <div>
                  <select
                    id="apartment"
                    value={selectedApartment}
                    onChange={(e) => setSelectedApartment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#018c98]/80 focus:border-transparent"
                  >
                    <option value="">เลือกหอพัก</option>
                    {apartments.map((apartment) => (
                      <option key={apartment.id} value={apartment.id.toString()}>
                        {apartment.name} - {apartment.address}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedApartment && (
                  <Button
                    onClick={() => handleApartmentSelect(selectedApartment)}
                    className="w-full"
                  >
                    เลือกห้องพัก
                  </Button>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-cyan-800">
                    <strong>หอพักที่เลือก:</strong> {selectedApartmentData?.name}
                  </p>
                  <p className="text-xs text-[#018c98]">{selectedApartmentData?.address}</p>
                </div>

                <div>
                  <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="email">อีเมล</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="password">รหัสผ่าน</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="room">เลือกห้องพัก</Label>
                  <select
                    id="room"
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#018c98]/80 focus:border-transparent"
                    required
                  >
                    <option value="">เลือกห้องพักที่ว่าง</option>
                    {availableRooms.map((room) => (
                      <option key={room.id} value={room.id.toString()}>
                        ห้อง {room.roomNumber} (ชั้น {room.floor.floor})
                      </option>
                    ))}
                  </select>
                  {availableRooms.length === 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      ไม่มีห้องพักเหลือ
                    </p>
                  )}
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBackToApartment}
                    className="flex-1"
                  >
                    กลับ
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isLoading || availableRooms.length === 0}
                  >
                    {isLoading ? "กำลังสร้างบัญชี..." : "สร้างบัญชี"}
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                มีบัญชีอยู่แล้ว?{" "}
                <a href="/sign-in" className="text-[#018c98] hover:text-[#018c98]/80">
                  เข้าสู่ระบบ
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
