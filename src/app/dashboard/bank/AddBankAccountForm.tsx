"use client";
import { useState } from "react";
import BankProviderLogo from './BankProviderLogo';

export default function AddBankAccountForm({ bankProviders }: { bankProviders: readonly string[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    bankProvider: '',
    name: '',
    bankNumber: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch('/api/bank-accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create bank account');
      }

      // Reset form and close modal
      setForm({ bankProvider: '', name: '', bankNumber: '' });
      setOpen(false);
      
      // Refresh the page to show the new bank account
      window.location.reload();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button 
        className="bg-gradient-to-r from-[#FFAC3E] to-orange-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 transform hover:scale-105"
        onClick={() => setOpen(true)}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>เพิ่มบัญชี</span>
      </button>
      
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-t-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">เพิ่มบัญชีธนาคาร</h2>
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex">
                    <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}
              
              {/* Bank Logo Preview */}
              {form.bankProvider && (
                <div className="flex justify-center">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <BankProviderLogo bankProvider={form.bankProvider} className="max-w-20 h-auto" />
                  </div>
                </div>
              )}
              
              {/* Bank Provider Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เลือกธนาคาร
                </label>
                <select
                  name="bankProvider"
                  value={form.bankProvider}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                  disabled={loading}
                >
                  <option value="">-- เลือกธนาคาร --</option>
                  <optgroup label="พร้อมเพย์">
                    <option value="promptpay">พร้อมเพย์</option>
                  </optgroup>
                  <optgroup label="ธนาคาร">
                    {bankProviders.filter(provider => provider !== "promptpay").map((provider) => (
                      <option key={provider} value={provider}>{provider}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Account Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อบัญชี
                </label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="ชื่อเจ้าของบัญชี"
                  required
                  disabled={loading}
                />
              </div>

              {/* Account Number/Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เลขที่บัญชี/เบอร์โทรศัพท์
                </label>
                <input
                  name="bankNumber"
                  type="text"
                  value={form.bankNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder={form.bankProvider === 'promptpay' ? 'เบอร์โทรศัพท์' : 'เลขที่บัญชี'}
                  required
                  disabled={loading}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button 
                  type="button" 
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
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
            </form>
          </div>
        </div>
      )}
    </>
  );
} 