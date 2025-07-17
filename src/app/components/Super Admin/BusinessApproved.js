// import React, { useState, useEffect } from 'react';
// import { Eye, CheckCircle, XCircle, Calendar, Building, Mail, FileText, AlertCircle, Users } from 'lucide-react';

// const BusinessApprovalSection = () => {
//   const [businesses, setBusinesses] = useState([]);
//   const [approvedBusinesses, setApprovedBusinesses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [approvedLoading, setApprovedLoading] = useState(false);
//   const [selectedBusiness, setSelectedBusiness] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [notification, setNotification] = useState(null);
//   const [activeTab, setActiveTab] = useState('pending');
//   const [downloadLoading, setDownloadLoading] = useState(false);
//   const [rejectReason, setRejectReason] = useState('');
//   const [showRejectForm, setShowRejectForm] = useState(false);

//   // Fetch both pending and approved businesses on page load
//   useEffect(() => {
//     const fetchAllBusinesses = async () => {
//       try {
//         // Fetch pending businesses
//         const pendingResponse = await fetch('https://cardsecuritysystem-8xdez.ondigitalocean.app/api/business-profile');
//         const pendingData = await pendingResponse.json();
            
//         if (pendingData.status) {
//           // Only get pending businesses from this endpoint
//           const allBusinesses = pendingData.data;
//           const pending = allBusinesses.filter(business => {
//             const status = business.user.business_verified;
//             return status === 0 || status === "0" || status === null || status === "PENDING";
//           });
          
//           setBusinesses(pending);
//         }

//         // Fetch approved businesses
//         const approvedResponse = await fetch('https://cardsecuritysystem-8xdez.ondigitalocean.app/api/business-profile/approved');
//         const approvedData = await approvedResponse.json();
            
//         if (approvedData.status) {
//           setApprovedBusinesses(approvedData.data || []);
//         }
//       } catch (error) {
//         console.error('Error fetching businesses:', error);
//         showNotification('Error fetching businesses', 'error');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllBusinesses();
//   }, []);

//   // Fetch approved businesses when approved tab is clicked (only if not already loaded)
//   const fetchApprovedBusinesses = async () => {
//     if (approvedBusinesses.length > 0) return; // Already loaded
    
//     setApprovedLoading(true);
//     try {
//       const response = await fetch('https://cardsecuritysystem-8xdez.ondigitalocean.app/api/business-profile/approved');
//       const data = await response.json();
          
