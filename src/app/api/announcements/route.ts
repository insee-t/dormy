import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/auth/nextjs/currentUser';
import { db } from '@/drizzle/db';
import { AnnouncementTable, ApartmentTable, UserTable } from '@/drizzle/schema';
import { eq, desc, and, or } from 'drizzle-orm';
import getApartments from '@/lib/getApartments';

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser({ withFullUser: true });
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const apartmentId = searchParams.get('apartmentId');
    const apartments = await getApartments(currentUser.id);
    
    // Filter by apartments owned by the current user
    const apartmentIds = apartments.map(apt => apt.id).filter(id => id !== null) as number[];
    
    if (apartmentIds.length === 0) {
      return NextResponse.json([]);
    }

    let whereConditions = [];

    // Filter by specific apartment if provided
    if (apartmentId && apartmentIds.includes(parseInt(apartmentId))) {
      whereConditions.push(eq(AnnouncementTable.apartmentId, parseInt(apartmentId)));
    } else {
      // Otherwise, show announcements from all user's apartments
      whereConditions.push(or(...apartmentIds.map(id => eq(AnnouncementTable.apartmentId, id))));
    }

    const announcements = await db
      .select({
        id: AnnouncementTable.id,
        title: AnnouncementTable.title,
        content: AnnouncementTable.content,
        priority: AnnouncementTable.priority,
        isPublished: AnnouncementTable.isPublished,
        createdAt: AnnouncementTable.createdAt,
        apartmentName: ApartmentTable.name,
        creatorName: UserTable.name,
      })
      .from(AnnouncementTable)
      .leftJoin(ApartmentTable, eq(AnnouncementTable.apartmentId, ApartmentTable.id))
      .leftJoin(UserTable, eq(AnnouncementTable.createdBy, UserTable.id))
      .where(and(...whereConditions))
      .orderBy(desc(AnnouncementTable.createdAt));

    return NextResponse.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser({ withFullUser: true });
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, priority, apartmentId, isPublished } = body;

    // Validate required fields
    if (!title || !content || !apartmentId) {
      return NextResponse.json({ 
        error: 'Missing required fields: title, content, apartmentId' 
      }, { status: 400 });
    }

    // Validate priority
    const validPriorities = ['low', 'normal', 'high', 'urgent'];
    if (!validPriorities.includes(priority)) {
      return NextResponse.json({ 
        error: 'Invalid priority. Must be one of: low, normal, high, urgent' 
      }, { status: 400 });
    }

    // Check if user owns the apartment
    const apartments = await getApartments(currentUser.id);
    const apartmentIds = apartments.map(apt => apt.id).filter(id => id !== null) as number[];
    
    if (!apartmentIds.includes(apartmentId)) {
      return NextResponse.json({ 
        error: 'You can only create announcements for apartments you own' 
      }, { status: 403 });
    }

    // Create the announcement
    const announcement = await db.insert(AnnouncementTable).values({
      title: title.trim(),
      content: content.trim(),
      priority,
      apartmentId,
      isPublished: isPublished ?? true,
      createdBy: currentUser.id,
    }).returning();

    console.log('Announcement created:', {
      id: announcement[0].id,
      title: title.substring(0, 50) + '...',
      apartmentId,
      createdBy: currentUser.id
    });

    return NextResponse.json({ 
      message: 'Announcement created successfully',
      announcement: announcement[0]
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 