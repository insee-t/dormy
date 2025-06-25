import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { BankAccountTable, BankAccountApartmentTable, ApartmentTable } from '@/drizzle/schema';
import { getCurrentUser } from '@/auth/nextjs/currentUser';
import { eq, and, inArray } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser({ withFullUser: true, redirectIfNotFound: true });
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const bankAccountId = parseInt(id);
    if (isNaN(bankAccountId)) {
      return NextResponse.json({ error: 'Invalid bank account ID' }, { status: 400 });
    }

    // Verify the bank account belongs to the current user
    const bankAccount = await db.select().from(BankAccountTable)
      .where(and(
        eq(BankAccountTable.id, bankAccountId),
        eq(BankAccountTable.userId, currentUser.id)
      ));

    if (bankAccount.length === 0) {
      return NextResponse.json({ error: 'Bank account not found' }, { status: 404 });
    }

    // Get associated apartment IDs
    const associations = await db.select({ apartmentId: BankAccountApartmentTable.apartmentId })
      .from(BankAccountApartmentTable)
      .where(eq(BankAccountApartmentTable.bankAccountId, bankAccountId));

    const apartmentIds = associations.map(assoc => assoc.apartmentId);

    return NextResponse.json({ apartmentIds });
  } catch (error) {
    console.error('Error fetching apartment associations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser({ withFullUser: true, redirectIfNotFound: true });
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const bankAccountId = parseInt(id);
    if (isNaN(bankAccountId)) {
      return NextResponse.json({ error: 'Invalid bank account ID' }, { status: 400 });
    }

    const body = await request.json();
    const { apartmentIds } = body;

    if (!Array.isArray(apartmentIds)) {
      return NextResponse.json({ error: 'apartmentIds must be an array' }, { status: 400 });
    }

    // Verify the bank account belongs to the current user
    const bankAccount = await db.select().from(BankAccountTable)
      .where(and(
        eq(BankAccountTable.id, bankAccountId),
        eq(BankAccountTable.userId, currentUser.id)
      ));

    if (bankAccount.length === 0) {
      return NextResponse.json({ error: 'Bank account not found' }, { status: 404 });
    }

    // Verify all apartments belong to the current user
    if (apartmentIds.length > 0) {
      const apartments = await db.select().from(ApartmentTable)
        .where(and(
          inArray(ApartmentTable.id, apartmentIds),
          eq(ApartmentTable.userId, currentUser.id)
        ));

      if (apartments.length !== apartmentIds.length) {
        return NextResponse.json({ error: 'Some apartments not found or not accessible' }, { status: 400 });
      }
    }

    // Delete existing associations
    await db.delete(BankAccountApartmentTable)
      .where(eq(BankAccountApartmentTable.bankAccountId, bankAccountId));

    // Create new associations
    if (apartmentIds.length > 0) {
      const newAssociations = apartmentIds.map(apartmentId => ({
        bankAccountId,
        apartmentId,
      }));

      await db.insert(BankAccountApartmentTable).values(newAssociations);
    }

    return NextResponse.json({ message: 'Associations updated successfully' });
  } catch (error) {
    console.error('Error updating apartment associations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 