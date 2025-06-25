'use server';

import puppeteer from 'puppeteer';
import rentalContractTemplate from '@/genpdf/documentTemplate/rentalContractTemplate';

export interface RentalData {
  contractCreationPlace: string;
  contractCreationDate: string;
  dormName: string;
  dormAddress: {
    houseNumber: string;
    alley: string;
    road: string;
    subDistrict: string;
    district: string;
    province: string;
  };
  tenantName: string;
  tenantAddress: {
    houseNumber: string;
    alley: string;
    road: string;
    subDistrict: string;
    district: string;
    province: string;
  };
  tenantNationalId: string;
  tenantPhoneNumber: string;
  roomNumber: string;
  floorNumber: string;
  contractDuration: string;
  monthlyRent: string;
  monthlyRentTextThai: string;
  contractStartDate: string;
  paymentDueDate: string;
  roomDeposit: string;
  roomDepositTextThai: string;
  latePaymentFee: string;
  returnRoomPeriod: string;
  additionalCondition: string[];
}

export async function generateRentalContractPDF(rentalData: RentalData): Promise<Buffer> {
  let browser;

  try {
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

    return Buffer.from(pdfBuffer);
  } catch (err) {
    console.error("PDF generation failed:", err);
    throw new Error('Failed to generate PDF');
  } finally {
    if (browser) await browser.close();
  }
}

export async function generateRentalContractPDFAsBlob(rentalData: RentalData): Promise<Blob> {
  const buffer = await generateRentalContractPDF(rentalData);
  return new Blob([buffer], { type: 'application/pdf' });
} 