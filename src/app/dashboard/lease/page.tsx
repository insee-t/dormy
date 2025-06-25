"use client";
/*flag:
  date format is yyyy-mm-dd. if you change it please change how it was implemented on doc template in server packgage
 */
import React, { useState } from "react";
import { HeroUIProvider } from "@heroui/react";
import App from "../../../components/Sidebar/App";
import { Button, Input } from "@heroui/react";
import { Textarea } from "@heroui/input";
import { Plus, Eye, Edit, Save, X } from "lucide-react";
import { type RentalData } from "@/lib/pdf-generator";
import PdfGenerator from "@/components/PdfGenerator";

// Client wrapper for the server component
function ServerPdfGeneratorWrapper({ rentalData }: { rentalData: RentalData }) {
  // For now, we'll use a simple approach that calls the API directly
  const handleServerDownload = async () => {
    try {
      const response = await fetch('/api/pdf/contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rentalData)
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'rental-contract.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        console.error('Failed to generate PDF');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div>
      <button 
        onClick={handleServerDownload}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
      >
        สร้างสัญญา
      </button>
    </div>
  );
}

export default function LeasePage() {
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [rentalData, setRentalData] = useState<RentalData>({
    contractCreationPlace: "",
    contractCreationDate: new Date().toISOString().split('T')[0],
    dormName: "",
    dormAddress: {
      houseNumber: "",
      alley: "",
      road: "",
      subDistrict: "",
      district: "",
      province: "",
    },
    tenantName: "",
    tenantAddress: {
      houseNumber: "",
      alley: "",
      road: "",
      subDistrict: "",
      district: "",
      province: "",
    },
    tenantNationalId: "",
    tenantPhoneNumber: "",
    roomNumber: "",
    floorNumber: "",
    contractDuration: "",
    monthlyRent: "",
    monthlyRentTextThai: "",
    contractStartDate: "",
    paymentDueDate: "",
    roomDeposit: "",
    roomDepositTextThai: "",
    latePaymentFee: "",
    returnRoomPeriod: "",
    additionalCondition: [""],
  });

  const formFields = [
    {
      name: "สถานที่ทำสัญญา",
      field: "contractCreationPlace",
      type: "text",
      options: { maxLength: 256 },
    },
    {
      name: "วันที่ทำสัญญา",
      field: "contractCreationDate",
      type: "date",
    },
    {
      name: "ชื่อหอพัก",
      field: "dormName",
      type: "text",
      options: { maxLength: 256 },
    },
    {
      name: "ที่อยู่หอพัก",
      field: "dormAddress",
      type: "object",
      subFields: [
        { name: "บ้านเลขที่", field: "houseNumber", type: "text" },
        { name: "ซอย", field: "alley", type: "text" },
        { name: "ถนน", field: "road", type: "text" },
        { name: "ตำบล/แขวง", field: "subDistrict", type: "text" },
        { name: "อำเภอ/เขต", field: "district", type: "text" },
        { name: "จังหวัด", field: "province", type: "text" },
      ],
    },
    {
      name: "ชื่อผู้เช่า",
      field: "tenantName",
      type: "text",
      options: { maxLength: 256 },
    },
    {
      name: "ที่อยู่ผู้เช่า",
      field: "tenantAddress",
      type: "object",
      subFields: [
        { name: "บ้านเลขที่", field: "houseNumber", type: "text" },
        { name: "ซอย", field: "alley", type: "text" },
        { name: "ถนน", field: "road", type: "text" },
        { name: "ตำบล/แขวง", field: "subDistrict", type: "text" },
        { name: "อำเภอ/เขต", field: "district", type: "text" },
        { name: "จังหวัด", field: "province", type: "text" },
      ],
    },
    {
      name: "เลขบัตรประชาชนผู้เช่า",
      field: "tenantNationalId",
      type: "text",
      options: { maxLength: 13, minLength: 13 },
    },
    {
      name: "เบอร์โทรศัพท์ผู้เช่า",
      field: "tenantPhoneNumber",
      type: "text",
      options: { maxLength: 10 },
    },
    {
      name: "หมายเลขห้อง",
      field: "roomNumber",
      type: "text",
      options: { maxLength: 256 },
    },
    {
      name: "ชั้น",
      field: "floorNumber",
      type: "number",
      options: { max: 999 },
    },
    {
      name: "ค่าเช่ารายเดือน",
      field: "monthlyRent",
      type: "number",
      options: { min: 0 },
    },
    {
      name: "ค่าเช่ารายเดือน (คำอ่านไทย)",
      field: "monthlyRentTextThai",
      type: "text",
      options: { maxLength: 256 },
    },
    {
      name: "ชำระค่าเช่าภายในวันที่ (ของทุกเดือน)",
      field: "paymentDueDate",
      type: "number",
      options: { max: 31, min: 1 },
    },
    {
      name: "วันที่เริ่มสัญญา",
      field: "contractStartDate",
      type: "date",
    },
    {
      name: "ระยะเวลาสัญญา (ปี)",
      field: "contractDuration",
      type: "number",
      options: { min: 0 },
    },
    {
      name: "ค่าประกันห้อง",
      field: "roomDeposit",
      type: "number",
      options: { min: 0 },
    },
    {
      name: "ค่าประกันห้อง (คำอ่านไทย)",
      field: "roomDepositTextThai",
      type: "text",
      options: { maxLength: 256 },
    },
    {
      name: "ดอกเบี้ยชำระเงินล่าช้า (ร้อยละ/ปี)",
      field: "latePaymentFee",
      type: "number",
      options: { min: 0 },
    },
    {
      name: "ระยะเวลาคืนห้องหลังครบกำหนดสัญญา (วัน)",
      field: "returnRoomPeriod",
      type: "number",
      options: { min: 0 },
    },
    {
      name: "เงื่อนไขเพิ่มเติม",
      field: "additionalCondition",
      type: "list",
    },
  ];

  const handleSaveForm = () => {
    setIsFormDisabled(!isFormDisabled);
  };

  const handlePdfGenerated = (blob: Blob) => {
    console.log('PDF generated successfully:', blob);
    setShowPdfPreview(true);
  };

  const renderField = (field: any, index: number) => {
    const fieldValue = rentalData[field.field as keyof RentalData];

    switch (field.type) {
      case "text":
        return (
          <Input
            key={`${field.field}-${index}`}
            disabled={isFormDisabled}
            required
            type="text"
            name={field.field}
            placeholder={`กรอก${field.name}`}
            value={fieldValue as string || ""}
            maxLength={field.options?.maxLength || 256}
            onChange={(e) =>
              setRentalData({
                ...rentalData,
                [field.field]: e.target.value,
              })
            }
          />
        );

      case "number":
        return (
          <Input
            key={`${field.field}-${index}`}
            disabled={isFormDisabled}
            required
            type="number"
            name={field.field}
            placeholder={`กรอก${field.name}`}
            value={fieldValue as string || ""}
            max={field.options?.max || undefined}
            min={field.options?.min || undefined}
            onChange={(e) =>
              setRentalData({
                ...rentalData,
                [field.field]: e.target.value,
              })
            }
          />
        );

      case "date":
        return (
          <Input
            key={`${field.field}-${index}`}
            disabled={isFormDisabled}
            required
            type="date"
            name={field.field}
            value={fieldValue as string || ""}
            onChange={(e) =>
              setRentalData({
                ...rentalData,
                [field.field]: e.target.value,
              })
            }
          />
        );

      case "object":
        const objectValue = fieldValue as any || {};
        return (
          <div className="flex flex-col gap-2" key={`${field.field}-${index}`}>
            {field.subFields.map((subField: any, subIndex: number) => (
              <Input
                key={`${field.field}.${subField.field}-${subIndex}`}
                disabled={isFormDisabled}
                required
                name={`${field.field}.${subField.field}`}
                placeholder={`กรอก${subField.name}`}
                maxLength={256}
                value={objectValue[subField.field] || ""}
                onChange={(e) =>
                  setRentalData({
                    ...rentalData,
                    [field.field]: {
                      ...objectValue,
                      [subField.field]: e.target.value,
                    },
                  })
                }
              />
            ))}
          </div>
        );

      case "list":
        const listValue = fieldValue as string[] || [""];
        return (
          <div className="flex flex-col gap-2" key={`${field.field}-${index}`}>
            {listValue.map((condition: string, subIndex: number) => (
              <div className="flex flex-row gap-2" key={`${field.field}-${subIndex}`}>
                <Textarea
                  disabled={isFormDisabled}
                  required
                  name={field.field}
                  placeholder={`กรอก${field.name}`}
                  value={condition}
                  maxLength={field.options?.maxLength ?? 4999}
                  minRows={1}
                  onChange={(e) =>
                    setRentalData((prev) => {
                      const prevList = [...(prev[field.field as keyof RentalData] as string[])];
                      prevList[subIndex] = e.target.value;
                      return {
                        ...prev,
                        [field.field]: prevList,
                      };
                    })
                  }
                />
                {!isFormDisabled && (
                  <Button
                    variant="solid"
                    color="primary"
                    className="bg-red-500 hover:bg-red-600 text-white px-3"
                    onClick={() =>
                      setRentalData((prev) => {
                        const updatedList = [...(prev[field.field as keyof RentalData] as string[])];
                        updatedList.splice(subIndex, 1);
                        return { ...prev, [field.field]: updatedList };
                      })
                    }
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>
            ))}
            {!isFormDisabled && (
              <div className="flex items-center mt-2">
                <Button
                  variant="solid"
                  color="primary"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() =>
                    setRentalData((prev) => {
                      const currentList = [...(prev[field.field as keyof RentalData] as string[])];
                      return { ...prev, [field.field]: [...currentList, ""] };
                    })
                  }
                >
                  <Plus size={16} className="mr-1" />
                  เพิ่มเงื่อนไข
                </Button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <HeroUIProvider>
      <App title="สัญญาเช่า" userName="Admin">
        
        {/* Header */}
        <div className="flex flex-row justify-between items-center w-full p-4 mb-4 bg-white shadow-md rounded-lg">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800">สัญญาเช่า</h1>
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
              ระบบจัดการสัญญา
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="solid"
              color="primary"
              className={`${
                isFormDisabled 
                  ? "bg-green-500 hover:bg-green-600" 
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white rounded-lg`}
              onClick={handleSaveForm}
            >
              {isFormDisabled ? (
                <>
                  <Edit size={16} className="mr-1" />
                  แก้ไข
                </>
              ) : (
                <>
                  <Save size={16} className="mr-1" />
                  บันทึก
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Form */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">ข้อมูลสัญญาเช่า</h2>
            <div className="flex flex-col gap-4">
              {formFields.map((field, index) => (
                <div key={index} className="flex flex-col">
                  <label className="text-sm font-medium mb-2 text-gray-700">
                    {field.name}
                  </label>
                  {renderField(field, index)}
                </div>
              ))}
            </div>
          </div>


        {/* Quick Actions */}
        <div className="mt-6 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">การดำเนินการ</h2>
          <div className="flex flex-row gap-4">
            <div className="p-4 border border-gray-200 rounded-lg w-full">
              <h3 className="font-medium text-gray-800 mb-2">บันทึกข้อมูล</h3>
              <p className="text-sm text-gray-600 mb-3">
                บันทึกข้อมูลสัญญาเช่าเพื่อใช้ในการสร้าง PDF
              </p>
              <Button
                variant="solid"
                color="primary"
                className={`${isFormDisabled
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-blue-500 hover:bg-blue-600"
                  } text-white rounded-lg`}
                onClick={handleSaveForm}
              >
              {isFormDisabled ? (
                <>
                  <Edit size={16} className="mr-1" />
                  แก้ไข
                </>
              ) : (
                <>
                  <Save size={16} className="mr-1" />
                  บันทึกข้อมูล
                </>
              )}
              </Button>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg w-full">
              <h3 className="font-medium text-gray-800 mb-2">สร้างสัญญา</h3>
              <p className="text-sm text-gray-600 mb-3">
                สร้างไฟล์ PDF สัญญาเช่าจากข้อมูลที่บันทึก
              </p>
              <ServerPdfGeneratorWrapper rentalData={rentalData} />
            </div>
            
          </div>
        </div>
      </App>
    </HeroUIProvider>
  );
}
