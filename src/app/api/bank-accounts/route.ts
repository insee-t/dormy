import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { BankAccountTable } from '@/drizzle/schema';
import { getCurrentUser } from '@/auth/nextjs/currentUser';
import { eq, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser({ withFullUser: true, redirectIfNotFound: true });
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { bankProvider, name, bankNumber } = body;

    if (!bankProvider || !name || !bankNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newBankAccount = await db.insert(BankAccountTable).values({
      bankProvider,
      name,
      bankNumber,
      userId: currentUser.id,
    }).returning();

    return NextResponse.json(newBankAccount[0], { status: 201 });
  } catch (error) {
    console.error('Error creating bank account:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser({ withFullUser: true, redirectIfNotFound: true });
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bankAccounts = await db.select().from(BankAccountTable).where(eq(BankAccountTable.userId, currentUser.id));
    
    return NextResponse.json(bankAccounts);
  } catch (error) {
    console.error('Error fetching bank accounts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser({ withFullUser: true, redirectIfNotFound: true });
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Bank account ID is required' }, { status: 400 });
    }

    const deletedAccount = await db.delete(BankAccountTable)
      .where(and(
        eq(BankAccountTable.id, parseInt(id)),
        eq(BankAccountTable.userId, currentUser.id)
      ))
      .returning();

    if (deletedAccount.length === 0) {
      return NextResponse.json({ error: 'Bank account not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Bank account deleted successfully' });
  } catch (error) {
    console.error('Error deleting bank account:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 