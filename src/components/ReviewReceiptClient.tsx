"use client"

import React, { useState } from "react"
import {
  Download,
  Eye,
  Filter,
  Search,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Smartphone,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"

interface BankingStatement {
  image: string
  bankName: string
  transactionId: string
  timestamp: string
  receiptId?: number
}

interface PaymentStatement {
  id: string
  tenantName: string
  apartmentUnit: string
  amount: number
  dueDate: string
  paidDate: string | null
  status: "paid" | "pending" | "overdue"
  paymentMethod: string | null
  lateFee: number
  bankingStatement: BankingStatement | null
}

interface ReviewReceiptClientProps {
  paymentStatements: PaymentStatement[]
}

export default function ReviewReceiptClient({ paymentStatements }: ReviewReceiptClientProps) {
  const [selectedStatements, setSelectedStatements] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedRows, setExpandedRows] = useState<string[]>([])
  const [loadingActions, setLoadingActions] = useState<{ [key: string]: boolean }>({})

  const filteredStatements = paymentStatements.filter((statement) => {
    const matchesStatus = statusFilter === "all" || statement.status === statusFilter
    const matchesSearch =
      statement.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      statement.apartmentUnit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      statement.id.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesStatus && matchesSearch
  })

  const totalAmount = paymentStatements.reduce((sum, statement) => sum + statement.amount, 0)
  const paidAmount = paymentStatements
    .filter((s) => s.status === "paid")
    .reduce((sum, statement) => sum + statement.amount, 0)
  const overdueAmount = paymentStatements
    .filter((s) => s.status === "overdue")
    .reduce((sum, statement) => sum + statement.amount + statement.lateFee, 0)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-[#00bf63]/20 text-[#00bf63] hover:bg-[#00bf63]/10">ชำระแล้ว</Badge>
      case "pending":
        return <Badge className="bg-[#ffa31e]/20 text-[#ffa31e] hover:bg-[#ffa31e]/10">รอดำเนินการ</Badge>
      case "overdue":
        return <Badge className="bg-[#ff5757]/20  text-[#ff5757] hover:bg-[#ff5757]/10 ">ค้างชำระ</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStatements(filteredStatements.map((s) => s.id))
    } else {
      setSelectedStatements([])
    }
  }

  const handleSelectStatement = (statementId: string, checked: boolean) => {
    if (checked) {
      setSelectedStatements([...selectedStatements, statementId])
    } else {
      setSelectedStatements(selectedStatements.filter((id) => id !== statementId))
    }
  }

  const toggleRowExpansion = (statementId: string) => {
    if (expandedRows.includes(statementId)) {
      setExpandedRows(expandedRows.filter((id) => id !== statementId))
    } else {
      setExpandedRows([...expandedRows, statementId])
    }
  }

  const handleReceiptAction = async (receiptId: number, action: 'approve' | 'reject' | 'clarify') => {
    if (!receiptId) {
      alert('Receipt ID not found')
      return
    }

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
        // Refresh the page to show updated data
        window.location.reload()
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
      <div className="min-h-screen  bg-white p-6 space-y-6 shadow-md rounded-lg">

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 ">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ยอดที่คาดว่าจะได้รับทั้งหมด</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">฿{totalAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{paymentStatements.length} รายการ</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ยอดที่เก็บได้</CardTitle>
              <CheckCircle className="h-4 w-4 text-[#00bf63]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#00bf63]">฿{paidAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {paymentStatements.filter((s) => s.status === "paid").length} ชำระแล้ว
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ค้างชำระ</CardTitle>
              <Clock className="h-4 w-4 text-[#ff5757]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#ff5757]">฿{overdueAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {paymentStatements.filter((s) => s.status === "overdue").length} ค้างชำระ
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ชำระเงินแล้ว</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round((paidAmount / totalAmount) * 100)}%</div>
              <p className="text-xs text-muted-foreground">ในเดือนนี้</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>รายการชำระเงินพร้อมหลักฐานจากธนาคาร</CardTitle>
            <CardDescription>ตรวจสอบการชำระค่าเช่าและรายการจากแอปธนาคารของผู้เช่า</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6 ">
              <div className="flex-1" >
                <Label htmlFor="search">ค้นหา</Label>
                <div className="relative ">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="ค้นหาโดยชื่อนผู้เช่า หน่วย หรือ รหัสรายการ ..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Label htmlFor="status">สถานะ</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    <SelectItem value="paid">ชำระแล้ว</SelectItem>
                    <SelectItem value="pending">รอดำเนินการ</SelectItem>
                    <SelectItem value="overdue">ค้างชำระ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedStatements.length > 0 && (
              <div className="flex items-center gap-4 mb-4 p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium"> เลือกแล้ว {selectedStatements.length} รายการ</span>
                <Button size="sm" variant="outline" className="bg-[#01bcb3] hover:bg-[#01bcb3]/50 text-white hover:text-white">
                  ส่งการแจ้งเตือน
                </Button>
                <Button size="sm" variant="outline" className="bg-[#01bcb3] hover:bg-[#01bcb3]/50 text-white hover:text-white">
                  ทำเครื่องหมายว่าได้ชำระเงินแล้ว
                </Button>
                <Button size="sm" variant="outline" className="bg-[#01bcb3] hover:bg-[#01bcb3]/50 text-white hover:text-white">
                  ส่งออกรายการที่เลือก
                </Button>
              </div>
            )}

            {/* Statements Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedStatements.length === filteredStatements.length}
                        onCheckedChange={handleSelectAll}
                        
                      />
                    </TableHead>
                    <TableHead>รหัสรายการ</TableHead>
                    <TableHead>ผู้เช่า</TableHead>
                    <TableHead>หน่วย</TableHead>
                    <TableHead>จำนวนเงิน</TableHead>
                    <TableHead>วันครบกำหนด</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead>หลักฐานการโอนเงิน</TableHead>
                    <TableHead>การดำเนินการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStatements.map((statement) => (
                    <React.Fragment key={statement.id}>
                      <TableRow className="group">
                        <TableCell>
                          <Checkbox
                            checked={selectedStatements.includes(statement.id)}
                            onCheckedChange={(checked) => handleSelectStatement(statement.id, checked as boolean)}
                            className=""
                          />
                        </TableCell>
                        <TableCell className="font-medium">{statement.id}</TableCell>
                        <TableCell>{statement.tenantName}</TableCell>
                        <TableCell>{statement.apartmentUnit}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">฿{statement.amount.toLocaleString()}</div>
                            {statement.lateFee > 0 && (
                              <div className="text-sm text-[#ff5757] ">+฿{statement.lateFee}  ค่าปรับล่าช้า </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{statement.dueDate}</TableCell>
                        <TableCell>{getStatusBadge(statement.status)}</TableCell>
                        <TableCell>
                          {statement.bankingStatement ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleRowExpansion(statement.id)}
                              className="flex items-center gap-2"
                            >
                              <Smartphone className="h-4 w-4" />
                              ดู statement
                              {expandedRows.includes(statement.id) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          ) : (
                            <span className="text-muted-foreground text-sm">ไม่มีหลักฐานการชำระเงิน</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">เปิดเมนู</span>
                                <Eye className="h-4 w-4 text-[#ffac3a]" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white">
                              <DropdownMenuLabel>การดำเนินการ</DropdownMenuLabel>
                              <DropdownMenuItem>ดูรายละเอียด</DropdownMenuItem>
                              <DropdownMenuItem>ดาวน์โหลดใบเสร็จ</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {statement.status !== "paid" && (
                                <>
                                  <DropdownMenuItem>ทำเครื่องหมายว่าได้ชำระเงินแล้ว</DropdownMenuItem>
                                  <DropdownMenuItem>ส่งการแจ้งเตือน</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                </>
                              )}
                              <DropdownMenuItem>ติดต่อผู้เช่า</DropdownMenuItem>
                              <DropdownMenuItem className="text-[#ff5757]">รายงานปัญหา</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>

                      {/* Expandable Banking Statement Row */}
                      {statement.bankingStatement && expandedRows.includes(statement.id) && (
                        <TableRow>
                          <TableCell colSpan={9} className="p-0 ">
                            <Collapsible open={expandedRows.includes(statement.id)}>
                              <CollapsibleContent>
                                <div className="p-6 bg-gray-50 bg-[#dbe1f0]/15 border-t">
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Banking Statement Image */}
                                    <div className="space-y-4">
                                      <h4 className="font-semibold text-lg flex items-center gap-2">
                                        <Smartphone className="h-5 w-5" />
                                        statement จากแอปธนาคาร
                                      </h4>
                                      <div className="bg-white rounded-lg p-4 shadow-sm">
                                        <img
                                          src={statement.bankingStatement.image || "/placeholder.svg"}
                                          alt="Banking app statement"
                                          className="w-full max-w-sm mx-auto rounded-lg border shadow-sm"
                                        />
                                      </div>
                                    </div>

                                    {/* Transaction Details */}
                                    <div className="space-y-4 ">
                                      <h4 className="font-semibold text-lg">รายละเอียดธุรกรรม</h4>
                                      <div className="bg-white rounded-lg p-4 shadow-sm space-y-3">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Label className="text-sm font-medium text-gray-600">ธนาคาร</Label>
                                            <p className="text-sm">{statement.bankingStatement.bankName}</p>
                                          </div>
                                          <div>
                                            <Label className="text-sm font-medium text-gray-600">รหัสธุรกรรม</Label>
                                            <p className="text-sm font-mono">
                                              {statement.bankingStatement.transactionId}
                                            </p>
                                          </div>
                                          <div>
                                            <Label className="text-sm font-medium text-gray-600">เวลาบันทึก</Label>
                                            <p className="text-sm">{statement.bankingStatement.timestamp}</p>
                                          </div>
                                          <div>
                                            <Label className="text-sm font-medium text-gray-600">จำนวนเงิน</Label>
                                            <p className="text-sm font-semibold text-[]">
                                              ฿{statement.amount.toLocaleString()}
                                            </p>
                                          </div>
                                        </div>

                                        <div className="pt-3 border-t">
                                          <div className="flex gap-2">
                                            <Button 
                                              size="sm" 
                                              className="bg-[#00bf63] hover:bg-green-700 cursor-pointer"
                                              onClick={() => {
                                                // Extract receipt ID from transaction ID (RCP001 -> 1)
                                                const receiptId = statement.bankingStatement?.transactionId?.replace('RCP', '')
                                                if (receiptId) {
                                                  handleReceiptAction(parseInt(receiptId), 'approve')
                                                }
                                              }}
                                              disabled={loadingActions[`${statement.bankingStatement?.transactionId?.replace('RCP', '')}-approve`]}
                                            >
                                              {loadingActions[`${statement.bankingStatement?.transactionId?.replace('RCP', '')}-approve`] ? 'กำลังดำเนินการ...' : 'อนุมัติการชำระเงิน'}
                                            </Button>
                                            <Button 
                                              size="sm" 
                                              variant="outline"
                                              className="cursor-pointer"
                                              onClick={() => {
                                                const receiptId = statement.bankingStatement?.transactionId?.replace('RCP', '')
                                                if (receiptId) {
                                                  handleReceiptAction(parseInt(receiptId), 'clarify')
                                                }
                                              }}
                                              disabled={loadingActions[`${statement.bankingStatement?.transactionId?.replace('RCP', '')}-clarify`]}
                                            >
                                              {loadingActions[`${statement.bankingStatement?.transactionId?.replace('RCP', '')}-clarify`] ? 'กำลังดำเนินการ...' : 'ขอคำชี้แจง'}
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              className="text-[#ff5757] border-red-200 hover:bg-red-50 cursor-pointer"
                                              onClick={() => {
                                                const receiptId = statement.bankingStatement?.transactionId?.replace('RCP', '')
                                                if (receiptId) {
                                                  handleReceiptAction(parseInt(receiptId), 'reject')
                                                }
                                              }}
                                              disabled={loadingActions[`${statement.bankingStatement?.transactionId?.replace('RCP', '')}-reject`]}
                                            >
                                              {loadingActions[`${statement.bankingStatement?.transactionId?.replace('RCP', '')}-reject`] ? 'กำลังดำเนินการ...' : 'ปฏิเสธ'}
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredStatements.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">ไม่พบรายการใบเสร็จที่ตรงกับเงื่อนไขของคุณ</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
  )
} 