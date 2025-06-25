import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { PaymentPlanTable, UserTable } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/auth/nextjs/currentUser';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser({ withFullUser: true });
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify the user is requesting their own payment plan
    if (currentUser.id !== id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get payment plan with room and apartment details
    const paymentPlan = await db.query.PaymentPlanTable.findFirst({
      where: eq(PaymentPlanTable.userId, id),
      with: {
        room: {
          with: {
            floor: {
              with: {
                apartment: true
              }
            }
          }
        }
      }
    });

    if (!paymentPlan) {
      return NextResponse.json({ error: 'Payment plan not found' }, { status: 404 });
    }

    return NextResponse.json(paymentPlan);
  } catch (error) {
    console.error('Error fetching payment plan:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 