"use client"

import { useEffect } from "react";

function TestInvoice() {

    useEffect(() => {
        fetch('/api/pdf/invoice', {
            method: 'POST',
            body: JSON.stringify(invoiceData)
        })
        .then(response => response.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'invoice.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('Error generating PDF:', error);
        });
    }, []);

    const invoiceData = {
        company: {
            name: "ทองพักแมนชั่นสุข",
            address: "408 ซอยพุทธมณฑล63 แขวงหลักสอง เขตบางแค กทม. 10160",
            taxId: "1525553324521",
            phone: "083-5465927",
            email: "sansukapartment@gmail.com",
            logoUrl: "https://yourdomain.com/logo.png", // or local path
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
            isOriginal: true, // or false for copy
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
    fetch('/api/pdf/invoice', {
        method: 'POST',
        body: JSON.stringify(invoiceData)
    })
    .then(response => response.blob())
    .then(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'invoice.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    })
}

export default TestInvoice;