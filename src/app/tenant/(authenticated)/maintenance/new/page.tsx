"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Upload, CheckCircle } from 'lucide-react'

const reportTypes = [
  { value: "repair", label: "ซ่อมแซม", description: "ปัญหาอุปกรณ์หรือสิ่งอำนวยความสะดวก" },
  { value: "clean", label: "ทำความสะอาด", description: "ขอให้ทำความสะอาดพื้นที่" },
  { value: "move", label: "ย้าย", description: "ขอความช่วยเหลือในการย้าย" },
  { value: "emergency", label: "ฉุกเฉิน", description: "ปัญหาที่ต้องแก้ไขทันที" },
  { value: "other", label: "อื่นๆ", description: "ปัญหาอื่นๆ ที่ไม่เข้าข่ายข้างต้น" }
]

export default function NewMaintenancePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    reportType: '',
    description: '',
    fileName: ''
  })
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('กรุณาเลือกไฟล์รูปภาพหรือ PDF เท่านั้น')
        return
      }

      // Validate file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('ขนาดไฟล์ต้องไม่เกิน 5MB')
        return
      }

      setFile(selectedFile)
      setFormData(prev => ({ ...prev, fileName: selectedFile.name }))
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!formData.reportType || !formData.description) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const submitData = new FormData()
      submitData.append('reportType', formData.reportType)
      submitData.append('description', formData.description)
      
      if (file) {
        submitData.append('file', file)
      }

      const response = await fetch('/api/tenant/maintenance', {
        method: 'POST',
        body: submitData,
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/tenant/maintenance')
        }, 2000)
      } else {
        setError(data.error || 'เกิดข้อผิดพลาดในการส่งคำขอ')
      }
    } catch (error) {
      console.error('Error submitting maintenance request:', error)
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold text-gray-900">ส่งคำขอสำเร็จ!</h2>
              <p className="text-gray-600">
                คำขอซ่อมแซมของคุณได้รับการส่งเรียบร้อยแล้ว 
                เราจะติดต่อกลับโดยเร็วที่สุด
              </p>
              <Button 
                onClick={() => router.push('/tenant/maintenance')}
                className="w-full"
              >
                กลับไปยังรายการคำขอ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto bg-white">
        <Card>
          <CardHeader>
            <CardTitle>ส่งคำขอซ่อมแซม</CardTitle>
            <CardDescription>
              กรอกข้อมูลเพื่อส่งคำขอซ่อมแซมหรือขอความช่วยเหลือ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="reportType">ประเภทปัญหา *</Label>
                <Select 
                  value={formData.reportType} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, reportType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกประเภทปัญหา" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {reportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-sm text-gray-500">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">รายละเอียดปัญหา *</Label>
                <Textarea
                  id="description"
                  placeholder="อธิบายปัญหาที่เกิดขึ้นอย่างละเอียด..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={5}
                  required
                />
                <p className="text-sm text-gray-500">
                  กรุณาระบุรายละเอียดที่ชัดเจนเพื่อให้เราสามารถช่วยเหลือได้อย่างตรงจุด
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">แนบไฟล์ (ไม่บังคับ)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <input
                    type="file"
                    id="file"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="hidden"
                  />
                  <label htmlFor="file" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-500 font-medium">
                      คลิกเพื่อเลือกไฟล์
                    </span>
                    <span className="text-gray-500"> หรือลากไฟล์มาวาง</span>
                  </label>
                  <p className="text-sm text-gray-500 mt-1">
                    รองรับไฟล์รูปภาพและ PDF ขนาดไม่เกิน 5MB
                  </p>
                </div>
                {file && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="destructive"
                  className="bg-[#ff5757] text-white hover:bg-[#ff5757]/80 flex-1"
                  onClick={() => router.back()}
                >
                  ยกเลิก
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'กำลังส่ง...' : 'ส่งคำขอ'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 