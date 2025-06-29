import express from 'express';
import puppeteer from 'puppeteer';
import invoiceTemplate from '../genpdf/documentTemplate/invoiceTemplate.js';

const router = express.Router();

router.get('/test-invoice', async (req, res) => {
  let browser;
  try {
    // Sample data for testing
    const invoiceData = {
      company: {
        name: "ทองพักแมนชั่นสุข",
        address: "407 ซอยพุทธมณฑล63 แขวงหลักสอง เขตบางแค กทม. 10160",
        taxId: "1525553324521",
        phone: "083-5465927",
        email: "sansukapartment@gmail.com",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Bitmap_Logo_example.png", // Replace with your logo
      },
      customer: {
        name: "นางสาว ลลิตวิภา บำรุงนาม",
        address: "140/111 หมู่ 7 ซอย 14 ต.วัดศรีวารีน้อย อ.บางเสาธง จ.สมุทรปราการ 10540",
      },
      invoice: {
        number: "INV20180400001",
        date: "02/03/2023",
        room: "302",
        staff: "กนกวุฒิ",
        isOriginal: true,
      },
      items: [
        { description: "ค่าห้องพัก (Room rate) 302 เดือน 2/2023", amount: 2000, vat: 0, total: 3000, type: "N" },
        { description: "ค่าน้ำ (Water rate) เดือน 2/2023 (0 - 0 = 0 ยูนิต)", amount: 100, vat: 0, total: 100, type: "N" },
        { description: "ค่าไฟฟ้า (Electrical rate) เดือน 2/2023 (5828 - 5742 = 86 ยูนิต)", amount: 430, vat: 0, total: 430, type: "N" },
        { description: "ค่าเช่าเฟอร์นิเจอร์ (Furniture rate)", amount: 250, vat: 0, total: 250, type: "N" },
      ],
      summary: {
        nonVatTotal: 3780,
        vatTotal: 0,
        vatAmount: 0,
        totalDue: 3780,
      }
    };

    const htmlContent = invoiceTemplate(invoiceData);
    browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ printBackground: true, displayHeaderFooter: false, preferCSSPageSize: true });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=test-invoice.pdf");
    res.send(pdfBuffer);
  } catch (err) {
    console.error("PDF generation failed:", err);
    res.status(500).send("Failed to generate PDF.");
  } finally {
    if (browser) await browser.close();
  }
});

export default router; 