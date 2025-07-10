"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function TestReceiptManagementPage() {
  const [loadingActions, setLoadingActions] = useState<{ [key: string]: boolean }>({})

  const handleReceiptAction = async (receiptId: number, action: 'approve' | 'reject' | 'clarify') => {
    setLoadingActions(prev => ({ ...prev, [`${receiptId}-${action}`]: true }))

    try {
      const response = await fetch(`/api/receipts/${receiptId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })

      const data = await response.json()

      if (response.ok) {
        alert(`Receipt ${action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'clarification requested'} successfully`)
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error updating receipt status:', error)
      alert('Failed to update receipt status')
    } finally {
      setLoadingActions(prev => ({ ...prev, [`${receiptId}-${action}`]: false }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Receipt Management Test</CardTitle>
            <CardDescription>
              Test the receipt approval, rejection, and clarification functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Sample Receipt Actions</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Test the three action buttons with a sample receipt ID. Replace the receipt ID with an actual one from your database.
                </p>
                
                <div className="flex gap-2">
                  <Button 
                    className="bg-[#00bf63] hover:bg-green-700"
                    onClick={() => handleReceiptAction(1, 'approve')}
                    disabled={loadingActions['1-approve']}
                  >
                    {loadingActions['1-approve'] ? 'กำลังดำเนินการ...' : 'อนุมัติการชำระเงิน'}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleReceiptAction(1, 'clarify')}
                    disabled={loadingActions['1-clarify']}
                  >
                    {loadingActions['1-clarify'] ? 'กำลังดำเนินการ...' : 'ขอคำชี้แจง'}
                  </Button>
                  <Button
                    variant="outline"
                    className="text-[#ff5757] border-red-200 hover:bg-red-50"
                    onClick={() => handleReceiptAction(1, 'reject')}
                    disabled={loadingActions['1-reject']}
                  >
                    {loadingActions['1-reject'] ? 'กำลังดำเนินการ...' : 'ปฏิเสธ'}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">อนุมัติการชำระเงิน</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-gray-600">
                      - อัปเดตสถานะบิลเป็น "อนุมัติการชำระเงิน"
                      - สร้างรายการชำระเงินใหม่ในตาราง บิล
                      - อัปเดตสถานะการชำระเงินเป็น "จ่ายแล้ว"
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">ขอใบเสร็จใหม่</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-gray-600">
                      - อัปเดตสถานะบิลเป็น "ขอใบเสร็จใหม่"
                      - ส่งการแจ้งเตือนไปยังผู้เช่า
                      - รอการตอบกลับจากผู้เช่า
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">ปฏิเสธ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-gray-600">
                      - อัปเดตสถานะบิลเป็น "rejected"
                      - ส่งการแจ้งเตือนไปยังผู้เช่า
                      - ต้องอัปโหลดบิลใหม่
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How to Test</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Upload a receipt using <code>/test-upload</code> page</li>
              <li>Note the receipt ID from the upload response</li>
              <li>Replace the receipt ID (currently set to 1) in the buttons above</li>
              <li>Click each action button to test the functionality</li>
              <li>Check the database to see the status changes</li>
              <li>Visit <code>/dashboard/review-reciept</code> to see the updated data</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Endpoint</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm font-medium">PATCH /api/receipts/[id]/status</p>
              <p className="text-xs text-gray-600">Body: {"{ action: 'approve' | 'reject' | 'clarify' }"}</p>
              <p className="text-xs text-gray-600">Requires: Admin authentication</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 