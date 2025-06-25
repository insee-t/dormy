'use server';

import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';

interface ServerPdfGeneratorProps {
  rentalData?: any; // Made optional with default
}

async function downloadPdfAction() {
  'use server';
  
  try {
    // Redirect to the API route
    redirect('/api/pdf/contract');
  } catch (error) {
    console.error('Failed to redirect:', error);
    throw new Error('Failed to redirect to PDF generation');
  }
}

export default async function ServerPdfGenerator({ rentalData }: ServerPdfGeneratorProps = {}) {
  // Handle case where rentalData is not provided
  if (!rentalData) {
    return (
      <div className="border rounded-lg p-6">
        <p className="text-red-600 mb-4">Error: Rental data is required</p>
        <Button disabled className="bg-gray-400 cursor-not-allowed">
          Download PDF (No Data)
        </Button>
      </div>
    );
  }

  return (
    <form action={downloadPdfAction}>
      <Button type="submit" className="bg-green-600 hover:bg-green-700">
        Download PDF (Server Component)
      </Button>
      <p className="text-sm text-gray-500 mt-2">
        Note: This redirects to the API route. For direct PDF generation with data, use the client component approach.
      </p>
    </form>
  );
} 