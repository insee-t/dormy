import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LinkValidationComponent from '../LinkValidationComponent';

// Mock the link validation utility
jest.mock('../../utils/linkValidation', () => ({
  validateLink: jest.fn(),
  sanitizeUrl: jest.fn(),
  isLinkSafe: jest.fn(),
}));

import { validateLink, sanitizeUrl, isLinkSafe } from '../../utils/linkValidation';

const mockValidateLink = validateLink as jest.MockedFunction<typeof validateLink>;
const mockSanitizeUrl = sanitizeUrl as jest.MockedFunction<typeof sanitizeUrl>;
const mockIsLinkSafe = isLinkSafe as jest.MockedFunction<typeof isLinkSafe>;

describe('LinkValidationComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component with initial state', () => {
    render(<LinkValidationComponent />);
    
    expect(screen.getByLabelText(/link url/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /validate/i })).toBeInTheDocument();
    expect(screen.getByText(/link validation tool/i)).toBeInTheDocument();
  });

  it('should validate a valid HTTPS URL', async () => {
    const user = userEvent.setup();
    
    mockValidateLink.mockReturnValue({
      isValid: true,
      type: 'external',
      protocol: 'https:',
      domain: 'example.com',
      path: '/'
    });
    
    mockIsLinkSafe.mockReturnValue(true);
    mockSanitizeUrl.mockReturnValue('https://example.com');

    render(<LinkValidationComponent />);
    
    const input = screen.getByLabelText(/link url/i);
    const button = screen.getByRole('button', { name: /validate/i });
    
    await user.type(input, 'https://example.com');
    await user.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/valid/i)).toBeInTheDocument();
      expect(screen.getByText(/external/i)).toBeInTheDocument();
      expect(screen.getByText(/https/i)).toBeInTheDocument();
    });
  });

  it('should show error for invalid URL', async () => {
    const user = userEvent.setup();
    
    mockValidateLink.mockReturnValue({
      isValid: false,
      error: 'Invalid URL format',
      type: 'unknown'
    });

    render(<LinkValidationComponent />);
    
    const input = screen.getByLabelText(/link url/i);
    const button = screen.getByRole('button', { name: /validate/i });
    
    await user.type(input, 'invalid-url');
    await user.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid/i)).toBeInTheDocument();
      expect(screen.getByText(/invalid url format/i)).toBeInTheDocument();
    });
  });

  it('should validate email links', async () => {
    const user = userEvent.setup();
    
    mockValidateLink.mockReturnValue({
      isValid: true,
      type: 'email',
      protocol: 'mailto:',
      localPart: 'test',
      domain: 'example.com'
    });
    
    mockIsLinkSafe.mockReturnValue(true);
    mockSanitizeUrl.mockReturnValue('mailto:test@example.com');

    render(<LinkValidationComponent />);
    
    const input = screen.getByLabelText(/link url/i);
    const button = screen.getByRole('button', { name: /validate/i });
    
    await user.type(input, 'mailto:test@example.com');
    await user.click(button);
    
    await waitFor(() => {
      // Use a more specific selector to avoid conflicts
      const validText = screen.getByText((content, element) => {
        return element?.tagName.toLowerCase() === 'span' && 
               content.toLowerCase().includes('valid') &&
               element?.className.includes('text-green-600');
      });
      expect(validText).toBeInTheDocument();
      expect(screen.getByText(/email/i)).toBeInTheDocument();
    });
  });

  it('should validate internal links', async () => {
    const user = userEvent.setup();
    
    mockValidateLink.mockReturnValue({
      isValid: true,
      type: 'internal',
      path: '/dashboard'
    });
    
    mockIsLinkSafe.mockReturnValue(true);
    mockSanitizeUrl.mockReturnValue('/dashboard');

    render(<LinkValidationComponent />);
    
    const input = screen.getByLabelText(/link url/i);
    const button = screen.getByRole('button', { name: /validate/i });
    
    await user.type(input, '/dashboard');
    await user.click(button);
    
    await waitFor(() => {
      // Use a more specific selector to avoid conflicts
      const validText = screen.getByText((content, element) => {
        return element?.tagName.toLowerCase() === 'span' && 
               content.toLowerCase().includes('valid') &&
               element?.className.includes('text-green-600');
      });
      expect(validText).toBeInTheDocument();
      expect(screen.getByText(/internal/i)).toBeInTheDocument();
    });
  });

  it('should show security warning for unsafe links', async () => {
    const user = userEvent.setup();
    
    mockValidateLink.mockReturnValue({
      isValid: true,
      type: 'external',
      protocol: 'http:',
      domain: 'example.com'
    });
    
    mockIsLinkSafe.mockReturnValue(false);
    mockSanitizeUrl.mockReturnValue('http://example.com');

    render(<LinkValidationComponent />);
    
    const input = screen.getByLabelText(/link url/i);
    const button = screen.getByRole('button', { name: /validate/i });
    
    await user.type(input, 'http://example.com');
    await user.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/security warning/i)).toBeInTheDocument();
      expect(screen.getByText(/not secure/i)).toBeInTheDocument();
    });
  });

  it('should clear results when input is cleared', async () => {
    const user = userEvent.setup();
    
    mockValidateLink.mockReturnValue({
      isValid: true,
      type: 'external',
      protocol: 'https:',
      domain: 'example.com'
    });

    render(<LinkValidationComponent />);
    
    const input = screen.getByLabelText(/link url/i);
    const button = screen.getByRole('button', { name: /validate/i });
    
    await user.type(input, 'https://example.com');
    await user.click(button);
    
    await waitFor(() => {
      const validText = screen.getByText((content, element) => {
        return element?.tagName.toLowerCase() === 'span' && 
               content.toLowerCase().includes('valid') &&
               element?.className.includes('text-green-600');
      });
      expect(validText).toBeInTheDocument();
    });
    
    await user.clear(input);
    
    await waitFor(() => {
      expect(screen.queryByText((content, element) => {
        return element?.tagName.toLowerCase() === 'span' && 
               content.toLowerCase().includes('valid') &&
               element?.className.includes('text-green-600');
      })).not.toBeInTheDocument();
    });
  });

  it('should handle empty input validation', async () => {
    const user = userEvent.setup();
    
    mockValidateLink.mockReturnValue({
      isValid: false,
      error: 'Link must be a non-empty string',
      type: 'unknown'
    });

    render(<LinkValidationComponent />);
    
    const button = screen.getByRole('button', { name: /validate/i });
    await user.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid/i)).toBeInTheDocument();
      expect(screen.getByText(/please enter a url to validate/i)).toBeInTheDocument();
    });
  });

  it('should show sanitized URL when available', async () => {
    const user = userEvent.setup();
    
    mockValidateLink.mockReturnValue({
      isValid: true,
      type: 'external',
      protocol: 'https:',
      domain: 'example.com'
    });
    
    mockSanitizeUrl.mockReturnValue('https://sanitized-example.com');

    render(<LinkValidationComponent />);
    
    const input = screen.getByLabelText(/link url/i);
    const button = screen.getByRole('button', { name: /validate/i });
    
    await user.type(input, 'example.com');
    await user.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/sanitized url/i)).toBeInTheDocument();
      expect(screen.getByText(/https:\/\/sanitized-example\.com/i)).toBeInTheDocument();
    });
  });

  it('should handle validation errors gracefully', async () => {
    const user = userEvent.setup();
    
    mockValidateLink.mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    render(<LinkValidationComponent />);
    
    const input = screen.getByLabelText(/link url/i);
    const button = screen.getByRole('button', { name: /validate/i });
    
    await user.type(input, 'https://example.com');
    await user.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
    });
  });
}); 