import React from "react";
import App from "../../../components/Sidebar/App";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ProfileLoading() {
  return (
    <App title="โปรไฟล์" userName="...">
      <div className="bg-white min-h-screen shadow-md rounded-xl p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="h-8 w-48 bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          <div className="space-y-6">
            {/* Profile Information Card */}
            <Card>
              <CardHeader>
                <div className="h-6 w-32 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>

            {/* Password Change Card */}
            <Card>
              <CardHeader>
                <div className="h-6 w-32 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="h-10 w-36 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </App>
  );
} 