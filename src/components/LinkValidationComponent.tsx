"use client"

import React, { useState } from 'react';
import { validateLink, sanitizeUrl, isLinkSafe } from '@/utils/linkValidation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, ExternalLink, Mail, Phone, Shield } from 'lucide-react';

interface ValidationResult {
  isValid: boolean;
  error?: string;
  type?: string;
  protocol?: string;
  domain?: string;
  path?: string;
  localPart?: string;
  sanitizedUrl?: string;
  isSafe?: boolean;
}

export default function LinkValidationComponent() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleValidation = async () => {
    if (!url.trim()) {
      setResult({
        isValid: false,
        error: 'Please enter a URL to validate'
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const validationResult = validateLink(url);
      const sanitizedUrl = sanitizeUrl(url);
      const isSafe = isLinkSafe(url);

      setResult({
        ...validationResult,
        sanitizedUrl: sanitizedUrl !== url ? sanitizedUrl : undefined,
        isSafe
      });
    } catch (err) {
      setError('An error occurred during validation');
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    // Clear results when input changes
    if (result) {
      setResult(null);
      setError(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleValidation();
    }
  };

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'external':
        return <ExternalLink className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'phone':
        return <Phone className="h-4 w-4" />;
      case 'internal':
        return <Shield className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'external':
        return 'bg-blue-100 text-blue-800';
      case 'email':
        return 'bg-green-100 text-green-800';
      case 'phone':
        return 'bg-purple-100 text-purple-800';
      case 'internal':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Link Validation Tool
          </CardTitle>
          <CardDescription>
            Validate URLs, email links, phone numbers, and internal links. Check for security and format compliance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="url-input" className="text-sm font-medium">
              Link URL
            </label>
            <div className="flex gap-2">
              <Input
                id="url-input"
                type="text"
                placeholder="Enter URL, email, phone, or internal link..."
                value={url}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button 
                onClick={handleValidation} 
                disabled={isLoading}
                className="min-w-[100px]"
              >
                {isLoading ? 'Validating...' : 'Validate'}
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {result.isValid ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className={`font-medium ${result.isValid ? 'text-green-600' : 'text-red-600'}`}>
                  {result.isValid ? 'Valid' : 'Invalid'}
                </span>
                {result.type && (
                  <Badge className={getTypeColor(result.type)}>
                    <div className="flex items-center gap-1">
                      {getTypeIcon(result.type)}
                      {result.type}
                    </div>
                  </Badge>
                )}
              </div>

              {result.error && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{result.error}</AlertDescription>
                </Alert>
              )}

              {result.isValid && (
                <div className="space-y-3">
                  {result.protocol && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Protocol:</span>
                      <span className="font-mono text-sm">{result.protocol}</span>
                    </div>
                  )}

                  {result.domain && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Domain:</span>
                      <span className="font-mono text-sm">{result.domain}</span>
                    </div>
                  )}

                  {result.path && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Path:</span>
                      <span className="font-mono text-sm">{result.path}</span>
                    </div>
                  )}

                  {result.localPart && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Local Part:</span>
                      <span className="font-mono text-sm">{result.localPart}</span>
                    </div>
                  )}

                  {(result as any).sanitizedUrl && (
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Sanitized URL:</span>
                      <span className="font-mono text-sm">{(result as any).sanitizedUrl}</span>
                    </div>
                  )}

                  {(result as any).isSafe === false && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Security Warning:</strong> This link is not secure. Consider using HTTPS for external links.
                      </AlertDescription>
                    </Alert>
                  )}

                  {(result as any).isSafe === true && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        <strong>Security Status:</strong> This link is safe to use.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Supported Formats:</h4>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• <strong>URLs:</strong> https://example.com, http://example.com, example.com</li>
              <li>• <strong>Email:</strong> mailto:user@example.com</li>
              <li>• <strong>Phone:</strong> tel:+1234567890</li>
              <li>• <strong>Internal:</strong> /dashboard, ./page, ../page</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 