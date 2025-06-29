import { getCurrentUser } from "@/auth/nextjs/currentUser";
import { db } from "@/drizzle/db";
import { UserTable, PaymentPlanTable, ComplainTable, RentTable, ElectricTable, WaterTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, Home, AlertTriangle, CheckCircle } from "lucide-react";
import Link from "next/link";

async function getTenantData(tenantId: string) {
  // Get user data
  const user = await db.query.UserTable.findFirst({
    where: eq(UserTable.id, tenantId),
  });

  // Get payment plan with room and bills
  const paymentPlan = await db.query.PaymentPlanTable.findFirst({
    where: eq(PaymentPlanTable.userId, tenantId),
    with: {
      room: {
        with: {
          floor: {
            with: {
              apartment: true
            }
          }
        }
      },
      electrics: {
        orderBy: (table, { desc }) => desc(table.createdAt),
        limit: 2
      },
      waters: {
        orderBy: (table, { desc }) => desc(table.createdAt),
        limit: 2
      },
      rentBills: {
        orderBy: (table, { desc }) => desc(table.createdAt),
        limit: 1
      }
    }
  });

  // Calculate electric and water fees if needed
  if (paymentPlan) {
    const latestElectric = paymentPlan.electrics[0];
    const prevElectric = paymentPlan.electrics[1];
    const latestWater = paymentPlan.waters[0];
    const prevWater = paymentPlan.waters[1];

    // Calculate electric fee if we have both current and previous readings
    if (latestElectric && prevElectric && latestElectric.fee === 0) {
      const electricUsage = latestElectric.meter - prevElectric.meter;
      const electricFee = electricUsage * (paymentPlan.electricFeePerMatrix || 0);
      
      await db.update(ElectricTable)
        .set({ fee: electricFee })
        .where(eq(ElectricTable.id, latestElectric.id));
      
      // Update the local data
      latestElectric.fee = electricFee;
    }

    // Calculate water fee if we have both current and previous readings
    if (latestWater && prevWater && latestWater.fee === 0) {
      const waterUsage = latestWater.meter - prevWater.meter;
      const waterFee = waterUsage * (paymentPlan.waterFeePerMatrix || 0);
      
      await db.update(WaterTable)
        .set({ fee: waterFee })
        .where(eq(WaterTable.id, latestWater.id));
      
      // Update the local data
      latestWater.fee = waterFee;
    }
  }

  // Get complaints
  const complains = await db.query.ComplainTable.findMany({
    where: eq(ComplainTable.userId, tenantId),
    orderBy: (table, { desc }) => desc(table.createdAt),
    limit: 5
  });

  return {
    ...user,
    paymentPlan,
    complains
  };
}

export default async function TenantDashboard() {
  const currentUser = await getCurrentUser({ withFullUser: true, redirectIfNotFound: true });
  const tenant = await getTenantData(currentUser.id);

  if (!tenant) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">ไม่พบข้อมูลผู้เช่า</p>
      </div>
    );
  }

  const latestElectric = tenant.paymentPlan?.electrics[0];
  const latestWater = tenant.paymentPlan?.waters[0];
  const latestRent = tenant.paymentPlan?.rentBills[0];
  const pendingComplaints = tenant.complains.filter(c => c.status !== "complete");
  const completedComplaints = tenant.complains.filter(c => c.status === "complete");
  console.log(latestRent)

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          ยินดีต้อนรับกลับ, {tenant.name}!
        </h1>
        <p className="text-gray-600">
          ห้อง {tenant.paymentPlan?.room?.roomNumber} • {tenant.paymentPlan?.room?.floor.apartment.name}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ค่าเช่ารายเดือน</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ฿{latestRent?.fee || tenant.paymentPlan?.fee || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              ครบกำหนดวันที่ {tenant.paymentPlan?.room?.floor.apartment.paymentDate.getDate()} ของเดือน
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ค่าไฟ</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestElectric?.paid ? "ชำระแล้ว" : "รอชำระ"}
            </div>
            <p className="text-xs text-muted-foreground">
              ฿{latestElectric?.fee || 0} • มิเตอร์: {latestElectric?.meter || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ค่าน้ำ</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestWater?.paid ? "ชำระแล้ว" : "รอชำระ"}
            </div>
            <p className="text-xs text-muted-foreground">
              ฿{latestWater?.fee || 0} • มิเตอร์: {latestWater?.meter || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">การซ่อมบำรุง</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingComplaints.length}
            </div>
            <p className="text-xs text-muted-foreground">
              คำขอที่รอดำเนินการ
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>คำขอซ่อมบำรุงล่าสุด</CardTitle>
            <CardDescription>
              คำขอซ่อมบำรุงและซ่อมแซมล่าสุดของคุณ
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tenant.complains.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                ยังไม่มีคำขอซ่อมบำรุง
              </p>
            ) : (
              <div className="space-y-3">
                {tenant.complains.slice(0, 3).map((complaint) => (
                  <div
                    key={complaint.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{complaint.reportType}</p>
                      <p className="text-sm text-gray-600">
                        {complaint.description.substring(0, 50)}...
                      </p>
                    </div>
                    <div className="flex items-center">
                      {complaint.status === "complete" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Link href="/tenant/maintenance">
                <Button variant="outline" className="w-full">
                  ดูคำขอทั้งหมด
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>การดำเนินการด่วน</CardTitle>
            <CardDescription>
              งานและกิจกรรมทั่วไป
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/tenant/bills">
                <Button className="w-full justify-start" variant="outline">
                  <DollarSign className="mr-2 h-4 w-4" />
                  ดูใบแจ้งหนี้และการชำระเงิน
                </Button>
              </Link>
              
              <Link href="/tenant/maintenance/new">
                <Button className="w-full justify-start" variant="outline">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  ส่งคำขอซ่อมบำรุง
                </Button>
              </Link>
              
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 