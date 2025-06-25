import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { RoomTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();
    const roomId = parseInt(id);
    if (!roomId || !["vacant", "occupied", "under_maintenance"].includes(status)) {
      return NextResponse.json({ message: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
    }
    console.log("Updating room status", { roomId, status });
    const result = await db.update(RoomTable)
      .set({ status })
      .where(eq(RoomTable.id, roomId));
    // result may be a count or an array depending on the ORM, so log it
    console.log("Update result", result);
    return NextResponse.json({ message: "อัปเดตสถานะห้องสำเร็จ", updated: result });
  } catch (error) {
    console.error("Error updating room status:", error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาดในการอัปเดตสถานะห้อง" }, { status: 500 });
  }
} 