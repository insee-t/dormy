import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import { db } from "@/drizzle/db";
import { ApartmentTable } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";

interface UpdateApartmentRequest {
  name: string;
  address: string;
  phone: string;
  email?: string;
  taxId?: string;
  businessType: "personal" | "business";
  billDate: number;
  paymentDueDate: number;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser({ 
      withFullUser: true, 
      redirectIfNotFound: false 
    });

    if (!currentUser) {
      return NextResponse.json(
        { message: "ไม่ได้รับอนุญาต" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const apartmentId = parseInt(id);
    if (isNaN(apartmentId)) {
      return NextResponse.json(
        { message: "ID หอพักไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    const body: UpdateApartmentRequest = await request.json();
    const { 
      name, 
      address, 
      phone, 
      email, 
      taxId, 
      businessType, 
      billDate, 
      paymentDueDate 
    } = body;

    // Validate required fields
    if (!name || !address || !phone || !businessType || !billDate || !paymentDueDate) {
      return NextResponse.json(
        { message: "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน" },
        { status: 400 }
      );
    }

    // Validate date ranges
    if (billDate < 1 || billDate > 31 || paymentDueDate < 1 || paymentDueDate > 31) {
      return NextResponse.json(
        { message: "วันที่ต้องอยู่ระหว่าง 1-31" },
        { status: 400 }
      );
    }

    // Check if apartment exists and belongs to current user
    const existingApartment = await db
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

    if (!existingApartment) {
      return NextResponse.json(
        { message: "ไม่พบหอพักหรือไม่มีสิทธิ์แก้ไข" },
        { status: 404 }
      );
    }

    // Parse dates
    const billDateObj = new Date();
    billDateObj.setDate(billDate);
    
    const paymentDueDateObj = new Date();
    paymentDueDateObj.setDate(paymentDueDate);

    // Update apartment
    await db
      .update(ApartmentTable)
      .set({
        name,
        address,
        phone,
        email: email || null,
        taxId: taxId || null,
        businessType,
        billDate: billDateObj,
        paymentDate: paymentDueDateObj,
        updatedAt: new Date(),
      })
      .where(eq(ApartmentTable.id, apartmentId));

    return NextResponse.json(
      { message: "อัปเดตข้อมูลหอพักสำเร็จแล้ว" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Apartment update error:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูลหอพัก" },
      { status: 500 }
    );
  }
} 