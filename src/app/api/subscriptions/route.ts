import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getCurrentUser } from "@/auth/nextjs/currentUser";

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser({ withFullUser: true });
    
    if (!currentUser) {
      return NextResponse.json({ error: "โปรดลงชื่อเข้าใช้งานก่อน" }, { status: 401 });
    }

    const { packagePlan } = await req.json();

    if (!packagePlan) {
      return NextResponse.json({ error: "Package not found" }, { status: 400 });
    }

    let price_id: string;

    switch (packagePlan) {
      case "Basic":
        price_id = process.env.PRICE_ID_BASIC!;
        break;

      case "Pro":
        price_id = process.env.PRICE_ID_PRO!;
        break;

      default:
        return NextResponse.json({ error: "Package not found" }, { status: 400 });
    }

    // Create or retrieve Stripe customer
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: currentUser.email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: currentUser.email,
        name: currentUser.name,
        metadata: {
          userId: currentUser.id,
        },
      });
    }

    // Get base URL with fallback
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   process.env.VERCEL_URL || 
                   `http://${req.headers.get('host')}` || 
                   'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: "subscription",
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/dashboard/subscription/cancel`,
      metadata: {
        userId: currentUser.id,
        packagePlan,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Subscription creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser({ withFullUser: true });
    
    if (!currentUser) {
      return NextResponse.json({ error: "โปรดลงชื่อเข้าใช้งานก่อน" }, { status: 401 });
    }

    // Get customer's subscriptions
    const customers = await stripe.customers.list({
      email: currentUser.email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return NextResponse.json({ subscriptions: [] });
    }

    const customer = customers.data[0];
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'all',
      expand: ['data.default_payment_method'],
    });

    return NextResponse.json({ subscriptions: subscriptions.data });
  } catch (error) {
    console.error("Subscription fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 