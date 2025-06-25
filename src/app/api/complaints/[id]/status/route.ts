import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { ComplainTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    // Validate status
    const validStatuses = ["in_progress", "waiting_for_inventory", "complete"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be one of: in_progress, waiting_for_inventory, complete" },
        { status: 400 }
      );
    }

    // Update the complaint status
    const updatedComplaint = await db
      .update(ComplainTable)
      .set({ 
        status,
        updatedAt: new Date()
      })
      .where(eq(ComplainTable.id, parseInt(id)))
      .returning();

    if (updatedComplaint.length === 0) {
      return NextResponse.json(
        { error: "Complaint not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Complaint status updated successfully",
      complaint: updatedComplaint[0]
    });

  } catch (error) {
    console.error("Error updating complaint status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 