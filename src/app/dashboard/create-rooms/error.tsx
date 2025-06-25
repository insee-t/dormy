'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#dbe1f0] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-8 rounded-md shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            เกิดข้อผิดพลาด
          </h2>
          <p className="text-gray-600 mb-6">
            ไม่สามารถโหลดหน้าสร้างชั้นและห้องได้ กรุณาลองใหม่อีกครั้ง
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={reset}
              className="bg-[#01bcb4] hover:bg-cyan-600 text-white"
            >
              ลองใหม่
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/dashboard'}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              กลับไปแดชบอร์ด
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 