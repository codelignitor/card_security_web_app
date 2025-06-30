'use client';

import React, { useState, use } from 'react';
import { Check, X, ArrowLeft, CreditCard, Shield, Lock } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPlanById } from '@/app/lib/plans';


export default function PaymentPage({ params }) {
  const resolvedParams = use(params);
  const plan = getPlanById(resolvedParams.plan);
  
  // If plan doesn't exist, show 404
  if (!plan) {
    notFound();
  }

  const [formData, setFormData] = useState({
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    city: '',
    zipCode: '',
    country: 'US'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle payment submission here
    console.log('Payment submitted:', formData);
  };

  return (
    
  <div className="min-h-screen text-black bg-white">
  {/* Header */}
  <div className=''>
    <nav className="bg-white backdrop-blur-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <video autoPlay loop muted playsInline width="70">
              <source src="/videos/cardnest.webm" type="video/webm" />
              Your browser does not support the video tag.
            </video> 
          </Link>

          <div className="ml-4 flex items-center space-x-4">
            
          </div>
        </div>
      </div>
    </nav>
  </div>

  {/* Main Content - Add pt-20 to account for fixed navbar height */}
  <div className="max-w-7xl mx-auto px-4 py-8 pt-28">
    <div className="grid lg:grid-cols-2 gap-12">
      
      {/* Left Side - Plan Details */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Subscription
          </h1>
          <p className="text-gray-600">
            You are subscribing to the {plan.name} plan
          </p>
        </div>

        {/* Plan Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Plan Header */}
          <div className={`bg-gradient-to-br ${plan.gradient} p-6 text-white`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold">{plan.name}</h2>
                <p className="text-white/80">{plan.subtitle}</p>
              </div>
              {plan.popular && (
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                  RECOMMENDED
                </span>
              )}
            </div>
            
            <div className="flex items-baseline">
              <span className="text-4xl font-bold">{plan.price}</span>
              {plan.price !== 'SALES' && (
                <span className="text-white/80 ml-2">per month</span>
              )}
            </div>
            <p className="text-white/80 mt-1">{plan.apiScans}</p>
          </div>

          {/* Plan Features */}
          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">What is included:</h3>
            <ul className="space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  {feature.included ? (
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-5 h-5 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
                  )}
                  <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Security Features */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-green-500" />
            Security & Trust
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Lock className="w-4 h-4 mr-2 text-green-500" />
              PCI/DSS Compliant
            </div>
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2 text-green-500" />
              256-bit SSL Encryption
            </div>
            <div className="flex items-center">
              <CreditCard className="w-4 h-4 mr-2 text-green-500" />
              Secure Payment Processing
            </div>
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2 text-green-500" />
              Money Back Guarantee
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Payment Form */}
      <div className="lg:sticky lg:top-28 lg:h-fit">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
                required
              />
            </div>

            {/* Card Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Information
              </label>
              <div className="space-y-3">
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1234 1234 1234 1234"
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="MM/YY"
                    required
                  />
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="CVV"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Cardholder Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                name="cardholderName"
                value={formData.cardholderName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Full name on card"
                required
              />
            </div>

            {/* Billing Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Billing Address
              </label>
              <div className="space-y-3">
                <input
                  type="text"
                  name="billingAddress"
                  value={formData.billingAddress}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Street address"
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="City"
                    required
                  />
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ZIP Code"
                    required
                  />
                </div>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Plan:</span>
                <span className="font-medium">{plan.name}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Billing:</span>
                <span className="font-medium">Monthly</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span>{plan.price === 'SALES' ? 'Contact Sales' : plan.price}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full ${plan.buttonColor} text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5`}
              disabled={plan.price === 'SALES'}
            >
              {plan.price === 'SALES' ? 'Contact Sales Team' : `Subscribe to ${plan.name}`}
            </button>

            <p className="text-xs text-gray-500 text-center">
              By subscribing, you agree to our Terms of Service and Privacy Policy. 
              You can cancel anytime.
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}