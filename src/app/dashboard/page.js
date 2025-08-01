'use client'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect, Suspense } from 'react';
import BusinessScreen from '../components/Dashboard-Screens/BusinessScreen';
import SubscriptionsScreen from '../components/Dashboard-Screens/SubscriptionScreen';
import DocumentsScreen from '../components/Dashboard-Screens/DocumentScreens';
import DevelopersScreen from '../components/Dashboard-Screens/Developer';
import Sidebar from '../components/Dashboard-Screens/Sidebar';
import HomeScreen from '../components/Dashboard-Screens/Homescreen';
import CardFeatureScreen from '../components/Dashboard-Screens/CardFeatureScreen';


// Loading component for Suspense fallback
function DashboardLoader() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    </div>
  );
}


// Updated getStatusFromBusinessVerified function
// Function to map business_verified value to status - UPDATE THIS FUNCTION
function getStatusFromBusinessVerified(businessVerified) {
  if (businessVerified === null || businessVerified === undefined || businessVerified === '') {
    return 'incomplete-profile';
  }
  
  switch (businessVerified.toString().toUpperCase()) {
    case 'INCOMPLETE PROFILE':
    case 'INCOMPLETE_PROFILE':
      return 'incomplete-profile';
    case 'INCOMPLETE':
      return 'incomplete';
    case 'PENDING':
      return 'pending';
    case 'APPROVED':
    case 'VERIFIED':
    case 'ACTIVE':
      return 'approved';
    case 'REJECTED':
    case 'DECLINED':
      return 'rejected';
    case '0':
      return 'pending';
    case '1':
      return 'approved';
    case '2':
      return 'incomplete';
    default:
      return 'incomplete-profile';
  }
}

// Separate component that uses useSearchParams
function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  
// Add this function to your dashboard component
const getUserDataFromStorage = () => {
  try {
    const userData = localStorage.getItem('userData');
    if (!userData) return null;
    
    const parsedData = JSON.parse(userData);
    return parsedData;
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    return null;
  }
};

useEffect(() => {
  // Check authentication and authorization
  const checkAuth = () => {
    const userData = getUserDataFromStorage();
    
    if (!userData) {
      // No user data found or expired
      console.log("No valid user data found, redirecting to login");
      router.push("/login");
      return;
    }
    
    const userRole = userData.user?.role;
    
    if (userRole !== "BUSINESS_USER") {
      // User is not a business user
      console.log("Access denied: User is not a business user");
      
      // Redirect based on their actual role
      if (userRole === "SUPER_ADMIN") {
        router.push("/admin");
      } else {
        router.push("/login");
      }
      return;
    }
    
    // User is authenticated and is a business user
    console.log("Access granted: User is a business user");
    setIsAuthenticated(true);
    
    // Set user data to state since access is granted
    const userObj = userData.user || userData;
    setUserData(userObj);
    
    // Extract and set business verification status
    const businessVerifiedStatus = getStatusFromBusinessVerified(userObj.business_verified);
    setStatus(businessVerifiedStatus);
    
    console.log('User object:', userObj);
    console.log('Business verified status:', userObj.business_verified);
    console.log('Mapped status:', businessVerifiedStatus);
  };

  checkAuth();
}, [router]);

// Check if user came from OTP verification
useEffect(() => {
  const verified = searchParams.get('verified');
  if (verified === 'true') {
    console.log('User verified via OTP');
  }
  setIsLoading(false);
}, [searchParams]);

