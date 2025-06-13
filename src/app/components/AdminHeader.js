import React from 'react';

const Header = () => {
  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logout clicked');
  };

  return (
    <header className="bg-slate-700 text-white px-6 py-4 shadow-lg">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">Super Admin Dashboard</h1>
          <div className="hidden md:flex items-center space-x-2 text-sm text-slate-300">
            <span>•</span>
            <span>Control Panel</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="hidden sm:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-slate-300">Online</span>
            </div>
            <span className="text-sm text-slate-300">Welcome, Admin!</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-slate-600 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M15 17h5l-5 5-5-5h5v-5h5v5z" />
              </svg>
            </button>
            
            <button 
              onClick={handleLogout}
              className="text-blue-300 hover:text-blue-200 text-sm px-3 py-1 rounded-lg hover:bg-slate-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;