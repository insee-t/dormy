import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { PackageTable, UserTable, RoomTable, FloorTable, PaymentPlanTable } from "@/drizzle/schema";
import { eq, and, ilike } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { roomNumber, ownerName, trackingCode, apartmentId } = await req.json();
    if (!roomNumber || !ownerName || !trackingCode || !apartmentId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    
    // Find tenant by room number and apartment
    const tenants = await db
      .select({ id: UserTable.id, name: UserTable.name })
      .from(UserTable)
      .leftJoin(PaymentPlanTable, eq(UserTable.id, PaymentPlanTable.userId))
      .leftJoin(RoomTable, eq(PaymentPlanTable.roomId, RoomTable.id))
      .leftJoin(FloorTable, eq(RoomTable.floorId, FloorTable.id))
      .where(and(
        eq(RoomTable.roomNumber, roomNumber),
        eq(FloorTable.apartmentId, apartmentId)
      ));
    
    // Try to match by name first, then use the first tenant if no exact match
    const normalizedOwner = ownerName.trim().toLowerCase();
    let matchedTenant = tenants.find(t => t.name.trim().toLowerCase() === normalizedOwner);
    
    // If no exact match, use the first tenant found for that room
    if (!matchedTenant && tenants.length > 0) {
      matchedTenant = tenants[0];
    }
    
    // Insert package (userId can be null if no tenant found)
    await db.insert(PackageTable).values({
      code: trackingCode,
      ownerName,
      roomNumber,
      userId: matchedTenant?.id || null,
      apartmentId,
      complete: false,
    });
    
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Package creation error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, complete } = await req.json();
    if (!id || typeof complete !== 'boolean') {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    await db.update(PackageTable)
      .set({ complete })
      .where(eq(PackageTable.id, id));
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
} 