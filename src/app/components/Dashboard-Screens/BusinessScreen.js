import React from 'react';

function BusinessScreen({
  businessInfo,
  documents,
  status,
  isSubmitting,
  submitError,
  submitSuccess,
  handleInputChange,
  handleFileUpload,
  removeDocument,
  handleSubmit,
  router
}) {
  
  const renderPendingStatus = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⏳</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Application Under Review</h2>
          <p className="text-gray-600 mb-6">Your business profile has been submitted and is currently being reviewed by our team.</p>
          
          {/* Success message */}
          {submitSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-green-400">✓</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-800">
                    Your business profile has been successfully submitted!
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Submitted Information:</h3>
            <div className="text-left space-y-2 text-sm">
              <p><span className="font-medium">Business Name:</span> {businessInfo.business_name}</p>
              <p><span className="font-medium">Registration Number:</span> {businessInfo.business_registration_number}</p>
              <p><span className="font-medium">Account Holder:</span> {businessInfo.account_holder_first_name} {businessInfo.account_holder_last_name}</p>
              <p><span className="font-medium">Address:</span> {businessInfo.street}, {businessInfo.city}, {businessInfo.state}</p>
              <p><span className="font-medium">Email:</span> {businessInfo.email}</p>
              <p><span className="font-medium">Documents:</span> {businessInfo.registration_document ? '1 file uploaded' : 'No files'}</p>
            </div>
          </div>
           */}
          <div className="flex justify-center space-x-4">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
              Contact Support
            </button>
            <button 
              onClick={() => router.push('/plans')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              View Subscriptions
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderBusinessForm = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Complete Your Business Profile</h2>
        
        {/* Error Message */}
        {submitError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-400">✕</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Submission Failed
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{submitError}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-green-400">✓</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Submission Successful
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Your business profile has been submitted successfully and is under review.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-6">
          {/* Business Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                name="business_name"
                value={businessInfo.business_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Registration Number *
              </label>
              <input
                type="text"
                name="business_registration_number"
                value={businessInfo.business_registration_number}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={businessInfo.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Information
              </label>
              <input
                type="text"
                name="bank_info"
                value={businessInfo.bank_info}
                onChange={handleInputChange}
                placeholder="e.g., JS Bank"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Business Address */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Business Address</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="street"
                  value={businessInfo.street}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Line 2 (Optional)
                </label>
                <input
                  type="text"
                  name="street_line2"
                  value={businessInfo.street_line2}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={businessInfo.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State/Province *
                </label>
                <input
                  type="text"
                  name="state"
                  value={businessInfo.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zip Code
                </label>
                <input
                  type="text"
                  name="zip_code"
                  value={businessInfo.zip_code}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <select
                  name="country"
                  value={businessInfo.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Pakistan">Pakistan</option>
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Account Holder Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Holder Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="account_holder_first_name"
                  value={businessInfo.account_holder_first_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="account_holder_last_name"
                  value={businessInfo.account_holder_last_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Document Upload */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Required Documents</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Registration Document *
              </label>
              <input
                type="file"
                name="registration_document"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Required: Business Registration Document (PDF, DOC, DOCX, JPG, JPEG, PNG)
              </p>
            </div>

            {businessInfo.registration_document && (
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">
                    📄 {businessInfo.registration_document.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setBusinessInfo(prev => ({...prev, registration_document: null}))}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              )}
              {isSubmitting ? 'Submitting...' : 'Submit Business Profile'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (status === 'pending') {
    return renderPendingStatus();
  }

  return renderBusinessForm();
}

export default BusinessScreen;