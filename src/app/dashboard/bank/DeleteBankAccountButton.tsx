"use client";
import { useState } from "react";

interface DeleteBankAccountButtonProps {
  accountId: number;
}

export default function DeleteBankAccountButton({ accountId }: DeleteBankAccountButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบบัญชีธนาคารนี้?")) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/bank-accounts?id=${accountId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete bank account');
      }

      // Refresh the page to show updated list
      window.location.reload();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      className="inline-flex items-center px-3 py-2 border border-red-300 text-red-700 bg-white hover:bg-red-50 hover:border-red-400 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={handleDelete}
      disabled={loading}
      title="ลบบัญชีธนาคาร"
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-700" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          กำลังลบ...
        </>
      ) : (
        <>
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          ลบ
        </>
      )}
    </button>
  );
} 