'use client'
import React, { useState, useEffect } from 'react';
import ContentManagement from '../components/ContentManagement';
import Header from '../components/AdminHeader';
import NavigationTabs from '../components/AdminNav';
import BusinessApprovalSection from '../components/Super Admin/BusinessApproved';
import { useRouter } from 'next/navigation';


// Placeholder components for other sections
const PayPerCallSection = () => (
  <div className="bg-white rounded-lg shadow-sm border p-6">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Pay-Per-Call Management</h2>
    <div className="space-y-6">
      {/* Pricing Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Current API Pricing</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
            Update Pricing
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">$0.25</div>
            <div className="text-gray-600">Per API Call</div>
            <div className="text-sm text-gray-500 mt-1">Standard Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">$0.20</div>
            <div className="text-gray-600">Bulk Rate (1000+ calls)</div>
            <div className="text-sm text-gray-500 mt-1">20% Discount</div>
          </div>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-800">Today Calls</h3>
          <p className="text-2xl font-bold text-blue-600">2,847</p>
          <p className="text-sm text-gray-600 mt-1">Revenue: $711.75</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-medium text-green-800">This Month</h3>
          <p className="text-2xl font-bold text-green-600">45,623</p>
          <p className="text-sm text-gray-600 mt-1">Revenue: $11,405.75</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-medium text-purple-800">Active Users</h3>
          <p className="text-2xl font-bold text-purple-600">892</p>
          <p className="text-sm text-gray-600 mt-1">Making API calls</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="font-medium text-orange-800">Avg/User/Day</h3>
          <p className="text-2xl font-bold text-orange-600">127</p>
          <p className="text-sm text-gray-600 mt-1">API calls</p>
        </div>
      </div>

      {/* Top Users Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b">
          <h4 className="font-medium text-gray-800">Top API Users (This Month)</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">API Calls</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Daily</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">john.doe@techcorp.com</div>
                  <div className="text-sm text-gray-500">Tech Corp</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">5,847</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$1,461.75</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">195</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">sarah.wilson@startup.io</div>
                  <div className="text-sm text-gray-500">Startup Solutions</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">3,429</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$857.25</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">114</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">mike.chen@enterprise.com</div>
                  <div className="text-sm text-gray-500">Enterprise LLC</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2,156</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$539.00</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">72</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Low Activity
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
        <h4 className="font-medium text-gray-800 mb-4">Revenue Analytics (Last 30 Days)</h4>
        <div className="flex items-center justify-center h-48 bg-white rounded-lg">
          <div className="text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-gray-600">Revenue chart would be displayed here</p>
            <p className="text-sm text-gray-500 mt-1">Integrate with your charting library</p>
          </div>
        </div>
      </div>

      {/* API Call Settings */}
      <div className="bg-white border rounded-lg p-6 text-black">
        <h4 className="font-medium text-gray-800 mb-4">API Call Settings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Standard Rate (per call)
            </label>
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">$</span>
              <input
                type="number"
                step="0.01"
                defaultValue="0.25"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bulk Rate (1000+ calls)
            </label>
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">$</span>
              <input
                type="number"
                step="0.01"
                defaultValue="0.20"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 flex space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Update Rates
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  </div>
);

const PricingSection = () => (
  <div className="bg-white rounded-lg shadow-sm border p-6 text-black">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Pricing Management</h2>
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold text-lg">Standard Plan</h3>
          <p className="text-3xl font-bold text-blue-600">$29<span className="text-sm text-gray-500">/month</span></p>
          <p className="text-gray-600 mt-2">API Calls: 50-60/month</p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold text-lg">Premium Plan</h3>
          <p className="text-3xl font-bold text-purple-600">$79<span className="text-sm text-gray-500">/month</span></p>
          <p className="text-gray-600 mt-2">API Calls: 100/month</p>
        </div>
      </div>
      <p className="text-gray-600">
        This section would allow you to modify pricing plans, set API limits, 
        manage overage rates, and configure billing settings.
      </p>
    </div>
  </div>
);



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
        router.push("/login");
        return;
      }
      
      // const userRole = "superadmin";


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
