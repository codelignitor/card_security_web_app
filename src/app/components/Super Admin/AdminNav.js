import React from 'react';

const NavigationTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
        { id: 'enterprise', label: 'Enterprise Approval', icon: '🏢' },
    { id: 'pricing', label: 'Pricing', icon: '💰' },
    { id: 'activity', label: 'User Activity', icon: '📊' },
    { id: 'content', label: 'Content Management', icon: '📝' },
    { id: 'api-docs', label: 'API Documentation', icon: '📖' }
  ];

  const handleTabClick = (tabId, tabLabel) => {
    setActiveTab(tabLabel);
    // You can also use tabId for routing if needed
    console.log(`Switched to tab: ${tabId}`);
  };

  return (
    <nav className="bg-gray-100 border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.label;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id, tab.label)}
                className={`
                  flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg 
                  transition-all duration-200 whitespace-nowrap min-w-fit
                  ${isActive
                    ? 'bg-blue-600 text-white shadow-md transform scale-105'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200 hover:shadow-sm'
                  }
                `}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
                {isActive && (
                  <div className="w-2 h-2 bg-white rounded-full opacity-75"></div>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Breadcrumb */}
        <div className="mt-3 flex items-center space-x-2 text-sm text-gray-500">
          <span>Dashboard</span>
          <span>•</span>
          <span className="text-blue-600 font-medium">{activeTab}</span>
        </div>
      </div>
    </nav>
  );
};

export default NavigationTabs;