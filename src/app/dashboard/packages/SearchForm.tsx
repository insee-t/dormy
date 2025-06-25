"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchForm({ defaultValue, apartment, filter }: { defaultValue: string, apartment: number, filter: string }) {
  const [value, setValue] = useState(defaultValue);
  const router = useRouter();
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (apartment !== undefined) params.set("apartment", String(apartment));
        if (filter && filter !== "all") params.set("filter", filter);
        if (value) params.set("search", value);
        router.push(`?${params.toString()}`);
      }}
      className="flex w-full"
    >
      <input
        className="flex-1 border border-slate-300 placeholder-slate-500 rounded-md px-2 py-1 w-full"
        placeholder="ค้นหา เลขห้อง/ชื่อเจ้าของ/รหัสพัสดุ"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <button type="submit" className="ml-2 bg-slate-800 text-white px-3 py-1 rounded-md">ค้นหา</button>
    </form>
  );
}
