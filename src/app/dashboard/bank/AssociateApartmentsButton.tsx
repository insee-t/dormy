"use client";
import { useState, useEffect } from "react";

interface Apartment {
  id: number;
  name: string;
  address: string;
}

interface AssociateApartmentsButtonProps {
  accountId: number;
  accountName: string;
  apartments: Apartment[];
}

export default function AssociateApartmentsButton({ accountId, accountName, apartments }: AssociateApartmentsButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedApartments, setSelectedApartments] = useState<number[]>([]);
  const [currentAssociations, setCurrentAssociations] = useState<number[]>([]);

  // Fetch current associations when modal opens
  useEffect(() => {
    if (open) {
      fetchCurrentAssociations();
    }
  }, [open, accountId]);

  async function fetchCurrentAssociations() {
    try {
      const response = await fetch(`/api/bank-accounts/${accountId}/apartments`);
      if (response.ok) {
        const data = await response.json();
        setCurrentAssociations(data.apartmentIds || []);
        setSelectedApartments(data.apartmentIds || []);
      }
    } catch (error) {
      console.error('Error fetching associations:', error);
    }
  }

  function handleApartmentToggle(apartmentId: number) {
    setSelectedApartments(prev => 
      prev.includes(apartmentId) 
        ? prev.filter(id => id !== apartmentId)
        : [...prev, apartmentId]
    );
  }

  async function handleSave() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/bank-accounts/${accountId}/apartments`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apartmentIds: selectedApartments }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update associations');
      }

      setOpen(false);
      // Optionally refresh the page or show success message
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        className="inline-flex items-center px-3 py-2 border border-blue-300 text-blue-700 bg-white hover:bg-blue-50 hover:border-blue-400 rounded-lg text-sm font-medium transition-all duration-200"
        onClick={() => setOpen(true)}
        title="เชื่อมโยงกับหอพัก"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        เชื่อมโยงหอพัก
      </button>
      
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-t-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">เชื่อมโยงกับหอพัก</h2>
                  <p className="text-blue-100 text-sm mt-1">{accountName}</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                  disabled={loading}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                  <div className="flex">
                    <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}

              {apartments.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p className="text-gray-500">ยังไม่มีหอพัก</p>
                  <p className="text-sm text-gray-400">สร้างหอพักก่อนเพื่อเชื่อมโยงกับบัญชีธนาคาร</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {apartments.map((apartment) => (
                    <label key={apartment.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedApartments.includes(apartment.id)}
                        onChange={() => handleApartmentToggle(apartment.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        disabled={loading}
                      />
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">{apartment.name}</p>
                        <p className="text-sm text-gray-500">{apartment.address}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-6">
                <button 
                  type="button" 
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  ยกเลิก
                </button>
                <button 
                  type="button" 
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSave}
                  disabled={loading || apartments.length === 0}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      กำลังบันทึก...
                    </div>
                  ) : (
                    'บันทึก'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 