export default function Loading() {
  return (
    <div className="min-h-screen bg-[#dbe1f0] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white p-4 rounded-md shadow-md">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <span>สร้างหอพัก</span>
              <span>→</span>
              <span>สร้างชั้นและห้อง</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">สร้างชั้นและห้อง</h1>
            <p className="text-gray-600 mt-1">กำลังโหลดข้อมูลหอพัก...</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-40 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Configuration Section */}
        <div className="bg-white p-4 rounded-md shadow-md">
          <div className="flex flex-col gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-md shadow-md">
          <div className="p-6">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse mb-6"></div>
            
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 