/**
 * Link Validation Utility
 * Comprehensive link validation functions for various use cases
 */

export interface LinkValidationResult {
  isValid: boolean;
  error?: string;
  type?: 'url' | 'email' | 'internal' | 'external' | 'phone' | 'unknown';
  protocol?: string;
  domain?: string;
  path?: string;
  localPart?: string;
}

export interface EmailValidationResult {
  isValid: boolean;
  error?: string;
  localPart?: string;
  domain?: string;
}

/**
 * Validates if a string is a valid URL
 */
export function validateUrl(url: string): LinkValidationResult {
  if (!url || typeof url !== 'string') {
    return {
      isValid: false,
      error: 'URL must be a non-empty string',
      type: 'unknown'
    };
  }

  try {
    // Handle protocol-relative URLs (must be checked before relative URLs)
    if (url.startsWith('//')) {
      const urlWithProtocol = `https:${url}`;
      const parsed = new URL(urlWithProtocol);
      return {
        isValid: true,
        type: 'external',
        protocol: 'https',
        domain: parsed.hostname,
        path: parsed.pathname
      };
    }

    // Handle relative URLs
    if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
      return {
        isValid: true,
        type: 'internal',
        path: url
      };
    }

    // Check for unsupported protocols before parsing
    if (url.match(/^[a-zA-Z]+:/)) {
      const protocol = url.split(':')[0] + ':';
      if (!['http:', 'https:', 'ftp:', 'mailto:', 'tel:'].includes(protocol)) {
        return {
          isValid: false,
          error: 'Unsupported protocol',
          type: 'unknown'
        };
      }
    }

    // Handle URLs with protocol first
    if (url.match(/^[a-zA-Z]+:\/\//)) {
      const parsed = new URL(url);
      
      // Validate hostname for non-special protocols
      if (!['mailto:', 'tel:'].includes(parsed.protocol) && (!parsed.hostname || parsed.hostname.length === 0)) {
        return {
          isValid: false,
          error: 'Invalid hostname',
          type: 'unknown'
        };
      }

      return {
        isValid: true,
        type: parsed.protocol === 'mailto:' ? 'email' : 
              parsed.protocol === 'tel:' ? 'phone' : 'external',
        protocol: parsed.protocol,
        domain: parsed.hostname,
        path: parsed.pathname
      };
    }

    // Handle URLs without protocol - but be more strict about what constitutes a valid domain
    if (url.match(/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9](\.[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])*\.[a-zA-Z]{2,}$/)) {
      const urlWithProtocol = `https://${url}`;
      const parsed = new URL(urlWithProtocol);
      return {
        isValid: true,
        type: 'external',
        protocol: 'https',
        domain: parsed.hostname,
        path: parsed.pathname
      };
    }

    // If we get here, it's not a valid URL format
    return {
      isValid: false,
      error: 'Invalid URL format',
      type: 'unknown'
    };
  } catch (error) {
    return {
      isValid: false,
      error: 'Invalid URL format',
      type: 'unknown'
    };
  }
}

/**
 * Validates email addresses
 */
export function validateEmail(email: string): EmailValidationResult {
  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      error: 'Email must be a non-empty string'
    };
  }

  // Basic email regex pattern with unicode support
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9\u00C0-\u017F.-]+\.[a-zA-Z\u00C0-\u017F]{2,}$/;
  
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Invalid email format'
    };
  }

  const [localPart, domain] = email.split('@');
  
  // Additional validation
  if (localPart.length === 0 || localPart.length > 64) {
    return {
      isValid: false,
      error: 'Local part must be between 1 and 64 characters'
    };
  }

  if (domain.length === 0 || domain.length > 255) {
    return {
      isValid: false,
      error: 'Domain must be between 1 and 255 characters'
    };
  }

  // Check for valid domain format with unicode support
  const domainRegex = /^[a-zA-Z0-9\u00C0-\u017F.-]+\.[a-zA-Z\u00C0-\u017F]{2,}$/;
  if (!domainRegex.test(domain)) {
    return {
      isValid: false,
      error: 'Invalid domain format'
    };
  }

  return {
    isValid: true,
    localPart,
    domain
  };
}

/**
 * Validates phone numbers
 */
export function validatePhoneNumber(phone: string): LinkValidationResult {
  if (!phone || typeof phone !== 'string') {
    return {
      isValid: false,
      error: 'Phone number must be a non-empty string',
      type: 'phone'
    };
  }

  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check if it's a valid phone number (basic validation)
  if (cleanPhone.length < 7 || cleanPhone.length > 15) {
    return {
      isValid: false,
      error: 'Phone number must be between 7 and 15 digits',
      type: 'phone'
    };
  }

  return {
    isValid: true,
    type: 'phone',
    protocol: 'tel:',
    path: cleanPhone
  };
}

