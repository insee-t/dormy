# Local File Storage Implementation

This document explains the local file storage implementation for receipt uploads in the Dormy application.

## Overview

The application now supports local file storage for receipt uploads, storing files in the `public/uploads/receipts/` directory and metadata in the database.

## Database Schema

### ReceiptTable
- `id`: Primary key (serial)
- `fileName`: Generated unique filename
- `originalName`: Original filename from user
- `filePath`: Path to the stored file
- `fileSize`: File size in bytes
- `mimeType`: MIME type of the file
- `paymentPlanId`: Reference to payment plan
- `userId`: Reference to user who uploaded
- `amount`: Payment amount
- `status`: Receipt status (pending/approved/rejected)
- `createdAt`: Upload timestamp
- `updatedAt`: Last update timestamp

## File Storage Structure

```
public/
  uploads/
    receipts/
      receipt_{userId}_{paymentPlanId}_{timestamp}.{extension}
```

## API Endpoints

### Upload Receipt
- **POST** `/api/tenant/upload-receipt`
- Accepts multipart form data with:
  - `receipt`: File (image or PDF)
  - `paymentPlanId`: Payment plan ID
  - `amount`: Payment amount
- Returns receipt metadata and file path

### Serve Receipt Files
- **GET** `/api/uploads/receipts/[filename]`
- Serves uploaded files with proper content type
- Includes security validation to prevent directory traversal

## Security Features

1. **File Type Validation**: Only allows images (JPEG, PNG, GIF) and PDFs
2. **File Size Limit**: Maximum 10MB per file
3. **Filename Validation**: Prevents directory traversal attacks
4. **Unique Filenames**: Generated using timestamp and user ID to prevent conflicts

## Usage

### Upload a Receipt
```javascript
const formData = new FormData()
formData.append('receipt', file)
formData.append('paymentPlanId', '1')
formData.append('amount', '5000')

const response = await fetch('/api/tenant/upload-receipt', {
  method: 'POST',
  body: formData
})
```

### Display a Receipt
```javascript
// In the review receipt page, receipts are displayed using:
<img src={`/api/uploads/receipts/${receipt.fileName}`} alt="Receipt" />
```

## Testing

Visit `/test-upload` to test the upload functionality with a simple form.

## File Management

- Files are stored locally in the VPS
- No external storage service required
- Files are accessible via the API endpoint
- Consider implementing cleanup for old files if needed

## Considerations for Production

1. **Backup Strategy**: Ensure the uploads directory is included in backups
2. **Disk Space**: Monitor disk usage as files accumulate
3. **File Cleanup**: Consider implementing automatic cleanup of old receipts
4. **CDN**: For high traffic, consider moving to a CDN or cloud storage
5. **Security**: Ensure proper access controls for file serving

## Migration

The receipt table was added via Drizzle migration. Run the following to apply:

```bash
bun run drizzle-kit push
```

## Integration with Review Receipt Page

The review receipt page now shows actual uploaded receipts instead of mock data. Receipts are fetched from the database and displayed with their actual file paths. 