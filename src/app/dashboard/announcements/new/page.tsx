"use client";

import React, { useState } from "react";
import App from "../../../../components/Sidebar/App";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, AlertTriangle, Info, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Apartment {
  id: number;
  name: string;
}

export default function NewAnnouncementPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "normal",
    apartmentId: "",
    isPublished: true,
  });

  const [apartments, setApartments] = useState<Apartment[]>([]);

  // Fetch apartments on component mount
  React.useEffect(() => {
    const fetchApartments = async () => {
      try {
        const response = await fetch("/api/apartments");
        if (response.ok) {
          const data = await response.json();
          setApartments(data);
          if (data.length > 0) {
            setFormData(prev => ({ ...prev, apartmentId: data[0].id.toString() }));
          }
        }
      } catch (error) {
        console.error("Error fetching apartments:", error);
      }
    };

    fetchApartments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.apartmentId) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          content: formData.content.trim(),
          priority: formData.priority,
          apartmentId: parseInt(formData.apartmentId),
          isPublished: formData.isPublished,
        }),
      });

      if (response.ok) {
        alert("สร้างประกาศสำเร็จ");
        router.push("/dashboard/announcements");
      } else {
        const error = await response.json();
        alert(`เกิดข้อผิดพลาด: ${error.message || "ไม่สามารถสร้างประกาศได้"}`);
      }
    } catch (error) {
      console.error("Error creating announcement:", error);
      alert("เกิดข้อผิดพลาดในการสร้างประกาศ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'normal':
        return <Info className="w-4 h-4 text-blue-500" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <App title="สร้างประกาศใหม่" userName="">
      <div className="bg-white min-h-screen shadow-md rounded-xl p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard/announcements">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                กลับ
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">สร้างประกาศใหม่</h1>
              <p className="text-gray-600">สร้างประกาศเพื่อแจ้งข้อมูลสำคัญให้ผู้เช่า</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card className="border-slate-300">
              <CardHeader>
                <CardTitle>ข้อมูลประกาศ</CardTitle>
                <CardDescription>
                  กรอกข้อมูลพื้นฐานของประกาศ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">หัวข้อประกาศ *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="กรอกหัวข้อประกาศ"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">เนื้อหาประกาศ *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="กรอกเนื้อหาประกาศ"
                    rows={8}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card className="border-slate-300">
              <CardHeader>
                <CardTitle>การตั้งค่า</CardTitle>
                <CardDescription>
                  กำหนดค่าการแสดงผลและความสำคัญของประกาศ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apartment">หอพัก *</Label>
                  <Select
                    value={formData.apartmentId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, apartmentId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกหอพัก" />
                    </SelectTrigger>
                    <SelectContent>
                      {apartments.map((apartment) => (
                        <SelectItem key={apartment.id} value={apartment.id.toString()}>
                          {apartment.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">ระดับความสำคัญ</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          ต่ำ
                        </div>
                      </SelectItem>
                      <SelectItem value="normal">
                        <div className="flex items-center gap-2">
                          <Info className="w-4 h-4 text-blue-500" />
                          ทั่วไป
                        </div>
                      </SelectItem>
                      <SelectItem value="high">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                          สำคัญ
                        </div>
                      </SelectItem>
                      <SelectItem value="urgent">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          ด่วน
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPublished"
                    checked={formData.isPublished}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, isPublished: checked as boolean }))
                    }
                  />
                  <Label htmlFor="isPublished">เผยแพร่ทันที</Label>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            {formData.title && formData.content && (
              <Card className="border-slate-300">
                <CardHeader>
                  <CardTitle>ตัวอย่างประกาศ</CardTitle>
                  <CardDescription>
                    ตัวอย่างการแสดงผลของประกาศ
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{formData.title}</h3>
                      {getPriorityIcon(formData.priority)}
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{formData.content}</p>
                    <div className="mt-4 text-sm text-gray-500">
                      สถานะ: {formData.isPublished ? "เผยแพร่แล้ว" : "ร่าง"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4 justify-end">
              <Link href="/dashboard/announcements">
                <Button variant="outline" type="button">
                  ยกเลิก
                </Button>
              </Link>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-[#01BCB4] hover:bg-cyan-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    กำลังสร้าง...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    สร้างประกาศ
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </App>
  );
} 