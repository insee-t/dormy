"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [amount, setAmount] = useState('')
  const [paymentPlanId, setPaymentPlanId] = useState('')
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file || !amount || !paymentPlanId) {
      alert('Please fill in all fields')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('receipt', file)
      formData.append('amount', amount)
      formData.append('paymentPlanId', paymentPlanId)

      const response = await fetch('/api/tenant/upload-receipt', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      setResult(data)
      
      if (response.ok) {
        alert('Upload successful!')
      } else {
        alert(`Upload failed: ${data.error}`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Receipt Upload</CardTitle>
            <CardDescription>
              Test the local file storage functionality for receipt uploads
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="file">Receipt File</Label>
              <Input
                id="file"
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="amount">Amount (THB)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="5000"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="paymentPlanId">Payment Plan ID</Label>
              <Input
                id="paymentPlanId"
                type="number"
                value={paymentPlanId}
                onChange={(e) => setPaymentPlanId(e.target.value)}
                placeholder="1"
                className="mt-1"
              />
            </div>

            <Button 
              onClick={handleUpload} 
              disabled={uploading || !file || !amount || !paymentPlanId}
              className="w-full"
            >
              {uploading ? 'Uploading...' : 'Upload Receipt'}
            </Button>

            {result && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <h3 className="font-semibold mb-2">Upload Result:</h3>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Select a receipt file (image or PDF)</li>
              <li>Enter the payment amount in THB</li>
              <li>Enter a valid Payment Plan ID from your database</li>
              <li>Click Upload to test the local file storage</li>
              <li>Files will be saved to <code>public/uploads/receipts/</code></li>
              <li>File metadata will be stored in the database</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 