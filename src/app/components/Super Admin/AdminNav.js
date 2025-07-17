'use client'
import React, { useState, useEffect } from 'react';

const NavigationSidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {

  const tabs = [
    { id: 'enterprise', label: 'Enterprise Approval', icon: '🏢' },
    { id: 'pricing', label: 'Pricing', icon: '💰' },
    { id: 'activity', label: 'User Activity', icon: '📊' },
    { id: 'content', label: 'Content Management', icon: '📝' },
    { id: 'api-docs', label: 'API Documentation', icon: '📖' }
  ];

  const handleTabClick = (tabId, tabLabel) => {
    setActiveTab(tabLabel);
    console.log(`Switched to tab: ${tabId}`);
  };

  return (
    <>
      {/* Main Sidebar */}
      <div 
        className={`
          sidebar-container fixed left-0 bg-white shadow-lg border-r border-gray-200 
          transition-all duration-300 ease-in-out flex flex-col z-40
          ${sidebarOpen ? 'w-4/5 sm:w-64' : 'w-16'}
          top-16 h-[calc(100vh-4rem)] h-[calc(100dvh-4rem)] min-h-0
        `}
      >
        {/* Mobile overlay when sidebar is open */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0  z-30 sm:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <div className="flex-shrink-0 p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            {/* Title - Show when sidebar is open */}
            {sidebarOpen && (
              <h1 className="text-xl font-bold text-gray-900">
                Admin Panel
              </h1>
            )}
            
            {/* Toggle button with arrow - always visible */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center justify-center p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              <svg 
                className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${sidebarOpen ? 'rotate-0' : 'rotate-180'}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation - Scrollable middle section */}
        <div className="flex-1 overflow-y-auto">
          <nav className="py-4">
            <div className={`${sidebarOpen ? 'px-4' : 'px-2'} space-y-2`}>
              {tabs.map((tab) => {
                const isActive = activeTab === tab.label;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id, tab.label)}
                    className={`
                      w-full flex items-center text-left rounded-lg transition-all duration-200 group
                      ${sidebarOpen ? 'px-4 py-3' : 'px-2 py-3 justify-center'}
                      ${isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                      }
                    `}
                    title={!sidebarOpen ? tab.label : undefined}
                  >
                    <span className="text-lg flex-shrink-0">{tab.icon}</span>
                    
                    {/* Label - Show when sidebar is open */}
                    {sidebarOpen && (
                      <>
                        <span className="ml-3 font-medium">{tab.label}</span>
                        {isActive && (
                          <div className="ml-auto w-2 h-2 bg-white rounded-full opacity-75"></div>
                        )}
                      </>
                    )}
                    
                    {/* Tooltip for collapsed state */}
                    {!sidebarOpen && (
                      <div className="absolute left-16 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {tab.label}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Bottom section - Show when sidebar is open */}
        {sidebarOpen && (
          <div className="flex-shrink-0 p-4 border-t border-gray-100">
            {/* Breadcrumb */}
            <div className="mb-3 flex items-center space-x-2 text-sm text-gray-500">
              <span>Dashboard</span>
              <span>•</span>
              <span className="text-blue-600 font-medium">{activeTab}</span>
            </div>

            {/* User info at bottom */}
            <div className="px-3 py-2 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">SA</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">Super Admin</p>
                  <p className="text-xs text-gray-500 truncate">admin@cardnest.com</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed state bottom section */}
        {!sidebarOpen && (
          <div className="flex-shrink-0 p-2 border-t border-gray-100">
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center group relative">
                <span className="text-white text-xs font-medium">SA</span>
                
                {/* Tooltip for user info */}
                <div className="absolute left-10 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Super Admin
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NavigationSidebar;