// Handle screen size changes and set initial sidebar state
useEffect(() => {
  const checkScreenSize = () => {
    const isLg = window.innerWidth >= 1024; // lg breakpoint is 1024px
    setIsLargeScreen(isLg);
    
    setSidebarOpen(isLg);
  };

  // Check initial screen size
  checkScreenSize();

  // Add event listener for resize
  window.addEventListener('resize', checkScreenSize);

  // Cleanup event listener
  return () => window.removeEventListener('resize', checkScreenSize);
}, []);

  // Auto-close sidebar when switching tabs on small screens
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    
    // Auto-close sidebar on small screens when a tab is selected
    if (!isLargeScreen) {
      setSidebarOpen(false);
    }
  };


  const handleLogout = () => {
  localStorage.removeItem('userData');
  localStorage.removeItem('rememberLogin');
  localStorage.removeItem('savedEmail');
  localStorage.removeItem('savedCountryCode');
  localStorage.removeItem('businessSubmissionId');
  
  router.replace('/login');
};

  const [businessInfo, setBusinessInfo] = useState({
    business_name: '',
    business_registration_number: '',
    street: '',
    street_line2: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'United States of America',
    account_holder_first_name: '',
    account_holder_last_name: '',
    registration_document: null,
    email: ''
  });
  
  const [documents, setDocuments] = useState([]);
  const [status, setStatus] = useState('pending'); // Initialize as incomplete
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // API Integration States
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Sidebar items for header title lookup
  const sidebarItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'profile', label: 'Business Profile', icon: '👤' },
    { id: 'balance', label: 'Balance', icon: '💰' },
    { id: 'subscriptions', label: 'Subscriptions', icon: '📋' },
    { id: 'documents', label: 'Documents', icon: '📄' },
    { id: 'support', label: 'Support', icon: '💬' },
    { id: 'developers', label: 'Developers', icon: '⚡' }
  ];

