import { getCurrentUser } from "@/auth/nextjs/currentUser"
import { db } from "@/drizzle/db"
import { ComplainTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

async function getMaintenanceRequests(userId: string) {
  try {
    const requests = await db.query.ComplainTable.findMany({
      where: eq(ComplainTable.userId, userId),
      orderBy: (table, { desc }) => desc(table.createdAt)
    })

    return requests
  } catch (error) {
    console.error("Error fetching maintenance requests:", error)
    return []
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "in_progress":
      return <Badge className="bg-blue-100 text-blue-800">กำลังดำเนินการ</Badge>
    case "waiting_for_inventory":
      return <Badge className="bg-yellow-100 text-yellow-800">รอตรวจสอบ</Badge>
    case "complete":
      return <Badge className="bg-green-100 text-green-800">เสร็จสิ้น</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getReportTypeLabel = (type: string) => {
  switch (type) {
    case "repair":
      return "ซ่อมแซม"
    case "clean":
      return "ทำความสะอาด"
    case "move":
      return "ย้าย"
    case "emergency":
      return "ฉุกเฉิน"
    case "other":
      return "อื่นๆ"
    default:
      return type
  }
}

const getReportTypeIcon = (type: string) => {
  switch (type) {
    case "repair":
      return "🔧"
    case "clean":
      return "🧹"
    case "move":
      return "📦"
    case "emergency":
      return "🚨"
    case "other":
      return "📋"
    default:
      return "📄"
  }
}

export default async function MaintenancePage() {
  const currentUser = await getCurrentUser({ withFullUser: true, redirectIfNotFound: true })
  
  const maintenanceRequests = await getMaintenanceRequests(currentUser.id)

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">คำขอซ่อมแซม</h1>
            <p className="text-gray-600 mt-1">ดูสถานะคำขอซ่อมแซมและความช่วยเหลือของคุณ</p>
          </div>
          <Link href="/tenant/maintenance/new">
            <Button className="bg-[#018c98] text-white hover:bg-[#018c98]/80 cursor-pointer">
              <Plus className="h-4 w-4 mr-2 text-white" />
              ส่งคำขอใหม่
            </Button>
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">คำขอทั้งหมด</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{maintenanceRequests.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">กำลังดำเนินการ</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {maintenanceRequests.filter(r => r.status === 'in_progress').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">เสร็จสิ้น</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {maintenanceRequests.filter(r => r.status === 'complete').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Maintenance Requests List */}
        <Card>
          <CardHeader>
            <CardTitle>รายการคำขอ</CardTitle>
            <CardDescription>
              คำขอซ่อมแซมและความช่วยเหลือของคุณ
            </CardDescription>
          </CardHeader>
          <CardContent>
            {maintenanceRequests.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">ยังไม่มีคำขอ</h3>
                <p className="text-gray-600 mb-4">
                  คุณยังไม่ได้ส่งคำขอซ่อมแซมหรือขอความช่วยเหลือ
                </p>
                <Link href="/tenant/maintenance/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    ส่งคำขอแรก
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {maintenanceRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">
                          {getReportTypeIcon(request.reportType)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900">
                              {getReportTypeLabel(request.reportType)}
                            </h3>
                            {getStatusBadge(request.status)}
                          </div>
                          <p className="text-gray-600 text-sm mb-2">
                            {request.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>
                              ส่งเมื่อ: {new Date(request.createdAt).toLocaleDateString('th-TH')}
                            </span>
                            {request.fileName && request.fileName !== 'no_file' && (
                              <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                มีไฟล์แนบ
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 