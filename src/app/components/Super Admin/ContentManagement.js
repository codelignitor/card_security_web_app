import React, { useState, useEffect } from 'react';
import ContentForm from './ContentForm';
import ContentTable from './ContentTable';

// Initial sample data
const initialContent = [
  {
    id: 1,
    title: "Home",
    slug: "/home",
    description: "Welcome to MySite - Your gateway to amazing content and services"
  },
  {
    id: 2,
    title: "About",
    slug: "/about",
    description: "Learn more about our company, mission, and the team behind MySite"
  },
  {
    id: 3,
    title: "ContactUs",
    slug: "/contact",
    description: "Get in touch with us - phone numbers, email addresses, and contact forms"
  }
];

const ContentManagement = () => {
  const [content, setContent] = useState(initialContent);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [apiStatus, setApiStatus] = useState('');
  const [showJsonPreview, setShowJsonPreview] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Load content from localStorage on component mount
  useEffect(() => {
    const savedContent = localStorage.getItem('adminContent');
    if (savedContent) {
      try {
        const parsedContent = JSON.parse(savedContent);
        setContent(parsedContent);
        console.log('Loaded content from localStorage');
      } catch (error) {
        console.error('Error loading content from localStorage:', error);
      }
    }
  }, []);

  // Save to localStorage whenever content changes
  useEffect(() => {
    localStorage.setItem('adminContent', JSON.stringify(content));
  }, [content]);

  // API Integration function
  const saveToAPI = async (data) => {
    setApiStatus('Saving to server...');
    
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Replace this with your actual API endpoint
      /*
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${yourAuthToken}` // Add if needed
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('API Response:', result);
      */
      
      // For demo purposes, just log the data
      console.log('Data that would be sent to API:', JSON.stringify(data, null, 2));
      
      setApiStatus('✅ Saved successfully!');
      setLastSaved(new Date().toLocaleString());
      
      // Clear status after 3 seconds
      setTimeout(() => setApiStatus(''), 3000);
      
    } catch (error) {
      console.error('Error saving to API:', error);
      setApiStatus('❌ Error saving data');
      
      // Clear error status after 5 seconds
      setTimeout(() => setApiStatus(''), 5000);
    }
  };

  const handleSave = async (formData) => {
    let updatedContent;
    
    if (editingItem) {
      // Update existing item
      updatedContent = content.map(item =>
        item.id === editingItem.id ? { ...formData, id: editingItem.id } : item
      );
    } else {
      // Add new item
      const newId = content.length > 0 ? Math.max(...content.map(item => item.id)) + 1 : 1;
      updatedContent = [...content, { ...formData, id: newId }];
    }

    setContent(updatedContent);
    
    // Save to API
    await saveToAPI(updatedContent);
    
    // Close form
    setShowForm(false);
    setEditingItem(null);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const itemToDelete = content.find(item => item.id === id);
    
    if (window.confirm(`Are you sure you want to delete "${itemToDelete?.title}"?`)) {
      const updatedContent = content.filter(item => item.id !== id);
      setContent(updatedContent);
      await saveToAPI(updatedContent);
    }
  };

  const handleView = (item) => {
    alert(`Content Details:\n\nID: ${item.id}\nTitle: ${item.title}\nSlug: ${item.slug}\nDescription: ${item.description}`);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleSyncToAPI = async () => {
    if (window.confirm('This will sync all current content to the API. Continue?')) {
      await saveToAPI(content);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Content Management</h2>
              <p className="text-gray-600 mt-1">
                Manage your website content dynamically. Changes are automatically synced to your API.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Indicator */}
              {apiStatus && (
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  apiStatus.includes('Error') || apiStatus.includes('❌') 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {apiStatus}
                </div>
              )}
              
              {/* Last Saved */}
              {lastSaved && (
                <span className="text-xs text-gray-500">
                  Last saved: {lastSaved}
                </span>
              )}
              
              {/* Action Buttons */}
              {!showForm && (
                <>
                  <button
                    onClick={handleSyncToAPI}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm"
                  >
                    Sync to API
                  </button>
                  
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    + Add New Content
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {showForm ? (
        <ContentForm
          item={editingItem}
          onSave={handleSave}
          onCancel={handleCancel}
          isEditing={!!editingItem}
        />
      ) : (
        <ContentTable
          content={content}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      )}

      {/* JSON Preview Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-800">JSON Data Preview</h3>
            <button
              onClick={() => setShowJsonPreview(!showJsonPreview)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {showJsonPreview ? 'Hide' : 'Show'} JSON
            </button>
          </div>
        </div>
        
        {showJsonPreview && (
          <div className="p-4 bg-gray-900">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-green-400 text-sm font-mono">
                {/* API Endpoint Data ({content.length} items) */}
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(JSON.stringify(content, null, 2))}
                className="text-green-400 hover:text-green-300 text-sm"
              >
                Copy to Clipboard
              </button>
            </div>
            <pre className="text-green-400 text-sm overflow-x-auto whitespace-pre-wrap max-h-80 overflow-y-auto">
{JSON.stringify(content, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="p-4 bg-blue-50 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            <p className="font-medium mb-2">🔗 API Integration Instructions:</p>
            <div className="space-y-1 text-xs">
              <p>• Replace the <code className="bg-gray-200 px-1 rounded">saveToAPI</code> function with your actual API endpoint</p>
              <p>• Use POST method to <code className="bg-gray-200 px-1 rounded">/api/content</code> with this JSON data</p>
              <p>• Add authentication headers if required by your API</p>
              <p>• Handle success/error responses appropriately</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;