const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setBusinessInfo(prev => ({
        ...prev,
        [name]: files[0] || null
      }));
    } else {
      setBusinessInfo(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setDocuments(prev => [...prev, ...files]);
  };

  const removeDocument = (index) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

 // API INTEGRATION - Fixed handleSubmit function
// console.log("User Data at submit:", userData);
 const handleSubmit = async () => {
  setIsSubmitting(true);
  setSubmitError(null);
  setSubmitSuccess(false);
  
  
  // Validation
  const requiredFields = ['business_name', 'business_registration_number', 'account_holder_first_name', 'account_holder_last_name', 'street', 'city', 'state', 'country', 'email'];
  const missingFields = requiredFields.filter(field => !businessInfo[field]?.trim());
  
  //check for all Required fields in case of Incomplete profile 
  if (status === "incomplete-profile" || status === "INCOMPLETE-PROFILE"){
    if (missingFields.length > 0) {
      setSubmitError('Please fill in all required field');
      setIsSubmitting(false);
      return;
    }
  }

  if (!businessInfo.registration_document) {
    setSubmitError('Please upload a business registration document');
    setIsSubmitting(false);
    return;
  }
  
  try {
    // Prepare FormData for API submission
    const formData = new FormData();
    formData.append("user_id", userData?.id); // or merchant_id 

    // Add all business information fields individually
    Object.keys(businessInfo).forEach(key => {
      if (key === 'registration_document' && businessInfo[key]) {
        formData.append('registration_document', businessInfo[key]);
      } else if (key !== 'registration_document' && businessInfo[key]) {
        formData.append(key, businessInfo[key]);
      }
    });

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    
    // Make API call
    const response = await fetch('https://cardsecuritysystem-8xdez.ondigitalocean.app/api/business-profile', {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - let browser set it for FormData
    });
    
    // Check if response is successful
    if (response.ok) {
      let result;
      
      try {
        result = await response.json();
      } catch (parseError) {
        // If JSON parsing fails, treat as success if status is ok
        result = { message: 'Business profile submitted successfully' };
      }
      
      // FIXED: Handle different success response formats including your API's structure
      const isSuccess = result.status === true ||           // Your API returns status: true
                       result.success === true || 
                       result.success === 'true' ||
                       result.message?.includes('successfully') ||
                       result.status === 'success' ||
                       response.status === 200 || 
                       response.status === 201;
      
      if (isSuccess) {
        setStatus('pending');
        setActiveTab('profile');
        setSubmitSuccess(true);
        
        // Store submission ID for tracking - check your API response structure
        if (typeof window !== 'undefined') {
          const submissionId = result.data?.id || result.submissionId || result.id || Date.now().toString();
          localStorage.setItem('businessSubmissionId', submissionId);
        }
        
        // Update userData in localStorage with new business_verified status
        if (userData) {
          // Get the original stored data structure
          const storedUserData = JSON.parse(localStorage.getItem('userData') || '{}');
          
          let updatedUserData;
          if (storedUserData.user) {
            // If nested structure, update the nested user object
            updatedUserData = {
              ...storedUserData,
              user: {
                ...storedUserData.user,
                business_verified: 'PENDING'
              }
            };
          } else {
            // If flat structure, update directly
            updatedUserData = {
              ...storedUserData,
              business_verified: 'PENDING'
            };
          }
          
          localStorage.setItem('userData', JSON.stringify(updatedUserData));
          
          // Update state with the user object (not the wrapper)
          const userObj = updatedUserData.user || updatedUserData;
          setUserData(userObj);
          
          // Immediately check the new status via API
          setTimeout(() => {
            checkBusinessVerificationStatus(userObj.id);
          }, 2000); // Check after 2 seconds to allow server processing
        }
        
        console.log('Submission successful:', result);
      } else {
        throw new Error(result.error || result.message || 'Submission failed');
      }
    } else {
      // Handle HTTP error status codes
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
    }
    
  } catch (error) {
    console.error('Submission failed:', error);
    
    // Handle different types of errors
    if (error.message.includes('400')) {
      setSubmitError('Invalid data submitted. Please check your information.');
    } else if (error.message.includes('500')) {
      setSubmitError('Server error. Please try again later.');
    } else if (error.message.includes('Failed to fetch')) {
      setSubmitError('Network error. Please check your connection.');
    } else {
      setSubmitError(error.message || 'An unexpected error occurred. Please try again.');
    }
  } finally {
    setIsSubmitting(false);
  }
};

// API function to check business verification status
const checkBusinessVerificationStatus = async (userId) => {
  try {
    const response = await fetch(`https://cardsecuritysystem-8xdez.ondigitalocean.app/api/business-profile/business-verification-status?user_id=${userId}`);
    //  console.log(userData?.userId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.status === true || result.success === true) {
      // Extract business verification status from the API response
      const businessVerified = result.data?.business_verified;
      const verificationReason = result.data?.verification_reason;
      const verificationStatus = result.data?.verification_status;
      const userId = result.data?.user_id;
      
      console.log('Business verification API response:', result);
      console.log('Business verified status:', businessVerified);
      console.log('Verification reason:', verificationReason);
      console.log('Verification status message:', verificationStatus);
      
      // Map the business_verified value to our internal status
      const newStatus = getStatusFromBusinessVerified(businessVerified);
      setStatus(newStatus);
      
      // Update localStorage if the status has changed
      if (userData && userData.business_verified !== businessVerified) {
        // Get the original stored data structure
        const storedUserData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        let updatedUserData;
        if (storedUserData.user) {
          // If nested structure, update the nested user object
          updatedUserData = {
            ...storedUserData,
            user: {
              ...storedUserData.user,
              business_verified: businessVerified,
              verification_reason: verificationReason,
              verification_status: verificationStatus
            }
          };
        } else {
          // If flat structure, update directly
          updatedUserData = {
            ...storedUserData,
            business_verified: businessVerified,
            verification_reason: verificationReason,
            verification_status: verificationStatus
          };
        }
        
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        
        // Update state with the user object (not the wrapper)
        const userObj = updatedUserData.user || updatedUserData;
        setUserData(userObj);
        
        console.log('Updated user data in localStorage:', updatedUserData);
      }
      
      return result.data;
    } else {
      console.warn('API response indicates failure:', result);
      throw new Error(result.message || 'Failed to retrieve business verification status');
    }
  } catch (error) {
    console.error('Failed to check business verification status:', error);
    
    // Fallback to checking localStorage data if API fails
    if (userData?.business_verified) {
      const fallbackStatus = getStatusFromBusinessVerified(userData.business_verified);
      setStatus(fallbackStatus);
      console.log('Using fallback status from localStorage:', fallbackStatus);
    }
  }
};

