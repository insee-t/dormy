import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { BankAccountApartmentTable, BankAccountTable, ApartmentTable } from '@/drizzle/schema';
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
    const apartmentId = parseInt(id);
    if (isNaN(apartmentId)) {
      return NextResponse.json({ error: 'Invalid apartment ID' }, { status: 400 });
    }

    // Get the bank account associated with this apartment
    const bankAccountAssociation = await db.query.BankAccountApartmentTable.findFirst({
      where: eq(BankAccountApartmentTable.apartmentId, apartmentId),
      with: {
        bankAccount: true
      }
    });

    if (!bankAccountAssociation) {
      return NextResponse.json({ error: 'No bank account associated with this apartment' }, { status: 404 });
    }

    return NextResponse.json(bankAccountAssociation.bankAccount);
  } catch (error) {
    console.error('Error fetching apartment bank account:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 