import {
  validateUrl,
  validateEmail,
  validatePhoneNumber,
  validateInternalLink,
  validateExternalLink,
  validateLink,
  sanitizeUrl,
  isLinkSafe,
  extractDomain,
  isTrustedDomain,
  LinkValidationResult,
  EmailValidationResult
} from '../linkValidation';

describe('Link Validation Tests', () => {
  describe('validateUrl', () => {
    it('should validate valid HTTPS URLs', () => {
      const result = validateUrl('https://example.com');
      expect(result.isValid).toBe(true);
      expect(result.type).toBe('external');
      expect(result.protocol).toBe('https:');
      expect(result.domain).toBe('example.com');
    });

    it('should validate valid HTTP URLs', () => {
      const result = validateUrl('http://example.com');
      expect(result.isValid).toBe(true);
      expect(result.type).toBe('external');
      expect(result.protocol).toBe('http:');
    });

    it('should validate URLs without protocol', () => {
      const result = validateUrl('example.com');
      expect(result.isValid).toBe(true);
      expect(result.type).toBe('external');
      expect(result.protocol).toBe('https');
    });

    it('should validate protocol-relative URLs', () => {
      const result = validateUrl('//example.com');
      expect(result.isValid).toBe(true);
      expect(result.type).toBe('external');
      expect(result.protocol).toBe('https');
    });

    it('should validate internal links', () => {
      const result = validateUrl('/dashboard');
      expect(result.isValid).toBe(true);
      expect(result.type).toBe('internal');
      expect(result.path).toBe('/dashboard');
    });

    it('should validate relative internal links', () => {
      const result = validateUrl('./page');
      expect(result.isValid).toBe(true);
      expect(result.type).toBe('internal');
    });

    it('should validate parent directory links', () => {
      const result = validateUrl('../page');
      expect(result.isValid).toBe(true);
      expect(result.type).toBe('internal');
    });

    it('should reject invalid URLs', () => {
      const result = validateUrl('not-a-url');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid URL format');
    });

    it('should reject empty strings', () => {
      const result = validateUrl('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('URL must be a non-empty string');
    });

    it('should reject null/undefined', () => {
      const result = validateUrl(null as any);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('URL must be a non-empty string');
    });

    it('should reject unsupported protocols', () => {
      const result = validateUrl('javascript:alert("xss")');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Unsupported protocol');
    });

    it('should validate URLs with paths and query parameters', () => {
      const result = validateUrl('https://example.com/path?param=value#fragment');
      expect(result.isValid).toBe(true);
      expect(result.path).toBe('/path');
    });
  });

  describe('validateEmail', () => {
    it('should validate valid email addresses', () => {
      const result = validateEmail('test@example.com');
      expect(result.isValid).toBe(true);
      expect(result.localPart).toBe('test');
      expect(result.domain).toBe('example.com');
    });

    it('should validate emails with subdomains', () => {
      const result = validateEmail('user@sub.example.com');
      expect(result.isValid).toBe(true);
      expect(result.domain).toBe('sub.example.com');
    });

    it('should validate emails with special characters', () => {
      const result = validateEmail('user.name+tag@example.com');
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid email formats', () => {
      const result = validateEmail('invalid-email');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });

    it('should reject emails without @ symbol', () => {
      const result = validateEmail('testexample.com');
      expect(result.isValid).toBe(false);
    });

    it('should reject emails with invalid domain', () => {
      const result = validateEmail('test@.com');
      expect(result.isValid).toBe(false);
    });

    it('should reject empty strings', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(false);
    });

    it('should reject emails with too long local part', () => {
      const longLocalPart = 'a'.repeat(65);
      const result = validateEmail(`${longLocalPart}@example.com`);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Local part must be between 1 and 64 characters');
    });

    it('should reject emails with too long domain', () => {
      const longDomain = 'a'.repeat(256);
      const result = validateEmail(`test@${longDomain}.com`);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Domain must be between 1 and 255 characters');
    });
  });

  describe('validatePhoneNumber', () => {
    it('should validate valid phone numbers', () => {
      const result = validatePhoneNumber('1234567890');
      expect(result.isValid).toBe(true);
      expect(result.type).toBe('phone');
      expect(result.protocol).toBe('tel:');
    });

    it('should validate phone numbers with formatting', () => {
      const result = validatePhoneNumber('(123) 456-7890');
      expect(result.isValid).toBe(true);
      expect(result.path).toBe('1234567890');
    });

    it('should validate international phone numbers', () => {
      const result = validatePhoneNumber('+1-234-567-8900');
      expect(result.isValid).toBe(true);
      expect(result.path).toBe('12345678900');
    });

    it('should reject phone numbers that are too short', () => {
      const result = validatePhoneNumber('123456');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Phone number must be between 7 and 15 digits');
    });

    it('should reject phone numbers that are too long', () => {
      const result = validatePhoneNumber('1234567890123456');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Phone number must be between 7 and 15 digits');
    });

    it('should reject empty strings', () => {
      const result = validatePhoneNumber('');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateInternalLink', () => {
    it('should validate absolute internal links', () => {
      const result = validateInternalLink('/dashboard');
      expect(result.isValid).toBe(true);
      expect(result.type).toBe('internal');
      expect(result.path).toBe('/dashboard');
    });

    it('should validate relative internal links', () => {
      const result = validateInternalLink('./page');
      expect(result.isValid).toBe(true);
      expect(result.type).toBe('internal');
    });

    it('should validate parent directory links', () => {
      const result = validateInternalLink('../page');
      expect(result.isValid).toBe(true);
      expect(result.type).toBe('internal');
    });

    it('should reject external URLs', () => {
      const result = validateInternalLink('https://example.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Internal link must start with /, ./ or ../');
    });

    it('should reject invalid path formats', () => {
      const result = validateInternalLink('/path//invalid');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid path format');
    });

    it('should reject empty strings', () => {
      const result = validateInternalLink('');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateExternalLink', () => {
    it('should validate HTTPS URLs', () => {
      const result = validateExternalLink('https://example.com');
      expect(result.isValid).toBe(true);
      expect(result.type).toBe('external');
    });

    it('should validate HTTP URLs', () => {
      const result = validateExternalLink('http://example.com');
      expect(result.isValid).toBe(true);
      expect(result.type).toBe('external');
    });

    it('should reject internal links', () => {
      const result = validateExternalLink('/dashboard');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('External link cannot be a relative path');
    });

    it('should reject invalid URLs', () => {
      const result = validateExternalLink('not-a-url');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateLink', () => {
    it('should validate email links', () => {
      const result = validateLink('mailto:test@example.com');
      expect(result.isValid).toBe(true);
      expect(result.type).toBe('email');
      expect(result.protocol).toBe('mailto:');
    });

    it('should validate phone links', () => {
      const result = validateLink('tel:1234567890');
      expect(result.isValid).toBe(true);
      expect(result.type).toBe('phone');
      expect(result.protocol).toBe('tel:');
    });

    it('should validate internal links', () => {
      const result = validateLink('/dashboard');
      expect(result.isValid).toBe(true);
      expect(result.type).toBe('internal');
    });

    it('should validate external links', () => {
      const result = validateLink('https://example.com');
      expect(result.isValid).toBe(true);
      expect(result.type).toBe('external');
    });

    it('should handle URLs without protocol', () => {
      const result = validateLink('example.com');
      expect(result.isValid).toBe(true);
      expect(result.type).toBe('external');
    });

    it('should reject invalid links', () => {
      const result = validateLink('invalid-link');
      expect(result.isValid).toBe(false);
    });

    it('should reject empty strings', () => {
      const result = validateLink('');
      expect(result.isValid).toBe(false);
    });
  });

  describe('sanitizeUrl', () => {
    it('should return internal links as-is', () => {
      const result = sanitizeUrl('/dashboard');
      expect(result).toBe('/dashboard');
    });

    it('should add https protocol to URLs without protocol', () => {
      const result = sanitizeUrl('example.com');
      expect(result).toBe('https://example.com');
    });

    it('should return valid HTTPS URLs as-is', () => {
      const result = sanitizeUrl('https://example.com');
      expect(result).toBe('https://example.com');
    });

    it('should return valid HTTP URLs as-is', () => {
      const result = sanitizeUrl('http://example.com');
      expect(result).toBe('http://example.com');
    });

    it('should return empty string for invalid URLs', () => {
      const result = sanitizeUrl('invalid-url');
      expect(result).toBe('');
    });

    it('should return empty string for empty input', () => {
      const result = sanitizeUrl('');
      expect(result).toBe('');
    });
  });

  describe('isLinkSafe', () => {
    it('should return true for internal links', () => {
      const result = isLinkSafe('/dashboard');
      expect(result).toBe(true);
    });

    it('should return true for HTTPS links', () => {
      const result = isLinkSafe('https://example.com');
      expect(result).toBe(true);
    });

    it('should return true for email links', () => {
      const result = isLinkSafe('mailto:test@example.com');
      expect(result).toBe(true);
    });

    it('should return true for phone links', () => {
      const result = isLinkSafe('tel:1234567890');
      expect(result).toBe(true);
    });

    it('should return false for HTTP links', () => {
      const result = isLinkSafe('http://example.com');
      expect(result).toBe(false);
    });

    it('should return false for invalid links', () => {
      const result = isLinkSafe('invalid-link');
      expect(result).toBe(false);
    });
  });

  describe('extractDomain', () => {
    it('should extract domain from HTTPS URL', () => {
      const result = extractDomain('https://example.com');
      expect(result).toBe('example.com');
    });

    it('should extract domain from HTTP URL', () => {
      const result = extractDomain('http://example.com');
      expect(result).toBe('example.com');
    });

    it('should extract domain from URL without protocol', () => {
      const result = extractDomain('example.com');
      expect(result).toBe('example.com');
    });

    it('should extract domain from subdomain', () => {
      const result = extractDomain('https://sub.example.com');
      expect(result).toBe('sub.example.com');
    });

    it('should return null for internal links', () => {
      const result = extractDomain('/dashboard');
      expect(result).toBe(null);
    });

    it('should return null for invalid URLs', () => {
      const result = extractDomain('invalid-url');
      expect(result).toBe(null);
    });
  });

  describe('isTrustedDomain', () => {
    const trustedDomains = ['example.com', 'trusted.org'];

    it('should return true for exact trusted domain match', () => {
      const result = isTrustedDomain('https://example.com', trustedDomains);
      expect(result).toBe(true);
    });

    it('should return true for subdomain of trusted domain', () => {
      const result = isTrustedDomain('https://sub.example.com', trustedDomains);
      expect(result).toBe(true);
    });

    it('should return false for untrusted domain', () => {
      const result = isTrustedDomain('https://untrusted.com', trustedDomains);
      expect(result).toBe(false);
    });

    it('should return false for internal links', () => {
      const result = isTrustedDomain('/dashboard', trustedDomains);
      expect(result).toBe(false);
    });

    it('should return false for invalid URLs', () => {
      const result = isTrustedDomain('invalid-url', trustedDomains);
      expect(result).toBe(false);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle very long URLs', () => {
      const longUrl = 'https://example.com/' + 'a'.repeat(1000);
      const result = validateUrl(longUrl);
      expect(result.isValid).toBe(true);
    });

    it('should handle URLs with special characters', () => {
      const result = validateUrl('https://example.com/path with spaces');
      expect(result.isValid).toBe(true);
    });

    it('should handle URLs with unicode characters', () => {
      const result = validateUrl('https://example.com/路径');
      expect(result.isValid).toBe(true);
    });

    it('should handle email addresses with unicode', () => {
      const result = validateEmail('test@exämple.com');
      expect(result.isValid).toBe(true);
    });

    it('should handle phone numbers with various formats', () => {
      const formats = [
        '123-456-7890',
        '(123) 456-7890',
        '123.456.7890',
        '+1 234 567 8900',
        '1234567890'
      ];

      formats.forEach(format => {
        const result = validatePhoneNumber(format);
        expect(result.isValid).toBe(true);
      });
    });
  });
}); 