import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import { db } from "@/drizzle/db";
import { ApartmentTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser({ withFullUser: true, redirectIfNotFound: true });
    const { id } = await params;
    const apartmentId = parseInt(id);

    if (isNaN(apartmentId)) {
      return NextResponse.json(
        { message: "ID หอพักไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    const apartment = await db.query.ApartmentTable.findFirst({
      where: eq(ApartmentTable.id, apartmentId)
    });

    if (!apartment) {
      return NextResponse.json(
        { message: "ไม่พบหอพัก" },
        { status: 404 }
      );
    }

    // Check if the apartment belongs to the current user
    if (apartment.userId !== currentUser.id) {
      return NextResponse.json(
        { message: "ไม่มีสิทธิ์เข้าถึงหอพักนี้" },
        { status: 403 }
      );
    }

    return NextResponse.json(apartment);

  } catch (error) {
    console.error("Error fetching apartment:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการดึงข้อมูลหอพัก" },
      { status: 500 }
    );
  }
} 