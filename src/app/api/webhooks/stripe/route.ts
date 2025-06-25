import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { sendEmailByEvent } from "@/lib/emailService";
import Stripe from "stripe";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event;

  try {
    if (endpointSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } else {
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    // Event when subscription start
    case "customer.subscription.created": {
      const subscription = event.data.object as Stripe.Subscription;
      const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
      
      if (customer.email) {
        await sendEmailByEvent(`${event.type}`, {
          email: customer.email,
          name: customer.name || "Customer",
          planType: subscription.metadata.packagePlan || "Unknown",
          amount: (subscription.items.data[0].price.unit_amount! / 100).toFixed(2),
          currency: "THB",
        });
      }
      break;
    }

    // When the invoice is locked and ready for payment (1-2 days before charge).
    case "invoice.finalized": {
      const finalized = event.data.object as Stripe.Invoice;
      const customer = await stripe.customers.retrieve(finalized.customer as string) as Stripe.Customer;

      // Skip if this is the first invoice for a new subscription
      if (finalized.billing_reason === "subscription_create") {
        console.log("Skipping: First invoice of subscription");
        break;
      }

      const subscriptionId = (finalized as any).subscription;
      if (!subscriptionId) {
        console.log("Skipping: Not a subscription invoice");
        break;
      }

      // Fetch the subscription to check its status
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      if (subscription.status !== "canceled" && customer.email) {
        await sendEmailByEvent(`${event.type}`, {
          email: customer.email,
          name: customer.name || "Customer",
          planType: subscription.metadata.packagePlan || "Unknown",
          amount: (finalized.total / 100).toFixed(2),
          currency: "THB",
          last4: (finalized as any).last_payment_error?.payment_method?.card?.last4 || "XXXX",
        });
        console.log("Invoice finalized - charge tomorrow", finalized.id);
      }
      break;
    }

    // Event when the payment is successfully (every subscription interval)
    case "invoice.paid": {
      const invoicePaid = event.data.object as Stripe.Invoice;
      const customer = await stripe.customers.retrieve(invoicePaid.customer as string) as Stripe.Customer;

      // Fetch the subscription to check its status
      const subscriptionId = (invoicePaid as any).subscription;
      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        if (subscription.status !== "canceled" && customer.email) {
          await sendEmailByEvent(`${event.type}`, {
            email: customer.email,
            name: customer.name || "Customer",
            planType: subscription.metadata.packagePlan || "Unknown",
            amount: (invoicePaid.amount_paid / 100).toFixed(2),
            currency: "THB",
          });
          console.log("invoice paid!!");
        }
      }
      break;
    }

    // Event when the payment is failed (Initial)
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const customer = await stripe.customers.retrieve(paymentIntent.customer as string) as Stripe.Customer;
      
      if (customer.email) {
        await sendEmailByEvent(`${event.type}`, {
          email: customer.email,
          name: customer.name || "Customer",
          planType: "Unknown", // This event doesn't have subscription info
          amount: (paymentIntent.amount / 100).toFixed(2),
          currency: "THB",
          last4: paymentIntent.last_payment_error?.payment_method?.card?.last4 || "",
        });
        console.log("Initial payment failed:", paymentIntent.id);
      }
      break;
    }

    // Event when the recurring payment is failed
    case "invoice.payment_failed": {
      const invoiceFailed = event.data.object as Stripe.Invoice;
      const customer = await stripe.customers.retrieve(invoiceFailed.customer as string) as Stripe.Customer;
      
      if (customer.email) {
        await sendEmailByEvent(`${event.type}`, {
          email: customer.email,
          name: customer.name || "Customer",
          planType: "Unknown", // This event doesn't have subscription info
          amount: (invoiceFailed.amount_paid / 100).toFixed(2),
          currency: "THB",
        });
        console.log("Invoice payment failed.");
      }
      break;
    }

    // Event when A plan is upgraded or downgraded
    case "customer.subscription.updated": {
      const updSubscription = event.data.object as Stripe.Subscription;
      const customer = await stripe.customers.retrieve(updSubscription.customer as string) as Stripe.Customer;

      if (customer.email) {
        if (!updSubscription.cancel_at_period_end) {
          await sendEmailByEvent(`${event.type}`, {
            email: customer.email,
            name: customer.name || "Customer",
            planType: updSubscription.metadata.packagePlan || "Unknown",
            amount: (updSubscription.items.data[0].price.unit_amount! / 100).toFixed(2),
            currency: "THB",
          });
          console.log("Subscription updated");
        } else {
          // This is the cancel event!
          await sendEmailByEvent("customer.subscription.deleted", {
            email: customer.email,
            name: customer.name || "Customer",
            planType: updSubscription.metadata.packagePlan || "Unknown",
            amount: (updSubscription.items.data[0].price.unit_amount! / 100).toFixed(2),
            currency: "THB",
          });
          console.log("Subscription cancelled");
        }
      }
      break;
    }

    // Event when A plan is going to expire in 3 day
    case "invoice.upcoming": {
      const upcoming = event.data.object as Stripe.Invoice;
      const customer = await stripe.customers.retrieve(upcoming.customer as string) as Stripe.Customer;
      
      if (customer.email) {
        await sendEmailByEvent(`${event.type}`, {
          email: customer.email,
          name: customer.name || "Customer",
          planType: "Unknown", // This event doesn't have subscription info
          amount: ((upcoming as any).amount / 100).toFixed(2),
          currency: "THB",
        });
        console.log("upcoming invoice reminder");
      }
      break;
    }

    // Unhandled event type
    default:
      console.log(`Unhandled event type ${event.type}.`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return NextResponse.json({ received: true });
} 