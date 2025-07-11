"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Home, MapPin, Phone, Mail, Building, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

interface Apartment {
  id: number;
  name: string;
  address: string;
  businessType: "personal" | "business";
  phone: string;
  email?: string | null;
  taxId?: string | null;
  billDay: number;
  paymentDay: number;
}

interface EditApartmentFormProps {
  apartment: Apartment;
}

export default function EditApartmentForm({ apartment }: EditApartmentFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: apartment.name || "",
    address: apartment.address || "",
    phone: apartment.phone || "",
    email: apartment.email || "",
    taxId: apartment.taxId || "",
    businessType: apartment.businessType || "personal",
    billDate: apartment.billDay.toString(),
    paymentDueDate: apartment.paymentDay.toString(),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/apartments/${apartment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          taxId: formData.taxId,
          businessType: formData.businessType,
          billDate: parseInt(formData.billDate),
          paymentDueDate: parseInt(formData.paymentDueDate),
        }),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "อัปเดตข้อมูลหอพักสำเร็จแล้ว"
        });
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        const error = await response.json();
        setMessage({
          type: "error",
          text: error.message || "เกิดข้อผิดพลาดในการอัปเดตข้อมูลหอพัก"
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            ชื่อหอพัก <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="กรอกชื่อหอพัก"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="address" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            ที่อยู่หอพัก <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            rows={3}
            placeholder="กรอกที่อยู่หอพัก"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            เบอร์โทรศัพท์ <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            required
            placeholder="0812345678"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            อีเมล
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="example@email.com"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="taxId" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            เลขประจำตัวผู้เสียภาษี (ไม่บังคับ)
          </Label>
          <Input
            id="taxId"
            name="taxId"
            type="text"
            value={formData.taxId}
            onChange={handleInputChange}
            placeholder="เลขประจำตัวผู้เสียภาษี"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="businessType" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            ประเภทธุรกิจ <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.businessType}
            onValueChange={(value) => handleSelectChange("businessType", value)}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="เลือกประเภทธุรกิจ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">บุคคลธรรมดา</SelectItem>
              <SelectItem value="business">บริษัท</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="billDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              วันที่ทำบิล <span className="text-red-500">*</span>
            </Label>
            <Input
              id="billDate"
              name="billDate"
              type="number"
              value={formData.billDate}
              onChange={handleInputChange}
              required
              min="1"
              max="31"
              placeholder="1-31"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="paymentDueDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              วันครบกำหนดชำระ <span className="text-red-500">*</span>
            </Label>
            <Input
              id="paymentDueDate"
              name="paymentDueDate"
              type="number"
              value={formData.paymentDueDate}
              onChange={handleInputChange}
              required
              min="1"
              max="31"
              placeholder="1-31"
              className="mt-2"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard")}
            disabled={isLoading}
          >
            ยกเลิก
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-[#01BCB4] hover:bg-cyan-700 cursor-pointer text-white"
          >
            {isLoading ? "กำลังอัปเดต..." : "อัปเดตข้อมูลหอพัก"}
          </Button>
        </div>
      </form>
    </div>
  );
} 