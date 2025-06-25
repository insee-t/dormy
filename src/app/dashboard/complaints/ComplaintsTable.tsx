"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/components/lib/utils";
import { CircleCheck, CircleX, Clock5, CirclePlus, CircleMinus, ChartNoAxesColumn, ChevronDown, ChevronUp, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Complaint = {
  id: number;
  createdAt: string | Date;
  status: string;
  reportType: string;
  description: string;
  fileName: string;
  tenant?: {
    name?: string;
    room?: {
      roomNumber?: string;
    };
  };
};

function statusDisplay(status: string) {
  switch (status) {
    case "complete":
      return { label: "ดำเนินการเรียบร้อย", color: "text-[#2FAB73]", icon: <CircleCheck className="bg-green-400 rounded-full size-fit" /> };
    case "in_progress":
      return { label: "กำลังดำเนินการ", color: "text-blue-400", icon: <Clock5 className="w-4 h-4" /> };
    case "waiting_for_inventory":
      return { label: "รอวัสดุ อุปกรณ์", color: "text-red-400", icon: <CircleX className="w-4 h-4" /> };
    default:
      return { label: status, color: "", icon: null };
  }
}

const PAGE_SIZE = 10;

export default function ComplaintsTable({ complaints }: { complaints: Complaint[] }) {
  const [sortKey, setSortKey] = useState<keyof Complaint | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [loadingActions, setLoadingActions] = useState<{ [key: string]: boolean }>({});

  // Filter by search
  const filtered = useMemo(() => {
    if (!search) return complaints;
    const lower = search.toLowerCase();
    return complaints.filter(c =>
      c.description.toLowerCase().includes(lower) ||
      c.reportType.toLowerCase().includes(lower) ||
      (c.tenant?.name?.toLowerCase().includes(lower) ?? false) ||
      (c.tenant?.room?.roomNumber?.toLowerCase().includes(lower) ?? false)
    );
  }, [complaints, search]);

  // Sort
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];
      if (sortKey === "createdAt") {
        aVal = new Date(aVal as string);
        bVal = new Date(bVal as string);
      }
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortAsc]);

  // Pagination
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Handlers
  function handleSort(key: keyof Complaint) {
    if (sortKey === key) setSortAsc(a => !a);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
    setPage(1);
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(1);
  }

  const toggleRowExpansion = (complaintId: number) => {
    if (expandedRows.includes(complaintId)) {
      setExpandedRows(expandedRows.filter((id) => id !== complaintId));
    } else {
      setExpandedRows([...expandedRows, complaintId]);
    }
  };

  const handleStatusUpdate = async (complaintId: number, newStatus: string) => {
    setLoadingActions(prev => ({ ...prev, [`${complaintId}-${newStatus}`]: true }));

    try {
      const response = await fetch(`/api/complaints/${complaintId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error updating complaint status:', error);
      alert('Failed to update complaint status');
    } finally {
      setLoadingActions(prev => ({ ...prev, [`${complaintId}-${newStatus}`]: false }));
    }
  };

  const getStatusButtonColor = (status: string) => {
    switch (status) {
      case "complete":
        return "bg-[#2FAB73] hover:bg-[#2FAB73]/80 text-white";
      case "in_progress":
        return "bg-blue-500 hover:bg-blue-600 text-white";
      case "waiting_for_inventory":
        return "bg-red-500 hover:bg-red-600 text-white";
      default:
        return "bg-gray-500 hover:bg-gray-600 text-white";
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-2 items-center">
        <ChartNoAxesColumn />
        <input
          className="border-2 p-1 rounded w-64"
          placeholder="ค้นหา..."
          value={search}
          onChange={handleSearch}
        />
        <span className="text-sm text-gray-500">{sorted.length} รายการ</span>
      </div>
      <table className="w-full mt-1 shadow">
        <thead className="bg-blue-400 text-white">
          <tr>
            <th className="w-24 p-2 tracking-wide text-left cursor-pointer" onClick={() => handleSort("id")}>ลำดับที่</th>
            <th className="p-2 tracking-wide text-left cursor-pointer" onClick={() => handleSort("createdAt")}>ประทับเวลา</th>
            <th className="w-34 p-2 tracking-wide text-left">สถานะ</th>
            <th className="w-30 p-2 tracking-wide text-left cursor-pointer" onClick={() => handleSort("tenant")}>ผู้แจ้ง</th>
            <th className="w-34 p-2 tracking-wide text-left cursor-pointer" onClick={() => handleSort("tenant")}>ห้อง</th>
            <th className="w-30 p-2 tracking-wide text-left cursor-pointer" onClick={() => handleSort("reportType")}>ประเภทงาน</th>
            <th className="w-30 p-2 tracking-wide text-left">รายละเอียด</th>
            <th className="w-30 p-2 tracking-wide text-left">รูปภาพ</th>
            <th className="w-30 p-2 tracking-wide text-left">การดำเนินการ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#4F5665]">
          {paged.map((c, idx) => {
            const status = statusDisplay(c.status);
            return (
              <React.Fragment key={c.id}>
                <tr className={idx % 2 === 0 ? "bg-white" : "bg-[#EEEFF2]"}>
                  <td className="p-2 text-sm whitespace-nowrap flex gap-1 items-center">
                    {c.status === "in_progress" ? <CirclePlus className="bg-green-400 rounded-full size-1/4" /> : <CircleMinus className="bg-red-400 rounded-full size-1/4" />}
                    {String(c.id).padStart(3, '0')}
                  </td>
                  <td className="p-2 text-sm whitespace-nowrap">{new Date(c.createdAt).toLocaleDateString("th-TH", { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                  <td className={cn("p-2 text-sm whitespace-nowrap flex gap-1 items-center", status.color)}>{status.icon}{status.label}</td>
                  <td className="p-2 text-sm whitespace-nowrap">{c.tenant?.name || '-'}</td>
                  <td className="p-2 text-sm whitespace-nowrap">{c.tenant?.room?.roomNumber || '-'}</td>
                  <td className="p-2 text-sm whitespace-nowrap">{c.reportType}</td>
                  <td className="p-2 text-sm whitespace-nowrap">{c.description}</td>
                  <td className="p-2 text-sm whitespace-nowrap">
                    {c.fileName ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleRowExpansion(c.id)}
                        className="flex items-center gap-2"
                      >
                        <ImageIcon className="h-4 w-4" />
                        ดูรูปภาพ
                        {expandedRows.includes(c.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    ) : (
                      <span className="text-muted-foreground text-sm">ไม่มีรูปภาพ</span>
                    )}
                  </td>
                  <td className="p-2 text-sm whitespace-nowrap">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          อัปเดตสถานะ
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white">
                        <DropdownMenuItem
                          onClick={() => handleStatusUpdate(c.id, "in_progress")}
                          disabled={c.status === "in_progress" || loadingActions[`${c.id}-in_progress`]}
                          className="flex items-center gap-2"
                        >
                          {loadingActions[`${c.id}-in_progress`] ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Clock5 className="h-3 w-3" />
                          )}
                          กำลังดำเนินการ
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusUpdate(c.id, "waiting_for_inventory")}
                          disabled={c.status === "waiting_for_inventory" || loadingActions[`${c.id}-waiting_for_inventory`]}
                          className="flex items-center gap-2"
                        >
                          {loadingActions[`${c.id}-waiting_for_inventory`] ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <CircleX className="h-3 w-3" />
                          )}
                          รอวัสดุ อุปกรณ์
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusUpdate(c.id, "complete")}
                          disabled={c.status === "complete" || loadingActions[`${c.id}-complete`]}
                          className="flex items-center gap-2"
                        >
                          {loadingActions[`${c.id}-complete`] ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <CircleCheck className="h-3 w-3" />
                          )}
                          ดำเนินการเรียบร้อย
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>

                {/* Expandable Image Row */}
                {c.fileName && expandedRows.includes(c.id) && (
                  <tr>
                    <td colSpan={9} className="p-0">
                      <Collapsible open={expandedRows.includes(c.id)}>
                        <CollapsibleContent>
                          <div className="p-6 bg-gray-50 bg-[#dbe1f0]/15 border-t">
                            <div className="space-y-4">
                              <h4 className="font-semibold text-lg flex items-center gap-2">
                                <ImageIcon className="h-5 w-5" />
                                รูปภาพจากผู้แจ้ง
                              </h4>
                              <div className="bg-white rounded-lg p-4 shadow-sm">
                                <img
                                  src={`/api/uploads/maintenance/${c.fileName}`}
                                  alt="Maintenance request image"
                                  className="w-full max-w-md mx-auto rounded-lg border shadow-sm"
                                />
                              </div>
                              <div className="text-sm text-gray-600 text-center">
                                รูปภาพที่อัปโหลดเมื่อ {new Date(c.createdAt).toLocaleString("th-TH")}
                              </div>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          ก่อนหน้า
        </button>
        <span>หน้า {page} / {totalPages || 1}</span>
        <button
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages || totalPages === 0}
        >
          ถัดไป
        </button>
      </div>
    </div>
  );
} 