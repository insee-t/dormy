import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { RoomTable, PaymentPlanTable } from "@/drizzle/schema";
import { eq, isNull } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const apartmentId = searchParams.get('apartmentId');

    // Get all rooms with their payment plans
    let allRooms = await db.query.RoomTable.findMany({
      with: {
        floor: {
          with: {
            apartment: {
              columns: {
                id: true,
                name: true,
                address: true
              }
            }
          }
        },
        paymentPlan: {
          with: {
            tenant: {
              columns: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: (table, { asc }) => asc(table.roomNumber)
    });

    // Filter rooms that don't have a payment plan with a tenant (available rooms)
    let availableRooms = allRooms.filter(room => !room.paymentPlan?.tenant);

    // If apartmentId is provided, filter by apartment
    if (apartmentId) {
      availableRooms = availableRooms.filter(room => 
        room.floor.apartment.id.toString() === apartmentId
      );
    }

    return NextResponse.json(availableRooms);

  } catch (error) {
    console.error("Error fetching available rooms:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการดึงข้อมูลห้อง" },
      { status: 500 }
    );
  }
} 