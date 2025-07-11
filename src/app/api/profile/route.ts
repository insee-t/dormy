import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const { name, realName, email, phone } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { message: "ชื่อและอีเมลเป็นข้อมูลที่จำเป็น" },
        { status: 400 }
      );
    }

    // Check if email is already taken by another user
    if (email !== currentUser.email) {
      const existingUser = await db.query.UserTable.findFirst({
        where: eq(UserTable.email, email),
      });

      if (existingUser && existingUser.id !== currentUser.id) {
        return NextResponse.json(
          { message: "อีเมลนี้ถูกใช้งานแล้ว" },
          { status: 400 }
        );
      }
    }

    // Update user profile
    await db
      .update(UserTable)
      .set({
        name,
        realName: realName || null,
        email,
        phone: phone || null,
        updatedAt: new Date(),
      })
      .where(eq(UserTable.id, currentUser.id));

    return NextResponse.json(
      { message: "อัปเดตโปรไฟล์สำเร็จแล้ว" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์" },
      { status: 500 }
    );
  }
} 