"use client"

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Home, 
  RefreshCw, 
  AlertTriangle, 
  Bug,
  Mail,
  Phone
} from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                  <Bug className="w-12 h-12 text-red-600" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Something Went Wrong
              </h1>
              
              <p className="text-xl text-gray-600 mb-6">
                We're sorry, but something unexpected happened. Our team has been notified and is working to fix the issue.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button 
                  onClick={reset}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
                
                <Link href="/">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Go Home
                  </Button>
                </Link>
              </div>
            </div>

            {/* Error Details */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Error Information
                </CardTitle>
                <CardDescription>
                  Technical details for debugging purposes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Error Message:</label>
                    <p className="text-sm text-gray-600 mt-1 p-3 bg-gray-50 rounded-md font-mono">
                      {error.message || 'Unknown error occurred'}
                    </p>
                  </div>
                  
                  {error.digest && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Error ID:</label>
                      <p className="text-sm text-gray-600 mt-1 p-3 bg-gray-50 rounded-md font-mono">
                        {error.digest}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Timestamp:</label>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date().toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>What You Can Do</CardTitle>
                <CardDescription>
                  Try these steps to resolve the issue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Refresh the Page</h4>
                      <p className="text-sm text-gray-600">Click the "Try Again" button above to reload the page.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Clear Browser Cache</h4>
                      <p className="text-sm text-gray-600">Clear your browser's cache and cookies, then try again.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-600 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Try a Different Browser</h4>
                      <p className="text-sm text-gray-600">Switch to a different browser to see if the issue persists.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-orange-600 font-bold text-sm">4</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Contact Support</h4>
                      <p className="text-sm text-gray-600">If the problem continues, contact our technical support team.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <div className="text-center">
              <Alert className="max-w-2xl mx-auto">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Need Immediate Help?</strong> Contact our support team at{' '}
                  <a href="mailto:support@mydormy.com" className="text-blue-600 hover:underline">
                    support@mydormy.com
                  </a>{' '}
                  or call us at{' '}
                  <a href="tel:+66123456789" className="text-blue-600 hover:underline">
                    +66 123 456 789
                  </a>
                  {error.digest && (
                    <span> (Reference Error ID: {error.digest})</span>
                  )}
                </AlertDescription>
              </Alert>
            </div>

            {/* Footer */}
            <div className="mt-12 text-center text-gray-500">
              <p className="text-sm">
                Error occurred • MyDormy Management System
              </p>
              <p className="text-xs mt-2">
                If you believe this is a system error, please report it with the Error ID above.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
} 