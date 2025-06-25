import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import { db } from "@/drizzle/db";
import { ApartmentTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import CreateRoomsForm from "./CreateRoomsForm";
import App from "@/components/Sidebar/App";

interface PageProps {
  searchParams: Promise<{
    apartmentId?: string;
    from?: string;
  }>;
}

async function getApartmentDetails(apartmentId: string) {
  try {
    const currentUser = await getCurrentUser({ withFullUser: true, redirectIfNotFound: true });
    const apartmentIdNum = parseInt(apartmentId);

    if (isNaN(apartmentIdNum)) {
      return null;
    }

    const apartment = await db.query.ApartmentTable.findFirst({
      where: eq(ApartmentTable.id, apartmentIdNum)
    });

    if (!apartment || apartment.userId !== currentUser.id) {
      return null;
    }

    return apartment;
  } catch (error) {
    console.error("Error fetching apartment details:", error);
    return null;
  }
}

export default async function CreateRoomsPage({ searchParams }: PageProps) {
  const { apartmentId, from } = await searchParams;
  const currentUser = await getCurrentUser({ withFullUser: true, redirectIfNotFound: true });
  if (!apartmentId) {
    redirect("/dashboard");
  }

  const apartment = await getApartmentDetails(apartmentId);
  
  if (!apartment) {
    redirect("/dashboard");
  }

  return (
    <App title="สร้างห้อง" userName={currentUser.name}>
    <Suspense fallback={
      <div className="min-h-screen bg-[#dbe1f0] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-4 rounded-md shadow-md">
            <p className="text-center text-gray-600">กำลังโหลด...</p>
          </div>
        </div>
      </div>
    }>
      <CreateRoomsForm 
        apartmentId={apartmentId}
        apartmentName={apartment.name}
        fromPage={from}
      />
    </Suspense>
</App>
  );
}
