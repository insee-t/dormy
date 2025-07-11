import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { comparePassword } from "@/auth/core/passwordHasher";

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
    const { currentPassword, newPassword } = body;

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "รหัสผ่านปัจจุบันและรหัสผ่านใหม่เป็นข้อมูลที่จำเป็น" },
        { status: 400 }
      );
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: "รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร" },
        { status: 400 }
      );
    }

    // Get user with password for verification
    const userWithPassword = await db
      .select()
      .from(UserTable)
      .where(eq(UserTable.id, currentUser.id))
      .limit(1)
      .then(rows => rows[0]);

    if (!userWithPassword || !userWithPassword.password) {
      return NextResponse.json(
        { message: "ไม่พบข้อมูลผู้ใช้หรือรหัสผ่าน" },
        { status: 404 }
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(
      currentPassword,
      userWithPassword.password
    );

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { message: "รหัสผ่านปัจจุบันไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    // Hash new password
    const { hashPassword } = await import("@/auth/core/passwordHasher");
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password
    await db
      .update(UserTable)
      .set({
        password: hashedNewPassword,
        updatedAt: new Date(),
      })
      .where(eq(UserTable.id, currentUser.id));

    return NextResponse.json(
      { message: "เปลี่ยนรหัสผ่านสำเร็จแล้ว" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน" },
      { status: 500 }
    );
  }
} 