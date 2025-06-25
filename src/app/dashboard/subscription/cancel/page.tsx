"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function SubscriptionCancelPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">
            การชำระเงินถูกยกเลิก
          </CardTitle>
          <CardDescription>
            คุณได้ยกเลิกการสมัครสมาชิก Dormy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              ไม่มีปัญหา! คุณสามารถลองสมัครสมาชิกอีกครั้งได้ตลอดเวลา
            </p>
            <p className="text-sm text-gray-600">
              หากคุณมีคำถาม กรุณาติดต่อทีมสนับสนุนของเรา
            </p>
          </div>
          
          <div className="space-y-2">
            <Link href="/dashboard/subscription">
              <Button className="w-full" size="lg">
                ลองใหม่
                <RefreshCw className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            
            <Link href="/dashboard">
              <Button variant="outline" className="w-full">
                กลับไปแดชบอร์ด
                <ArrowLeft className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 