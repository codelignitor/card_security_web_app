import React, { useState, useEffect } from 'react';
import { Edit, Save, X, AlertCircle, CheckCircle, RefreshCw, DollarSign, Calendar, Users } from 'lucide-react';

function PricingSectionAdmin() {
  const [packages, setPackages] = useState([]);
  const [editingPackage, setEditingPackage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  // Fetch pricing data on component mount
  useEffect(() => {
    fetchPricingData();
  }, []);

  const fetchPricingData = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://cardsecuritysystem-8xdez.ondigitalocean.app/api/Packages');
      
      if (response.ok) {
        const result = await response.json();
        if (result.status && result.data) {
          setPackages(result.data);
        } else {
          throw new Error(result.message || 'Failed to fetch packages');
        }
      } else {
        throw new Error('Failed to fetch packages');
      }
    } catch (error) {
      showNotification('error', 'Failed to fetch pricing data');
      console.error('Error fetching pricing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePricing = async (packageData) => {
    setLoading(true);
    try {
      const response = await fetch(`https://cardsecuritysystem-8xdez.ondigitalocean.app/api/Packages/Update/${packageData.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          monthly_limit: packageData.monthly_limit,
          overage_rate: packageData.overage_rate,
          package_price: packageData.package_price,
          package_period: packageData.package_period,
          package_description: packageData.package_description || ''
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Check if the API returned a success response
        if (result.status === true) {
          // Update the local state
          setPackages(prev => prev.map(pkg => 
            pkg.id === packageData.id ? packageData : pkg
          ));
          setEditingPackage(null);
          showNotification('success', `${packageData.package_name} package updated successfully!`);
        } else {
          throw new Error(result.message || 'Failed to update package');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      showNotification('error', `Failed to update pricing: ${error.message}`);
      console.error('Error updating pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000);
  };

  const handleEdit = (packageData) => {
    setEditingPackage({
      ...packageData,
      overage_rate: parseFloat(packageData.overage_rate),
      package_price: parseFloat(packageData.package_price)
    });
  };

  const handleSave = () => {
    if (editingPackage) {
      updatePricing(editingPackage);
    }
  };

  const handleCancel = () => {
    setEditingPackage(null);
  };

  const handleInputChange = (field, value) => {
    setEditingPackage(prev => ({
      ...prev,
      [field]: field === 'monthly_limit' ? parseInt(value) || 0 : 
               field === 'overage_rate' || field === 'package_price' ? parseFloat(value) || 0 : 
               value
    }));
  };

  const getPackageDesign = (packageName) => {
    switch (packageName.toLowerCase()) {
      case 'standard':
        return {
          colorClass: 'text-blue-600',
          bgGradient: 'bg-gradient-to-br from-blue-50 to-blue-100',
          borderColor: 'border-blue-200',
          accentColor: 'bg-blue-600'
        };
      case 'premium':
        return {
          colorClass: 'text-purple-600',
          bgGradient: 'bg-gradient-to-br from-purple-50 to-purple-100',
          borderColor: 'border-purple-200',
          accentColor: 'bg-purple-600'
        };
      default:
        return {
          colorClass: 'text-gray-600',
          bgGradient: 'bg-gradient-to-br from-gray-50 to-gray-100',
          borderColor: 'border-gray-200',
          accentColor: 'bg-gray-600'
        };
    }
  };

  const renderPackageCard = (packageData) => {
    const isEditing = editingPackage?.id === packageData.id;
    const design = getPackageDesign(packageData.package_name);

    return (
      <div key={packageData.id} className={` text-black relative overflow-hidden rounded-xl border-2 ${design.borderColor} ${design.bgGradient} shadow-lg hover:shadow-xl transition-all duration-300`}>
        {/* Header accent bar */}
        <div className={`h-1 ${design.accentColor}`}></div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2">
              <DollarSign className={`w-6 h-6 ${design.colorClass}`} />
              <h3 className="font-bold text-xl text-gray-800">{packageData.package_name}</h3>
            </div>
            {!isEditing && (
              <button
                onClick={() => handleEdit(packageData)}
                className={`p-2 rounded-lg ${design.accentColor} text-white hover:opacity-80 transition-opacity shadow-md`}
                disabled={loading}
              >
                <Edit size={16} />
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <DollarSign className="inline w-4 h-4 mr-1" />
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingPackage.package_price}
                    onChange={(e) => handleInputChange('package_price', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Users className="inline w-4 h-4 mr-1" />
                    Monthly Limit
                  </label>
                  <input
                    type="number"
                    value={editingPackage.monthly_limit}
                    onChange={(e) => handleInputChange('monthly_limit', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Overage Rate ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingPackage.overage_rate}
                    onChange={(e) => handleInputChange('overage_rate', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Period
                  </label>
                  <input
                    type="text"
                    value={editingPackage.package_period}
                    onChange={(e) => handleInputChange('package_period', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editingPackage.package_description || ''}
                  onChange={(e) => handleInputChange('package_description', e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Enter package description..."
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center space-x-2 font-semibold shadow-md transition-all"
                >
                  <Save size={18} />
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 disabled:opacity-50 flex items-center justify-center space-x-2 font-semibold shadow-md transition-all"
                >
                  <X size={18} />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <p className={`text-5xl font-bold ${design.colorClass} mb-2`}>
                  ${packageData.package_price}
                </p>
                <p className="text-gray-500 text-lg font-medium">
                  per {packageData.package_period}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white bg-opacity-60 rounded-lg">
                  <span className="text-gray-700 font-medium flex items-center">
                    <Users className="w-4 h-4 mr-2 text-gray-500" />
                    Monthly Limit
                  </span>
                  <span className="font-bold text-gray-800">
                    {packageData.monthly_limit === 100000000 ? 'Unlimited' : packageData.monthly_limit.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white bg-opacity-60 rounded-lg">
                  <span className="text-gray-700 font-medium flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                    Overage Rate
                  </span>
                  <span className="font-bold text-gray-800">
                    ${packageData.overage_rate}
                  </span>
                </div>
              </div>

              {packageData.package_description && (
                <div className="mt-4 p-3 bg-white bg-opacity-60 rounded-lg">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {packageData.package_description}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br text-black from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
          {/* Notification */}
          {notification.show && (
            <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 shadow-md ${
              notification.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span className="font-medium">{notification.message}</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Pricing Management</h1>
              <p className="text-gray-600">Manage your subscription packages and pricing tiers</p>
            </div>
            <button
              onClick={fetchPricingData}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 font-semibold shadow-lg transition-all duration-200 flex items-center space-x-2"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && !editingPackage ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading pricing data...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Package Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {packages.slice(0, 2).map(packageData => renderPackageCard(packageData))}
            </div>
            
            {/* Instructions */}
            {!editingPackage && packages.length > 0 && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 shadow-md">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-600 text-white p-2 rounded-lg">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">How to Edit Packages</h3>
                    <p className="text-blue-800 leading-relaxed">
                      Click the edit button on any package card to modify pricing, limits, and descriptions. 
                      Your changes will be automatically saved to the API and reflected immediately.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {packages.length === 0 && !loading && (
              <div className="text-center py-16">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <DollarSign size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Packages Found</h3>
                <p className="text-gray-500 mb-4">Unable to load pricing packages. Please try refreshing.</p>
                <button
                  onClick={fetchPricingData}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition-all"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PricingSectionAdmin;