"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import { db } from "@/drizzle/db";
import { UserTable, PaymentPlanTable, BankAccountTable, BankAccountApartmentTable, ApartmentTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, QrCode, CreditCard, Upload, CheckCircle } from "lucide-react";
import Link from "next/link";
import generatePayload from "promptpay-qr";
import Image from "next/image";
import * as QRCode from "qrcode";
import { useRouter } from "next/navigation";

interface BankAccount {
  id: number;
  name: string;
  bankNumber: string;
  bankProvider: string;
}

interface PaymentData {
  apartmentName: string;
  roomNumber: string;
  rentAmount: number;
  electricAmount: number;
  waterAmount: number;
  totalAmount: number;
  paymentPlanId?: number;
  bankAccount?: BankAccount;
  bills: {
    rent: { fee: number; paid: boolean; createdAt: Date };
    electric: { fee: number; paid: boolean; createdAt: Date; meter: number };
    water: { fee: number; paid: boolean; createdAt: Date; meter: number };
  };
}

export default function TenantBillsPage() {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<"payment" | "upload">("payment");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const userResponse = await fetch("/api/auth/me");
      if (!userResponse.ok) {
        throw new Error("Failed to get user information");
      }
      const user = await userResponse.json();
      
      if (!user) {
        throw new Error("User not found");
      }

      // Get payment plan with room and apartment
      const paymentResponse = await fetch(`/api/tenant/payment-plan/${user.id}`);
      if (!paymentResponse.ok) {
        throw new Error("Failed to get payment plan");
      }
      const paymentPlan = await paymentResponse.json();

      if (!paymentPlan) {
        throw new Error("Payment plan not found");
      }

      // Get latest bills
      const billsResponse = await fetch(`/api/tenant/bills/${user.id}`);
      let bills = {
        rent: { fee: paymentPlan.fee, paid: false, createdAt: new Date() },
        electric: { fee: 0, paid: false, createdAt: new Date(), meter: 0 },
        water: { fee: 0, paid: false, createdAt: new Date(), meter: 0 }
      };
      
      if (billsResponse.ok) {
        const billsData = await billsResponse.json();
        bills = billsData;
      }

      // Calculate total amount
      const totalAmount = bills.rent.fee + bills.electric.fee + bills.water.fee;

      // Get apartment's associated bank account
      const bankResponse = await fetch(`/api/apartments/${paymentPlan.room.floor.apartment.id}/bank-account`);
      let bankAccount = null;
      
      if (bankResponse.ok) {
        bankAccount = await bankResponse.json();
      } else if (bankResponse.status !== 404) {
        // Only throw error if it's not a 404 (no bank account associated)
        throw new Error("Failed to get bank account information");
      }

      const data: PaymentData = {
        apartmentName: paymentPlan.room.floor.apartment.name,
        roomNumber: paymentPlan.room.roomNumber,
        rentAmount: bills.rent.fee,
        electricAmount: bills.electric.fee,
        waterAmount: bills.water.fee,
        totalAmount: totalAmount,
        paymentPlanId: paymentPlan.id,
        bankAccount: bankAccount,
        bills: bills
      };

      setPaymentData(data);

      // Generate QR code if it's PromptPay
      if (bankAccount && bankAccount.bankProvider === "promptpay") {
        try {
          const promptPayPayload = generatePromptPayData(bankAccount.bankNumber, data.totalAmount);
          const qrCodeImage = await QRCode.toDataURL(promptPayPayload, {
            width: 200,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
          setQrCodeUrl(qrCodeImage);
        } catch (qrError) {
          console.error("Error generating QR code:", qrError);
          // Continue without QR code
        }
      }
    } catch (error) {
      console.error("Error fetching payment data:", error);
      alert("เกิดข้อผิดพลาดในการโหลดข้อมูล: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const generatePromptPayData = (phoneNumber: string, amount: number): string => {
    try {
      // Remove any non-digit characters from phone number
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      
      // Generate PromptPay QR code payload
      const payload = generatePayload(cleanPhone, { amount });
      return payload;
    } catch (error) {
      console.error('Error generating PromptPay QR:', error);
      throw error;
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append("receipt", selectedFile);
      formData.append("paymentPlanId", paymentData?.paymentPlanId?.toString() || "");
      formData.append("amount", paymentData?.totalAmount?.toString() || "");

      const response = await fetch("/api/tenant/upload-receipt", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Handle success
        alert("Receipt uploaded successfully!");
        setStep("payment");
        setSelectedFile(null);
        router.push("/tenant/dashboard");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading receipt:", error);
      alert("Failed to upload receipt");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">ไม่พบข้อมูลการชำระเงิน</p>
        <Link href="/tenant/dashboard">
          <Button className="mt-4">กลับไปหน้าแดชบอร์ด</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl bg-white mx-auto p-6 space-y-6 rounded-2xl shadow-md">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/tenant/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับ
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ชำระบิล</h1>
          <p className="text-gray-600">
            ห้อง {paymentData.roomNumber} • {paymentData.apartmentName}
          </p>
        </div>
      </div>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>ข้อมูลการชำระเงิน</span>
          </CardTitle>
          <CardDescription>
            จำนวนเงินที่ต้องชำระ: ฿{paymentData.totalAmount.toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">ข้อมูลห้อง</h3>
              <p className="text-sm text-gray-600">ห้อง: {paymentData.roomNumber}</p>
              <p className="text-sm text-gray-600">อาคาร: {paymentData.apartmentName}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">รายละเอียดบิล</h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">ค่าเช่า:</span>
                  <span className="text-sm">฿{paymentData.rentAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">ค่าไฟ:</span>
                  <span className="text-sm">฿{paymentData.electricAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">ค่าน้ำ:</span>
                  <span className="text-sm">฿{paymentData.waterAmount.toLocaleString()}</span>
                </div>
                <div className="border-t pt-1 mt-2">
                  <div className="flex justify-between font-medium">
                    <span>รวมทั้งหมด:</span>
                    <span className="text-green-600">฿{paymentData.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {step === "payment" ? (
        /* Payment Method Selection */
        <Card>
          <CardHeader>
            <CardTitle>เลือกวิธีการชำระเงิน</CardTitle>
            {/* <CardDescription>
              เลือกวิธีการชำระเงินที่สะดวกสำหรับคุณ
            </CardDescription> */}
          </CardHeader>
          <CardContent>
            {paymentData.bankAccount ? (
              paymentData.bankAccount.bankProvider === "promptpay" ? (
                /* PromptPay QR Code */
                <div className="text-center space-y-4">
                  <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300">
                    {qrCodeUrl ? (
                      <div className="space-y-4">
                        <Image
                          src={qrCodeUrl}
                          alt="PromptPay QR Code"
                          width={200}
                          height={200}
                          className="mx-auto"
                        />
                        <div>
                          <p className="font-medium">พร้อมเพย์</p>
                          <p className="text-sm text-gray-600">{paymentData.bankAccount.bankNumber}</p>
                          <p className="text-sm text-gray-600">จำนวน: ฿{paymentData.totalAmount.toLocaleString()}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <QrCode className="h-12 w-12 text-gray-400 mx-auto" />
                        <p className="text-gray-500">กำลังสร้าง QR Code...</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      1. เปิดแอปธนาคารของคุณ
                    </p>
                    <p className="text-sm text-gray-600">
                      2. สแกน QR Code ด้านบน
                    </p>
                    <p className="text-sm text-gray-600">
                      3. ตรวจสอบข้อมูลและยืนยันการชำระเงิน
                    </p>
                  </div>
                </div>
              ) : (
                /* Bank Transfer Information */
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">ข้อมูลบัญชีธนาคาร</h3>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">ธนาคาร:</span> {paymentData.bankAccount.bankProvider}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">ชื่อบัญชี:</span> {paymentData.bankAccount.name}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">เลขที่บัญชี:</span> {paymentData.bankAccount.bankNumber}
                      </p>
                      <p className="text-sm text-gray-600">จำนวน: ฿{paymentData.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      1. โอนเงินไปยังบัญชีธนาคารข้างต้น
                    </p>
                    <p className="text-sm text-gray-600">
                      2. เก็บใบเสร็จการโอนเงิน
                    </p>
                    <p className="text-sm text-gray-600">
                      3. อัปโหลดใบเสร็จเพื่อยืนยันการชำระเงิน
                    </p>
                  </div>
                </div>
              )
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">ไม่พบข้อมูลบัญชีการชำระเงิน</p>
                <p className="text-sm text-gray-400">กรุณาติดต่อผู้ดูแลระบบ</p>
              </div>
            )}

            {paymentData.bankAccount && (
              <div className="mt-6">
                <Button 
                  onClick={() => setStep("upload")} 
                  className="w-full"
                  size="lg"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  อัปโหลดใบเสร็จ
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* Receipt Upload Step */
        <Card>
          <CardHeader>
            <CardTitle>อัปโหลดใบเสร็จ</CardTitle>
            <CardDescription>
              อัปโหลดใบเสร็จการชำระเงินเพื่อยืนยันการโอนเงิน
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="receipt-upload"
                />
                <label htmlFor="receipt-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    รองรับไฟล์รูปภาพและ PDF ขนาดไม่เกิน 10MB
                  </p>
                </label>
              </div>

              {selectedFile && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium text-green-800">
                      เลือกไฟล์แล้ว: {selectedFile.name}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setStep("payment")}
                  className="flex-1"
                >
                  ย้อนกลับ
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile}
                  className="flex-1"
                >
                  อัปโหลดและยืนยัน
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 