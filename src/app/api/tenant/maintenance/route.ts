import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/auth/nextjs/currentUser';
import { db } from '@/drizzle/db';
import { ComplainTable } from '@/drizzle/schema';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser({ withFullUser: true });
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const reportType = formData.get('reportType') as string;
    const description = formData.get('description') as string;
    const file = formData.get('file') as File;

    if (!reportType || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate report type
    const allowedReportTypes = ['repair', 'clean', 'move', 'emergency', 'other'];
    if (!allowedReportTypes.includes(reportType)) {
      return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }

    let fileName = '';

    // Handle file upload if provided
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: 'Invalid file type. Only images and PDFs are allowed.' }, { status: 400 });
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 });
      }

      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'maintenance');
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      fileName = `maintenance_${currentUser.id}_${timestamp}.${fileExtension}`;
      const filePath = join(uploadsDir, fileName);

      // Convert file to buffer and save
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);
    }

    // Save maintenance request to database
    const maintenanceRequest = await db.insert(ComplainTable).values({
      reportType: reportType as any, // Type assertion since we validated above
      description: description,
      fileName: fileName || 'no_file',
      status: 'in_progress',
      userId: currentUser.id
    }).returning();

    console.log('Maintenance request submitted:', {
      id: maintenanceRequest[0].id,
      reportType,
      description: description.substring(0, 100) + '...',
      fileName,
      userId: currentUser.id
    });

    return NextResponse.json({ 
      message: 'Maintenance request submitted successfully',
      requestId: maintenanceRequest[0].id
    });
  } catch (error) {
    console.error('Error submitting maintenance request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 