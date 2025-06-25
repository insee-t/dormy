# Stripe Subscription Implementation Guide

This guide explains how to set up and use the Stripe subscription functionality that has been integrated into your Dormy project.

## Features Implemented

- ✅ Subscription creation with Stripe Checkout
- ✅ Email notifications for subscription events
- ✅ Webhook handling for real-time updates
- ✅ Customer billing portal integration
- ✅ Subscription management dashboard
- ✅ Success and cancel pages

## Prerequisites

1. **Stripe Account**: You need a Stripe account with API keys
2. **Email Service**: Gmail account for sending notifications
3. **Environment Variables**: Configure the required environment variables

## Environment Variables Setup

Add the following environment variables to your `.env.local` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_... # Your Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_... # Your webhook endpoint secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000 # Your app's base URL

# Stripe Price IDs (create these in your Stripe dashboard)
PRICE_ID_BASIC=price_... # Price ID for Basic plan
PRICE_ID_PRO=price_... # Price ID for Pro plan

# Email Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password # Gmail app password
```

## Stripe Dashboard Setup

### 1. Create Products and Prices

1. Go to your Stripe Dashboard → Products
2. Create two products:
   - **Basic Plan** (฿5,490/year)
   - **Pro Plan** (฿12,900/year)
3. For each product, create a recurring price:
   - Billing model: Standard pricing
   - Price: 5490 (Basic) or 12900 (Pro)
   - Billing period: Yearly
   - Currency: THB
4. Copy the Price IDs and add them to your environment variables

### 2. Configure Webhooks

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select these events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `invoice.finalized`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `payment_intent.payment_failed`
   - `invoice.upcoming`
4. Copy the webhook signing secret to your environment variables

### 3. Configure Customer Portal

1. Go to Stripe Dashboard → Settings → Customer Portal
2. Enable the portal
3. Configure allowed features:
   - ✅ Cancel subscription
   - ✅ Update payment method
   - ✅ Download invoices
   - ✅ Update billing information

## Email Setup

### Gmail App Password

1. Go to your Google Account settings
2. Enable 2-factor authentication
3. Generate an app password for your application
4. Use this password in the `GMAIL_APP_PASSWORD` environment variable

## Installation

Install the required dependencies:

```bash
npm install stripe nodemailer
npm install --save-dev @types/nodemailer
```

## Usage

### For Users

1. **Subscribe to a Plan**:
   - Navigate to `/dashboard/subscription`
   - Choose between Basic (฿5,490/year) or Pro (฿12,900/year)
   - Click "Subscribe" to be redirected to Stripe Checkout
   - Complete payment to activate subscription

2. **Manage Subscription**:
   - View current subscription status
   - Access billing portal to update payment methods
   - Cancel or modify subscription

3. **Email Notifications**:
   - Receive welcome email upon subscription
   - Get payment confirmation emails
   - Receive payment failure notifications
   - Get renewal reminders

### For Developers

#### API Endpoints

- `POST /api/subscriptions` - Create new subscription
- `GET /api/subscriptions` - Get user's subscriptions
- `GET /api/subscriptions/[customerId]` - Access billing portal
- `POST /api/webhooks/stripe` - Handle Stripe webhooks

#### Components

- `SubscriptionPage` - Main subscription management page
- `SubscriptionSuccessPage` - Success page after payment
- `SubscriptionCancelPage` - Cancel page if payment is cancelled

#### Email Templates

The system sends emails for these events:
- Subscription created
- Payment successful
- Payment failed
- Subscription updated/cancelled
- Upcoming renewal reminder
- Invoice finalized (payment pending)

## Testing

### Test Mode

1. Use Stripe test keys for development
2. Test with these card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - 3D Secure: `4000 0025 0000 3155`

### Webhook Testing

1. Use Stripe CLI for local webhook testing:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

2. Or use ngrok for public webhook testing:
   ```bash
   ngrok http 3000
   ```

## Production Deployment

### Environment Variables

Update your production environment variables:
- Use production Stripe keys
- Set `NEXT_PUBLIC_BASE_URL` to your production domain
- Configure production email settings

### Webhook Configuration

1. Update webhook endpoint URL to your production domain
2. Verify webhook signature in production
3. Monitor webhook delivery in Stripe dashboard

### Security Considerations

1. Never expose Stripe secret keys in client-side code
2. Always verify webhook signatures
3. Implement proper error handling
4. Use HTTPS in production
5. Monitor failed payments and subscription status

## Troubleshooting

### Common Issues

1. **Webhook not receiving events**:
   - Check webhook endpoint URL
   - Verify webhook secret
   - Check server logs for errors

2. **Email not sending**:
   - Verify Gmail credentials
   - Check app password configuration
   - Review email service logs

3. **Subscription creation fails**:
   - Verify Stripe API keys
   - Check price IDs configuration
   - Review server logs

### Debug Mode

Enable debug logging by adding to your environment:
```env
DEBUG=stripe:*
```

## Support

For issues related to:
- **Stripe Integration**: Check Stripe documentation and logs
- **Email Service**: Verify Gmail configuration
- **Application Logic**: Review server logs and error messages

## Files Created/Modified

### New Files
- `src/lib/emailService.ts` - Email notification service
- `src/app/api/subscriptions/route.ts` - Subscription API
- `src/app/api/subscriptions/[customerId]/route.ts` - Billing portal API
- `src/app/api/webhooks/stripe/route.ts` - Webhook handler
- `src/app/dashboard/subscription/page.tsx` - Main subscription page
- `src/app/dashboard/subscription/success/page.tsx` - Success page
- `src/app/dashboard/subscription/cancel/page.tsx` - Cancel page

### Modified Files
- `src/lib/stripe.js` - Updated Stripe configuration

This implementation provides a complete subscription system with proper error handling, email notifications, and user management capabilities. 