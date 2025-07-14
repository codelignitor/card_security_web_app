import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, Calendar, Building, Mail, FileText, AlertCircle, Users } from 'lucide-react';

const BusinessApprovalSection = () => {
  const [businesses, setBusinesses] = useState([]);
  const [approvedBusinesses, setApprovedBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvedLoading, setApprovedLoading] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  // Fetch both pending and approved businesses on page load
  useEffect(() => {
    const fetchAllBusinesses = async () => {
      try {
        // Fetch pending businesses
        const pendingResponse = await fetch('https://cardsecuritysystem-8xdez.ondigitalocean.app/api/business-profile');
        const pendingData = await pendingResponse.json();
            
        if (pendingData.status) {
          // Only get pending businesses from this endpoint
          const allBusinesses = pendingData.data;
          const pending = allBusinesses.filter(business => {
            const status = business.user.business_verified;
            return status === 0 || status === "0" || status === null || status === "PENDING";
          });
          
          setBusinesses(pending);
        }

        // Fetch approved businesses
        const approvedResponse = await fetch('https://cardsecuritysystem-8xdez.ondigitalocean.app/api/business-profile/approved');
        const approvedData = await approvedResponse.json();
            
        if (approvedData.status) {
          setApprovedBusinesses(approvedData.data || []);
        }
      } catch (error) {
        console.error('Error fetching businesses:', error);
        showNotification('Error fetching businesses', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAllBusinesses();
  }, []);

  // Fetch approved businesses when approved tab is clicked (only if not already loaded)
  const fetchApprovedBusinesses = async () => {
    if (approvedBusinesses.length > 0) return; // Already loaded
    
    setApprovedLoading(true);
    try {
      const response = await fetch('https://cardsecuritysystem-8xdez.ondigitalocean.app/api/business-profile/approved');
      const data = await response.json();
          
      if (data.status) {
        setApprovedBusinesses(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching approved businesses:', error);
      showNotification('Error fetching approved businesses', 'error');
    } finally {
      setApprovedLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'approved') {
      fetchApprovedBusinesses();
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Enhanced download function with multiple fallback methods
  const handleDownloadDocument = async (documentPath, fileName) => {
    setDownloadLoading(true);
    const fullUrl = `${documentPath}`;
    
    try {
      // Method 1: Fetch and create blob (works for CORS-enabled servers)
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName || documentPath.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        showNotification('Document downloaded successfully', 'success');
      } else {
        throw new Error('Failed to fetch document');
      }
    } catch (error) {
      console.error('Download method 1 failed:', error);
      
      // Method 2: Direct link approach
      try {
        const link = document.createElement('a');
        link.href = fullUrl;
        link.download = fileName || documentPath.split('/').pop();
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showNotification('Opening document in new tab for download', 'success');
      } catch (directError) {
        console.error('Download method 2 failed:', directError);
        
        // Method 3: Window.open as last resort
        window.open(fullUrl, '_blank');
        showNotification('Document opened in new tab. Use browser\'s download option if needed.', 'success');
      }
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleViewDocument = (business) => {
    setSelectedBusiness(business);
    setIsModalOpen(true);
    setShowRejectForm(false);
    setRejectReason('');
  };

  const handleApprove = async (businessId) => {
    setActionLoading(true);
    try {
      const response = await fetch('https://cardsecuritysystem-8xdez.ondigitalocean.app/api/business-profile/decision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: selectedBusiness.user.id,
          status: 'APPROVED',
          reason: 'Business profile approved after verification'
        })
      });

      const data = await response.json();

      if (response.ok && data.status) {
        showNotification(data.message || 'Business approved successfully', 'success');
        
        // Remove from pending businesses
        setBusinesses(prevBusinesses => 
          prevBusinesses.filter(business => business.id !== businessId)
        );
        
        // If approved tab data is already loaded, add to approved businesses
        if (approvedBusinesses.length > 0) {
          const approvedBusiness = { 
            ...selectedBusiness, 
            user: { ...selectedBusiness.user, business_verified: 1 }
          };
          setApprovedBusinesses(prevApproved => [...prevApproved, approvedBusiness]);
        }
        
        setIsModalOpen(false);
      } else {
        throw new Error(data.message || 'Failed to approve business');
      }
    } catch (error) {
      console.error('Error approving business:', error);
      showNotification(error.message || 'Failed to approve business', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectClick = () => {
    setShowRejectForm(true);
  };

  const handleReject = async (businessId) => {
    if (!rejectReason.trim()) {
      showNotification('Please provide a reason for rejection', 'error');
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch('https://cardsecuritysystem-8xdez.ondigitalocean.app/api/business-profile/decision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: selectedBusiness.user.id,
          status: 'INCOMPLETE',
          reason: rejectReason.trim()
        })
      });

      const data = await response.json();

      if (response.ok && data.status) {
        showNotification(data.message || 'Business marked as incomplete successfully', 'success');
        
        // Update the business status in the list
        setBusinesses(prevBusinesses => 
          prevBusinesses.map(business => 
            business.id === businessId 
              ? { ...business, user: { ...business.user, business_verified: 2 } }
              : business
          )
        );
        
        setIsModalOpen(false);
        setShowRejectForm(false);
        setRejectReason('');
      } else {
        throw new Error(data.message || 'Failed to mark business as incomplete');
      }
    } catch (error) {
      console.error('Error rejecting business:', error);
      showNotification(error.message || 'Failed to mark business as incomplete', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (verified) => {
    // Handle both string and number values
    const status = String(verified).toUpperCase();
    
    if (status === "1" || status === "APPROVED") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </span>
      );
    } else if (status === "2" || status === "INCOMPLETE") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Incomplete
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Calendar className="w-3 h-3 mr-1" />
          Pending
        </span>
      );
    }
  };

  const renderBusinessTable = (businessList, isApproved = false) => (
    <div className="overflow-x-auto">
      {isApproved && approvedLoading ? (
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading approved businesses...</p>
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {activeTab === 'approved' ? 'Approved Date' : 'Requested Date'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {businessList.map((business) => (
              <tr key={business.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Building className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {business.business_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Reg: {business.business_registration_number}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <div className="text-sm text-gray-900">{business.user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(business.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(business.user.business_verified)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleViewDocument(business)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View Documents
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderEmptyState = (title, description, icon) => (
    <div className="p-6 text-center">
      {icon}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border text-black">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
          notification.type === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            )}
            <p className={`text-sm font-medium ${
              notification.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {notification.message}
            </p>
          </div>
        </div>
      )}

      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
          <Building className="w-5 h-5 mr-2" />
          Business Management
        </h2>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => handleTabChange('pending')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'pending'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center">
              <Calendar className="w-4 h-4 mr-2" />
              Pending Approval ({businesses.length})
            </div>
          </button>
          <button
            onClick={() => handleTabChange('approved')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'approved'
                ? 'bg-white text-green-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center">
              <Users className="w-4 h-4 mr-2" />
              Approved Businesses ({approvedBusinesses.length})
            </div>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'pending' && (
        <>
          {businesses.length > 0 ? (
            renderBusinessTable(businesses)
          ) : (
            renderEmptyState(
              'No Pending Requests',
              'There are no business verification requests at the moment.',
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            )
          )}
        </>
      )}

      {activeTab === 'approved' && (
        <>
          {approvedBusinesses.length > 0 || approvedLoading ? (
            renderBusinessTable(approvedBusinesses, true)
          ) : (
            renderEmptyState(
              'No Approved Businesses',
              'There are no approved businesses at the moment.',
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            )
          )}
        </>
      )}

      {/* Modal for Document Review */}
      {isModalOpen && selectedBusiness && (
        <div className="fixed inset-0 bg-gray-600/60 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Business Details Review
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={actionLoading}
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Business Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedBusiness.business_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Registration Number</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedBusiness.business_registration_number}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Account Holder</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedBusiness.account_holder_first_name} {selectedBusiness.account_holder_last_name}
                    </p>
                  </div>
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700">Bank Info</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedBusiness.bank_info}</p>
                  </div> */}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedBusiness.street}
                    {selectedBusiness.street_line2 && `, ${selectedBusiness.street_line2}`}
                    <br />
                    {selectedBusiness.city}, {selectedBusiness.state} {selectedBusiness.zip_code}
                    <br />
                    {selectedBusiness.country}
                  </p>
                </div>

                {/* Show verification reason if exists */}
                {selectedBusiness.user.verification_reason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-red-800 mb-1">Previous Verification Notes</label>
                    <p className="text-sm text-red-700">{selectedBusiness.user.verification_reason}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Registration Document</label>
                  <div className="border border-gray-300 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          {selectedBusiness.registration_document_path.split('/').pop()}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => window.open(`${selectedBusiness.registration_document_path}`, '_blank')}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => handleDownloadDocument(
                            selectedBusiness.registration_document_path,
                            `${selectedBusiness.business_name}_registration_document.${selectedBusiness.registration_document_path.split('.').pop()}`
                          )}
                          disabled={downloadLoading}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {downloadLoading ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-700 mr-1"></div>
                          ) : (
                            <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          )}
                          Download
                        </button>
                      </div>
                    </div>
                    
                    {/* Document Preview */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="aspect-w-16 aspect-h-9">
                        {selectedBusiness.registration_document_path.toLowerCase().includes('.pdf') ? (
                          <iframe
                            src={`${selectedBusiness.registration_document_path}`}
                            className="w-full h-64 border-0 rounded"
                            title="Document Preview"
                          />
                        ) : (
                          <img
                            src={`${selectedBusiness.registration_document_path}`}
                            alt="Registration Document"
                            className="w-full h-64 object-contain rounded"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        )}
                        <div className="hidden w-full h-64 bg-gray-100 rounded flex items-center justify-center">
                          <div className="text-center">
                            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Preview not available</p>
                            <p className="text-xs text-gray-400">Use View or Download buttons above</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reject Reason Form */}
                {showRejectForm && (
                  <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                    <label className="block text-sm font-medium text-red-800 mb-2">
                      Reason for marking as rejected *
                    </label>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows="3"
                      placeholder="Please provide a detailed reason for marking this business profile as rejected..."
                      required
                    />
                  </div>
                )}
              </div>

              {/* Show action buttons only for pending businesses */}
              {activeTab === 'pending' && (
                <div className="flex items-center justify-end space-x-4 mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleApprove(selectedBusiness.id)}
                    disabled={actionLoading}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Approve
                  </button>

                  {!showRejectForm ? (
                    <button
                      onClick={handleRejectClick}
                      disabled={actionLoading}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReject(selectedBusiness.id)}
                      disabled={actionLoading || !rejectReason.trim()}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <XCircle className="h-4 w-4 mr-2" />
                      )}
                      Confirm Reject
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setShowRejectForm(false);
                      setRejectReason('');
                    }}
                    disabled={actionLoading}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessApprovalSection;