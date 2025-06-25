import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { UserTable, PaymentPlanTable, RoomTable } from "@/drizzle/schema";
import { hashPassword } from "@/auth/core/passwordHasher";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, roomId } = body;

    // Validate required fields
    if (!name || !email || !password || !roomId) {
      return NextResponse.json(
        { message: "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingTenant = await db.query.UserTable.findFirst({
      where: eq(UserTable.email, email)
    });

    if (existingTenant) {
      return NextResponse.json(
        { message: "อีเมลนี้ถูกใช้งานแล้ว" },
        { status: 400 }
      );
    }

    // Check if room is available (no existing tenant for this room)
    const roomWithTenant = await db.query.PaymentPlanTable.findFirst({
      where: eq(PaymentPlanTable.roomId, parseInt(roomId)),
      with: {
        tenant: {
          columns: { id: true }
        }
      }
    });

    if (roomWithTenant?.tenant) {
      return NextResponse.json(
        { message: "ห้องนี้มีผู้เช่าอยู่แล้ว" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create tenant
    const [newTenant] = await db.insert(UserTable).values({
      name,
      email,
      password: hashedPassword,
      role: "user"
    }).returning();

    // Update existing payment plan to assign tenant to the room
    await db.update(PaymentPlanTable)
      .set({ userId: newTenant.id })
      .where(eq(PaymentPlanTable.roomId, parseInt(roomId)));

    // Set room status to 'occupied'
    await db.update(RoomTable)
      .set({ status: "occupied" })
      .where(eq(RoomTable.id, parseInt(roomId)));

    return NextResponse.json({
      message: "สร้างบัญชีผู้เช่าสำเร็จ",
      tenant: {
        id: newTenant.id,
        name: newTenant.name,
        email: newTenant.email
      }
    });

  } catch (error) {
    console.error("Error creating tenant:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการสร้างบัญชีผู้เช่า" },
      { status: 500 }
    );
  }
} 