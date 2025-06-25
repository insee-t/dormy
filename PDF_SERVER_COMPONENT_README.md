# PDF Generation with Server Components

This implementation shows how to convert your Express.js PDF generation to use Next.js server components. The solution provides multiple approaches for generating PDFs using Puppeteer.

## Implementation Overview

### 1. API Route Approach (`/api/pdf/contract/route.ts`)
- **Best for**: Direct API calls from client-side JavaScript
- **Features**: Error handling, proper HTTP responses
- **Usage**: Send POST request with rental data JSON

```typescript
// Example API call
const response = await fetch('/api/pdf/contract', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(rentalData)
});

if (response.ok) {
  const blob = await response.blob();
  // Handle PDF blob
}
```

### 2. Server Action Approach (`/lib/pdf-generator.ts`)
- **Best for**: Client components that need to generate PDFs
- **Features**: Type-safe, reusable server actions
- **Usage**: Import and call from client components

```typescript
import { generateRentalContractPDFAsBlob } from '@/lib/pdf-generator';

// In client component
const pdfBlob = await generateRentalContractPDFAsBlob(rentalData);
```

### 3. Client Component (`/components/PdfGenerator.tsx`)
- **Best for**: Interactive PDF generation with preview/download options
- **Features**: Loading states, error handling, user-friendly interface
- **Usage**: Pass rental data as props

```tsx
<PdfGenerator 
  rentalData={rentalData}
  onPdfGenerated={(blob) => console.log('PDF ready:', blob)}
/>
```

### 4. Server Component (`/components/ServerPdfGenerator.tsx`)
- **Best for**: Server-side rendering with form-based downloads
- **Features**: Server-side processing, form actions
- **Usage**: Pass rental data as props

```tsx
<ServerPdfGenerator rentalData={rentalData} />
```

## Key Differences from Express.js Implementation

### Authentication
- **Express**: Used `clerkMiddleware()` and custom `attachUserId` middleware
- **Next.js**: No authentication required (can be added as needed)

### Response Handling
- **Express**: Used `res.send()` and `res.setHeader()`
- **Next.js**: Uses `NextResponse` with proper headers

### Error Handling
- **Express**: Used try-catch with `res.status().send()`
- **Next.js**: Uses `NextResponse.json()` with status codes

### File Structure
- **Express**: Single route file with middleware
- **Next.js**: Separated concerns into API routes, server actions, and components

## Setup Requirements

1. **Install Dependencies**:
```bash
bun add puppeteer
bun add -d @types/puppeteer
```

2. **TypeScript Configuration**:
Ensure your `tsconfig.json` includes proper path mappings:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Usage Examples

### Basic API Usage
```typescript
// Client-side fetch
const generatePDF = async (data: RentalData) => {
  const response = await fetch('/api/pdf/contract', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (response.ok) {
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    window.open(url);
  }
};
```

### Server Action Usage
```typescript
// In client component
'use client';
import { generateRentalContractPDFAsBlob } from '@/lib/pdf-generator';

const MyComponent = () => {
  const handleGenerate = async () => {
    const blob = await generateRentalContractPDFAsBlob(rentalData);
    // Handle blob
  };
  
  return <button onClick={handleGenerate}>Generate PDF</button>;
};
```

### Component Usage
```tsx
// Using client component
<PdfGenerator 
  rentalData={rentalData}
  onPdfGenerated={(blob) => {
    // Handle generated PDF
  }}
/>

// Using server component
<ServerPdfGenerator rentalData={rentalData} />
```

## Benefits of Server Component Approach

1. **Better Performance**: Server-side processing reduces client load
2. **Type Safety**: Full TypeScript support with proper interfaces
3. **Reusability**: Server actions can be used across multiple components
4. **Security**: Validation happens on the server
5. **SEO Friendly**: Server components can be pre-rendered
6. **Error Handling**: Centralized error handling with proper HTTP status codes

## Migration Steps

1. **Convert Template**: Update `rentalContractTemplate.js` to TypeScript
2. **Create API Route**: Implement `/api/pdf/contract/route.ts`
3. **Add Server Actions**: Create `/lib/pdf-generator.ts`
4. **Build Components**: Create reusable PDF generation components
5. **Update Client Code**: Replace Express.js calls with new implementations

## Testing

Visit `/pdf-example` to see all implementation approaches in action with sample data.

## Troubleshooting

### Common Issues

1. **Puppeteer Installation**: Ensure Puppeteer is properly installed with Bun
2. **Type Issues**: Make sure `@types/puppeteer` is installed for TypeScript support
3. **Memory Issues**: Puppeteer can be memory-intensive; consider implementing cleanup
4. **Font Loading**: Ensure Thai fonts are properly loaded in the template

### Performance Considerations

1. **Browser Pooling**: Consider implementing browser instance pooling for high-traffic scenarios
2. **Caching**: Cache generated PDFs when possible
3. **Async Processing**: For large PDFs, consider background job processing
4. **Memory Management**: Always close browser instances in finally blocks

## Security Notes

1. **Input Validation**: Always validate rental data before processing
2. **Authentication**: Add authentication if needed for your use case
3. **Rate Limiting**: Consider implementing rate limiting for PDF generation
4. **File Cleanup**: Ensure temporary files are properly cleaned up

## Adding Authentication (Optional)

If you need authentication, you can add it to the API route:

```typescript
import { auth } from '@your-auth-library/server';

export async function POST(request: NextRequest) {
  // Add your authentication logic here
  const user = await auth(request);
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Rest of the PDF generation logic
}
``` 