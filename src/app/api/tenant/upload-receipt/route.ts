import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/auth/nextjs/currentUser';
import { db } from '@/drizzle/db';
import { ReceiptTable } from '@/drizzle/schema';
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
    const receipt = formData.get('receipt') as File;
    const paymentPlanId = formData.get('paymentPlanId') as string;
    const amount = formData.get('amount') as string;

    if (!receipt || !paymentPlanId || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(receipt.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only images and PDFs are allowed.' }, { status: 400 });
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (receipt.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'receipts');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = receipt.name.split('.').pop();
    const fileName = `receipt_${currentUser.id}_${paymentPlanId}_${timestamp}.${fileExtension}`;
    const filePath = join(uploadsDir, fileName);

    // Convert file to buffer and save
    const bytes = await receipt.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Save receipt information to database
    const savedReceipt = await db.insert(ReceiptTable).values({
      fileName: fileName,
      originalName: receipt.name,
      filePath: `/uploads/receipts/${fileName}`,
      fileSize: receipt.size,
      mimeType: receipt.type,
      paymentPlanId: parseInt(paymentPlanId),
      userId: currentUser.id,
      amount: parseInt(amount),
      status: 'pending'
    }).returning();

    console.log('Receipt uploaded successfully:', {
      fileName: receipt.name,
      fileSize: receipt.size,
      fileType: receipt.type,
      paymentPlanId,
      amount,
      userId: currentUser.id,
      savedPath: `/uploads/receipts/${fileName}`
    });

    return NextResponse.json({ 
      message: 'Receipt uploaded successfully',
      fileName: receipt.name,
      filePath: `/uploads/receipts/${fileName}`,
      receiptId: savedReceipt[0].id
    });
  } catch (error) {
    console.error('Error uploading receipt:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 