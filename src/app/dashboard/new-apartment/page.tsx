import { getCurrentUser } from "@/auth/nextjs/currentUser";
import { db } from "@/drizzle/db";
import { ApartmentTable } from "@/drizzle/schema";
import { redirect } from "next/navigation";
import App from "@/components/Sidebar/App";
import { revalidatePath } from "next/cache";

async function createApartment(formData: FormData) {
  "use server"
  
  const currentUser = await getCurrentUser({ withFullUser: true, redirectIfNotFound: true });
  
  const apartmentName = formData.get("apartment_name") as string;
  const apartmentAddress = formData.get("apartment_address") as string;
  const phoneNumber = formData.get("phone_number") as string;
  const emailAddress = formData.get("email_address") as string;
  const businessType = formData.get("business_type") as "personal" | "business";
  const billDate = formData.get("bill_date") as string;
  const paymentDueDate = formData.get("payment_due_date") as string;

  // Validate required fields
  if (!apartmentName || !apartmentAddress || !phoneNumber || !businessType || !billDate || !paymentDueDate) {
    throw new Error("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
  }

  // Parse dates
  const billDateObj = new Date();
  billDateObj.setDate(parseInt(billDate));
  
  const paymentDueDateObj = new Date();
  paymentDueDateObj.setDate(parseInt(paymentDueDate));

  let redirectPath: string | null = null;
  let newApartmentId: number | null = null;

  try {
    const [newApartment] = await db.insert(ApartmentTable).values({
      name: apartmentName,
      address: apartmentAddress,
      phone: phoneNumber,
      email: emailAddress || null,
      businessType: businessType,
      billDate: billDateObj,
      paymentDate: paymentDueDateObj,
      userId: currentUser.id,
    }).returning({ id: ApartmentTable.id });

    newApartmentId = newApartment.id;
    redirectPath = `/dashboard/create-rooms?apartmentId=${newApartmentId}`;
    
  } catch (error) {
    console.error("Error creating apartment:", error);
    redirectPath = "/dashboard";
    throw new Error("เกิดข้อผิดพลาดในการสร้างหอพัก");
  } finally {
    if (redirectPath) {
      redirect(redirectPath);
    }
  }
}

export default async function NewApartmentPage() {
  const currentUser = await getCurrentUser({ withFullUser: true, redirectIfNotFound: true });

  return (
    <App title="สร้างหอพักใหม่" userName={currentUser.name}>
      <div className="bg-white shadow-md rounded-2xl p-8 h-fit">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">สร้างหอพักใหม่</h1>
          
          <form action={createApartment} className="space-y-6">
            <div>
              <label htmlFor="apartment_name" className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อหอพัก <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="apartment_name"
                name="apartment_name"
                required
                className="placeholder-slate-500 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="กรอกชื่อหอพัก"
              />
            </div>

            <div>
              <label htmlFor="apartment_address" className="block text-sm font-medium text-gray-700 mb-2">
                ที่อยู่หอพัก <span className="text-red-500">*</span>
              </label>
              <textarea
                id="apartment_address"
                name="apartment_address"
                required
                rows={3}
                className="placeholder-slate-500 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="กรอกที่อยู่หอพัก"
              />
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
                เบอร์โทรศัพท์ <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                required
                className="placeholder-slate-500 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0812345678"
              />
            </div>

            <div>
              <label htmlFor="email_address" className="block text-sm font-medium text-gray-700 mb-2">
                อีเมล
              </label>
              <input
                type="email"
                id="email_address"
                name="email_address"
                className="placeholder-slate-500 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label htmlFor="business_type" className="block text-sm font-medium text-gray-700 mb-2">
                ประเภทธุรกิจ <span className="text-red-500">*</span>
              </label>
              <select
                id="business_type"
                name="business_type"
                required
                className="placeholder-slate-500 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">เลือกประเภทธุรกิจ</option>
                <option value="personal">บุคคลธรรมดา</option>
                <option value="business">บริษัท</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="bill_date" className="block text-sm font-medium text-gray-700 mb-2">
                  วันที่ทำบิล <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="bill_date"
                  name="bill_date"
                  required
                  min="1"
                  max="31"
                  className="placeholder-slate-500 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1-31"
                />
              </div>
              <div>
                <label htmlFor="payment_due_date" className="block text-sm font-medium text-gray-700 mb-2">
                  วันครบกำหนดชำระ <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="payment_due_date"
                  name="payment_due_date"
                  required
                  min="1"
                  max="31"
                  className="placeholder-slate-500 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1-31"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <a
                href="/dashboard"
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                ยกเลิก
              </a>
              <button
                type="submit"
                className="px-6 py-2 bg-[#018c98] text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                สร้างหอพัก
              </button>
            </div>
          </form>
        </div>
      </div>
    </App>
  );
}
