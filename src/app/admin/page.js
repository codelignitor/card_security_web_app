'use client'
import React, { useState, useEffect } from 'react';
// import ContentManagement from '../components/ContentManagement';
import BusinessApprovalSection from '../components/Super Admin/BusinessApproved';
import { useRouter } from 'next/navigation';
import Header from '../components/Super Admin/AdminHeader';
import NavigationTabs from '../components/Super Admin/AdminNav';
import PricingSectionAdmin from '../components/Super Admin/PricingSection';


// Placeholder components for other sections


const UserActivitySection = () => (
  <div className="bg-white rounded-lg shadow-sm border p-6">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">User Activity</h2>
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-800">Total Users</h3>
          <p className="text-2xl font-bold text-blue-600">1,247</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-medium text-green-800">Active Today</h3>
          <p className="text-2xl font-bold text-green-600">89</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-medium text-purple-800">API Calls Today</h3>
          <p className="text-2xl font-bold text-purple-600">2,156</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="font-medium text-orange-800">New Signups</h3>
          <p className="text-2xl font-bold text-orange-600">23</p>
        </div>
      </div>
      <div className="border rounded-lg p-4 text-black">
        <h4 className="font-medium mb-3">Recent Activity</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center py-2 border-b">
            <span>john.doe@example.com made 45 API calls</span>
            <span className="text-gray-500">2 hours ago</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span>New user registration: jane.smith@company.com</span>
            <span className="text-gray-500">3 hours ago</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span>Enterprise client exceeded API limit</span>
            <span className="text-gray-500">5 hours ago</span>
          </div>
        </div>
      </div>
      <p className="text-gray-600">
        This section would show detailed user activity, API usage statistics, 
        user behavior analytics, and real-time monitoring data.
      </p>
    </div>
  </div>
);

const APIDocumentationSection = () => (
  <div className="bg-white rounded-lg shadow-sm border p-6">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">API Documentation & Integration</h2>
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available APIs */}
        <div>
          <h3 className="font-medium text-gray-800 mb-3">Available APIs</h3>
          <div className="space-y-2">
            {[
              'User Management API',
              'Content Management API',
              'Analytics API',
              'Billing API',
              'Notification API'
            ].map((api, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <span className="text-blue-600 font-medium">{api}</span>
                <button className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  View Docs
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Integration */}
        <div>
          <h3 className="font-medium text-gray-800 mb-3">Quick Integration</h3>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm">
            <div className="mb-2 text-gray-400">{/* Content API Example */}</div>
            <pre className="whitespace-pre-wrap">{`fetch('/api/content', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify(contentData)
})`}</pre>
          </div>
          <button className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
            Copy Integration Code
          </button>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-2">Integration Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-3 rounded-lg">
            <h5 className="font-medium text-green-800">Active Integrations</h5>
            <p className="text-2xl font-bold text-green-600">8</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <h5 className="font-medium text-yellow-800">Pending Setup</h5>
            <p className="text-2xl font-bold text-yellow-600">2</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <h5 className="font-medium text-blue-800">Total API Calls</h5>
            <p className="text-2xl font-bold text-blue-600">45,123</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Main Dashboard Component

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Enterprise Approval');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Helper function to get userData and check if it's expired
  const getUserDataFromStorage = () => {
    try {
      const storedData = localStorage.getItem("userData");
      if (!storedData) return null;
      
      const userData = JSON.parse(storedData);
      const now = new Date().getTime();
      
      // Check if data has expired
      if (userData.expirationTime && now > userData.expirationTime) {
        localStorage.removeItem("userData");
        return null;
      }
      
      return userData;
    } catch (error) {
      console.error("Error reading userData from localStorage:", error);
      localStorage.removeItem("userData");
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
        router.push("/admin-login");
        return;
      }
      
      // const userRole = "SUPER_ADMIN";


      const userRole = userData.user?.role;
      
      if (userRole !== "SUPER_ADMIN") {
        // User is not a superadmin
        console.log("Access denied: User is not a superadmin");
        
        // Redirect based on their actual role
        if (userRole === "BUSINESS_USER") {
          router.push("/dashboard");
        } else {
          router.push("/login");
        }
        return;
      }
      
      // User is authenticated and is a superadmin
      console.log("Access granted: User is a superadmin");
      setIsAuthenticated(true);
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    // Only start the loading simulation if user is authenticated
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  // Show loading spinner while checking authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'Enterprise Approval':
        return <BusinessApprovalSection />;
       case 'Pricing':
        return <PricingSectionAdmin />;
      case 'User Activity':
        // return <UserActivitySection />;
      case 'Content Management':
        // return <ContentManagement />;
      case 'API Documentation':
        // return <APIDocumentationSection />;
      default:
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{activeTab}</h2>
            <p className="text-gray-600">This section is not implemented yet.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
             
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Quick Stats Bar */}
                  
          {/* Main Content */}
          {renderTabContent()}
        </div>
      </main>
       
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>© CardNest 2025 Super Admin Dashboard. All rights reserved.</span>
            <div className="flex items-center space-x-4">
              <span>Version 2.1.0</span>
              <span>•</span>
              <a href="#" className="text-blue-600 hover:text-blue-800">Documentation</a>
              <span>•</span>
              <a href="#" className="text-blue-600 hover:text-blue-800">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
