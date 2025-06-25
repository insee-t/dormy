import express from 'express';
import { clerkMiddleware } from "@clerk/express";
import { attachUserId } from "../../middleware/authMiddleware.js";
import puppeteer from 'puppeteer';
import rentalContractTemplate from './documentTemplate/rentalContractTemplate.js';

const router = express.Router();
router.use(clerkMiddleware());
router.use(attachUserId);

router.post("/contract", async (req, res) => {
  const { userId } = req;
  let browser;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const rentalData = req.body;
    const htmlContent = rentalContractTemplate(rentalData);

    // launch headles chrome
      browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
     // open new page and set the page with provided html content
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      printBackground: true,
      displayHeaderFooter: false,
      preferCSSPageSize: true // This respects your CSS @page rules
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=rental-contract.pdf");
    res.send(pdfBuffer);
  } catch (err) {
    console.error("PDF generation failed:", err);
    res.status(500).send("Failed to generate PDF.");
  } finally {
    if (browser) await browser.close();
  }
});

export default router;