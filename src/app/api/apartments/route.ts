import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { ApartmentTable } from "@/drizzle/schema";

export async function GET(request: NextRequest) {
  try {
    const apartments = await db.query.ApartmentTable.findMany({
      columns: {
        id: true,
        name: true,
        address: true
      },
      orderBy: (table, { asc }) => asc(table.name)
    });

    return NextResponse.json(apartments);

  } catch (error) {
    console.error("Error fetching apartments:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการดึงข้อมูลหอพัก" },
      { status: 500 }
    );
  }
} 