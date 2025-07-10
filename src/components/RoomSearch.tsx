"use client";

import React, { useState } from "react";
import { Button, Input } from "@heroui/react";
import { SearchIcon } from "lucide-react";

interface RoomSearchProps {
  onSearch: (query: string) => void;
  onFilter: () => void;
  onSettings: () => void;
}

export default function RoomSearch({ onSearch, onFilter, onSettings }: RoomSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="flex gap-4 mb-6 bg-white rounded-xl px-4">
      <Input
        className="flex-1"
        placeholder="ค้นหาตามหมายเลขห้อง"
        startContent={<SearchIcon className="text-gray-400" />}
        value={searchQuery}
        onChange={handleSearchChange}
      />
    </div>
  );
} 