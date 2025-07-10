import { getCurrentUser } from "@/auth/nextjs/currentUser"
import { db } from "@/drizzle/db"
import { UserTable, PaymentPlanTable, RentTable, ApartmentTable, RoomTable, FloorTable, ReceiptTable } from "@/drizzle/schema"
import { eq, and, isNull, isNotNull } from "drizzle-orm"
import ReviewReceiptClient from "@/components/ReviewReceiptClient"
import App from "@/components/Sidebar/App";

async function getPaymentStatements(userId: string) {
  try {
    // Get payment plans for the current user with their associated data
    const paymentPlans = await db.query.PaymentPlanTable.findMany({
      where: eq(PaymentPlanTable.userId, userId),
      with: {
        room: {
          with: {
            floor: {
              with: {
                apartment: true
              }
            }
          }
        },
        tenant: true,
        rentBills: {
          orderBy: (table, { desc }) => desc(table.createdAt),
          limit: 1
        },
        receipts: {
          orderBy: (table, { desc }) => desc(table.createdAt),
          limit: 1
        }
      }
    })

    // Transform the data to match the expected format
    const statements = paymentPlans.map((plan) => {
      const latestRent = plan.rentBills[0]
      const latestReceipt = plan.receipts[0]
      
      return {
        id: `PS${plan.id.toString().padStart(3, '0')}`,
        tenantName: plan.tenant?.name || "Unknown",
        apartmentUnit: `${plan.room.floor.apartment.name}-${plan.room.roomNumber}`,
        amount: plan.fee,
        dueDate: plan.room.floor.apartment.paymentDate.toISOString().split('T')[0],
        paidDate: latestRent?.paid ? latestRent.createdAt.toISOString().split('T')[0] : null,
        status: latestRent?.paid ? "paid" : (latestRent ? "pending" : "overdue") as "paid" | "pending" | "overdue",
        paymentMethod: latestRent?.paid ? "Bank Transfer" : null,
        lateFee: latestRent?.late ? 50 : 0,
        bankingStatement: latestReceipt ? {
          image: `/api/uploads/receipts/${latestReceipt.fileName}`,
          bankName: "Receipt Upload",
          transactionId: `RCP${latestReceipt.id.toString().padStart(3, '0')}`,
          timestamp: latestReceipt.createdAt.toISOString().replace('T', ' ').substr(0, 19),
          receiptId: latestReceipt.id
        } : null,
      }
    })

    return statements
  } catch (error) {
    console.error("Error fetching payment statements:", error)
    return []
  }
}

export default async function ReviewReceiptPage() {
  const currentUser = await getCurrentUser({ withFullUser: true, redirectIfNotFound: true })
  
  // Fetch payment statements from database for the current user
  const paymentStatements = await getPaymentStatements(currentUser.id)

  return <App title="ตรวจสอบใบเสร็จ" userName={currentUser.name}>
    <ReviewReceiptClient paymentStatements={paymentStatements} />
  </App>
}