//       if (data.status) {
//         setApprovedBusinesses(data.data || []);
//       }
//     } catch (error) {
//       console.error('Error fetching approved businesses:', error);
//       showNotification('Error fetching approved businesses', 'error');
//     } finally {
//       setApprovedLoading(false);
//     }
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     if (tab === 'approved') {
//       fetchApprovedBusinesses();
//     }
//   };

//   const showNotification = (message, type = 'success') => {
//     setNotification({ message, type });
//     setTimeout(() => setNotification(null), 3000);
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   // Enhanced download function with multiple fallback methods
//   const handleDownloadDocument = async (documentPath, fileName) => {
//     setDownloadLoading(true);
//     const fullUrl = `${documentPath}`;
    
//     try {
//       // Method 1: Fetch and create blob (works for CORS-enabled servers)
//       const response = await fetch(fullUrl, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/pdf',
//         },
//       });
      
//       if (response.ok) {
//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = fileName || documentPath.split('/').pop();
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         window.URL.revokeObjectURL(url);
//         showNotification('Document downloaded successfully', 'success');
//       } else {
//         throw new Error('Failed to fetch document');
//       }
//     } catch (error) {
//       console.error('Download method 1 failed:', error);
      
//       // Method 2: Direct link approach
//       try {
//         const link = document.createElement('a');
//         link.href = fullUrl;
//         link.download = fileName || documentPath.split('/').pop();
//         link.target = '_blank';
//         link.rel = 'noopener noreferrer';
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         showNotification('Opening document in new tab for download', 'success');
//       } catch (directError) {
//         console.error('Download method 2 failed:', directError);
        
//         // Method 3: Window.open as last resort
//         window.open(fullUrl, '_blank');
//         showNotification('Document opened in new tab. Use browser\'s download option if needed.', 'success');
//       }
//     } finally {
//       setDownloadLoading(false);
//     }
//   };

//   const handleViewDocument = (business) => {
//     setSelectedBusiness(business);
//     setIsModalOpen(true);
//     setShowRejectForm(false);
//     setRejectReason('');
//   };

//   const handleApprove = async (businessId) => {
//     setActionLoading(true);
//     try {
//       const response = await fetch('https://cardsecuritysystem-8xdez.ondigitalocean.app/api/business-profile/decision', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           user_id: selectedBusiness.user.id,
//           status: 'APPROVED',
//           reason: 'Business profile approved after verification'
//         })
//       });

//       const data = await response.json();

//       if (response.ok && data.status) {
//         showNotification(data.message || 'Business approved successfully', 'success');
        
//         // Remove from pending businesses
//         setBusinesses(prevBusinesses => 
//           prevBusinesses.filter(business => business.id !== businessId)
//         );
        
//         // If approved tab data is already loaded, add to approved businesses
//         if (approvedBusinesses.length > 0) {
//           const approvedBusiness = { 
//             ...selectedBusiness, 
//             user: { ...selectedBusiness.user, business_verified: 1 }
//           };
//           setApprovedBusinesses(prevApproved => [...prevApproved, approvedBusiness]);
//         }
        
//         setIsModalOpen(false);
//       } else {
//         throw new Error(data.message || 'Failed to approve business');
//       }
//     } catch (error) {
//       console.error('Error approving business:', error);
//       showNotification(error.message || 'Failed to approve business', 'error');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleRejectClick = () => {
//     setShowRejectForm(true);
//   };

//   const handleReject = async (businessId) => {
//     if (!rejectReason.trim()) {
//       showNotification('Please provide a reason for rejection', 'error');
//       return;
//     }

//     setActionLoading(true);
//     try {
//       const response = await fetch('https://cardsecuritysystem-8xdez.ondigitalocean.app/api/business-profile/decision', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           user_id: selectedBusiness.user.id,
//           status: 'INCOMPLETE',
//           reason: rejectReason.trim()
//         })
//       });

//       const data = await response.json();

//       if (response.ok && data.status) {
//         showNotification(data.message || 'Business marked as incomplete successfully', 'success');
        
//         // Update the business status in the list
//         setBusinesses(prevBusinesses => 
//           prevBusinesses.map(business => 
//             business.id === businessId 
//               ? { ...business, user: { ...business.user, business_verified: 2 } }
//               : business
//           )
//         );
        
//         setIsModalOpen(false);
//         setShowRejectForm(false);
//         setRejectReason('');
//       } else {
//         throw new Error(data.message || 'Failed to mark business as incomplete');
//       }
//     } catch (error) {
//       console.error('Error rejecting business:', error);
//       showNotification(error.message || 'Failed to mark business as incomplete', 'error');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const getStatusBadge = (verified) => {
//     // Handle both string and number values
//     const status = String(verified).toUpperCase();
    
//     if (status === "1" || status === "APPROVED") {
//       return (
//         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//           <CheckCircle className="w-3 h-3 mr-1" />
//           <span className="hidden sm:inline">Approved</span>
//           <span className="sm:hidden">✓</span>
//         </span>
//       );
//     } else if (status === "2" || status === "INCOMPLETE") {
//       return (
//         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
//           <XCircle className="w-3 h-3 mr-1" />
//           <span className="hidden sm:inline">Incomplete</span>
//           <span className="sm:hidden">✗</span>
//         </span>
//       );
//     } else {
//       return (
//         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
//           <Calendar className="w-3 h-3 mr-1" />
//           <span className="hidden sm:inline">Pending</span>
//           <span className="sm:hidden">⏳</span>
//         </span>
//       );
//     }
//   };

//   // Mobile Card View for businesses
//   const renderMobileCard = (business, isApproved = false) => (
//     <div key={business.id} className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
//       <div className="flex items-start justify-between mb-3">
//         <div className="flex items-center flex-1 min-w-0">
//           <div className="flex-shrink-0 h-10 w-10 mr-3">
//             <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
//               <Building className="h-5 w-5 text-blue-600" />
//             </div>
//           </div>
//           <div className="flex-1 min-w-0">
//             <h3 className="text-sm font-medium text-gray-900 truncate">
//               {business.business_name}
//             </h3>
//             <p className="text-xs text-gray-500 truncate">
//               Reg: {business.business_registration_number}
//             </p>
//           </div>
//         </div>
//         {getStatusBadge(business.user.business_verified)}
//       </div>
      
//       <div className="space-y-2 mb-4">
//         <div className="flex items-center text-sm text-gray-600">
//           <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
//           <span className="truncate">{business.user.email}</span>
//         </div>
//         <div className="flex items-center text-sm text-gray-500">
//           <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
//           <span>{formatDate(business.created_at)}</span>
//         </div>
//       </div>
      
//       <button
//         onClick={() => handleViewDocument(business)}
//         className="w-full inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//       >
//         <Eye className="h-4 w-4 mr-2" />
//         View Documents
//       </button>
//     </div>
//   );

//   const renderBusinessTable = (businessList, isApproved = false) => (
//     <div className="overflow-x-auto">
//       {isApproved && approvedLoading ? (
//         <div className="p-6 text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-500">Loading approved businesses...</p>
//         </div>
//       ) : (
//         <>
//           {/* Desktop Table View */}
//           <div className="hidden md:block">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Company Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Email
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     {activeTab === 'approved' ? 'Approved Date' : 'Requested Date'}
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {businessList.map((business) => (
//                   <tr key={business.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0 h-8 w-8">
//                           <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
//                             <Building className="h-4 w-4 text-blue-600" />
//                           </div>
//                         </div>
//                         <div className="ml-3">
//                           <div className="text-sm font-medium text-gray-900">
//                             {business.business_name}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             Reg: {business.business_registration_number}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <Mail className="h-4 w-4 text-gray-400 mr-2" />
//                         <div className="text-sm text-gray-900">{business.user.email}</div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatDate(business.created_at)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {getStatusBadge(business.user.business_verified)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <button
//                         onClick={() => handleViewDocument(business)}
//                         className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                       >
//                         <Eye className="h-3 w-3 mr-1" />
//                         View Documents
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile Card View */}
//           <div className="md:hidden px-4">
//             {businessList.map((business) => renderMobileCard(business, isApproved))}
//           </div>
//         </>
//       )}
//     </div>
//   );

//   const renderEmptyState = (title, description, icon) => (
//     <div className="p-6 text-center">
//       {icon}
//       <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
//       <p className="text-gray-500 text-sm">{description}</p>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
//         <div className="animate-pulse">
//           <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
//           <div className="space-y-3">
//             <div className="h-4 bg-gray-200 rounded"></div>
//             <div className="h-4 bg-gray-200 rounded w-5/6"></div>
//             <div className="h-4 bg-gray-200 rounded w-4/6"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-sm border text-black">
//       {/* Notification */}
//       {notification && (
//         <div className={`fixed top-4 right-4 z-50 p-3 sm:p-4 rounded-md shadow-lg max-w-sm ${
//           notification.type === 'success' 
//             ? 'bg-green-50 border border-green-200' 
//             : 'bg-red-50 border border-red-200'
//         }`}>
//           <div className="flex items-center">
//             {notification.type === 'success' ? (
//               <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" />
//             ) : (
//               <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
//             )}
//             <p className={`text-sm font-medium ${
//               notification.type === 'success' ? 'text-green-800' : 'text-red-800'
//             }`}>
//               {notification.message}
//             </p>
//           </div>
//         </div>
//       )}

//       <div className="p-4 sm:p-6 border-b border-gray-200">
//         <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center mb-4">
//           <Building className="w-5 h-5 mr-2" />
//           Business Management
//         </h2>
        
//         {/* Tab Navigation */}
//         <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
//           <button
//             onClick={() => handleTabChange('pending')}
//             className={`flex-1 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
//               activeTab === 'pending'
//                 ? 'bg-white text-blue-700 shadow-sm'
//                 : 'text-gray-500 hover:text-gray-700'
//             }`}
//           >
//             <div className="flex items-center justify-center">
//               <Calendar className="w-4 h-4 mr-1 sm:mr-2" />
//               <span className="hidden sm:inline">Pending Approval</span>
//               <span className="sm:hidden">Pending</span>
//               <span className="ml-1">({businesses.length})</span>
//             </div>
//           </button>
//           <button
//             onClick={() => handleTabChange('approved')}
//             className={`flex-1 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
//               activeTab === 'approved'
//                 ? 'bg-white text-green-700 shadow-sm'
//                 : 'text-gray-500 hover:text-gray-700'
//             }`}
//           >
//             <div className="flex items-center justify-center">
//               <Users className="w-4 h-4 mr-1 sm:mr-2" />
//               <span className="hidden sm:inline">Approved Businesses</span>
//               <span className="sm:hidden">Approved</span>
//               <span className="ml-1">({approvedBusinesses.length})</span>
//             </div>
//           </button>
//         </div>
//       </div>

//       {/* Tab Content */}
//       {activeTab === 'pending' && (
//         <>
//           {businesses.length > 0 ? (
//             renderBusinessTable(businesses)
//           ) : (
//             renderEmptyState(
//               'No Pending Requests',
//               'There are no business verification requests at the moment.',
//               <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//             )
//           )}
//         </>
//       )}

//       {activeTab === 'approved' && (
//         <>
//           {approvedBusinesses.length > 0 || approvedLoading ? (
//             renderBusinessTable(approvedBusinesses, true)
//           ) : (
//             renderEmptyState(
//               'No Approved Businesses',
//               'There are no approved businesses at the moment.',
//               <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//             )
//           )}
//         </>
//       )}

//       {/* Modal for Document Review */}
//       {isModalOpen && selectedBusiness && (
//         <div className="fixed inset-0 bg-gray-600/60 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
//           <div className="relative top-4 sm:top-20 mx-auto p-4 sm:p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
//             <div className="mt-3">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-medium text-gray-900">
//                   Business Details Review
//                 </h3>
//                 <button
//                   onClick={() => setIsModalOpen(false)}
//                   className="text-gray-400 hover:text-gray-600"
//                   disabled={actionLoading}
//                 >
//                   <XCircle className="h-6 w-6" />
//                 </button>
//               </div>
              
//               <div className="space-y-4">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Business Name</label>
//                     <p className="mt-1 text-sm text-gray-900">{selectedBusiness.business_name}</p>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Registration Number</label>
//                     <p className="mt-1 text-sm text-gray-900">{selectedBusiness.business_registration_number}</p>
//                   </div>
//                   <div className="sm:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700">Account Holder</label>
//                     <p className="mt-1 text-sm text-gray-900">
//                       {selectedBusiness.account_holder_first_name} {selectedBusiness.account_holder_last_name}
//                     </p>
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Address</label>
//                   <p className="mt-1 text-sm text-gray-900">
//                     {selectedBusiness.street}
//                     {selectedBusiness.street_line2 && `, ${selectedBusiness.street_line2}`}
//                     <br />
//                     {selectedBusiness.city}, {selectedBusiness.state} {selectedBusiness.zip_code}
//                     <br />
//                     {selectedBusiness.country}
//                   </p>
//                 </div>

//                 {/* Show verification reason if exists */}
//                 {selectedBusiness.user.verification_reason && (
//                   <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//                     <label className="block text-sm font-medium text-red-800 mb-1">Previous Verification Notes</label>
//                     <p className="text-sm text-red-700">{selectedBusiness.user.verification_reason}</p>
//                   </div>
//                 )}

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Registration Document</label>
//                   <div className="border border-gray-300 rounded-lg p-4">
//                     <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 space-y-2 sm:space-y-0">
//                       <div className="flex items-center min-w-0">
//                         <FileText className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
//                         <span className="text-sm text-gray-600 truncate">
//                           {selectedBusiness.registration_document_path.split('/').pop()}
//                         </span>
//                       </div>
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => window.open(`${selectedBusiness.registration_document_path}`, '_blank')}
//                           className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                         >
//                           <Eye className="h-3 w-3 mr-1" />
//                           View
//                         </button>
//                         <button
//                           onClick={() => handleDownloadDocument(
//                             selectedBusiness.registration_document_path,
//                             `${selectedBusiness.business_name}_registration_document.${selectedBusiness.registration_document_path.split('.').pop()}`
//                           )}
//                           disabled={downloadLoading}
//                           className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           {downloadLoading ? (
//                             <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-700 mr-1"></div>
//                           ) : (
//                             <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                             </svg>
//                           )}
//                           <span className="hidden sm:inline">Download</span>
//                           <span className="sm:hidden">DL</span>
//                         </button>
//                       </div>
//                     </div>
                    
//                     {/* Document Preview */}
//                     <div className="bg-gray-50 rounded-lg p-3">
//                       <div className="aspect-w-16 aspect-h-9">
//                         {selectedBusiness.registration_document_path.toLowerCase().includes('.pdf') ? (
//                           <iframe
//                             src={`${selectedBusiness.registration_document_path}`}
//                             className="w-full h-48 sm:h-64 border-0 rounded"
//                             title="Document Preview"
//                           />
//                         ) : (
//                           <img
//                             src={`${selectedBusiness.registration_document_path}`}
//                             alt="Registration Document"
//                             className="w-full h-48 sm:h-64 object-contain rounded"
//                             onError={(e) => {
//                               e.target.style.display = 'none';
//                               e.target.nextSibling.style.display = 'flex';
//                             }}
//                           />
//                         )}
//                         <div className="hidden w-full h-48 sm:h-64 bg-gray-100 rounded flex items-center justify-center">
//                           <div className="text-center">
//                             <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
//                             <p className="text-sm text-gray-500">Preview not available</p>
//                             <p className="text-xs text-gray-400">Use View or Download buttons above</p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Reject Reason Form */}
//                 {showRejectForm && (
//                   <div className="border border-red-200 bg-red-50 rounded-lg p-4">
//                     <label className="block text-sm font-medium text-red-800 mb-2">
//                       Reason for marking as rejected *
//                     </label>
//                     <textarea
//                       value={rejectReason}
//                       onChange={(e) => setRejectReason(e.target.value)}
//                       className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                       rows="3"
//                       placeholder="Please provide a detailed reason for marking this business profile as rejected..."
//                       required
//                     />
//                   </div>
//                 )}
//               </div>

//               {/* Show action buttons only for pending businesses */}
//               {activeTab === 'pending' && (
//                 <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-6 pt-4 border-t border-gray-200">
//                   <button
//                     onClick={() => handleApprove(selectedBusiness.id)}
//                     disabled={actionLoading}
//                     className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {actionLoading ? (
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                     ) : (
//                       <CheckCircle className="h-4 w-4 mr-2" />
//                     )}
//                     Approve
//                   </button>

//                   {!showRejectForm ? (
//                     <button
//                       onClick={handleRejectClick}
//                       disabled={actionLoading}
//                       className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       <XCircle className="h-4 w-4 mr-2" />
//                       Reject
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() => handleReject(selectedBusiness.id)}
//                       disabled={actionLoading || !rejectReason.trim()}
//                       className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       {actionLoading ? (
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                       ) : (
//                         <XCircle className="h-4 w-4 mr-2" />
//                       )}
//                       Confirm Reject
//                     </button>
//                   )}
                  
//                   <button
//                     onClick={() => {
//                       setIsModalOpen(false);
//                       setShowRejectForm(false);
//                       setRejectReason('');
//                     }}
//                     disabled={actionLoading}
//                     className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BusinessApprovalSection;


import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, Calendar, Building, Mail, FileText, AlertCircle, Users, Download, Search, Filter } from 'lucide-react';

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
    setTimeout(() => setNotification(null), 4000);
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
        <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-200">
          <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
          <span className="hidden sm:inline">Approved</span>
          <span className="sm:hidden">✓</span>
        </div>
      );
    } else if (status === "2" || status === "INCOMPLETE") {
      return (
        <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200">
          <XCircle className="w-3.5 h-3.5 mr-1.5" />
          <span className="hidden sm:inline">Incomplete</span>
          <span className="sm:hidden">✗</span>
        </div>
      );
    } else {
      return (
        <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border border-amber-200">
          <Calendar className="w-3.5 h-3.5 mr-1.5" />
          <span className="hidden sm:inline">Pending</span>
          <span className="sm:hidden">⏳</span>
        </div>
      );
    }
  };

  // Modern Mobile Card View
  const renderMobileCard = (business, isApproved = false) => (
    <div key={business.id} className="bg-white backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6 mb-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center flex-1 min-w-0">
          {/* <div className="flex-shrink-0 h-12 w-12 mr-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-slate-800 to-purple-900 flex items-center justify-center shadow-lg">
              <Building className="h-6 w-6 text-white" />
            </div>
          </div> */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 truncate mb-1">
              {business.business_name}
            </h3>
            <p className="text-sm text-gray-500 truncate">
              Reg: {business.business_registration_number}
            </p>
          </div>
        </div>
        {getStatusBadge(business.user.business_verified)}
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
          <Mail className="h-4 w-4 mr-3 flex-shrink-0 text-blue-500" />
          <span className="truncate font-medium">{business.user.email}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
          <Calendar className="h-4 w-4 mr-3 flex-shrink-0 text-purple-500" />
          <span className="font-medium">{formatDate(business.created_at)}</span>
        </div>
      </div>
      
      <button
        onClick={() => handleViewDocument(business)}
        className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-slate-800 to-purple-900 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transform transition-all duration-200 hover:scale-105 shadow-lg"
      >
        <Eye className="h-5 w-5 mr-2" />
        View Documents
      </button>
    </div>
  );

  const renderBusinessTable = (businessList, isApproved = false) => (
    <div className="overflow-hidden">
      {isApproved && approvedLoading ? (
        <div className="p-12 text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-500 border-t-blue-900 mx-auto mb-4"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-slate-800 to-purple-800 opacity-20 animate-pulse"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading approved businesses...</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="px-8 py-6 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200">
                    Company Details
                  </th>
                  <th className="px-8 py-6 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200">
                    Contact
                  </th>
                  <th className="px-8 py-6 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200">
                    {activeTab === 'approved' ? 'Approved Date' : 'Requested Date'}
                  </th>
                  <th className="px-8 py-6 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200">
                    Status
                  </th>
                  <th className="px-8 py-6 text-center text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {businessList.map((business, index) => (
                  <tr key={business.id} className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        {/* <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-slate-800 to-purple-600 800 items-center justify-center shadow-lg">
                            <Building className="h-6 w-6 text-white" />
                          </div>
                        </div> */}
                        <div className="ml-4">
                          <div className="text-lg font-bold text-gray-900 mb-1">
                            {business.business_name}
                          </div>
                          <div className="text-sm text-gray-500 font-medium">
                            Reg: {business.business_registration_number}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center bg-gray-50 rounded-lg p-3">
                        <Mail className="h-5 w-5 text-blue-500 mr-3" />
                        <div className="text-sm font-medium text-gray-900">{business.user.email}</div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center text-sm font-medium text-gray-700 bg-gray-50 rounded-lg p-3">
                        <Calendar className="h-4 w-4 text-purple-500 mr-2" />
                        {formatDate(business.created_at)}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      {getStatusBadge(business.user.business_verified)}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleViewDocument(business)}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-slate-700 to-purple-800 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transform transition-all duration-200 hover:scale-105 shadow-lg"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">View Documents</span>
                        <span className="sm:hidden">View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden px-6">
            {businessList.map((business) => renderMobileCard(business, isApproved))}
          </div>
        </>
      )}
    </div>
  );

  const renderEmptyState = (title, description, icon) => (
    <div className="p-16 text-center">
      <div className="mb-6">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-500 text-lg">{description}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200/60 p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl w-1/3"></div>
          <div className="space-y-4">
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-5/6"></div>
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-200/60 text-black overflow-hidden backdrop-blur-sm">
      {/* Modern Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 p-6 rounded-2xl shadow-2xl max-w-sm backdrop-blur-lg border ${
          notification.type === 'success' 
            ? 'bg-emerald-50/90 border-emerald-200 shadow-emerald-200/50' 
            : 'bg-red-50/90 border-red-200 shadow-red-200/50'
        }`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {notification.type === 'success' ? (
                <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              ) : (
                <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
              )}
            </div>
            <div className="ml-4">
              <p className={`text-sm font-semibold ${
                notification.type === 'success' ? 'text-emerald-800' : 'text-red-800'
              }`}>
                {notification.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modern Header */}
      <div className="p-8 bg-gradient-to-r from-slate-800 to-purple-800 text-white">
        <h2 className="text-3xl font-bold mb-2 flex items-center">
          <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center mr-4">
            <Building className="w-6 h-6" />
          </div>
          Business Management
        </h2>
        <p className="text-blue-100 text-lg">Manage business verification requests and approvals</p>
      </div>

      <div className="p-8">
        {/* Modern Tab Navigation */}
        <div className="flex space-x-2 bg-gray-100/80 p-2 rounded-2xl mb-8 backdrop-blur-sm">
          <button
            onClick={() => handleTabChange('pending')}
            className={`flex-1 px-6 py-4 text-sm font-bold rounded-xl transition-all duration-300 ${
              activeTab === 'pending'
                ? 'bg-white text-blue-700 shadow-lg shadow-blue-200/50 scale-105'
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
            }`}
          >
            <div className="flex items-center justify-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Pending Approval</span>
              <span className="sm:hidden">Pending</span>
              <span className="ml-2 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                {businesses.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => handleTabChange('approved')}
            className={`flex-1 px-6 py-4 text-sm font-bold rounded-xl transition-all duration-300 ${
              activeTab === 'approved'
                ? 'bg-white text-green-700 shadow-lg shadow-green-200/50 scale-105'
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
            }`}
          >
            <div className="flex items-center justify-center">
              <Users className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Approved Businesses</span>
              <span className="sm:hidden">Approved</span>
              <span className="ml-2 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                {approvedBusinesses.length}
              </span>
            </div>
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-gray-50/50 rounded-2xl overflow-hidden">
          {activeTab === 'pending' && (
            <>
              {businesses.length > 0 ? (
                renderBusinessTable(businesses)
              ) : (
                renderEmptyState(
                  'No Pending Requests',
                  'There are no business verification requests at the moment.',
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-slate-800 to-purple-700 flex items-center justify-center mx-auto">
                    <FileText className="h-10 w-10 text-white" />
                  </div>
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
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-900 to-green-700 flex items-center justify-center mx-auto">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                )
              )}
            </>
          )}
        </div>
      </div>

      {/* Modern Modal for Document Review */}
      {isModalOpen && selectedBusiness && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 p-4">
          <div className="relative top-4 sm:top-10 mx-auto p-0 border-0 w-full max-w-5xl shadow-2xl rounded-3xl bg-white overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-800 to-purple-900 text-white p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Business Details Review</h3>
                  <p className="text-blue-100">Comprehensive verification assessment</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
                  disabled={actionLoading}
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-8 max-h-[80vh] overflow-y-auto">
              <div className="space-y-8">
                {/* Business Information Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200/50">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Business Name</label>
                    <p className="text-lg font-semibold text-gray-900">{selectedBusiness.business_name}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200/50">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Registration Number</label>
                    <p className="text-lg font-semibold text-gray-900">{selectedBusiness.business_registration_number}</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200/50">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Account Holder</label>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedBusiness.account_holder_first_name} {selectedBusiness.account_holder_last_name}
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200/50">
                  <label className="block text-sm font-bold text-gray-700 mb-3">Business Address</label>
                  <div className="text-gray-900 space-y-1">
                    <p className="font-medium">{selectedBusiness.street}</p>
                    {selectedBusiness.street_line2 && <p className="font-medium">{selectedBusiness.street_line2}</p>}
                    <p className="font-medium">{selectedBusiness.city}, {selectedBusiness.state} {selectedBusiness.zip_code}</p>
                    <p className="font-semibold text-amber-700">{selectedBusiness.country}</p>
                  </div>
                </div>

                {/* Previous verification reason */}
                {selectedBusiness.user.verification_reason && (
                  <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-2xl p-6">
                    <label className="block text-sm font-bold text-red-800 mb-3 flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Previous Verification Notes
                    </label>
                    <p className="text-red-700 font-medium bg-white/50 rounded-xl p-4">{selectedBusiness.user.verification_reason}</p>
                  </div>
                )}

                {/* Document Section */}

                {activeTab === "pending" &&(
                   <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
                    <h4 className="text-xl font-bold flex items-center">
                      <FileText className="h-6 w-6 mr-3" />
                      Registration Document
                    </h4>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
                      <div className="flex items-center min-w-0 bg-gray-50 rounded-xl p-4">
                        <FileText className="h-6 w-6 text-indigo-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700 font-medium truncate">
                          {selectedBusiness.registration_document_path.split('/').pop()}
                        </span>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => window.open(`${selectedBusiness.registration_document_path}`, '_blank')}
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-slate-800 to-indigo-900 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transform transition-all duration-200 hover:scale-105 shadow-lg"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">View Document</span>
                          <span className="sm:hidden">View</span>
                        </button>
                        <button
                          onClick={() => handleDownloadDocument(
                            selectedBusiness.registration_document_path,
                            `${selectedBusiness.business_name}_registration_document.${selectedBusiness.registration_document_path.split('.').pop()}`
                          )}
                          disabled={downloadLoading}
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-700 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 transform transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {downloadLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          ) : (
                            <Download className="h-4 w-4 mr-2" />
                          )}
                          <span className="hidden sm:inline">Download</span>
                          <span className="sm:hidden">DL</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Enhanced Document Preview */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200">
                      <div className="aspect-w-16 aspect-h-9">
                        {selectedBusiness.registration_document_path.toLowerCase().includes('.pdf') ? (
                          <iframe
                            src={`${selectedBusiness.registration_document_path}`}
                            className="w-full h-80 border-0 rounded-xl shadow-inner"
                            title="Document Preview"
                          />
                        ) : (
                          <img
                            src={`${selectedBusiness.registration_document_path}`}
                            alt="Registration Document"
                            className="w-full h-80 object-contain rounded-xl shadow-inner"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        )}
                        <div className="hidden w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                          <div className="text-center">
                            <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center mx-auto mb-4">
                              <FileText className="h-8 w-8 text-gray-500" />
                            </div>
                            <p className="text-lg font-semibold text-gray-600 mb-2">Preview not available</p>
                            <p className="text-sm text-gray-500">Use View or Download buttons above</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                )}
               

                {/* Modern Reject Reason Form */}
                {showRejectForm && (
                  <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl p-6">
                    <label className="block text-lg font-bold text-red-800 mb-4 flex items-center">
                      <XCircle className="h-6 w-6 mr-3" />
                      Reason for Rejection *
                    </label>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="w-full px-6 py-4 border-2 border-red-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-500 text-gray-800 font-medium bg-white/80 backdrop-blur-sm resize-none"
                      rows="4"
                      placeholder="Please provide a detailed reason for rejecting this business profile. Be specific about what needs to be corrected or improved..."
                      required
                    />
                  </div>
                )}
              </div>

              {/* Modern Action Buttons - Only for pending businesses */}
              {activeTab === 'pending' && (
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-end space-y-4 lg:space-y-0 lg:space-x-4 mt-8 pt-8 border-t-2 border-gray-200">
                  <button
                    onClick={() => handleApprove(selectedBusiness.id)}
                    disabled={actionLoading}
                    className="w-full lg:w-auto inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-800 to-green-900 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 transform transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {actionLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                    ) : (
                      <CheckCircle className="h-5 w-5 mr-3" />
                    )}
                    Approve Business
                  </button>

                  {!showRejectForm ? (
                    <button
                      onClick={handleRejectClick}
                      disabled={actionLoading}
                      className="w-full lg:w-auto inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-rose-700 focus:outline-none focus:ring-4 focus:ring-red-200 transform transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      <XCircle className="h-5 w-5 mr-3" />
                      Reject Application
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReject(selectedBusiness.id)}
                      disabled={actionLoading || !rejectReason.trim()}
                      className="w-full lg:w-auto inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-red-600 to-rose-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-rose-800 focus:outline-none focus:ring-4 focus:ring-red-200 transform transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {actionLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                      ) : (
                        <XCircle className="h-5 w-5 mr-3" />
                      )}
                      Confirm Rejection
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setShowRejectForm(false);
                      setRejectReason('');
                    }}
                    disabled={actionLoading}
                    className="w-full lg:w-auto px-8 py-4 text-gray-700 font-bold bg-gray-200 hover:bg-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-gray-200 transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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