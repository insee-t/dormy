import React from "react";
import App from "../../../components/Sidebar/App";
import { db } from "@/drizzle/db";
import { 
  UserTable, 
  PaymentPlanTable, 
  RoomTable, 
  FloorTable, 
  ApartmentTable 
} from "@/drizzle/schema";
import { eq, or, ilike, and, desc } from "drizzle-orm";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import { redirect } from "next/navigation";
import getApartments from "@/lib/getApartments";
import ApartmentSelectForm from "../../../components/ApartmentSelectForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Phone, Mail, Calendar, MapPin, Home } from "lucide-react";
import SearchButton from "@/components/SearchButton";

interface TenantsPageProps {
  searchParams: {
    search?: string;
    apartment?: string;
  };
}

export default async function TenantsPage({ searchParams }: TenantsPageProps) {
  const currentUser = await getCurrentUser({ withFullUser: true, redirectIfNotFound: true });
  const apartments = await getApartments(currentUser.id);
  
  const search = searchParams.search || '';

  if (!apartments.length) {
    return (
      <App title="ข้อมูลผู้เช่า" userName={currentUser.name}>
        <div className="flex flex-col items-center justify-center h-full p-10">
          <p className="text-xl mb-4">คุณยังไม่มีหอพักในระบบ</p>
          <a
            href="/dashboard/new-apartment"
            className="bg-[#01BCB4] hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
          >
            สร้างหอพักใหม่
          </a>
        </div>
      </App>
    );
  }

  // Filter by apartments owned by the current user
  const apartmentIds = apartments.map(apt => apt.id).filter(id => id !== null) as number[];
  
  let tenants: any[] = [];
  
  // Only fetch tenants if user has apartments
  if (apartmentIds.length > 0) {
    let whereConditions = [];

    // Add search conditions if search term is provided
    if (search.trim()) {
      whereConditions.push(
        or(
          ilike(UserTable.name, `%${search}%`),
          ilike(UserTable.email, `%${search}%`),
          ilike(UserTable.phone || '', `%${search}%`)
        )
      );
    }

    // Always filter by apartments owned by the current user
    whereConditions.push(
      or(...apartmentIds.map(id => eq(ApartmentTable.id, id)))
    );

    tenants = await db
      .select({
        id: UserTable.id,
        name: UserTable.name,
        email: UserTable.email,
        phone: UserTable.phone,
        createdAt: UserTable.createdAt,
        roomNumber: RoomTable.roomNumber,
        floorNumber: FloorTable.floor,
        apartmentName: ApartmentTable.name,
        apartmentAddress: ApartmentTable.address,
      })
      .from(UserTable)
      .leftJoin(PaymentPlanTable, eq(UserTable.id, PaymentPlanTable.userId))
      .leftJoin(RoomTable, eq(PaymentPlanTable.roomId, RoomTable.id))
      .leftJoin(FloorTable, eq(RoomTable.floorId, FloorTable.id))
      .leftJoin(ApartmentTable, eq(FloorTable.apartmentId, ApartmentTable.id))
      .where(and(...whereConditions))
      .orderBy(desc(UserTable.createdAt));
  }

  return (
    <App title="ข้อมูลผู้เช่า" userName={currentUser.name}>
      <div className="bg-white min-h-screen shadow-md rounded-xl p-6">
        <div className="flex flex-col gap-4 mb-6">

          {/* Search Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                ค้นหาผู้เช่า
              </CardTitle>
              <CardDescription>
                ค้นหาจากชื่อ, อีเมล, หรือเบอร์โทรศัพท์
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex gap-2">
                <Input
                  name="search"
                  placeholder="ค้นหาผู้เช่า..."
                  defaultValue={search}
                  className="flex-1"
                />
                <Button type="submit">ค้นหา</Button>
                {search && (
                <SearchButton />
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Tenants List */}
        <div className="grid gap-4">
          {tenants.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Home className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-600 mb-2">
                  {search ? 'ไม่พบผู้เช่าที่ตรงกับคำค้นหา' : 'ยังไม่มีผู้เช่าในหอพักนี้'}
                </p>
                <p className="text-sm text-gray-500">
                  {search ? 'ลองเปลี่ยนคำค้นหาหรือล้างการค้นหา' : 'ผู้เช่าจะปรากฏที่นี่เมื่อลงทะเบียนแล้ว'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">รายชื่อผู้เช่า ({tenants.length})</h2>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tenants.map((tenant) => (
                  <Card key={tenant.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{tenant.name}</CardTitle>
                          <CardDescription>
                            ห้อง {tenant.roomNumber} ชั้น {tenant.floorNumber}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">
                          {tenant.apartmentName}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{tenant.email}</span>
                      </div>
                      
                      {tenant.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{tenant.phone}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{tenant.apartmentAddress}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">
                          เข้าร่วมเมื่อ {new Date(tenant.createdAt).toLocaleDateString('th-TH')}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </App>
  );
} 