// Legacy API function to check business status (keeping as backup)
const checkBusinessStatus = async () => {
  try {
    const response = await fetch(`https://cardsecuritysystem-8xdez.ondigitalocean.app/api/business-profile`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      // Check the business_verified field to determine status
      const businessVerified = result.data?.user?.business_verified;
      
      const newStatus = getStatusFromBusinessVerified(businessVerified);
      setStatus(newStatus);
      
      // Update localStorage if the status has changed
      if (userData && userData.business_verified !== businessVerified) {
        // Get the original stored data structure  
        const storedUserData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        let updatedUserData;
        if (storedUserData.user) {
          // If nested structure, update the nested user object
          updatedUserData = {
            ...storedUserData,
            user: {
              ...storedUserData.user,
              business_verified: businessVerified
            }
          };
        } else {
          // If flat structure, update directly
          updatedUserData = {
            ...storedUserData,
            business_verified: businessVerified
          };
        }
        
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        
        // Update state with the user object (not the wrapper)
        const userObj = updatedUserData.user || updatedUserData;
        setUserData(userObj);
      }
      
      return result.data;
    }
  } catch (error) {
    console.error('Failed to check business status:', error);
  }
};

  // Check status on component mount and periodically
  useEffect(() => {
    if (userData?.id) {
      // Initial status check when user data is available
      checkBusinessVerificationStatus(userData.id);
      
      // Set up periodic status checking (every 30 seconds)
      const statusCheckInterval = setInterval(() => {
        checkBusinessVerificationStatus(userData.id);
      }, 30000);
      
      // Cleanup interval on component unmount
      return () => clearInterval(statusCheckInterval);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.id]);

  // Legacy status check (keeping for backward compatibility)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const submissionId = localStorage.getItem('businessSubmissionId');
      if (submissionId && !userData?.id) {
        // Only use legacy method if user ID is not available
        checkBusinessStatus();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.id]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            status={status} 
            setActiveTab={handleTabChange}
          />
        );
        
      case 'profile':
        return (
          <BusinessScreen
            businessInfo={businessInfo}
            setBusinessInfo={setBusinessInfo}
            documents={documents}
            status={status}
            isSubmitting={isSubmitting}
            submitError={submitError}
            submitSuccess={submitSuccess}
            handleInputChange={handleInputChange}
            handleFileUpload={handleFileUpload}
            removeDocument={removeDocument}
            handleSubmit={handleSubmit}
            router={router}
          />
        );
        
         
      case 'subscriptions':
        return <SubscriptionsScreen />;
        
        case 'Card':
        return <CardFeatureScreen />;

      case 'documents':
        return (
          <DocumentsScreen 
            documents={documents} 
            setActiveTab={handleTabChange}
            handleFileUpload={handleFileUpload}
          />
        );
        
 

      case 'developers':
        return <DevelopersScreen />;
        
      default:
        return null;
    }
  };

  if (isLoading) {
    return <DashboardLoader />;
  }

  return (
    <div className="h-screen bg-gray-50 text-black flex overflow-hidden">
      {/* Fixed Sidebar - No scrolling */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        status={status}
        isLargeScreen={isLargeScreen}
      />

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <header className="flex-shrink-0 bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              {/* Mobile menu button - only show on small screens */}
              <div className="flex items-center space-x-4">
          
                <h2 className="text-2xl font-bold text-gray-900">
                  {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                </h2>
              </div>
           <div className="flex items-center space-x-4">
  {/* <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
    {businessInfo.account_holder_first_name ? businessInfo.account_holder_first_name.charAt(0).toUpperCase() : 'U'}
  </div> */}
  <button
    onClick={handleLogout}
    className="text-sm text-gray-600 hover:text-red-600 transition"
  >
    Logout
  </button>
</div>

            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className=" p-3">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && !isLargeScreen && (
        <div 
          className="fixed inset-0 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

// Main component wrapped with Suspense
function ClientDashboard() {
  return (
    <Suspense fallback={<DashboardLoader />}>
      <DashboardContent />
    </Suspense>
  );
}

export default ClientDashboard;