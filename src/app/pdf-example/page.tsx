"use client"

import PdfGenerator from '@/components/PdfGenerator';
import { type RentalData } from '@/lib/pdf-generator';

// Sample rental data for demonstration
const sampleRentalData: RentalData = {
  contractCreationPlace: "กรุงเทพมหานคร",
  contractCreationDate: "2024-01-15",
  dormName: "หอพักสุขุมวิท",
  dormAddress: {
    houseNumber: "123",
    alley: "สุขุมวิท 1",
    road: "สุขุมวิท",
    subDistrict: "คลองเตย",
    district: "คลองเตย",
    province: "กรุงเทพมหานคร",
  },
  tenantName: "สมชาย ใจดี",
  tenantAddress: {
    houseNumber: "456",
    alley: "สุขุมวิท 2",
    road: "สุขุมวิท",
    subDistrict: "คลองเตย",
    district: "คลองเตย",
    province: "กรุงเทพมหานคร",
  },
  tenantNationalId: "1234567890123",
  tenantPhoneNumber: "0812345678",
  roomNumber: "101",
  floorNumber: "1",
  contractDuration: "1",
  monthlyRent: "5000",
  monthlyRentTextThai: "ห้าพันบาท",
  contractStartDate: "2024-02-01",
  paymentDueDate: "5",
  roomDeposit: "10000",
  roomDepositTextThai: "หนึ่งหมื่นบาท",
  latePaymentFee: "200",
  returnRoomPeriod: "30",
  additionalCondition: ["ห้ามเลี้ยงสัตว์", "ห้ามสูบบุหรี่ในห้อง"],
};

// Client wrapper for the server component
function ServerPdfGeneratorWrapper({ rentalData }: { rentalData: RentalData }) {
  // For now, we'll use a simple approach that calls the API directly
  const handleServerDownload = async () => {
    try {
      const response = await fetch('/api/pdf/contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rentalData)
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'rental-contract.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        console.error('Failed to generate PDF');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div>
      <button 
        onClick={handleServerDownload}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Download PDF (Server Approach)
      </button>
      <p className="text-sm text-gray-500 mt-2">
        This calls the API route directly from the client.
      </p>
    </div>
  );
}

export default function PdfExamplePage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">PDF Generation Examples</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Client Component Example */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Client Component Approach</h2>
          <p className="text-gray-600 mb-4">
            Uses server actions to generate PDFs. Allows for preview and download functionality.
          </p>
          <PdfGenerator 
            rentalData={sampleRentalData}
            onPdfGenerated={(blob) => {
              console.log('PDF generated:', blob);
            }}
          />
        </div>

        {/* Server Component Example */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Server Approach</h2>
          <p className="text-gray-600 mb-4">
            Calls the API route directly from the client for PDF generation.
          </p>
          <ServerPdfGeneratorWrapper rentalData={sampleRentalData} />
        </div>
      </div>

      {/* API Route Example */}
      <div className="mt-8 border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">API Route Approach</h2>
        <p className="text-gray-600 mb-4">
          Direct API endpoint for PDF generation. You can call this endpoint directly.
        </p>
        <div className="space-y-2">
          <p className="text-sm font-mono bg-gray-100 p-2 rounded">
            POST /api/pdf/contract
          </p>
          <p className="text-sm text-gray-600">
            Send rental data as JSON in the request body to generate and download PDF.
          </p>
        </div>
      </div>

      {/* Rental Data Display */}
      <div className="mt-8 border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Sample Rental Data</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
          {JSON.stringify(sampleRentalData, null, 2)}
        </pre>
      </div>
    </div>
  );
} 