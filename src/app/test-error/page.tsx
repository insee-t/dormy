"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Bug, 
  Zap, 
  XCircle,
  ArrowRight,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export default function TestErrorPage() {
  const [errorType, setErrorType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const triggerError = (type: string) => {
    setErrorType(type);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      
      switch (type) {
        case 'runtime':
          throw new Error('This is a simulated runtime error for testing purposes');
        case 'api':
          throw new Error('API Error: Failed to fetch data from server');
        case 'validation':
          throw new Error('Validation Error: Invalid input data provided');
        case 'auth':
          throw new Error('Authentication Error: User session expired');
        case 'network':
          throw new Error('Network Error: Unable to connect to server');
        default:
          throw new Error('Unknown error occurred');
      }
    }, 1000);
  };

  const errorTypes = [
    {
      type: 'runtime',
      title: 'Runtime Error',
      description: 'Simulate a JavaScript runtime error',
      color: 'bg-red-100 text-red-800',
      icon: <Bug className="h-4 w-4" />
    },
    {
      type: 'api',
      title: 'API Error',
      description: 'Simulate a server API error',
      color: 'bg-orange-100 text-orange-800',
      icon: <Zap className="h-4 w-4" />
    },
    {
      type: 'validation',
      title: 'Validation Error',
      description: 'Simulate a data validation error',
      color: 'bg-yellow-100 text-yellow-800',
      icon: <XCircle className="h-4 w-4" />
    },
    {
      type: 'auth',
      title: 'Authentication Error',
      description: 'Simulate an authentication failure',
      color: 'bg-purple-100 text-purple-800',
      icon: <AlertTriangle className="h-4 w-4" />
    },
    {
      type: 'network',
      title: 'Network Error',
      description: 'Simulate a network connectivity error',
      color: 'bg-blue-100 text-blue-800',
      icon: <RefreshCw className="h-4 w-4" />
    }
  ];

  const testScenarios = [
    {
      title: '404 Page Test',
      description: 'Test the custom 404 error page',
      href: '/test-404',
      color: 'bg-green-100 text-green-800'
    },
    {
      title: 'Link Validation Test',
      description: 'Test the link validation functionality',
      href: '/test-link-validation',
      color: 'bg-indigo-100 text-indigo-800'
    },
    {
      title: 'QR Code Test',
      description: 'Test QR code generation',
      href: '/test-qr',
      color: 'bg-pink-100 text-pink-800'
    },
    {
      title: 'Receipt Management Test',
      description: 'Test receipt management features',
      href: '/test-receipt-management',
      color: 'bg-teal-100 text-teal-800'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Error Handling Test
          </h1>
          <p className="text-lg text-gray-600">
            Test different types of error handling and error pages in the application.
          </p>
        </div>

        <Alert className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Warning:</strong> This page allows you to test error handling by triggering 
            different types of errors. Use with caution as some errors may cause the page to crash.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6">
          {/* Error Types */}
          <Card>
            <CardHeader>
              <CardTitle>Test Error Types</CardTitle>
              <CardDescription>
                Click on any button below to trigger a specific type of error and test the error handling.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {errorTypes.map((error) => (
                  <Button
                    key={error.type}
                    variant="outline"
                    onClick={() => triggerError(error.type)}
                    disabled={isLoading}
                    className="h-auto p-4 flex flex-col items-start gap-2"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div className={`p-2 rounded-lg ${error.color}`}>
                        {error.icon}
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{error.title}</div>
                        <div className="text-xs text-gray-500">{error.description}</div>
                      </div>
                    </div>
                    {isLoading && errorType === error.type && (
                      <div className="flex items-center gap-2 text-xs text-blue-600">
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        Triggering error...
                      </div>
                    )}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Test Scenarios */}
          <Card>
            <CardHeader>
              <CardTitle>Other Test Scenarios</CardTitle>
              <CardDescription>
                Test other functionality and error handling features.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testScenarios.map((scenario, index) => (
                  <Link key={index} href={scenario.href}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${scenario.color}`}>
                            <ExternalLink className="h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{scenario.title}</h3>
                            <p className="text-sm text-gray-600">{scenario.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Error Handling Features */}
          <Card>
            <CardHeader>
              <CardTitle>Error Handling Features</CardTitle>
              <CardDescription>
                The application includes comprehensive error handling with the following features:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">404 Error Page</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Custom 404 page for missing routes</li>
                      <li>• Search functionality</li>
                      <li>• Quick navigation links</li>
                      <li>• Popular pages listing</li>
                      <li>• Contact support options</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Global Error Page</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Handles unexpected errors</li>
                      <li>• Error details and ID</li>
                      <li>• Troubleshooting steps</li>
                      <li>• Reset functionality</li>
                      <li>• Support contact information</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Error Types Handled</h4>
                    <div className="space-y-2">
                      {errorTypes.map((error) => (
                        <div key={error.type} className="flex items-center gap-2">
                          <Badge className={error.color}>
                            {error.icon}
                            {error.title}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">User Experience</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Clear error messages</li>
                      <li>• Helpful navigation options</li>
                      <li>• Professional design</li>
                      <li>• Mobile responsive</li>
                      <li>• Accessibility compliant</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="text-center">
            <Link href="/">
              <Button className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500">
          <p className="text-sm">
            This test page helps you verify that error handling works correctly across the application.
          </p>
          <p className="text-xs mt-2">
            Error handling is crucial for providing a good user experience and maintaining system reliability.
          </p>
        </div>
      </div>
    </div>
  );
} 