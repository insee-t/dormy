import { getCurrentUser } from "@/auth/nextjs/currentUser";
import { redirect } from "next/navigation";
import { db } from "@/drizzle/db";
import { UserTable, PaymentPlanTable, RoomTable, FloorTable, ApartmentTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { logOut } from "@/auth/nextjs/actions";
import LogOutButton from "@/components/LogoutButton";

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
      <header className="bg-gradient-to-r from-[#01BCB4] to-[#00a8a0] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-white">
                Dormy Resident
              </h1>
              {paymentPlan?.room && (
                <span className="ml-4 text-sm text-[#e6f7f6]">
                  ห้อง {paymentPlan.room.roomNumber} - {paymentPlan.room.floor.apartment.name}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white">
                ยินดีต้อนรับ, {tenant?.name}
              </span>
              <LogOutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Tenant Navigation */}
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <a
              href="/tenant/dashboard"
              className="py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-[#01BCB4] hover:border-[#01BCB4] transition-colors duration-200"
            >
              แดชบอร์ด
            </a>
            <a
              href="/tenant/bills"
              className="py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-[#01BCB4] hover:border-[#01BCB4] transition-colors duration-200"
            >
              ใบแจ้งหนี้และการชำระเงิน
            </a>
            <a
              href="/tenant/maintenance"
              className="py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-[#01BCB4] hover:border-[#01BCB4] transition-colors duration-200"
            >
              คำขอซ่อมบำรุง
            </a>
            {/* <a
              href="/tenant/profile"
              className="py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-[#01BCB4] hover:border-[#01BCB4] transition-colors duration-200"
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