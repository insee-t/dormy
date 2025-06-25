import { getCurrentUser } from "@/auth/nextjs/currentUser";
import { redirect } from "next/navigation";
import { db } from "@/drizzle/db";
import { UserTable, PaymentPlanTable, RoomTable, FloorTable, ApartmentTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export default async function AuthenticatedTenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser({ withFullUser: false, redirectIfNotFound: false });
  
  // If no user is logged in, redirect to tenant login
  if (!currentUser) {
    redirect("/sign-in");
  }

  // If user is not a tenant, redirect to landlord dashboard
  if (currentUser.role !== "user") {
    redirect("/dashboard");
  }

  // Fetch tenant with payment plan and room information
  const tenant = await db.query.UserTable.findFirst({
    where: eq(UserTable.id, currentUser.id),
  });

  // Fetch payment plan with room information
  const paymentPlan = await db.query.PaymentPlanTable.findFirst({
    where: eq(PaymentPlanTable.userId, currentUser.id),
    with: {
      room: {
        with: {
          floor: {
            with: {
              apartment: true
            }
          }
        }
      }
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tenant Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Dormy Resident
              </h1>
              {paymentPlan?.room && (
                <span className="ml-4 text-sm text-gray-500">
                  ห้อง {paymentPlan.room.roomNumber} - {paymentPlan.room.floor.apartment.name}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                ยินดีต้อนรับ, {tenant?.name}
              </span>
              <form action="/auth/sign-out" method="post">
                <button
                  type="submit"
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  ออกจากระบบ
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Tenant Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <a
              href="/tenant/dashboard"
              className="py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              แดชบอร์ด
            </a>
            <a
              href="/tenant/bills"
              className="py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              ใบแจ้งหนี้และการชำระเงิน
            </a>
            <a
              href="/tenant/maintenance"
              className="py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              คำขอซ่อมบำรุง
            </a>
            {/* <a
              href="/tenant/profile"
              className="py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              โปรไฟล์
            </a> */}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
} 