/**
 * Validates internal links (relative paths)
 */
export function validateInternalLink(link: string): LinkValidationResult {
  if (!link || typeof link !== 'string') {
    return {
      isValid: false,
      error: 'Internal link must be a non-empty string',
      type: 'internal'
    };
  }

  // Internal links should start with /, ./ or ../
  if (!link.startsWith('/') && !link.startsWith('./') && !link.startsWith('../')) {
    return {
      isValid: false,
      error: 'Internal link must start with /, ./ or ../',
      type: 'internal'
    };
  }

  // Check for invalid characters in path
  if (link.includes('//') && !link.startsWith('//')) {
    return {
      isValid: false,
      error: 'Invalid path format',
      type: 'internal'
    };
  }

  return {
    isValid: true,
    type: 'internal',
    path: link
  };
}

/**
 * Validates external links (absolute URLs)
 */
export function validateExternalLink(link: string): LinkValidationResult {
  if (!link || typeof link !== 'string') {
    return {
      isValid: false,
      error: 'External link must be a non-empty string',
      type: 'external'
    };
  }

  const result = validateUrl(link);
  
  if (!result.isValid) {
    return result;
  }

  // External links should not be internal
  if (result.type === 'internal') {
    return {
      isValid: false,
      error: 'External link cannot be a relative path',
      type: 'external'
    };
  }

  return result;
}

/**
 * Comprehensive link validation that determines the type and validates accordingly
 */
export function validateLink(link: string): LinkValidationResult {
  if (!link || typeof link !== 'string') {
    return {
      isValid: false,
      error: 'Link must be a non-empty string',
      type: 'unknown'
    };
  }

  // Check for email links
  if (link.startsWith('mailto:')) {
    const email = link.replace('mailto:', '');
    const emailResult = validateEmail(email);
    return {
      isValid: emailResult.isValid,
      error: emailResult.error,
      type: 'email',
      protocol: 'mailto:',
      localPart: emailResult.localPart,
      domain: emailResult.domain
    };
  }

  // Check for phone links
  if (link.startsWith('tel:')) {
    const phone = link.replace('tel:', '');
    return validatePhoneNumber(phone);
  }

  // Check for internal links
  if (link.startsWith('/') || link.startsWith('./') || link.startsWith('../')) {
    return validateInternalLink(link);
  }

  // Check for external links
  if (link.match(/^[a-zA-Z]+:\/\//) || link.match(/^\/\//)) {
    return validateExternalLink(link);
  }

  // If no protocol, assume it's an external link
  return validateExternalLink(link);
}

/**
 * Sanitizes a URL for safe use
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  try {
    const result = validateUrl(url);
    if (!result.isValid) {
      return '';
    }

    // For internal links, return as is
    if (result.type === 'internal') {
      return url;
    }

    // For external links, ensure proper protocol
    if (result.protocol && ['http:', 'https:'].includes(result.protocol)) {
      return url;
    }

    // Add https protocol if missing
    if (!url.match(/^[a-zA-Z]+:\/\//)) {
      return `https://${url}`;
    }

    return url;
  } catch {
    return '';
  }
}

/**
 * Checks if a link is safe (uses HTTPS or is internal)
 */
export function isLinkSafe(link: string): boolean {
  const result = validateLink(link);
  
  if (!result.isValid) {
    return false;
  }

  // Internal links are always safe
  if (result.type === 'internal') {
    return true;
  }

  // External links should use HTTPS
  if (result.type === 'external' && result.protocol === 'https:') {
    return true;
  }

  // Email and phone links are safe
  if (result.type === 'email' || result.type === 'phone') {
    return true;
  }

  return false;
}

/**
 * Extracts domain from a URL
 */
export function extractDomain(url: string): string | null {
  try {
    const result = validateUrl(url);
    if (!result.isValid || !result.domain) {
      return null;
    }
    return result.domain;
  } catch {
    return null;
  }
}

/**
 * Checks if a URL is from a trusted domain
 */
export function isTrustedDomain(url: string, trustedDomains: string[]): boolean {
  const domain = extractDomain(url);
  if (!domain) {
    return false;
  }

  return trustedDomains.some(trustedDomain => {
    return domain === trustedDomain || domain.endsWith(`.${trustedDomain}`);
  });
} 