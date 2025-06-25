import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import { db } from "@/drizzle/db";
import { FloorTable, RoomTable, ApartmentTable, PaymentPlanTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser({ withFullUser: true, redirectIfNotFound: true });
    const body = await request.json();
    const { apartmentId, floors } = body;

    if (!apartmentId || !floors || !Array.isArray(floors)) {
      return NextResponse.json(
        { message: "ข้อมูลไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    // Verify the apartment belongs to the current user
    const apartment = await db.query.ApartmentTable.findFirst({
      where: eq(ApartmentTable.id, apartmentId)
    });

    if (!apartment) {
      return NextResponse.json(
        { message: "ไม่พบหอพัก" },
        { status: 404 }
      );
    }

    if (apartment.userId !== currentUser.id) {
      return NextResponse.json(
        { message: "ไม่มีสิทธิ์เข้าถึงหอพักนี้" },
        { status: 403 }
      );
    }

    // Create floors and rooms in a transaction
    const createdFloors = [];
    const createdRooms = [];
    const createdPaymentPlans = [];

    for (const floorData of floors) {
      // Create floor
      const [newFloor] = await db.insert(FloorTable).values({
        floor: floorData.floorNumber,
        apartmentId: apartmentId,
      }).returning();

      createdFloors.push(newFloor);

      // Create rooms for this floor
      if (floorData.rooms && Array.isArray(floorData.rooms)) {
        for (let i = 0; i < floorData.rooms.length; i++) {
          const roomData = floorData.rooms[i];
          const paymentPlanData = floorData.paymentPlans?.[i] || { fee: 0, lateFee: 0 };
          
          // Create room
          const [newRoom] = await db.insert(RoomTable).values({
            roomNumber: roomData.roomNumber,
            floorId: newFloor.id,
          }).returning();
          createdRooms.push(newRoom);

          // Create payment plan for this room
          const [newPaymentPlan] = await db.insert(PaymentPlanTable).values({
            fee: paymentPlanData.fee,
            lateFee: paymentPlanData.lateFee,
            waterFeePerMatrix: paymentPlanData.waterFeePerMatrix || 0,
            electricFeePerMatrix: paymentPlanData.electricFeePerMatrix || 0,
            roomId: newRoom.id,
          }).returning();
          createdPaymentPlans.push(newPaymentPlan);
        }
      }
    }

    return NextResponse.json({
      message: "สร้างชั้นและห้องเรียบร้อยแล้ว",
      floors: createdFloors,
      rooms: createdRooms,
      paymentPlans: createdPaymentPlans
    });

  } catch (error) {
    console.error("Error creating floors and rooms:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการสร้างชั้นและห้อง" },
      { status: 500 }
    );
  }
} 