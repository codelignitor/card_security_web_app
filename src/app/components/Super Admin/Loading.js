import React from 'react';

const LoadingComponent = ({ message = "Loading dashboard..." }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingComponent;
