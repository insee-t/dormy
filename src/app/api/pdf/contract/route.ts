import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import rentalContractTemplate from '@/genpdf/documentTemplate/rentalContractTemplate';

export async function POST(request: NextRequest) {
  let browser;

  try {
    const rentalData = await request.json();
    const htmlContent = rentalContractTemplate(rentalData);

    // Launch headless Chrome
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    // Open new page and set the page with provided html content
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    
    const pdfBuffer = await page.pdf({
      printBackground: true,
      displayHeaderFooter: false,
      preferCSSPageSize: true // This respects your CSS @page rules
    });

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename=rental-contract.pdf',
      },
    });
  } catch (err) {
    console.error("PDF generation failed:", err);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  } finally {
    if (browser) await browser.close();
  }
} 