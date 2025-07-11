import React from "react";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import { db } from "@/drizzle/db";
import { 
  AnnouncementTable, 
  ApartmentTable, 
  UserTable,
  PaymentPlanTable,
  RoomTable,
  FloorTable
} from "@/drizzle/schema";
import { eq, desc, and } from "drizzle-orm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Building, AlertTriangle, Info, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

async function getTenantAnnouncements(userId: string) {
  // Get tenant's payment plan with apartment info
  const paymentPlan = await db.query.PaymentPlanTable.findFirst({
    where: eq(PaymentPlanTable.userId, userId),
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

  if (!paymentPlan?.room?.floor?.apartment) {
    return [];
  }

  const apartmentId = paymentPlan.room.floor.apartment.id;

  // Get announcements for this apartment
  const announcements = await db
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
    .where(and(
      eq(AnnouncementTable.apartmentId, apartmentId),
      eq(AnnouncementTable.isPublished, true)
    ))
    .orderBy(desc(AnnouncementTable.createdAt));

  return announcements;
}

export default async function TenantAnnouncementsPage() {
  const currentUser = await getCurrentUser({ withFullUser: true, redirectIfNotFound: true });
  const announcements = await getTenantAnnouncements(currentUser.id);

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

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'ด่วน';
      case 'high':
        return 'สำคัญ';
      case 'normal':
        return 'ทั่วไป';
      case 'low':
        return 'ต่ำ';
      default:
        return 'ทั่วไป';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/tenant/dashboard">
          <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ประกาศและข่าวสาร</h1>
          <p className="text-gray-600">ข้อมูลสำคัญและประกาศจากเจ้าของหอพัก</p>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <Card className="border-slate-300">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Info className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-600 mb-2">
                ยังไม่มีประกาศ
              </p>
              <p className="text-sm text-gray-500">
                ยังไม่มีประกาศหรือข่าวสารใหม่จากเจ้าของหอพัก
              </p>
            </CardContent>
          </Card>
        ) : (
          announcements.map((announcement) => (
            <Card key={announcement.id} className="border-slate-300 hover:shadow-lg transition-shadow">
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
                        {getPriorityText(announcement.priority)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {announcement.content}
                  </p>
                </div>
                
                <div className="border-t pt-4 space-y-2">
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
                      ประกาศเมื่อ {new Date(announcement.createdAt).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 