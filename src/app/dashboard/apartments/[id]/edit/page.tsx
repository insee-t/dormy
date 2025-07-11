import { getCurrentUser } from "@/auth/nextjs/currentUser";
import { db } from "@/drizzle/db";
import { ApartmentTable } from "@/drizzle/schema";
import { redirect } from "next/navigation";
import App from "@/components/Sidebar/App";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import EditApartmentForm from "./EditApartmentForm";

interface EditApartmentPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditApartmentPage({ params }: EditApartmentPageProps) {
  const currentUser = await getCurrentUser({ withFullUser: true, redirectIfNotFound: true });
  const { id } = await params;
  const apartmentId = parseInt(id);

  if (isNaN(apartmentId)) {
    notFound();
  }

  // Fetch the apartment and verify ownership
  const apartment = await db
    .select()
    .from(ApartmentTable)
    .where(
      and(
        eq(ApartmentTable.id, apartmentId),
        eq(ApartmentTable.userId, currentUser.id)
      )
    )
    .limit(1)
    .then(rows => rows[0]);

  if (!apartment) {
    notFound();
  }

  // Convert dates to day numbers for the form
  const billDay = apartment.billDate.getDate();
  const paymentDay = apartment.paymentDate.getDate();

  return (
    <App title="แก้ไขหอพัก" userName={currentUser.name}>
      <div className="bg-white shadow-md rounded-2xl p-8 h-fit">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">แก้ไขหอพัก</h1>
            <p className="text-gray-600">อัปเดตข้อมูลหอพักของคุณ</p>
          </div>
          
          <EditApartmentForm 
            apartment={{
              ...apartment,
              billDay,
              paymentDay
            }}
          />
        </div>
      </div>
    </App>
  );
} 