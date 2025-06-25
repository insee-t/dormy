"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

function SubscriptionSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      // You can fetch session details here if needed
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">กำลังตรวจสอบการชำระเงิน...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">
            การชำระเงินสำเร็จ!
          </CardTitle>
          <CardDescription>
            ขอบคุณสำหรับการสมัครสมาชิก Dormy ของคุณ
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              การสมัครสมาชิกของคุณได้เริ่มต้นเรียบร้อยแล้ว
            </p>
            <p className="text-sm text-gray-600">
              คุณจะได้รับอีเมลยืนยันในไม่ช้า
            </p>
          </div>
          
          <div className="space-y-2">
            <Link href="/dashboard">
              <Button className="w-full" size="lg">
                ไปยังแดชบอร์ด
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            
            <Link href="/dashboard/subscription">
              <Button variant="outline" className="w-full">
                ดูการสมัครสมาชิก
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <SubscriptionSuccessContent />
    </Suspense>
  );
} 