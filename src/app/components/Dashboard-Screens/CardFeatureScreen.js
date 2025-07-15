'use client';

import { useState } from 'react';
import { Check, CreditCard, Shield, Zap, Phone, RotateCcw } from 'lucide-react';
import Image from 'next/image';

const CreditCardFeatureSelector = () => {
  const [selectedFeatures, setSelectedFeatures] = useState({
    bank_logo: false,
    chip: false,
    mag_strip: false,
    sig_strip: false,
    hologram: false,
    customer_service: false,
    symmetry: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const frontFeatures = [
    { key: 'bank_logo', label: 'Bank Logo', icon: CreditCard },
    { key: 'chip', label: 'Chip', icon: Zap },
    { key: 'hologram', label: 'Hologram', icon: Shield }
  ];

  const backFeatures = [
    { key: 'mag_strip', label: 'Magnetic Strip', icon: CreditCard },
    { key: 'sig_strip', label: 'Signature Strip', icon: CreditCard },
    { key: 'customer_service', label: 'Customer Service Info', icon: Phone },
    { key: 'symmetry', label: 'Symmetry Design', icon: RotateCcw }
  ];

  const handleFeatureToggle = (feature) => {
    setSelectedFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/card-features', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          features: selectedFeatures,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('Features saved successfully!');
        console.log('Saved features:', data);
      } else {
        throw new Error('Failed to save features');
      }
    } catch (error) {
      setMessage('Error saving features. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedCount = () => {
    return Object.values(selectedFeatures).filter(Boolean).length;
  };

  return (
    <div className="h-full mx-auto flex flex-col w-[100%]">
      <div className="flex-1 overflow-hidden ">
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Card Preview */}
        <div className="flex   flex-col h-[350px]">
          <div className="flex-1 flex flex-col justify-center space-y-4 lg:space-y-6 p-2 lg:p-4">
            {/* Card Front */}
            <div className="flex-1 flex flex-col items-center ">
              <h3 className="text-sm lg:text-base font-semibold mb-2 lg:mb-3 text-center flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Card Front
              </h3>
              <div className="w-full max-w-xs lg:max-w-sm">
                <Image 
                  src="/images/cardfront.png" 
                  alt="Credit Card Front" 
                  width="400"
                  height="250"
                  className="w-full h-auto object-contain rounded-xl lg:rounded-2xl shadow-xl lg:shadow-2xl"
                />
              </div>
            </div>
            
            {/* Card Back */}
            <div className="flex-1 flex flex-col items-center ">
              <h3 className="text-sm lg:text-base font-semibold mb-2 lg:mb-3 text-center flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Card Back
              </h3>
              <div className="w-full max-w-xs lg:max-w-sm">
                <Image 
                  src="/images/cardback.png" 
                  alt="Credit Card Back" 
                  width="400"
                  height="250"
                  className="w-full h-auto object-contain rounded-xl lg:rounded-2xl shadow-xl lg:shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Selection - Reduced Size */}
        <div className="h-full  overflow-y-auto">
          <div className="space-y-2 lg:space-y-3 p-1 lg:p-2">
            <div className="bg-white rounded-lg shadow-md p-2 lg:p-3">
              <h3 className="text-sm lg:text-base font-semibold mb-2 lg:mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Front Side Features
              </h3>
              <div className="space-y-1 lg:space-y-2">
                {frontFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <label
                      key={feature.key}
                      className="flex items-center gap-2 p-2 rounded-md border-2 border-gray-200 hover:border-blue-300 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFeatures[feature.key]}
                        onChange={() => handleFeatureToggle(feature.key)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                        selectedFeatures[feature.key] 
                          ? 'bg-blue-600 border-blue-600' 
                          : 'border-gray-300'
                      }`}>
                        {selectedFeatures[feature.key] && (
                          <Check className="w-2 h-2 text-white" />
                        )}
                      </div>
                      <Icon className="w-4 h-4 text-gray-600 flex-shrink-0" />
                      <span className="text-sm font-medium">{feature.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-2 lg:p-3">
              <h3 className="text-sm lg:text-base font-semibold mb-2 lg:mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Back Side Features
              </h3>
              <div className="space-y-1 lg:space-y-2">
                {backFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <label
                      key={feature.key}
                      className="flex items-center gap-2 p-2 rounded-md border-2 border-gray-200 hover:border-blue-300 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFeatures[feature.key]}
                        onChange={() => handleFeatureToggle(feature.key)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                        selectedFeatures[feature.key] 
                          ? 'bg-blue-600 border-blue-600' 
                          : 'border-gray-300'
                      }`}>
                        {selectedFeatures[feature.key] && (
                          <Check className="w-2 h-2 text-white" />
                        )}
                      </div>
                      <Icon className="w-4 h-4 text-gray-600 flex-shrink-0" />
                      <span className="text-sm font-medium">{feature.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Summary and Submit - Reduced Size */}
            <div className="bg-gray-50 rounded-lg p-2 lg:p-3 sticky bottom-0">
              <div className="flex items-center justify-between mb-2 lg:mb-3">
                <h3 className="text-sm lg:text-base font-semibold">Selection Summary</h3>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  {getSelectedCount()} features selected
                </span>
              </div>
              
              {message && (
                <div className={`mb-2 lg:mb-3 p-2 rounded-md text-sm ${
                  message.includes('Error') 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {message}
                </div>
              )}
              
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || getSelectedCount() === 0}
                className="w-full bg-blue-600 text-white py-2 px-3 rounded-md text-sm font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Saving...' : 'Save Features'}
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCardFeatureSelector;