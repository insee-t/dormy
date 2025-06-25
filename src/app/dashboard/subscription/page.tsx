"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Calendar, DollarSign, Settings } from "lucide-react";

interface Subscription {
  id: string;
  status: string;
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  customer: string;
  items: {
    data: Array<{
      price: {
        unit_amount: number;
        currency: string;
        product: string;
      };
    }>;
  };
  metadata: {
    packagePlan?: string;
  };
}

export default function SubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch("/api/subscriptions");
      const data = await response.json();
      
      if (response.ok) {
        setSubscriptions(data.subscriptions);
      } else {
        setError(data.error || "Failed to fetch subscriptions");
      }
    } catch (err) {
      setError("Failed to fetch subscriptions");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (packagePlan: string) => {
    try {
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ packagePlan }),
      });

      const data = await response.json();
      
      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Failed to create subscription");
      }
    } catch (err) {
      setError("Failed to create subscription");
    }
  };

  const handleManageBilling = async (customerId: string) => {
    try {
      const response = await fetch(`/api/subscriptions/${customerId}`);
      const data = await response.json();
      
      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Failed to open billing portal");
      }
    } catch (err) {
      setError("Failed to open billing portal");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "canceled":
        return <Badge className="bg-red-100 text-red-800">Canceled</Badge>;
      case "past_due":
        return <Badge className="bg-yellow-100 text-yellow-800">Past Due</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("th-TH");
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">การสมัครสมาชิก</h1>
          <p className="text-gray-600">จัดการการสมัครสมาชิกและการชำระเงินของคุณ</p>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {subscriptions.length === 0 ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  ไม่มีการสมัครสมาชิก
                </CardTitle>
                <CardDescription>
                  เลือกแพ็กเกจที่เหมาะสมกับคุณเพื่อเริ่มต้นใช้งาน Dormy
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>แพ็กเกจ Basic</CardTitle>
                  <CardDescription>เหมาะสำหรับผู้เริ่มต้น</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">฿5,490/ปี</div>
                  <ul className="space-y-2 text-sm">
                    <li>• ฟีเจอร์พื้นฐานทั้งหมด</li>
                    <li>• สนับสนุนอีเมล</li>
                    <li>• อัพเดทปกติ</li>
                  </ul>
                  <Button 
                    onClick={() => handleSubscribe("Basic")}
                    className="w-full"
                  >
                    เลือกแพ็กเกจ Basic
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>แพ็กเกจ Pro</CardTitle>
                  <CardDescription>เหมาะสำหรับธุรกิจ</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">฿12,900/ปี</div>
                  <ul className="space-y-2 text-sm">
                    <li>• ฟีเจอร์ทั้งหมดของ Basic</li>
                    <li>• ฟีเจอร์ขั้นสูง</li>
                    <li>• สนับสนุนทางโทรศัพท์</li>
                    <li>• อัพเดทล่าสุด</li>
                  </ul>
                  <Button 
                    onClick={() => handleSubscribe("Pro")}
                    className="w-full"
                  >
                    เลือกแพ็กเกจ Pro
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {subscriptions.map((subscription) => (
              <Card key={subscription.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        {subscription.metadata.packagePlan || "Unknown Plan"}
                      </CardTitle>
                      <CardDescription>
                        Subscription ID: {subscription.id}
                      </CardDescription>
                    </div>
                    {getStatusBadge(subscription.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">จำนวนเงิน</p>
                        <p className="font-medium">
                          {formatAmount(
                            subscription.items.data[0].price.unit_amount,
                            subscription.items.data[0].price.currency
                          )}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">เริ่มต้น</p>
                        <p className="font-medium">
                          {formatDate(subscription.current_period_start)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">สิ้นสุด</p>
                        <p className="font-medium">
                          {formatDate(subscription.current_period_end)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {subscription.cancel_at_period_end && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-800 text-sm">
                        การสมัครสมาชิกจะถูกยกเลิกเมื่อสิ้นสุดรอบการเรียกเก็บปัจจุบัน
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleManageBilling(subscription.customer as string)}
                      className="flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      จัดการการชำระเงิน
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 