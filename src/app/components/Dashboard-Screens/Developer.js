import React, { useState, useEffect } from 'react';

function DevelopersScreen() {
  const [apiKey, setApiKey] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Base URL for API calls
  const baseURL = 'https://cardsecuritysystem-8xdez.ondigitalocean.app';

  // Fetch documentation
  const fetchDocuments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const merchantId = userData.user?.merchant_id;

      if (!merchantId) {
        throw new Error('Merchant ID not found in UserData');
      }

      const response = await fetch(`${baseURL}/api/superadmin/getDocumentation?merchant_id=${merchantId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const result = await response.json();
        setDocuments(result.data || []);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch documents');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message || 'An error occurred while fetching documents.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle file download
  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
    <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6 min-h-screen">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">Developers</h2>
      
      <div className="space-y-6 md:space-y-8">
        {/* API Management Section */}
        <div className="bg-gray-50 rounded-lg p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-medium text-gray-800 mb-4">API Management</h3>
          
          <div className="space-y-4">
            {/* API Key Generation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={apiKey}
                  readOnly
                  placeholder="Click 'Generate' to create an API key"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleGenerateApiKey}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    Generate
                  </button>
                  {apiKey && (
                    <button
                      onClick={handleCopyApiKey}
                      className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm"
                    >
                      Copy
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Webhook Configuration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Webhook URL
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://your-domain.com/webhook"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  onClick={handleConfigureWebhooks}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
                >
                  Configure
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SDK Downloads */}
        <div className="bg-gray-50 rounded-lg p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-medium text-gray-800 mb-4">SDK Downloads</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {['JavaScript', 'Python', 'PHP', 'Node.js'].map((language) => (
              <button
                key={language}
                onClick={() => handleDownloadSDK(language)}
                className="bg-white border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow text-center"
              >
                <div className="text-lg font-medium text-gray-800 mb-2">{language}</div>
                <div className="text-sm text-gray-600">Download SDK</div>
              </button>
            ))}
          </div>
        </div>

        {/* Documentation Section */}
        <div className="bg-gray-50 rounded-lg p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 className="text-lg md:text-xl font-medium text-gray-800 mb-2 sm:mb-0">
              Documentation & Guides
            </h3>
            <button
              onClick={fetchDocuments}
              disabled={isLoading}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-400 text-sm transition-colors"
            >
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md border border-red-300 mb-4 text-sm">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading documentation...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-lg font-medium">No documentation available</p>
              <p className="text-sm mt-1">Documentation will appear here once uploaded by admin.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Desktop Grid View */}
              <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-gray-900 text-base leading-tight">{doc.title}</h4>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium ml-2 shrink-0">
                        {doc.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{doc.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{formatDate(doc.created_at)}</span>
                      <button
                        onClick={() => handleDownload(doc.file_url, doc.title)}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium transition-colors"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile List View */}
              <div className="md:hidden space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 text-sm pr-2">{doc.title}</h4>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs shrink-0">
                        {doc.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{doc.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{formatDate(doc.created_at)}</span>
                      <button
                        onClick={() => handleDownload(doc.file_url, doc.title)}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs transition-colors"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-3">Quick Links & Resources:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <a href="#" className="text-blue-700 hover:text-blue-900 transition-colors">• API Reference</a>
            <a href="#" className="text-blue-700 hover:text-blue-900 transition-colors">• Integration Guide</a>
            <a href="#" className="text-blue-700 hover:text-blue-900 transition-colors">• Code Examples</a>
            <a href="#" className="text-blue-700 hover:text-blue-900 transition-colors">• Support Forum</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DevelopersScreen;