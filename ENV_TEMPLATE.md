# Environment Variables Template

Copy these variables to your `.env.local` file and fill in the actual values:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Base URL (optional - will auto-detect if not set)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Stripe Price IDs (create these in your Stripe dashboard)
PRICE_ID_BASIC=price_your_basic_plan_price_id_here
PRICE_ID_PRO=price_your_pro_plan_price_id_here

# Email Configuration (for subscription notifications)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password_here

# Database (if not already configured)
DATABASE_URL=your_database_url_here

# Auth (if not already configured)
AUTH_SECRET=your_auth_secret_here
```

## Quick Setup Steps:

1. **Create `.env.local` file** in your project root
2. **Copy the template above** and replace the placeholder values
3. **For Stripe keys**: Get them from your Stripe Dashboard → Developers → API keys
4. **For Price IDs**: Create products in Stripe Dashboard → Products
5. **For Gmail**: Enable 2FA and generate an app password

The subscription system will now work with proper URL handling and fallbacks! 