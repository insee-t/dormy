"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  Plus,
  Save,
  ArrowLeft
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";

// Simple toast replacement
const toast = {
  success: (message: string) => alert(`✅ ${message}`),
  error: (message: string) => alert(`❌ ${message}`)
};

interface Floor {
  floorNumber: number;
  roomAmount: number;
  rooms?: Room[];
}

interface Room {
  id?: number;
  roomNumber: string;
  floorId?: number;
}

interface PaymentPlan {
  id?: number;
  fee: number;
  lateFee: number;
  waterFeePerMatrix: number;
  electricFeePerMatrix: number;
  roomId?: number;
}

interface CreateRoomsFormProps {
  apartmentId: string;
  apartmentName: string;
  fromPage?: string | null;
}

export default function CreateRoomsForm({ apartmentId, apartmentName, fromPage }: CreateRoomsFormProps) {
  const router = useRouter();
  
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<number[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [floorAmount, setFloorAmount] = useState(0);
  const [allRoomAmount, setAllRoomAmount] = useState(0);
  const [roomAmount, setRoomAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [defaultFee, setDefaultFee] = useState(0);
  const [defaultLateFee, setDefaultLateFee] = useState(0);
  const [defaultWaterFeePerMatrix, setDefaultWaterFeePerMatrix] = useState(0);
  const [defaultElectricFeePerMatrix, setDefaultElectricFeePerMatrix] = useState(0);
  const [floorPaymentPlans, setFloorPaymentPlans] = useState<{ [key: string]: { fee: number; lateFee: number; waterFeePerMatrix: number; electricFeePerMatrix: number } }>({});

  // Redirect if no apartmentId
  useEffect(() => {
    if (!apartmentId) {
      toast.error("ไม่พบข้อมูลหอพัก");
      router.push("/dashboard");
    }
  }, [apartmentId, router]);

  const toggleRowExpansion = (floorNumber: string) => {
    if (expandedRows.includes(floorNumber)) {
      setExpandedRows(expandedRows.filter((id) => id !== floorNumber));
    } else {
      setExpandedRows([...expandedRows, floorNumber]);
    }
  };

  const handleSelectFloor = (floorNumber: number, checked: boolean) => {
    if (checked) {
      setSelectedFloor([...selectedFloor, floorNumber]);
    } else {
      setSelectedFloor(selectedFloor.filter((id) => id !== floorNumber));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFloor(floors.map((floor) => floor.floorNumber));
    } else {
      setSelectedFloor([]);
    }
  };

  const handleFloorAmount = () => {
    const floorAmountDif = floorAmount - floors.length;
    if (floorAmountDif > 0) {
      const newFloors = Array.from({ length: floorAmountDif }, (_, i) => ({
        floorNumber: floors.length + i + 1,
        roomAmount: allRoomAmount,
        rooms: []
      }));
      setFloors((prev) => [...prev, ...newFloors]);
    } else if (floorAmountDif < 0) {
      setFloors(floors.slice(0, floorAmount));
    }
  };

  const handleApplyToAllFloors = () => {
    setFloors((prev) =>
      prev.map((floor) => ({
        ...floor,
        roomAmount: allRoomAmount,
        rooms: []
      }))
    );
  };

  const handleApplyToSelectedFloors = () => {
    setFloors((prev) =>
      prev.map((floor) =>
        selectedFloor.includes(floor.floorNumber)
          ? { ...floor, roomAmount: roomAmount, rooms: [] }
          : floor
      )
    );
  };

  const handleApplyDefaultFeeToAllFloors = () => {
    setFloorPaymentPlans({});
  };

  const handleApplyDefaultFeeToSelectedFloors = () => {
    setFloorPaymentPlans((prev) => {
      const newFees = { ...prev };
      selectedFloor.forEach(floorNumber => {
        delete newFees[floorNumber.toString()];
      });
      return newFees;
    });
  };

  const handleFloorFeeChange = (floorNumber: number, fee: number) => {
    setFloorPaymentPlans((prev) => ({
      ...prev,
      [floorNumber.toString()]: { fee: fee, lateFee: defaultLateFee, waterFeePerMatrix: defaultWaterFeePerMatrix, electricFeePerMatrix: defaultElectricFeePerMatrix },
    }));
  };

  const generateRoomsForFloor = (floor: Floor) => {
    const rooms: Room[] = [];
    for (let i = 1; i <= floor.roomAmount; i++) {
      const roomNumber = `${floor.floorNumber}${i.toString().padStart(2, '0')}`;
      rooms.push({
        roomNumber: roomNumber,
      });
    }
    return rooms;
  };

  const generatePaymentPlansForFloor = (floor: Floor) => {
    const paymentPlans: PaymentPlan[] = [];
    const floorPaymentPlan = floorPaymentPlans[floor.floorNumber.toString()] || { fee: defaultFee, lateFee: defaultLateFee, waterFeePerMatrix: defaultWaterFeePerMatrix, electricFeePerMatrix: defaultElectricFeePerMatrix };
    for (let i = 1; i <= floor.roomAmount; i++) {
      const roomNumber = `${floor.floorNumber}${i.toString().padStart(2, '0')}`;
      const individualPaymentPlan = floorPaymentPlans[`${floor.floorNumber}_${roomNumber}`] || floorPaymentPlan;
      paymentPlans.push({
        fee: individualPaymentPlan.fee,
        lateFee: individualPaymentPlan.lateFee,
        waterFeePerMatrix: individualPaymentPlan.waterFeePerMatrix,
        electricFeePerMatrix: individualPaymentPlan.electricFeePerMatrix,
      });
    }
    return paymentPlans;
  };

  const validateRoomNumbers = () => {
    const allRooms: string[] = [];
    for (const floor of floors) {
      const floorRooms = generateRoomsForFloor(floor);
      for (const room of floorRooms) {
        if (allRooms.includes(room.roomNumber)) {
          return false; // Duplicate room number found
        }
        allRooms.push(room.roomNumber);
      }
    }
    return true;
  };

  const handleSaveFloorsAndRooms = async () => {
    if (!apartmentId) {
      toast.error("ไม่พบข้อมูลหอพัก");
      return;
    }

    if (floors.length === 0) {
      toast.error("กรุณาสร้างชั้นอย่างน้อย 1 ชั้น");
      return;
    }

    if (!validateRoomNumbers()) {
      toast.error("มีหมายเลขห้องซ้ำกัน กรุณาตรวจสอบอีกครั้ง");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/create-floors-rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apartmentId: parseInt(apartmentId),
          floors: floors.map(floor => ({
            floorNumber: floor.floorNumber,
            rooms: generateRoomsForFloor(floor),
            paymentPlans: generatePaymentPlansForFloor(floor)
          }))
        }),
      });

      if (response.ok) {
        toast.success("สร้างชั้นและห้องเรียบร้อยแล้ว");
        router.push("/dashboard");
      } else {
        const error = await response.json();
        toast.error(error.message || "เกิดข้อผิดพลาดในการสร้างชั้นและห้อง");
      }
    } catch (error) {
      console.error("Error saving floors and rooms:", error);
      toast.error("เกิดข้อผิดพลาดในการสร้างชั้นและห้อง");
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-h-screen space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white p-4 rounded-md shadow-md">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <span>สร้างหอพัก</span>
              <span>→</span>
              <span>สร้างชั้นและห้อง</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">สร้างชั้นและห้อง</h1>
            <p className="text-gray-600 mt-1">
              {apartmentName ? `สำหรับหอพัก: ${apartmentName}` : "กำหนดจำนวนชั้นและห้องสำหรับหอพัก"}
              {fromPage === 'meter' && (
                <span className="block text-sm text-blue-600 mt-1">
                  ⚠️ คุณถูกนำมาที่นี่เพราะหอพักนี้ยังไม่มีห้อง กรุณาสร้างห้องก่อนใช้งานฟีเจอร์มิเตอร์
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              กลับไปแดชบอร์ด
            </Button>
            <Button
              onClick={handleSaveFloorsAndRooms}
              disabled={isLoading || floors.length === 0}
              className="bg-[#01bcb4] hover:bg-cyan-600 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "กำลังบันทึก..." : "บันทึกชั้นและห้อง"}
            </Button>
          </div>
        </div>

        {/* Configuration Section */}
        <div className="flex items-center justify-between bg-white p-4 rounded-md shadow-md">
          <div className="flex flex-col gap-5">
            <form
              className="flex flex-row items-center gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                handleFloorAmount();
              }}
            >
              <div className="flex text-nowrap">จำนวนชั้น</div>
              <Input
                id="floorAmount"
                type="number"
                placeholder="ใส่จำนวนชั้น"
                className="w-24"
                value={floorAmount}
                onChange={(e) => setFloorAmount(Number(e.target.value))}
                min="1"
              />
              <Button
                type="submit"
                variant="outline"
                className="bg-[#01bcb4] hover:bg-cyan-600 text-white"
              >
                <ArrowUpRight className="h-4 w-4 mr-2" />
                นำไปใช้
              </Button>
            </form>
            <form
              className="flex items-center gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                handleApplyToAllFloors();
              }}
            >
              <div className="flex text-nowrap">จำนวนห้องต่อชั้น</div>
              <Input
                id="allRoomAmount"
                type="number"
                placeholder="ใส่จำนวนห้อง"
                className="w-24"
                value={allRoomAmount}
                onChange={(e) => setAllRoomAmount(Number(e.target.value))}
                min="1"
              />
              <Button
                type="submit"
                variant="outline"
                className="bg-[#01bcb4] hover:bg-cyan-600 text-white"
              >
                <ArrowUpRight className="h-4 w-4 mr-2" />
                นำไปใช้ทั้งหมด
              </Button>
            </form>
            <form
              className="flex items-center gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                handleApplyDefaultFeeToAllFloors();
              }}
            >
              <div className="flex text-nowrap">ค่าเช่าเริ่มต้น (บาท)</div>
              <Input
                id="defaultFee"
                type="number"
                placeholder="ใส่ค่าเช่า"
                className="w-24"
                value={defaultFee}
                onChange={(e) => setDefaultFee(Number(e.target.value))}
                min="0"
              />
              <Button
                type="submit"
                variant="outline"
                className="bg-[#01bcb4] hover:bg-cyan-600 text-white"
              >
                <ArrowUpRight className="h-4 w-4 mr-2" />
                นำไปใช้ทั้งหมด
              </Button>
            </form>
            <form
              className="flex items-center gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                handleApplyDefaultFeeToAllFloors();
              }}
            >
              <div className="flex text-nowrap">ค่าปรับล่าช้าเริ่มต้น (บาท)</div>
              <Input
                id="defaultLateFee"
                type="number"
                placeholder="ใส่ค่าปรับ"
                className="w-24"
                value={defaultLateFee}
                onChange={(e) => setDefaultLateFee(Number(e.target.value))}
                min="0"
              />
              <Button
                type="submit"
                variant="outline"
                className="bg-[#01bcb4] hover:bg-cyan-600 text-white"
              >
                <ArrowUpRight className="h-4 w-4 mr-2" />
                นำไปใช้ทั้งหมด
              </Button>
            </form>
            <form
              className="flex items-center gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                handleApplyDefaultFeeToAllFloors();
              }}
            >
              <div className="flex text-nowrap">ค่าน้ำต่อหน่วยเริ่มต้น (บาท)</div>
              <Input
                id="defaultWaterFeePerMatrix"
                type="number"
                placeholder="ใส่ค่าน้ำต่อหน่วย"
                className="w-24"
                value={defaultWaterFeePerMatrix}
                onChange={(e) => setDefaultWaterFeePerMatrix(Number(e.target.value))}
                min="0"
              />
              <Button
                type="submit"
                variant="outline"
                className="bg-[#01bcb4] hover:bg-cyan-600 text-white"
              >
                <ArrowUpRight className="h-4 w-4 mr-2" />
                นำไปใช้ทั้งหมด
              </Button>
            </form>
            <form
              className="flex items-center gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                handleApplyDefaultFeeToAllFloors();
              }}
            >
              <div className="flex text-nowrap">ค่าไฟต่อหน่วยเริ่มต้น (บาท)</div>
              <Input
                id="defaultElectricFeePerMatrix"
                type="number"
                placeholder="ใส่ค่าไฟต่อหน่วย"
                className="w-24"
                value={defaultElectricFeePerMatrix}
                onChange={(e) => setDefaultElectricFeePerMatrix(Number(e.target.value))}
                min="0"
              />
              <Button
                type="submit"
                variant="outline"
                className="bg-[#01bcb4] hover:bg-cyan-600 text-white"
              >
                <ArrowUpRight className="h-4 w-4 mr-2" />
                นำไปใช้ทั้งหมด
              </Button>
            </form>
          </div>
        </div>

        {/* Main Content */}
        <Card className="shadow-md bg-white border-none">
          <CardHeader>
            <CardTitle>จัดการชั้นและห้อง</CardTitle>
            <CardDescription>
              กำหนดจำนวนห้องสำหรับแต่ละชั้น และดูรายละเอียดห้องทั้งหมด
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Bulk Actions */}
            {selectedFloor.length > 0 && (
              <div className="flex items-center gap-4 mb-4 p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium">
                  เลือกแล้ว {selectedFloor.length} ชั้น
                </span>

                <form
                  className="flex flex-row items-center gap-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleApplyToSelectedFloors();
                  }}
                >
                  <div className="flex text-nowrap text-sm">
                    เปลี่ยนจำนวนห้องเป็น
                  </div>
                  <Input
                    type="number"
                    placeholder="ใส่จำนวนห้อง"
                    className="w-24"
                    value={roomAmount}
                    onChange={(e) => setRoomAmount(Number(e.target.value))}
                    min="1"
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    className="bg-[#01bcb4] hover:bg-cyan-600 text-white"
                  >
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    นำไปใช้
                  </Button>
                </form>

                <form
                  className="flex flex-row items-center gap-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleApplyDefaultFeeToSelectedFloors();
                  }}
                >
                  <div className="flex text-nowrap text-sm">
                    เปลี่ยนค่าเช่าเป็นค่าเริ่มต้น
                  </div>
                  <Button
                    type="submit"
                    variant="outline"
                    className="bg-[#01bcb4] hover:bg-cyan-600 text-white"
                  >
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    นำไปใช้
                  </Button>
                </form>
              </div>
            )}

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedFloor.length === floors.length && floors.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>ชั้น</TableHead>
                    <TableHead>จำนวนห้อง</TableHead>
                    <TableHead>ค่าเช่า (บาท)</TableHead>
                    <TableHead>ค่าปรับล่าช้า (บาท)</TableHead>
                    <TableHead>ค่าน้ำต่อหน่วย (บาท)</TableHead>
                    <TableHead>ค่าไฟต่อหน่วย (บาท)</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {floors.map((floor) => (
                    <React.Fragment key={floor.floorNumber}>
                      <TableRow className="group">
                        <TableCell>
                          <Checkbox
                            checked={selectedFloor.includes(floor.floorNumber)}
                            onCheckedChange={(checked) =>
                              handleSelectFloor(floor.floorNumber, checked as boolean)
                            }
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {floor.floorNumber}
                        </TableCell>
                        <TableCell className="font-medium">
                          {floor.roomAmount}
                        </TableCell>
                        <TableCell className="font-medium">
                          {floorPaymentPlans[floor.floorNumber.toString()]?.fee || defaultFee}
                        </TableCell>
                        <TableCell className="font-medium">
                          {floorPaymentPlans[floor.floorNumber.toString()]?.lateFee || defaultLateFee}
                        </TableCell>
                        <TableCell className="font-medium">
                          {floorPaymentPlans[floor.floorNumber.toString()]?.waterFeePerMatrix || defaultWaterFeePerMatrix}
                        </TableCell>
                        <TableCell className="font-medium">
                          {floorPaymentPlans[floor.floorNumber.toString()]?.electricFeePerMatrix || defaultElectricFeePerMatrix}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleRowExpansion(floor.floorNumber.toString())}
                            className="flex items-center gap-2"
                          >
                            รายละเอียด
                            {expandedRows.includes(floor.floorNumber.toString()) ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>

                      {/* Expandable floor detail Row */}
                      {expandedRows.includes(floor.floorNumber.toString()) && (
                        <TableRow>
                          <TableCell colSpan={6} className="p-0">
                            <Collapsible open={expandedRows.includes(floor.floorNumber.toString())}>
                              <CollapsibleContent>
                                <div className="p-4 bg-slate-400/10">
                                  <div className="container grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 justify-center">
                                    {generateRoomsForFloor(floor).map((room, index) => {
                                      const paymentPlan = generatePaymentPlansForFloor(floor)[index];
                                      return (
                                        <Card key={index}>
                                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                              ห้อง {room.roomNumber}
                                            </CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            <div className="space-y-2">
                                              <div className="text-xs text-gray-500">
                                                ค่าเช่า (บาท)
                                              </div>
                                              <Input
                                                type="number"
                                                placeholder="ใส่ค่าเช่า"
                                                className="w-full text-sm"
                                                value={paymentPlan.fee}
                                                onChange={(e) => {
                                                  const newFee = Number(e.target.value);
                                                  setFloorPaymentPlans((prev) => ({
                                                    ...prev,
                                                    [`${floor.floorNumber}_${room.roomNumber}`]: { 
                                                      fee: newFee, 
                                                      lateFee: paymentPlan.lateFee,
                                                      waterFeePerMatrix: paymentPlan.waterFeePerMatrix,
                                                      electricFeePerMatrix: paymentPlan.electricFeePerMatrix
                                                    },
                                                  }));
                                                }}
                                                min="0"
                                              />
                                              <div className="text-xs text-gray-500">
                                                ค่าปรับล่าช้า (บาท)
                                              </div>
                                              <Input
                                                type="number"
                                                placeholder="ใส่ค่าปรับ"
                                                className="w-full text-sm"
                                                value={paymentPlan.lateFee}
                                                onChange={(e) => {
                                                  const newLateFee = Number(e.target.value);
                                                  setFloorPaymentPlans((prev) => ({
                                                    ...prev,
                                                    [`${floor.floorNumber}_${room.roomNumber}`]: { 
                                                      fee: paymentPlan.fee, 
                                                      lateFee: newLateFee,
                                                      waterFeePerMatrix: paymentPlan.waterFeePerMatrix,
                                                      electricFeePerMatrix: paymentPlan.electricFeePerMatrix
                                                    },
                                                  }));
                                                }}
                                                min="0"
                                              />
                                              <div className="text-xs text-gray-500">
                                                ค่าน้ำต่อหน่วย (บาท)
                                              </div>
                                              <Input
                                                type="number"
                                                placeholder="ใส่ค่าน้ำต่อหน่วย"
                                                className="w-full text-sm"
                                                value={paymentPlan.waterFeePerMatrix}
                                                onChange={(e) => {
                                                  const newWaterFeePerMatrix = Number(e.target.value);
                                                  setFloorPaymentPlans((prev) => ({
                                                    ...prev,
                                                    [`${floor.floorNumber}_${room.roomNumber}`]: { 
                                                      fee: paymentPlan.fee, 
                                                      lateFee: paymentPlan.lateFee,
                                                      waterFeePerMatrix: newWaterFeePerMatrix,
                                                      electricFeePerMatrix: paymentPlan.electricFeePerMatrix
                                                    },
                                                  }));
                                                }}
                                                min="0"
                                              />
                                              <div className="text-xs text-gray-500">
                                                ค่าไฟต่อหน่วย (บาท)
                                              </div>
                                              <Input
                                                type="number"
                                                placeholder="ใส่ค่าไฟต่อหน่วย"
                                                className="w-full text-sm"
                                                value={paymentPlan.electricFeePerMatrix}
                                                onChange={(e) => {
                                                  const newElectricFeePerMatrix = Number(e.target.value);
                                                  setFloorPaymentPlans((prev) => ({
                                                    ...prev,
                                                    [`${floor.floorNumber}_${room.roomNumber}`]: { 
                                                      fee: paymentPlan.fee, 
                                                      lateFee: paymentPlan.lateFee,
                                                      waterFeePerMatrix: paymentPlan.waterFeePerMatrix,
                                                      electricFeePerMatrix: newElectricFeePerMatrix
                                                    },
                                                  }));
                                                }}
                                                min="0"
                                              />
                                            </div>
                                          </CardContent>
                                        </Card>
                                      );
                                    })}
                                  </div>
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>

            {floors.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                ยังไม่มีชั้น กรุณากำหนดจำนวนชั้นก่อน
              </div>
            )}
          </CardContent>
        </Card>
      </div>
  );
} 