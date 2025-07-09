import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 bg-gray-800 rounded-lg p-8 text-white">
      
      {/* Simple Spinner */}
      <div className="w-16 h-16 border-4 border-gray-600 border-t-white rounded-full animate-spin mb-6"></div>

      {/* Loading Text */}
      <h2 className="text-xl font-semibold mb-2">Processing...</h2>
      <p className="text-gray-300 text-center">Please wait while we process your card</p>
      
    </div>
  );
};

export default LoadingScreen;