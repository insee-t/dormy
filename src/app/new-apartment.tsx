import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/router';

const DormitoryForm = () => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);
  
  // Mock data initialization
  const [formData, setFormData] = useState({
    dormitoryName: 'หอพักตัวอย่าง',
    phoneNumber: '0812345678',
    email: 'example@dormitory.com',
    businessType: 'personal',
    billDate: '1',
    paymentDueDate: '5',
    totalRooms: '4'
  });

  const handleSave = () => {
    // Here you could add validation if needed
    console.log('Saving form data:', formData);
    // Navigate to /owner after saving
    router.push('/owner');
  };

  const handleCancel = () => {
    // Navigate back to /owner
    router.push('/owner');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-center mb-8 relative">
          <div className="w-full max-w-2xl flex justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" />
            <div className={`absolute top-1/2 left-0 h-0.5 bg-[#6FB2D2] -translate-y-1/2 transition-all duration-300 ${activeStep === 1 ? 'w-0' : activeStep === 2 ? 'w-full' : ''}`} />
            
            <div className="relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold ${activeStep >= 1 ? 'bg-[#6FB2D2] text-white' : 'bg-gray-200 text-#DDDDDD'}`}>
                1
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-medium text-gray-600">
                ข้อมูลหอพัก
              </div>
            </div>

            <div className="relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold ${activeStep >= 2 ? 'bg-[#6FB2D2] text-white' : 'bg-gray-200 text-#DDDDDD'}`}>
                2
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-medium text-gray-600">
                ที่อยู่หอพัก
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mt-12">
          {activeStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อหอพัก <span className="text-#ff5757">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="กรอกชื่อหอพัก"
                  value={formData.dormitoryName}
                  onChange={(e) => setFormData({ ...formData, dormitoryName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  เบอร์โทรติดต่อหอพัก <span className="text-#ff5757">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    className="flex-1 px-3 py-2 border rounded-md"
                    placeholder="กรอกเบอร์โทร"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  />
                  <button 
                    type="button"
                    className="px-4 py-2 bg-[#6FB2D2] text-white rounded-md hover:bg-[#5DA1C1] transition-colors"
                  >
                    + เพิ่มเบอร์โทรศัพท์
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  อีเมลติดต่อหอพัก
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="กรอกข้อมูล"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ประเภทธุรกิจ <span className="text-#ff5757">*</span>
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                >
                  <option value="">บุคคลธรรมดา/บริษัท</option>
                  <option value="personal">บุคคลธรรมดา</option>
                  <option value="company">บริษัท</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ทำบิลทุกวันที่ที่กำหนด
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="กรอกข้อมูล"
                    value={formData.billDate}
                    onChange={(e) => setFormData({ ...formData, billDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    กำหนดสิ้นสุดของการชำระเงิน
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="กรอกข้อมูล"
                    value={formData.paymentDueDate}
                    onChange={(e) => setFormData({ ...formData, paymentDueDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  จำนวนชั้น/ชั้นที่ห้อง
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="กรอกข้อมูล"
                  value={formData.totalRooms}
                  onChange={(e) => setFormData({ ...formData, totalRooms: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-#ff5757 text-white rounded-md hover:bg-#e73333 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 bg-[#4CAF50] text-white rounded-md hover:bg-[#388E3C] transition-colors"
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DormitoryForm;
