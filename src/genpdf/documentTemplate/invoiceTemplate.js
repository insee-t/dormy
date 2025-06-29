export default function invoiceTemplate(data) {
  const { company, customer, invoice, items, summary } = data;

  // Helper for item rows
  const itemRows = items.map((item, idx) => `
    <tr>
      <td style="text-align:center;">${idx + 1}</td>
      <td style="text-align:center;">${item.type}</td>
      <td>${item.description}</td>
      <td style="text-align:right;">${item.amount.toFixed(2)}</td>
      <td style="text-align:right;">${item.vat.toFixed(2)}</td>
      <td style="text-align:right;">${item.total.toFixed(2)}</td>
    </tr>
  `).join("");

  // Main HTML
  return `
  <html>
  <head>
    <meta charset="UTF-8" />
    <style>
      body { font-family: 'TH SarabunPSK', Arial, sans-serif; font-size: 16px; margin: 0; padding: 0; }
      .invoice-box { width: 800px; margin: auto; padding: 24px; border: 1px solid #eee; background: #fff; }
      .header { display: flex; align-items: flex-start; }
      .logo { width: 80px; margin-right: 16px; }
      .company-info { flex: 1; }
      .invoice-title { text-align: right; font-size: 24px; font-weight: bold; }
      .section { margin-top: 16px; }
      table { width: 100%; border-collapse: collapse; margin-top: 12px; }
      th, td { border: 1px solid #ddd; padding: 8px; }
      th { background: #f5f5f5; }
      .summary-table td { border: none; }
      .footer { margin-top: 32px; }
      .copy { color: #888; font-size: 14px; }
    </style>
  </head>
  <body>
    <div class="invoice-box">
      <div class="header">
        <img src="${company.logoUrl}" class="logo" />
        <div class="company-info">
          <div><b>${company.name}</b></div>
          <div>${company.address}</div>
          <div>เลขประจำตัวผู้เสียภาษี ${company.taxId}</div>
          <div>โทร. ${company.phone} อีเมล ${company.email}</div>
        </div>
        <div class="invoice-title">
          ใบแจ้งหนี้ (Invoice)<br/>
          <span class="copy">${invoice.isOriginal ? "ต้นฉบับ (Original)" : "สำเนา (Copy)"}</span>
        </div>
      </div>
      <div class="section">
        <b>ลูกค้า (Customer)</b><br/>
        ${customer.name}<br/>
        ${customer.address}
      </div>
      <div class="section">
        เลขที่ ${invoice.number} <br/>
        วันที่ ${invoice.date} <br/>
        ห้อง ${invoice.room} <br/>
        พนักงาน ${invoice.staff}
      </div>
      <div class="section">
        <table>
          <thead>
            <tr>
              <th>ลำดับ(#)</th>
              <th>V/N*</th>
              <th>รายการ (Description)</th>
              <th>จำนวนเงิน (Amount)</th>
              <th>ภาษี(VAT)</th>
              <th>รวมเงิน (Total)</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows}
          </tbody>
        </table>
        <div style="font-size: 12px; margin-top: 4px;">
          * V = ภาษี / N = ยกเว้นภาษี<br/>
          * V = VAT Items / N = NOT-VAT Items
        </div>
      </div>
      <div class="section">
        <table class="summary-table">
          <tr>
            <td>มูลค่าสินค้าที่ไม่เสียภาษีมูลค่าเพิ่ม (NON-VAT Items)</td>
            <td style="text-align:right;">${summary.nonVatTotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td>มูลค่าสินค้าที่เสียภาษีมูลค่าเพิ่ม (VAT Items)</td>
            <td style="text-align:right;">${summary.vatTotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td>ภาษีมูลค่าเพิ่ม 7.00% (VAT amount)</td>
            <td style="text-align:right;">${summary.vatAmount.toFixed(2)}</td>
          </tr>
          <tr>
            <td><b>ยอดชำระสุทธิ (Total Payment Due)</b></td>
            <td style="text-align:right;"><b>${summary.totalDue.toFixed(2)}</b></td>
          </tr>
        </table>
      </div>
      <div class="footer">
        <div>ลงชื่อ ....................................................... ผู้วางบิล</div>
        <div>(.......................................................)</div>
      </div>
    </div>
  </body>
  </html>
  `;
}