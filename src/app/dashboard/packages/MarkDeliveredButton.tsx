"use client";

import { useState } from "react";

export default function MarkDeliveredButton({ id, disabled }: { id: number, disabled?: boolean }) {
  const [loading, setLoading] = useState(false);
  const handleMarkDelivered = async () => {
    setLoading(true);
    await fetch("/api/packages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, complete: true }),
    });
    window.location.reload();
  };
  return (
    <button
      className="cursor-pointer bg-[#2FAB73] hover:bg-[#2FAB73]/80 rounded-lg px-3 py-1 text-white ml-4"
      onClick={handleMarkDelivered}
      disabled={loading || disabled}
    >
      {loading ? "กำลังอัปเดต..." : "ยืนยันนำจ่ายแล้ว"}
    </button>
  );
}
