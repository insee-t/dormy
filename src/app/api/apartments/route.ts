import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/auth/nextjs/currentUser';
import getApartments from '@/lib/getApartments';

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser({ withFullUser: true });
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apartments = await getApartments(currentUser.id);
    
    return NextResponse.json(apartments);
  } catch (error) {
    console.error('Error fetching apartments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 