import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getCurrentUser } from "@/auth/nextjs/currentUser";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {
    const currentUser = await getCurrentUser({ withFullUser: true });
    
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { customerId } = await params;

    // Verify the customer belongs to the current user
    const customers = await stripe.customers.list({
      email: currentUser.email,
      limit: 1,
    });

    if (customers.data.length === 0 || customers.data[0].id !== customerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get base URL with fallback
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   process.env.VERCEL_URL || 
                   `http://${req.headers.get('host')}` || 
                   'http://localhost:3000';

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${baseUrl}/dashboard/subscription`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Billing portal error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 