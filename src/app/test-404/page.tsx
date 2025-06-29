"use client"

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, ExternalLink, ArrowRight } from 'lucide-react';

export default function Test404Page() {
  const testUrls = [
    '/non-existent-page',
    '/dashboard/non-existent-feature',
    '/tenant/non-existent-portal',
    '/api/non-existent-endpoint',
    '/random/very/long/non/existent/path',
    '/page-with-special-chars-@#$%^&*()',
    '/page-with-unicode-测试-ページ',
    '/page-with-spaces and special characters',
  ];

  const trigger404 = (url: string) => {
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            404 Page Test
          </h1>
          <p className="text-lg text-gray-600">
            Test the custom 404 page functionality by navigating to non-existent URLs.
          </p>
        </div>

        <Alert className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Note:</strong> This page allows you to test the custom 404 error page. 
            Clicking on any of the test links below will trigger the 404 page.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6">
          {/* Test URLs Section */}
          <Card>
            <CardHeader>
              <CardTitle>Test 404 Triggers</CardTitle>
              <CardDescription>
                Click on any of these links to test the 404 page functionality.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testUrls.map((url, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => trigger404(url)}
                    className="justify-start text-left h-auto p-4"
                  >
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{url}</div>
                        <div className="text-xs text-gray-500">Click to test 404</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Manual Navigation */}
          <Card>
            <CardHeader>
              <CardTitle>Manual URL Testing</CardTitle>
              <CardDescription>
                Enter a custom URL to test the 404 page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter URL (e.g., /test-page)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const target = e.target as HTMLInputElement;
                      if (target.value) {
                        trigger404(target.value);
                      }
                    }
                  }}
                />
                <Button
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    if (input.value) {
                      trigger404(input.value);
                    }
                  }}
                >
                  Test 404
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Features Overview */}
          <Card>
            <CardHeader>
              <CardTitle>404 Page Features</CardTitle>
              <CardDescription>
                The custom 404 page includes the following helpful features:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">Navigation Options</span>
                  </div>
                  <ul className="text-sm text-gray-600 ml-4 space-y-1">
                    <li>• Go Back button</li>
                    <li>• Refresh Page button</li>
                    <li>• Go Home button</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Quick Links</span>
                  </div>
                  <ul className="text-sm text-gray-600 ml-4 space-y-1">
                    <li>• Dashboard access</li>
                    <li>• Tenant Portal</li>
                    <li>• Subscription management</li>
                    <li>• Contact support</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="font-medium">Search Functionality</span>
                  </div>
                  <ul className="text-sm text-gray-600 ml-4 space-y-1">
                    <li>• Site-wide search</li>
                    <li>• Real-time feedback</li>
                    <li>• Loading states</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="font-medium">Popular Pages</span>
                  </div>
                  <ul className="text-sm text-gray-600 ml-4 space-y-1">
                    <li>• Common navigation links</li>
                    <li>• Organized by category</li>
                    <li>• Easy access to main features</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Back */}
          <div className="text-center">
            <Link href="/">
              <Button className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-gray-500">
          <p className="text-sm">
            This test page helps you verify that the 404 error handling works correctly.
          </p>
          <p className="text-xs mt-2">
            The 404 page is automatically triggered when users visit non-existent URLs.
          </p>
        </div>
      </div>
    </div>
  );
} 