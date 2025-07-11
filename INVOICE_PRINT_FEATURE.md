# Invoice Print Feature

## Overview
The invoice print feature allows users to generate and print PDF invoices for rent bills. This feature is integrated into the rent bill management page.

## Implementation Details

### API Endpoint
- **Route**: `/api/pdf/invoice`
- **Method**: GET
- **Parameters**:
  - `roomId`: The ID of the room
  - `month`: The month (1-12)
  - `year`: The Thai year (e.g., 2567)

### Features
1. **Dynamic Invoice Generation**: Creates invoices based on actual rent, water, and electricity data from the database
2. **Automatic Data Population**: Fills in company information, tenant details, and billing items automatically
3. **PDF Generation**: Uses Puppeteer to generate professional PDF invoices
4. **Thai Language Support**: Fully supports Thai language and Thai Baht text conversion

### Invoice Content
The generated invoice includes:
- Company information (name, address, tax ID, phone, email)
- Customer information (tenant name and address)
- Invoice details (number, date, room number, staff name)
- Billing items:
  - Room rent
  - Water charges (calculated from meter usage difference × rate per unit)
  - Electricity charges (calculated from meter usage difference × rate per unit)
- Summary with total amounts
- Thai Baht text representation of the total

### Calculation Logic
- **Electric Fee**: (Current meter reading - Previous meter reading) × Rate per unit
- **Water Fee**: (Current meter reading - Previous meter reading) × Rate per unit
- **Rent Fee**: Fixed amount from payment plan
- If no previous readings exist, uses the stored fee amount

### Usage
1. Navigate to the rent bill page (`/dashboard/rent-bill`)
2. Select the apartment, month, and year
3. Click the "พิมพ์" (Print) button next to any room that has a tenant
4. The PDF invoice will open in a new tab for printing or download

### Prerequisites
Before printing invoices, ensure:
- **User Profile**: Your real name is set in your user profile
- **Apartment Settings**: Tax ID is configured in the apartment settings
- **Tenant Assignment**: Room has an assigned tenant

### Technical Stack
- **PDF Generation**: Puppeteer
- **Template Engine**: Custom HTML template with CSS styling
- **Thai Baht Text**: thai-baht-text package
- **Database**: Drizzle ORM with PostgreSQL
- **Logo Handling**: Base64 encoded image for PDF compatibility

### Error Handling
- Validates required parameters (roomId, month, year)
- Handles missing room or tenant data
- Provides fallback for rooms without bills
- Graceful error responses with appropriate HTTP status codes
- **User Validation**: Requires user to have a real name in profile
- **Tax ID Validation**: Requires apartment to have a tax ID configured
- **User-Friendly Messages**: Shows Thai language error messages for missing data

### File Structure
```
src/
├── app/
│   └── api/
│       └── pdf/
│           └── invoice/
│               └── route.ts          # Main invoice API endpoint
│           └── test-invoice/
│               └── route.ts          # Test invoice endpoint
├── components/
│   └── PrintInvoiceButton.tsx        # Client component for print button
├── genpdf/
│   └── documentTemplate/
│       └── invoiceTemplate.js        # Invoice HTML template
└── app/
    └── dashboard/
        └── rent-bill/
            └── page.tsx              # Rent bill page with print buttons
```

## Future Enhancements
- Add support for custom logos
- Include additional billing items (furniture, internet, etc.)
- Add invoice numbering system
- Support for multiple invoice formats
- Email integration for sending invoices
- Invoice history and archiving 