# Tenant Bills Feature

This feature allows tenants to view their rent bills and make payments through PromptPay QR codes or bank transfers.

## Features

### 1. Payment Method Detection
- Automatically detects if the apartment has a PromptPay or bank account associated
- Shows appropriate payment method based on the bank account type

### 2. PromptPay QR Code Generation
- Uses the `promptpay-qr` package to generate proper PromptPay payloads
- Uses the `qrcode` package to convert payloads to QR code images
- Generates data URLs that can be directly used in image tags
- Supports dynamic amount and phone number

### 3. Bank Transfer Information
- Displays bank account details for manual transfers
- Shows account name, number, and bank provider

### 4. Receipt Upload
- Two-step process: payment → receipt upload
- Supports image and PDF files
- File size validation (max 10MB)

## File Structure

```
src/app/tenant/(authenticated)/bills/
├── page.tsx                    # Main bills page
└── ...

src/app/api/
├── auth/me/route.ts           # Get current user
├── tenant/
│   ├── payment-plan/[id]/route.ts  # Get tenant payment plan
│   └── upload-receipt/route.ts     # Handle receipt uploads
└── apartments/[id]/bank-account/route.ts  # Get apartment bank account

src/app/test-qr/
└── page.tsx                   # QR code testing page
```

## API Endpoints

### GET /api/auth/me
Returns the current authenticated user.

### GET /api/tenant/payment-plan/[id]
Returns the payment plan for a specific tenant with room and apartment details.

### GET /api/apartments/[id]/bank-account
Returns the bank account associated with an apartment.

### POST /api/tenant/upload-receipt
Handles receipt file uploads with validation.

## Usage

1. **Access the bills page**: Navigate to `/tenant/bills` from the tenant dashboard
2. **View payment information**: See rent amount and apartment details
3. **Choose payment method**:
   - If PromptPay: QR code will be generated automatically
   - If bank account: Bank details will be displayed
4. **Make payment**: Use the provided QR code or bank details
5. **Upload receipt**: Click "อัปโหลดใบเสร็จ" to upload payment proof
6. **Confirm**: Submit the receipt for verification

## QR Code Generation

The system uses a two-step process for QR code generation:

1. **PromptPay Payload Generation**: Uses the `promptpay-qr` package to generate proper EMV QR Code format for Thai PromptPay
2. **QR Code Image Generation**: Uses the `qrcode` package to convert the payload into a visual QR code image

This approach ensures:
- Accurate PromptPay format compliance
- Proper phone number formatting and validation
- Support for dynamic amounts
- High-quality QR code images that can be scanned by banking apps

## Testing

Visit `/test-qr` to test QR code generation with custom phone numbers and amounts.

## Dependencies

- `promptpay-qr`: Thai PromptPay payload generation
- `qrcode`: QR code image generation
- `@types/qrcode`: TypeScript types for QR code library
- `bun`: Package manager (instead of npm)

## Package Management

This project uses Bun as the package manager:

```bash
# Install dependencies
bun install

# Add new packages
bun add package-name

# Remove packages
bun remove package-name

# Run development server
bun run dev
```

## Future Enhancements

1. **File Storage**: Integrate with cloud storage (AWS S3, Cloudinary)
2. **Payment Verification**: Automate payment verification with bank APIs
3. **Payment History**: Track payment history and status
4. **Notifications**: Send payment confirmations and reminders
5. **Multiple Payment Methods**: Support additional payment gateways

## Security Considerations

- All API endpoints require authentication
- File uploads are validated for type and size
- User can only access their own payment data
- Bank account information is protected through proper authorization

## Error Handling

- Graceful handling of missing bank accounts
- QR code generation fallbacks
- User-friendly error messages in Thai
- Loading states for better UX 