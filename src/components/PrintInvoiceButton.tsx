"use client";

import React from 'react';

interface PrintInvoiceButtonProps {
  roomId: number;
  month: string;
  year: string;
}

export default function PrintInvoiceButton({ roomId, month, year }: PrintInvoiceButtonProps) {
  const handlePrint = async () => {
    try {
      const response = await fetch(`/api/pdf/invoice?roomId=${roomId}&month=${month}&year=${year}`);
      if (response.ok) {
        // Open PDF in new tab
        window.open(`/api/pdf/invoice?roomId=${roomId}&month=${month}&year=${year}`, '_blank');
      } else {
        const errorData = await response.json();
        if (errorData.code === 'MISSING_REAL_NAME') {
          alert('กรุณากรอกชื่อจริงในโปรไฟล์ก่อนพิมพ์บิล');
        } else if (errorData.code === 'MISSING_TAX_ID') {
          alert('กรุณากรอกเลขประจำตัวผู้เสียภาษีในข้อมูลหอพักก่อนพิมพ์บิล');
        } else {
          alert('เกิดข้อผิดพลาดในการสร้างบิล: ' + (errorData.error || 'Unknown error'));
        }
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการสร้างบิล');
    }
  };

  return (
    <button 
      onClick={handlePrint}
      className="bg-[#FFAC3E] hover:bg-[#FFAC3E] rounded-lg text-white py-0.25 px-2"
    >
      พิมพ์
    </button>
  );
} 