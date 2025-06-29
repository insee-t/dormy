import LinkValidationComponent from '@/components/LinkValidationComponent';

export default function TestLinkValidationPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Link Validation Test Page
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            This page demonstrates the comprehensive link validation functionality. 
            Test various types of links including URLs, email addresses, phone numbers, 
            and internal paths to see how the validation works.
          </p>
        </div>
        
        <LinkValidationComponent />
        
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Test Examples</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2 text-green-700">Valid Examples</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• https://example.com</li>
                  <li>• http://example.com</li>
                  <li>• example.com</li>
                  <li>• mailto:user@example.com</li>
                  <li>• tel:+1234567890</li>
                  <li>• /dashboard</li>
                  <li>• ./page</li>
                  <li>• ../parent/page</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-red-700">Invalid Examples</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• not-a-url</li>
                  <li>• javascript:alert('xss')</li>
                  <li>• mailto:invalid-email</li>
                  <li>• tel:123</li>
                  <li>• //invalid-protocol</li>
                  <li>• empty string</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 