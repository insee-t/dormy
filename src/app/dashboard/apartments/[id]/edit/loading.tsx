import React from "react";
import App from "@/components/Sidebar/App";

export default function EditApartmentLoading() {
  return (
    <App title="แก้ไขหอพัก" userName="...">
      <div className="bg-white shadow-md rounded-2xl p-8 h-fit">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="h-8 w-48 bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          <div className="space-y-6">
            {/* Name field */}
            <div>
              <div className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Address field */}
            <div>
              <div className="h-4 w-28 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="h-24 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Phone field */}
            <div>
              <div className="h-4 w-32 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Email field */}
            <div>
              <div className="h-4 w-16 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Tax ID field */}
            <div>
              <div className="h-4 w-40 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Business Type field */}
            <div>
              <div className="h-4 w-32 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Date fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div>
                <div className="h-4 w-32 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </App>
  );
} 