import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/auth/nextjs/currentUser';
import { db } from '@/drizzle/db';
import { ReceiptTable, PaymentPlanTable, RentTable } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser({ withFullUser: true });
    
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const receiptId = parseInt(id);
    if (isNaN(receiptId)) {
      return NextResponse.json({ error: 'Invalid receipt ID' }, { status: 400 });
    }

    const body = await request.json();
    const { action } = body; // 'approve', 'reject', 'clarify'

    if (!['approve', 'reject', 'clarify'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Get the receipt with payment plan info
    const receipt = await db.query.ReceiptTable.findFirst({
      where: eq(ReceiptTable.id, receiptId),
      with: {
        paymentPlan: true
      }
    });

    if (!receipt) {
      return NextResponse.json({ error: 'Receipt not found' }, { status: 404 });
    }

    let newStatus: string;
    let paymentPlanUpdate: any = {};

    switch (action) {
      case 'approve':
        newStatus = 'approved';
        // Update payment plan to mark as paid
        paymentPlanUpdate = {
          // Create a new rent record to mark as paid
          rentBills: {
            create: {
              paymentPlanId: receipt.paymentPlanId,
              paid: true,
              late: false,
              fee: receipt.amount,
              userId: receipt.userId
            }
          }
        };
        break;
      
      case 'reject':
        newStatus = 'rejected';
        break;
      
      case 'clarify':
        newStatus = 'clarification_requested';
        break;
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Update receipt status
    await db.update(ReceiptTable)
      .set({ 
        status: newStatus,
        updatedAt: new Date()
      })
      .where(eq(ReceiptTable.id, receiptId));

    // If approving, also update the payment plan
    if (action === 'approve') {
      // Create a new rent record to mark as paid
      await db.insert(RentTable).values({
        paymentPlanId: receipt.paymentPlanId,
        paid: true,
        late: false,
        fee: receipt.amount,
        userId: receipt.userId
      });
    }

    console.log(`Receipt ${receiptId} ${action}ed by admin ${currentUser.id}`);

    return NextResponse.json({ 
      message: `Receipt ${action}ed successfully`,
      status: newStatus
    });
  } catch (error) {
    console.error('Error updating receipt status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 