import { db } from "@/drizzle/db";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import App from "@/components/Sidebar/App";
import { Package as LucidePackage } from "lucide-react";
import { HeroUIProvider } from "@heroui/react";
import React from "react";
import getApartments from "@/lib/getApartments";
import ApartmentSelectForm from "@/components/ApartmentSelectForm";
import AddPackageModal from "./AddPackageModal";
import MarkDeliveredButton from "./MarkDeliveredButton";
import SearchForm from "./SearchForm";
import { RoomTable, UserTable, PaymentPlanTable, FloorTable, PackageTable } from "@/drizzle/schema";
import { eq, and, inArray, ilike, or } from "drizzle-orm";

function PackageFilterButtons({ filter, apartment }: { filter: string, apartment: number }) {
  // Helper to build URL with filter and apartment
  function buildUrl(newFilter: string) {
    const params = new URLSearchParams();
    if (apartment !== undefined) params.set('apartment', String(apartment));
    if (newFilter !== 'all') params.set('filter', newFilter);
    return `?${params.toString()}`;
  }
  return (
    <div className="flex mb-4 gap-2">
      <a
        href={buildUrl('pending')}
        className={`bg-slate-800 hover:bg-slate-600 text-white px-4 py-2 rounded-md${filter === "pending" ? " ring-2 ring-[#2FAB73]" : ""}`}
      >
        พัสดุค้างนำจ่าย
      </a>
      <a
        href={buildUrl('delivered')}
        className={`bg-slate-800 hover:bg-slate-600 text-white px-4 py-2 rounded-md${filter === "delivered" ? " ring-2 ring-[#2FAB73]" : ""}`}
      >
        พัสดุนำจ่ายแล้ว
      </a>
      <a
        href={buildUrl('all')}
        className={`bg-slate-800 hover:bg-slate-600 text-white px-4 py-2 rounded-md${filter === "all" ? " ring-2 ring-[#2FAB73]" : ""}`}
      >
        ทั้งหมด
      </a>
    </div>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: any
}) {
  const currentUser = await getCurrentUser({ withFullUser:true, redirectIfNotFound: true });

  const { apartment, search, filter = 'all' } = searchParams;
  const currentApartment = apartment ? parseInt(apartment) : 0;
  const apartments = await getApartments(currentUser.id);

  let tenants: { id: string, name: string, roomNumber: string }[] = [];
  let packages: any[] = [];
  if (!apartments[currentApartment].id) {
    return (
      <App title="ผังห้อง" userName={currentUser.name}>
        <div className="flex flex-col items-center justify-center h-full p-10">
          <p className="text-xl mb-4">คุณยังไม่มีหอพักในระบบ</p>
          <a
            href="/dashboard/new-apartment"
            className="bg-[#01BCB4] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            สร้างหอพักใหม่
          </a>
        </div>
      </App>
    );
  }


  const apartmentId = apartments[currentApartment].id as number;

  // Get packages directly for this apartment
  let searchTerm = (search || '').trim();

    packages = await db.query.PackageTable.findMany({
    where: (pkg, { eq, and, ilike, or }) => {
      let conditions = [eq(pkg.apartmentId, apartmentId)];
      
      // Apply filter
      if (filter === 'pending') {
        conditions.push(eq(pkg.complete, false));
      } else if (filter === 'delivered') {
        conditions.push(eq(pkg.complete, true));
      }
      
      // Apply search
        if (searchTerm) {
          const like = `%${searchTerm}%`;
        const searchConditions = [
              ilike(pkg.roomNumber, like),
              ilike(pkg.ownerName, like),
              ilike(pkg.code, like)
        ];
        const searchCondition = or(...searchConditions);
        if (searchCondition) {
          conditions.push(searchCondition);
        }
      }
      
      return and(...conditions);
      },
      with: {
        tenant: {
        columns: { name: true },
        }
      },
      orderBy: (pkg, { desc }) => desc(pkg.createdAt)
    });

    packages = packages.map(pkg => ({
      id: pkg.id,
      code: pkg.code,
      complete: pkg.complete,
      createdAt: pkg.createdAt,
      tenantName: pkg.tenant?.name ?? '',
    roomNumber: pkg.roomNumber ?? '',
      ownerName: pkg.ownerName ?? '',
      apartmentId: apartmentId,
    }));

  return (
    <HeroUIProvider>
      <App title="พัสดุ" userName={currentUser.name}>
        <div className="min-h-screen bg-white rounded-2xl shadow-md">
          <div className="flex flex-col gap-2 bg-slate-50 rounded-xl shadow-sm px-6 py-4 mb-4 items-center md:flex-row md:justify-between md:items-center">
            <ApartmentSelectForm apartments={apartments as any} currentApartment={currentApartment} />
          </div>
          <div className="content-center">
            <div className="flex-auto w-full h-auto shadow-md p-4 rounded-md mb-2">
              <PackageFilterButtons filter={filter} apartment={currentApartment} />
              <div className="sm:inline flex gap-4 mb-6">
                <div className="flex mt-3 gap-4 w-full items-center">
                  <div className="flex-1">
                    <SearchForm defaultValue={search || ''} apartment={currentApartment} filter={filter} />
                  </div>
                  <div className="flex-shrink-0">
                    <AddPackageModal apartmentId={apartments[currentApartment].id || 0} />
                  </div>
                </div>
              </div>
            </div>
            {/* Display list of packages */}
              {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="flex items-center justify-between rounded-lg p-4 shadow-md mb-2"
              >
                <div className="flex gap-12 mx-8">
                  <LucidePackage size={75} />
                  <div className="flex items-center">
                    <div>
                      <div className="text-lg font-bold">{pkg.roomNumber || "-"}</div>
                      <div>{pkg.tenantName || "-"}</div>
                      <div>รหัสพัสดุ : {pkg.code}</div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {pkg.complete ? (
                    <div className="bg-lime-200 text-black px-3 py-1 rounded-md text-sm text-center">
                      นำจ่ายแล้ว
                    </div>
                  ) : (
                    <div className="flex flex-col items-end">
                      <div className="inline w-fit bg-yellow-200 text-black px-3 py-1 rounded-md text-sm text-center mb-2">
                        รอดำเนินการ
                      </div>
                      <MarkDeliveredButton id={pkg.id} />
                    </div>
                  )}
                  <div className="mt-2 text-slate-600">
                    {pkg.createdAt?.toLocaleDateString("th-TH")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Modal for Adding Package */}
        {/* AddPackageModal is now rendered above in the trigger area */}
      </App>
    </HeroUIProvider>
  );
}
