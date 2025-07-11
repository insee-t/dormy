import thaiBahtText from "thai-baht-text";

export default function invoiceTemplate(data)  {
  const { company, customer, invoice, items, summary } = data;
  return `
  <!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ใบแจ้งหนี้ (Invoice)</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 9.6px;
            margin: 0;
            padding: 0;
        }
        .invoice-container {
            width: 800px;
            margin: 0 auto;
            padding: 24px;
            // border: 1px solid #e5e7eb;
            background-color: white;
            border-bottom: 2px dotted #e5e7eb;
        }
        .header {
            display: flex;
            align-items: flex-start;
        }
        .header-left {
            flex: 1;
        }
        .header-right {
            text-align: right;
        }
        .invoice-title {
            font-size: 14.4px;
            font-weight: bold;
        }
        .original {
            color: black;
        }
        .copy {
            color: #6b7280;
        }
        .customer-info {
            margin-top: 8px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        .customer-details {
            flex: 1;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
        }
        th, td {
            padding: 8px;
        }
        .summary-td {
            padding: 4px;
        }
        th {
            border-top: 1.5px solid #9ca3af;
            border-bottom: 1px solid #9ca3af;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .summary {
            margin-top: 8px;
            display: flex;
        }
        .vat-note {
            margin-top: 4px;
            flex-shrink: 0;
            margin-right: 138px;
        }
        .summary-table {
            width: 100%;
        }
        .total-text {
            font-size: 9px;
            font-weight: bold;
            text-align: right;
        }
        .signature {
            margin-top: 4px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .logo {
            min-height: 24px;
            max-height: 36px;
            width: auto;
            margin-right: 16px;
        }
    </style>
</head>
<body>
${['original', 'copy'].map((part) => 
    `
    <div class="invoice-container">
        <!-- Header -->
        <div class="header">
            <div class="header-left">
                <img src="${company.logoUrl}" class="logo" alt="Company Logo">
                <div>
                    <b>${company.name}</b>
                </div>
                <div>${company.address}</div>
                <div>เลขประจำตัวผู้เสียภาษี ${company.taxId}</div>
                <div>
                    โทร. ${company.phone} อีเมล ${company.email}
                </div>
            </div>
            <div class="header-right">
                <div class="invoice-title">ใบแจ้งหนี้ (Invoice)</div>
                <div class="${part.includes('original') ? 'original' : 'copy'}">
                    ${part.includes('original') ? "ต้นฉบับ (Original)" : "สำเนา (Copy)"}
                </div>
                <div style="min-width: 220px;">
                    เลขที่ ${invoice.number} <br>
                    วันที่ ${invoice.date} <br>
                    ห้อง ${invoice.room} <br>
                    พนักงาน ${invoice.staff}
                </div>
            </div>
        </div>

        <!-- Customer and Invoice Info -->
        <div class="customer-info">
            <div class="customer-details">
                <b>ลูกค้า (Customer)</b>
                <br>
                ${customer.name}
                <br>
                ${customer.address}
            </div>
        </div>

        <!-- Items Table -->
        <div style="margin-top: 8px;">
            <table>
                <thead>
                    <tr>
                        <th>ลำดับ(#)</th>
                        <th>V/N*</th>
                        <th>รายการ (Description)</th>
                        <th class="text-right">จำนวนเงิน (Amount)</th>
                        <th class="text-right">ภาษี(VAT)</th>
                        <th class="text-right">รวมเงิน (Total)</th>
                    </tr>
                </thead>
                <tbody>
                    
                    ${ items.map((item, index) => 
                        `<tr>
                            <td class="text-center">${index + 1} </td>
                            <td class="text-center">${item.type}</td>
                            <td>${item.description}</td>
                            <td class="text-right">${item.amount.toFixed(2)}</td>
                            <td class="text-right">${item.vat.toFixed(2)}</td>
                            <td class="text-right">${item.total.toFixed(2)}</td>
                        </tr>`
                        ).join('')}
                    <tr>
                        <td class="p-1"></td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr style="border-bottom: 1.5px solid #9ca3af;"></tr>
                </tfoot>
            </table>
        </div>

        <!-- Summary Table -->
        <div style="margin-top: 8px;">
            <div class="summary">
                <div class="vat-note">
                    * V = ภาษี / N = ยกเว้นภาษี
                    <br>* V = VAT Items / N = NOT-VAT Items
                </div>
                <table class="summary-table">
                    <tbody>
                        <tr>
                            <td class="summary-td">มูลค่าสินค้าที่ไม่เสียภาษีมูลค่าเพิ่ม (NON-VAT Items)</td>
                            <td class="text-right summary-td">${summary.nonVatTotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td class="summary-td">มูลค่าสินค้าที่เสียภาษีมูลค่าเพิ่ม (VAT Items)</td>
                            <td class="text-right summary-td">${summary.vatTotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td class="summary-td">ภาษีมูลค่าเพิ่ม 7.00% (VAT amount)</td>
                            <td class="text-right summary-td">${summary.vatAmount.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td class="summary-td"><b>ยอดชำระสุทธิ (Total Payment Due)</b></td>
                            <td class="text-right summary-td"><b>${summary.totalDue.toFixed(2)}</b></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="total-text">
                ( ${thaiBahtText(summary.totalDue)} )
            </div>
        </div>

        <!-- signature -->
        <div class="signature">
            <div style="margin-bottom: 5px;">
                ลงชื่อ ..................................................... ผู้วางบิล
            </div>
            <div>
                ( ....................................................................... )
            </div>
        </div>
    </div>
    `
).join('')}
    
</body>
</html>
  `;
}
