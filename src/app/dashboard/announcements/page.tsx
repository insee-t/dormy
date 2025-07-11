import React from "react";
import App from "../../../components/Sidebar/App";
import { db } from "@/drizzle/db";
import { 
  AnnouncementTable, 
  ApartmentTable, 
  UserTable 
} from "@/drizzle/schema";
import { eq, desc, and, or } from "drizzle-orm";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import { redirect } from "next/navigation";
import getApartments from "@/lib/getApartments";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, User, Building, AlertTriangle, Info, CheckCircle, Megaphone } from "lucide-react";
import Link from "next/link";

interface AnnouncementsPageProps {
  searchParams: Promise<{
    apartment?: string;
  }>;
}

export default async function AnnouncementsPage({ searchParams }: AnnouncementsPageProps) {
  const currentUser = await getCurrentUser({ withFullUser: true, redirectIfNotFound: true });
  const apartments = await getApartments(currentUser.id);
  
  const { apartment } = await searchParams;
  const selectedApartmentId = apartment ? parseInt(apartment) : apartments[0]?.id;

  if (!apartments.length) {
    return (
      <App title="ประกาศ" userName={currentUser.name}>
        <div className="flex flex-col items-center justify-center h-full p-10">
          <p className="text-xl mb-4">คุณยังไม่มีหอพักในระบบ</p>
          <Link
            href="/dashboard/new-apartment"
            className="bg-[#01BCB4] hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
          >
            สร้างหอพักใหม่
          </Link>
        </div>
      </App>
    );
  }

  // Filter by apartments owned by the current user
  const apartmentIds = apartments.map(apt => apt.id).filter(id => id !== null) as number[];
  
  let announcements: any[] = [];
  
  // Only fetch announcements if user has apartments
  if (apartmentIds.length > 0) {
    const whereConditions = [];

    // Filter by selected apartment if specified
    if (selectedApartmentId && apartmentIds.includes(selectedApartmentId)) {
      whereConditions.push(eq(AnnouncementTable.apartmentId, selectedApartmentId));
    } else {
      // Otherwise, show announcements from all user's apartments
      whereConditions.push(or(...apartmentIds.map(id => eq(AnnouncementTable.apartmentId, id))));
    }

    announcements = await db
      .select({
        id: AnnouncementTable.id,
        title: AnnouncementTable.title,
        content: AnnouncementTable.content,
        priority: AnnouncementTable.priority,
        isPublished: AnnouncementTable.isPublished,
        createdAt: AnnouncementTable.createdAt,
        apartmentName: ApartmentTable.name,
        creatorName: UserTable.name,
      })
      .from(AnnouncementTable)
      .leftJoin(ApartmentTable, eq(AnnouncementTable.apartmentId, ApartmentTable.id))
      .leftJoin(UserTable, eq(AnnouncementTable.createdBy, UserTable.id))
      .where(and(...whereConditions))
      .orderBy(desc(AnnouncementTable.createdAt));
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertTriangle className="w-4 h-4" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4" />;
      case 'normal':
        return <Info className="w-4 h-4" />;
      case 'low':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  return (
    <App title="ประกาศ" userName={currentUser.name}>
      <div className="bg-white min-h-screen shadow-md rounded-xl p-6">
        <div className="flex flex-col gap-4 mb-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ประกาศ</h1>
              <p className="text-gray-600">จัดการประกาศและข้อมูลสำหรับผู้เช่า</p>
            </div>
            <Link href="/dashboard/announcements/new">
              <Button className="bg-[#01BCB4] hover:bg-cyan-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                สร้างประกาศใหม่
              </Button>
            </Link>
          </div>

          {/* Apartment Filter */}
          {apartments.length > 1 && (
            <Card className="border-slate-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  เลือกหอพัก
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  {apartments.map((apartment) => (
                    <Link
                      key={apartment.id}
                      href={`/dashboard/announcements?apartment=${apartment.id}`}
                    >
                      <Button
                        variant={selectedApartmentId === apartment.id ? "default" : "outline"}
                        className={selectedApartmentId === apartment.id ? "bg-[#01BCB4] hover:bg-cyan-700" : ""}
                      >
                        {apartment.name}
                      </Button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Announcements List */}
        <div className="grid gap-4">
          {announcements.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Megaphone className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-600 mb-2">
                  ยังไม่มีประกาศ
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  สร้างประกาศแรกของคุณเพื่อแจ้งข้อมูลสำคัญให้ผู้เช่า
                </p>
                <Link href="/dashboard/announcements/new">
                  <Button className="bg-[#01BCB4] hover:bg-cyan-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    สร้างประกาศใหม่
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">รายการประกาศ ({announcements.length})</h2>
              </div>
              
              <div className="grid gap-4">
                {announcements.map((announcement) => (
                  <Card key={announcement.id} className="hover:shadow-lg transition-shadow border-slate-300">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">{announcement.title}</CardTitle>
                            <Badge 
                              variant="outline" 
                              className={`${getPriorityColor(announcement.priority)} flex items-center gap-1`}
                            >
                              {getPriorityIcon(announcement.priority)}
                              {announcement.priority === 'urgent' && 'ด่วน'}
                              {announcement.priority === 'high' && 'สำคัญ'}
                              {announcement.priority === 'normal' && 'ทั่วไป'}
                              {announcement.priority === 'low' && 'ต่ำ'}
                            </Badge>
                            {!announcement.isPublished && (
                              <Badge variant="secondary">ร่าง</Badge>
                            )}
                          </div>
                          <CardDescription className="text-sm">
                            {announcement.content.length > 150 
                              ? `${announcement.content.substring(0, 150)}...` 
                              : announcement.content
                            }
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building className="w-4 h-4" />
                        <span>{announcement.apartmentName}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>โดย {announcement.creatorName}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          สร้างเมื่อ {new Date(announcement.createdAt).toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
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