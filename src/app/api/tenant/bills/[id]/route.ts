import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { PaymentPlanTable, RentTable, ElectricTable, WaterTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tenantId = id;

    // Get payment plan with latest bills
    const paymentPlan = await db.query.PaymentPlanTable.findFirst({
      where: eq(PaymentPlanTable.userId, tenantId),
      with: {
        rentBills: {
          orderBy: (table, { desc }) => desc(table.createdAt),
          limit: 1
        },
        electrics: {
          orderBy: (table, { desc }) => desc(table.createdAt),
          limit: 2
        },
        waters: {
          orderBy: (table, { desc }) => desc(table.createdAt),
          limit: 2
        }
      }
    });

    if (!paymentPlan) {
      return NextResponse.json(
        { error: "Payment plan not found" },
        { status: 404 }
      );
    }

    // Calculate electric and water fees if needed
    const latestElectric = paymentPlan.electrics[0];
    const prevElectric = paymentPlan.electrics[1];
    const latestWater = paymentPlan.waters[0];
    const prevWater = paymentPlan.waters[1];

    // Calculate electric fee if we have both current and previous readings
    if (latestElectric && prevElectric && latestElectric.fee === 0) {
      const electricUsage = latestElectric.meter - prevElectric.meter;
      const electricFee = electricUsage * (paymentPlan.electricFeePerMatrix || 0);
      
      await db.update(ElectricTable)
        .set({ fee: electricFee })
        .where(eq(ElectricTable.id, latestElectric.id));
      
      // Update the local data
      latestElectric.fee = electricFee;
    }

    // Calculate water fee if we have both current and previous readings
    if (latestWater && prevWater && latestWater.fee === 0) {
      const waterUsage = latestWater.meter - prevWater.meter;
      const waterFee = waterUsage * (paymentPlan.waterFeePerMatrix || 0);
      
      await db.update(WaterTable)
        .set({ fee: waterFee })
        .where(eq(WaterTable.id, latestWater.id));
      
      // Update the local data
      latestWater.fee = waterFee;
    }

    // Get latest bills
    const latestRent = paymentPlan.rentBills[0];

    const bills = {
      rent: {
        fee: latestRent?.fee || paymentPlan.fee,
        paid: latestRent?.paid || false,
        createdAt: latestRent?.createdAt || new Date()
      },
      electric: {
        fee: latestElectric?.fee || 0,
        paid: latestElectric?.paid || false,
        createdAt: latestElectric?.createdAt || new Date(),
        meter: latestElectric?.meter || 0
      },
      water: {
        fee: latestWater?.fee || 0,
        paid: latestWater?.paid || false,
        createdAt: latestWater?.createdAt || new Date(),
        meter: latestWater?.meter || 0
      }
    };

    return NextResponse.json(bills);
  } catch (error) {
    console.error("Error fetching tenant bills:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 