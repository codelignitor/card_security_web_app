import React, { useState } from "react";

const APIDocumentationSection = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "PDF",
    file: null
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        file: file
      }));
    }
  };

  // Convert file to base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Remove the data URL prefix to get just the base64 string
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.file) {
      setUploadStatus({ type: 'error', message: 'Please select a file to upload.' });
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    try {
      // Get merchant_id from localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
       const merchantId = userData.user?.merchant_id;
      // const userObj = JSON.parse(localStorage.getItem('UserObj') || '{}');
      // const merchantId = userObj.user.merchant_id;

     

      if (!merchantId) {
        throw new Error('Merchant ID not found in UserData');
      }

      // Convert file to base64
      const fileBase64 = await convertFileToBase64(formData.file);

      // Prepare the request body
      const requestBody = {
        merchant_id: merchantId,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        fileName: formData.file.name,
        fileType: formData.file.type,
        fileBase: fileBase64
      };

      // Make API call
      const response = await fetch('https://cardsecuritysystem-8xdez.ondigitalocean.app/api/superadmin/uploadDocumentation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const result = await response.json();
        setUploadStatus({ type: 'success', message: 'Documentation uploaded successfully!' });
        // Reset form
        setFormData({
          title: "",
          description: "",
          type: "PDF",
          file: null
        });
        // Reset file input
        document.getElementById('file-input').value = '';
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({ 
        type: 'error', 
        message: error.message || 'An error occurred while uploading the documentation.' 
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg text-black h-screen shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        API Documentation & Integration
      </h2>

      <div className="space-y-6">
        {/* Upload Documentation Form */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Upload Documentation
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title Input */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter documentation title"
                required
              />
            </div>

            {/* Description Input */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter documentation description"
                required
              />
            </div>

            {/* Type Selection */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Document Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PDF">PDF</option>
                <option value="DOC">DOC</option>
                <option value="DOCX">DOCX</option>
                <option value="TXT">TXT</option>
                <option value="MD">Markdown</option>
              </select>
            </div>

            {/* File Input */}
            <div>
              <label htmlFor="file-input" className="block text-sm font-medium text-gray-700 mb-2">
                Select File
              </label>
              <input
                type="file"
                id="file-input"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                accept=".pdf,.doc,.docx,.txt,.md"
                required
              />
              {formData.file && (
                <p className="text-sm text-gray-600 mt-1">
                  Selected: {formData.file.name} ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            {/* Upload Button */}
            <button
              type="submit"
              disabled={isUploading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Upload Documentation'}
            </button>
          </form>

          {/* Status Messages */}
          {uploadStatus && (
            <div className={`mt-4 p-3 rounded-md ${
              uploadStatus.type === 'success' 
                ? 'bg-green-100 text-green-700 border border-green-300' 
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}>
              {uploadStatus.message}
            </div>
          )}
        </div>

        {/* Additional Information */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Upload Guidelines:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Supported formats: PDF, DOC, DOCX, TXT, MD</li>
            <li>• Maximum file size: 10MB</li>
            <li>• Files are converted to base64 for secure transmission</li>
            <li>• Merchant ID is automatically retrieved from UserData</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default APIDocumentationSection;