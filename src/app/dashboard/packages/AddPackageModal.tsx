"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

export default function AddPackageModal({ apartmentId }: { apartmentId: number }) {
  const [open, setOpen] = useState(false);
  const [roomNumber, setRoomNumber] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomNumber, ownerName, trackingCode, apartmentId }),
      });
      if (!res.ok) {
        setError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        setIsSubmitting(false);
        return;
      }
      setOpen(false);
      setRoomNumber("");
      setOwnerName("");
      setTrackingCode("");
      window.location.reload();
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button className="bg-[#2FAB73] rounded-lg px-3 py-1 text-white" onClick={() => setOpen(true)}>
        + เพิ่มพัสดุ
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>เพิ่มพัสดุใหม่</DialogTitle>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="room_number" className="block text-sm font-medium text-gray-700">
                เลขห้อง
              </label>
              <input
                id="room_number"
                name="room_number"
                value={roomNumber}
                onChange={e => setRoomNumber(e.target.value)}
                placeholder="เลขห้อง"
                required
                className="border border-slate-300 placeholder-slate-500 rounded-md px-2 py-1 w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="owner_name" className="block text-sm font-medium text-gray-700">
                ชื่อเจ้าของพัสดุ
              </label>
              <input
                id="owner_name"
                name="owner_name"
                value={ownerName}
                onChange={e => setOwnerName(e.target.value)}
                placeholder="ชื่อเจ้าของ"
                required
                className="border border-slate-300 placeholder-slate-500 rounded-md px-2 py-1 w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="tracking_code" className="block text-sm font-medium text-gray-700">
                รหัสพัสดุ
            </label>
              <input
                id="tracking_code"
                name="tracking_code"
                value={trackingCode}
                onChange={e => setTrackingCode(e.target.value)}
                placeholder="รหัสพัสดุ"
                required
                className="border border-slate-300 placeholder-slate-500 rounded-md px-2 py-1 w-full"
              />
            </div>
            {error && <p className="text-[#ff5757] text-sm">{error}</p>}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
                className="bg-slate-800 hover:bg-slate-600 rounded-lg px-3 py-1 text-white"
              >
                ปิด
              </button>
              <button
                className="bg-[#2FAB73] hover:bg-[#2FAB73]/80 rounded-lg px-3 py-1 text-white"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "กำลังบันทึก..." : "บันทึก"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}