import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import invoiceTemplate from '@/genpdf/documentTemplate/invoiceTemplate';
import { db } from '@/drizzle/db';
import { 
  ApartmentTable, 
  FloorTable, 
  RoomTable, 
  UserTable, 
  PaymentPlanTable, 
  RentTable,
  ElectricTable,
  WaterTable 
} from '@/drizzle/schema';
import { eq, and, gte, lt } from 'drizzle-orm';
import { readFileSync } from 'fs';
import { join } from 'path';
import { getCurrentUser } from '@/auth/nextjs/currentUser';

// Function to convert logo to base64
function getLogoBase64(): string {
  try {
    const logoPath = join(process.cwd(), 'public', 'assets', 'Logo_Blue.png');
    const logoBuffer = readFileSync(logoPath);
    return `data:image/png;base64,${logoBuffer.toString('base64')}`;
  } catch (error) {
    console.error('Error reading logo file:', error);
    // Return a placeholder or empty string if logo can't be loaded
    return '';
  }
}

export async function GET(request: NextRequest) {
  let browser;
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    
    if (!roomId || !month || !year) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Get current user for staff name
    const currentUser = await getCurrentUser({ withFullUser: true });
    if (!currentUser) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }
    
    // Check if user has a real name
    if (!currentUser.realName || currentUser.realName.trim() === '') {
      return NextResponse.json({ 
        error: 'กรุณากรอกชื่อจริงในโปรไฟล์ก่อนพิมพ์บิล',
        code: 'MISSING_REAL_NAME'
      }, { status: 400 });
    }
    
    const staffName = currentUser.realName;

    // Calculate the start and end of the selected month
    const gregorianYear = parseInt(year) - 543; // Thai year to Gregorian
    const gregorianMonth = parseInt(month) - 1;
    const monthStart = new Date(gregorianYear, gregorianMonth, 1);
    const monthEnd = new Date(gregorianYear, gregorianMonth + 1, 1);

    // Get room data with apartment, floor, tenant, and payment plan
    const roomData = await db.query.RoomTable.findFirst({
      where: eq(RoomTable.id, parseInt(roomId)),
      with: {
        floor: {
          with: {
            apartment: true
          }
        },
        paymentPlan: {
          with: {
            tenant: true,
            rentBills: {
              where: (table, { and, gte, lt }) => and(
                gte(table.createdAt, monthStart),
                lt(table.createdAt, monthEnd)
              ),
              orderBy: (table, { desc }) => desc(table.createdAt),
              limit: 1
            },
            electrics: {
              orderBy: (table, { desc }) => desc(table.createdAt),
              limit: 2
            },
            waters: {
              orderBy: (table, { desc }) => desc(table.createdAt),
              limit: 2
            }
          }
        }
      }
    });

    if (!roomData || !roomData.paymentPlan) {
      return NextResponse.json({ error: 'Room or payment plan not found' }, { status: 404 });
    }

    const apartment = roomData.floor.apartment;
    const tenant = roomData.paymentPlan.tenant;
    const rentBill = roomData.paymentPlan.rentBills[0];
    
    // Get latest electric and water readings
    const latestElectric = roomData.paymentPlan.electrics[0];
    const prevElectric = roomData.paymentPlan.electrics[1];
    const latestWater = roomData.paymentPlan.waters[0];
    const prevWater = roomData.paymentPlan.waters[1];

    if (!apartment || !tenant) {
      return NextResponse.json({ error: 'Apartment or tenant data not found' }, { status: 404 });
    }

    // Check if apartment has tax ID
    if (!apartment.taxId || apartment.taxId.trim() === '') {
      return NextResponse.json({ 
        error: 'กรุณากรอกเลขประจำตัวผู้เสียภาษีในข้อมูลหอพักก่อนพิมพ์บิล',
        code: 'MISSING_TAX_ID'
      }, { status: 400 });
    }

    // Calculate electric fee if we have both current and previous readings
    let electricFee = 0;
    let electricUsage = 0;
    if (latestElectric && prevElectric) {
      electricUsage = latestElectric.meter - prevElectric.meter;
      electricFee = electricUsage * (roomData.paymentPlan.electricFeePerMatrix || 0);
    } else if (latestElectric) {
      electricFee = latestElectric.fee || 0;
      electricUsage = latestElectric.meter || 0;
    }

    // Calculate water fee if we have both current and previous readings
    let waterFee = 0;
    let waterUsage = 0;
    if (latestWater && prevWater) {
      waterUsage = latestWater.meter - prevWater.meter;
      waterFee = waterUsage * (roomData.paymentPlan.waterFeePerMatrix || 0);
    } else if (latestWater) {
      waterFee = latestWater.fee || 0;
      waterUsage = latestWater.meter || 0;
    }

    // Generate invoice number
    const invoiceNumber = `INV${year}${month.padStart(2, '0')}${roomData.roomNumber.padStart(3, '0')}`;

    // Format date
    const invoiceDate = `${month.padStart(2, '0')}/${year}`;

    // Prepare invoice items
    const items = [];
    let totalAmount = 0;

    // Add rent
    if (rentBill) {
      items.push({
        description: `ค่าห้องพัก (Room rate) ${roomData.roomNumber} เดือน ${month}/${year}`,
        amount: rentBill.fee,
        vat: 0,
        total: rentBill.fee,
        type: "N"
      });
      totalAmount += rentBill.fee;
    }

    // Add water
    if (waterFee > 0) {
      items.push({
        description: `ค่าน้ำ (Water rate) เดือน ${month}/${year} (${waterUsage} ยูนิต)`,
        amount: waterFee,
        vat: 0,
        total: waterFee,
        type: "N"
      });
      totalAmount += waterFee;
    }

    // Add electricity
    if (electricFee > 0) {
      items.push({
        description: `ค่าไฟฟ้า (Electrical rate) เดือน ${month}/${year} (${electricUsage} ยูนิต)`,
        amount: electricFee,
        vat: 0,
        total: electricFee,
        type: "N"
      });
      totalAmount += electricFee;
    }

    // If no bills found, add a default rent item
    if (items.length === 0) {
      const defaultRent = roomData.paymentPlan.fee || 0;
      items.push({
        description: `ค่าห้องพัก (Room rate) ${roomData.roomNumber} เดือน ${month}/${year}`,
        amount: defaultRent,
        vat: 0,
        total: defaultRent,
        type: "N"
      });
      totalAmount = defaultRent;
    }

    // Prepare invoice data
    const invoiceData = {
      company: {
        name: apartment.name,
        address: apartment.address,
        taxId: apartment.taxId,
        phone: apartment.phone,
        email: apartment.email,
        logoUrl: getLogoBase64(),
      },
      customer: {
        name: tenant.name,
        address: `${roomData.roomNumber} ${apartment.name}, ${apartment.address}`,
      },
      invoice: {
        number: invoiceNumber,
        date: invoiceDate,
        room: roomData.roomNumber,
        staff: staffName,
        isOriginal: true,
      },
      items: items,
      summary: {
        nonVatTotal: totalAmount,
        vatTotal: 0,
        vatAmount: 0,
        totalDue: totalAmount,
      }
    };

    const htmlContent = invoiceTemplate(invoiceData);
    browser = await puppeteer.launch({ 
      headless: true, 
      args: ["--no-sandbox", "--disable-setuid-sandbox"] 
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ 
      printBackground: true, 
      displayHeaderFooter: false, 
      preferCSSPageSize: true 
    });

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename=invoice-${roomData.roomNumber}-${month}-${year}.pdf`,
      },
    });
  } catch (err) {
    console.error("PDF generation failed:", err);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  } finally {
    if (browser) await browser.close();
  }
} 