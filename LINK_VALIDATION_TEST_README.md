# Link Validation Test Suite

This comprehensive link validation test suite provides robust validation for various types of links including URLs, email addresses, phone numbers, and internal paths. It includes both utility functions and React components with full test coverage.

## Features

### 🔗 Link Types Supported
- **External URLs**: HTTPS, HTTP, FTP
- **Email Links**: mailto: protocol
- **Phone Links**: tel: protocol  
- **Internal Links**: Relative paths, absolute paths
- **Protocol-relative URLs**: //example.com

### 🛡️ Security Features
- Protocol validation (blocks dangerous protocols like javascript:)
- HTTPS enforcement for external links
- Domain extraction and validation
- URL sanitization
- Trusted domain checking

### 📊 Validation Capabilities
- Format validation
- Length validation
- Character validation
- Protocol validation
- Domain validation
- Path validation

## File Structure

```
src/
├── utils/
│   ├── linkValidation.ts              # Core validation utilities
│   └── __tests__/
│       └── linkValidation.test.ts     # Unit tests for utilities
├── components/
│   ├── LinkValidationComponent.tsx    # React component
│   └── __tests__/
│       └── LinkValidationComponent.test.tsx  # Component tests
└── app/
    └── test-link-validation/
        └── page.tsx                   # Demo page
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Run tests:
```bash
npm test
```

3. Run tests with coverage:
```bash
npm run test:coverage
```

4. Run tests in watch mode:
```bash
npm run test:watch
```

## Usage

### Utility Functions

```typescript
import { 
  validateLink, 
  validateUrl, 
  validateEmail, 
  validatePhoneNumber,
  sanitizeUrl,
  isLinkSafe 
} from '@/utils/linkValidation';

// Validate any type of link
const result = validateLink('https://example.com');
console.log(result);
// {
//   isValid: true,
//   type: 'external',
//   protocol: 'https:',
//   domain: 'example.com',
//   path: '/'
// }

// Validate specific types
const emailResult = validateEmail('user@example.com');
const phoneResult = validatePhoneNumber('+1234567890');
const urlResult = validateUrl('https://example.com');

// Check if link is safe
const isSafe = isLinkSafe('https://example.com'); // true
const isUnsafe = isLinkSafe('http://example.com'); // false

// Sanitize URLs
const sanitized = sanitizeUrl('example.com'); // 'https://example.com'
```

### React Component

```tsx
import LinkValidationComponent from '@/components/LinkValidationComponent';

function MyPage() {
  return (
    <div>
      <h1>Link Validator</h1>
      <LinkValidationComponent />
    </div>
  );
}
```

## API Reference

### `validateLink(link: string): LinkValidationResult`

Comprehensive link validation that automatically detects and validates the link type.

**Parameters:**
- `link`: The link string to validate

**Returns:**
```typescript
interface LinkValidationResult {
  isValid: boolean;
  error?: string;
  type?: 'url' | 'email' | 'internal' | 'external' | 'phone' | 'unknown';
  protocol?: string;
  domain?: string;
  path?: string;
  localPart?: string;
}
```

### `validateUrl(url: string): LinkValidationResult`

Validates URLs with protocol checking and domain validation.

### `validateEmail(email: string): EmailValidationResult`

Validates email addresses with format and length checking.

### `validatePhoneNumber(phone: string): LinkValidationResult`

Validates phone numbers and strips formatting.

### `validateInternalLink(link: string): LinkValidationResult`

Validates internal/relative links.

### `validateExternalLink(link: string): LinkValidationResult`

Validates external/absolute URLs.

### `sanitizeUrl(url: string): string`

Sanitizes URLs by adding protocols and removing dangerous content.

### `isLinkSafe(link: string): boolean`

Checks if a link is safe (HTTPS or internal).

### `extractDomain(url: string): string | null`

Extracts the domain from a URL.

### `isTrustedDomain(url: string, trustedDomains: string[]): boolean`

Checks if a URL is from a trusted domain.

## Test Coverage

The test suite covers:

### Unit Tests
- ✅ URL validation (HTTPS, HTTP, relative, protocol-relative)
- ✅ Email validation (format, length, domain)
- ✅ Phone number validation (various formats)
- ✅ Internal link validation
- ✅ External link validation
- ✅ Security checks
- ✅ Edge cases and error handling
- ✅ Unicode and special characters
- ✅ Very long URLs and inputs

### Component Tests
- ✅ Component rendering
- ✅ User interactions
- ✅ Validation results display
- ✅ Error handling
- ✅ Loading states
- ✅ Input clearing
- ✅ Security warnings

### Test Examples

```typescript
// Valid URLs
'https://example.com'
'http://example.com'
'example.com'
'//example.com'

// Valid Emails
'mailto:user@example.com'
'user.name+tag@example.com'
'test@sub.example.com'

// Valid Phone Numbers
'tel:+1234567890'
'(123) 456-7890'
'123-456-7890'

// Valid Internal Links
'/dashboard'
'./page'
'../parent/page'

// Invalid Examples
'not-a-url'
'javascript:alert("xss")'
'mailto:invalid-email'
'tel:123'
```

## Demo Page

Visit `/test-link-validation` to see the component in action with:
- Interactive validation tool
- Real-time feedback
- Security warnings
- Example valid/invalid links
- Comprehensive documentation

## Security Considerations

1. **Protocol Validation**: Blocks dangerous protocols like `javascript:`, `data:`, `vbscript:`
2. **HTTPS Enforcement**: Warns about HTTP links for security
3. **Input Sanitization**: Cleans and validates all inputs
4. **Domain Validation**: Validates domain formats and lengths
5. **Trusted Domain Checking**: Allows whitelisting of trusted domains

## Contributing

1. Add new test cases to the appropriate test file
2. Ensure all tests pass: `npm test`
3. Maintain test coverage above 90%
4. Follow the existing code style and patterns

## License

This test suite is part of the Dormy project and follows the same licensing terms. 