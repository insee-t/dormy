import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { UserTable, PaymentPlanTable, RoomTable, FloorTable, ApartmentTable } from "@/drizzle/schema";
import { eq, or, ilike, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

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

    const tenants = await db
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
      .where(
        whereConditions.length > 0 
          ? and(...whereConditions)
          : undefined
      )
      .orderBy(UserTable.createdAt);

    return NextResponse.json(tenants);

  } catch (error) {
    console.error("Error fetching tenants:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้เช่า" },
      { status: 500 }
    );
  }
} 