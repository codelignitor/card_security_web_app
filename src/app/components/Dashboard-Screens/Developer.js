import React, { useState } from 'react';

function DevelopersScreen() {
  const [apiKey, setApiKey] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');

  const handleGenerateApiKey = () => {
    // Generate API key logic here
    const newApiKey = 'sk_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setApiKey(newApiKey);
    console.log('Generated API Key:', newApiKey);
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    alert('API Key copied to clipboard!');
  };

  const handleConfigureWebhooks = () => {
    if (!webhookUrl.trim()) {
      alert('Please enter a valid webhook URL');
      return;
    }
    // Configure webhooks logic here
    console.log('Configuring webhook:', webhookUrl);
    alert('Webhook configured successfully!');
  };

  const handleDownloadSDK = (language) => {
    // Download SDK logic here
    console.log('Downloading SDK for:', language);
    alert(`${language} SDK download started!`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Developers</h2>
      
      <div className="space-y-6">
        {/* API Access */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">API Access</h3>
          <p className="text-gray-600 text-sm mb-4">Integrate our services with your applications.</p>
          
          {!apiKey ? (
            <button 
              onClick={handleGenerateApiKey}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Generate API Key
            </button>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your API Key</label>
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    value={apiKey} 
                    readOnly 
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                  />
                  <button 
                    onClick={handleCopyApiKey}
                    className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                ⚠️ Keep your API key secure and don&apos;t share it publicly
              </div>
            </div>
          )}
        </div>

        {/* Webhooks */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Webhooks</h3>
          <p className="text-gray-600 text-sm mb-4">Set up real-time notifications for your application.</p>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
              <input 
                type="url" 
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://your-app.com/webhook"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <button 
              onClick={handleConfigureWebhooks}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
            >
              Configure Webhooks
            </button>
          </div>

          {/* Webhook Events */}
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <h4 className="font-medium text-sm mb-2">Available Events</h4>
            <div className="space-y-1 text-xs text-gray-600">
              <div>• account.updated</div>
              <div>• document.uploaded</div>
              <div>• payment.completed</div>
              <div>• subscription.changed</div>
            </div>
          </div>
        </div>

   

        {/* API Documentation */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">API Documentation</h3>
          <p className="text-gray-600 text-sm mb-4">Comprehensive guides and API reference.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button className="p-3 border rounded-md text-left hover:bg-gray-50">
              <h4 className="font-medium text-sm">Quick Start Guide</h4>
              <p className="text-gray-600 text-xs mt-1">Get started with our API in 5 minutes</p>
            </button>
            <button className="p-3 border rounded-md text-left hover:bg-gray-50">
              <h4 className="font-medium text-sm">API Reference</h4>
              <p className="text-gray-600 text-xs mt-1">Complete API endpoints documentation</p>
            </button>
            <button className="p-3 border rounded-md text-left hover:bg-gray-50">
              <h4 className="font-medium text-sm">Code Examples</h4>
              <p className="text-gray-600 text-xs mt-1">Sample code for common use cases</p>
            </button>
            <button className="p-3 border rounded-md text-left hover:bg-gray-50">
              <h4 className="font-medium text-sm">Rate Limits</h4>
              <p className="text-gray-600 text-xs mt-1">Understanding API rate limiting</p>
            </button>
          </div>
        </div>

        {/* Testing Tools */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Testing Tools</h3>
          <p className="text-gray-600 text-sm mb-4">Test your integration with our sandbox environment.</p>
          
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
              Open API Explorer
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm">
              Sandbox Environment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DevelopersScreen;