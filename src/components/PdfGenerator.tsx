'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { generateRentalContractPDFAsBlob, type RentalData } from '@/lib/pdf-generator';

interface PdfGeneratorProps {
  rentalData: RentalData;
  onPdfGenerated?: (blob: Blob) => void;
}

export default function PdfGenerator({ rentalData, onPdfGenerated }: PdfGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const pdfBlob = await generateRentalContractPDFAsBlob(rentalData);
      
      // Create a URL for the blob
      const url = URL.createObjectURL(pdfBlob);
      
      // Open in new tab
      window.open(url, '_blank');
      
      // Call the callback if provided
      if (onPdfGenerated) {
        onPdfGenerated(pdfBlob);
      }
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const pdfBlob = await generateRentalContractPDFAsBlob(rentalData);
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'rental-contract.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download PDF:', err);
      setError('Failed to download PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Button 
          onClick={handleGeneratePDF} 
          disabled={isGenerating}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isGenerating ? 'Generating...' : 'Preview PDF'}
        </Button>
        
        <Button 
          onClick={handleDownloadPDF} 
          disabled={isGenerating}
          variant="outline"
        >
          {isGenerating ? 'Generating...' : 'Download PDF'}
        </Button>
      </div>
      
      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}
    </div>
  );
} 