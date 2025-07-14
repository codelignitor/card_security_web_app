// 'use client';

// import React, { useState, use, useMemo, useEffect } from 'react';
// import { Check, X, ArrowLeft, CreditCard, Shield, Lock, Salad, ExternalLink } from 'lucide-react';
// import Link from 'next/link';
// import QRCode from "react-qr-code";
// import { notFound, useRouter } from 'next/navigation';

// export default function PaymentPage({ params }) {
//   const router = useRouter();
//   const resolvedParams = use(params);
//   const [plan, setPlan] = useState(null);
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const [notification, setnotification] = useState(null)
//   const [Success, setSuccess] = useState(false)
  
//   // New state for scan integration
//   const [scanData, setScanData] = useState(null);
//   const [scanLoading, setScanLoading] = useState(false);
//   const [scanError, setScanError] = useState(null);

//   const [formData, setFormData] = useState({
//     email: '',
//     billingAddress: '',
//     city: '',
//     zipCode: '',
//     country: 'US',
//     // Contact form fields
//     companyName: '',
//     contactName: '',
//     phone: '',
//     businessType: '',
//     monthlyVolume: '',
//     currentProvider: '',
//     message: ''
//   });

//   // Function to detect if device is mobile
//   const isMobileDevice = () => {
//     return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
//   };

//   // Function to generate scan token
// const generateScanToken = async (userObj) => {
//   setScanLoading(true);
//   setScanError(null);
  
//   try {
//     const requestData = {
//       merchantId: userObj.merchant_id, // Note: API has typo "mercahnt"
//       merchantcontact: userObj.phone_no || '',
//       isMobile: isMobileDevice() ? "true" : "false"
//     };

//     const response = await fetch('https://cardsecuritysystem-8xdez.ondigitalocean.app/api/merchantscan/generateToken', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(requestData)
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || 'Failed to generate scan token');
//     }

//     console.log('Scan token generated:', data);
    
//     // Store scanURL in localStorage
//     if (data.scanURL) {
//       localStorage.setItem('scanURL', data.scanURL);
//     }
    
//     // You might also want to store other data
//     if (data.scanID) {
//       localStorage.setItem('scanID', data.scanID);
//     }
    
//     setScanData(data);
//   } catch (err) {
//     console.error('Error generating scan token:', err);
//     setScanError(err.message);
//   } finally {
//     setScanLoading(false);
//   }
// };

//   // Fetch plan data and user data on component mount
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         // Get user data from localStorage using the correct structure
//         const storedUser = localStorage.getItem('userData');
//         if (!storedUser) {
//           setError('User not logged in. Please log in first.');
//           return;
//         }
        
//         const parsedUser = JSON.parse(storedUser);
//         console.log('User data found in localStorage:', parsedUser);
        
//         // Handle nested user object structure
//         const userObj = parsedUser.user || parsedUser;
//         setUserData(userObj);
        
//         console.log('User object:', userObj);
//         console.log('Merchant ID:', userObj.merchant_id);
        
//         // Pre-fill email if available
//         if (userObj.email) {
//           setFormData(prev => ({ ...prev, email: userObj.email }));
//         }

//         // Fetch packages from API
//         const response = await fetch('https://cardsecuritysystem-8xdez.ondigitalocean.app/api/Packages');
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
        
//         const data = await response.json();
//         if (!data.status || !data.data) {
//           throw new Error('Invalid API response format');
//         }

//         // Find the specific plan by ID
//         const planId = parseInt(resolvedParams.plan);
//         const foundPlan = data.data.find(p => p.id === planId);
        
//         if (!foundPlan) {
//           notFound();
//           return;
//         }

//         // Map API data to component format
//         const mappedPlan = mapApiDataToPlan(foundPlan);
//         setPlan(mappedPlan);
        
//         // Generate scan token for non-enterprise plans
//         if (mappedPlan.price !== 'SALES' && mappedPlan.name.toLowerCase() !== 'enterprise') {
//           await generateScanToken(userObj);
//         }
        
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [resolvedParams.plan]);

//   // Function to map API data to component format
//   const mapApiDataToPlan = (apiPlan) => {
//     const planStyles = {
//       'Standard': {
//         gradient: 'from-purple-500 to-purple-700',
//         bgGradient: 'from-purple-100 to-purple-50',
//         buttonColor: 'bg-purple-500 hover:bg-purple-600',
//         popular: false
//       },
//       'Premium': {
//         gradient: 'from-cyan-400 to-blue-500',
//         bgGradient: 'from-cyan-50 to-blue-50',
//         buttonColor: 'bg-cyan-500 hover:bg-cyan-600',
//         popular: true
//       },
//       'Enterprise': {
//         gradient: 'from-pink-500 to-purple-600',
//         bgGradient: 'from-pink-50 to-purple-50',
//         buttonColor: 'bg-pink-500 hover:bg-pink-600',
//         popular: false
//       }
//     };

//     const style = planStyles[apiPlan.package_name] || planStyles['Standard'];
//     const isEnterprise = apiPlan.package_name === 'Enterprise';
    
//     // Static features that apply to all plans
//     const staticFeatures = [
//       { text: 'Front-side card scan', included: true },
//       { text: 'Back-side scan', included: true },
//       { text: 'AI fraud detection', included: true },
//       { text: 'CardNest protection', included: true },
//       { text: 'ML data accuracy', included: true },
//       { text: 'PCI/DSS security', included: true },
//       { text: 'API integration', included: true },
//       { text: '24/7 fraud watch', included: true }
//     ];

//     // Add overage rate feature
//     const features = [...staticFeatures];
//     if (isEnterprise) {
//       features.push({ text: 'Custom pricing/options', included: true });
//     } else {
//       features.push({ text: `$${apiPlan.overage_rate}/extra scan`, included: true });
//     }

//     return {
//       id: apiPlan.id,
//       name: apiPlan.package_name.toUpperCase(),
//       subtitle: isEnterprise ? 'CONTACT SUPPORT' : 'FOR BUSINESS',
//       price: isEnterprise ? 'SALES' : `$${apiPlan.package_price}`,
//       period: apiPlan.package_period.toUpperCase(),
//       apiScans: isEnterprise ? 'UNLIMITED*' : `${apiPlan.monthly_limit} API SCANS`,
//       gradient: style.gradient,
//       bgGradient: style.bgGradient,
//       buttonColor: style.buttonColor,
//       popular: style.popular,
//       features: features,
//       originalData: apiPlan
//     };
//   };

//   // Calculate pricing with 3% tax
//   const pricingCalculation = useMemo(() => {
//     if (!plan || plan.price === 'SALES' || plan.price === 'Free') {
//       return {
//         subtotal: 0,
//         tax: 0,
//         total: 0,
//         taxRate: 0,
//         taxName: 'Tax'
//       };
//     }

//     // Extract numeric value from price string (e.g., "$29" -> 29)
//     const subtotal = parseFloat(plan.price.replace(/[$,]/g, ''));
//     const taxRate = 0.03; // 3% tax rate
//     const tax = subtotal * taxRate;
//     const total = subtotal + tax;

//     return {
//       subtotal,
//       tax,
//       total,
//       taxRate,
//       taxName: 'Tax'
//     };
//   }, [plan?.price]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

// const handleSubmit = async (e) => {
//   e.preventDefault();
  
//   // Handle nested user object structure for merchant_id
//   const userObj = userData?.user || userData;
  
//   if (!userObj?.merchant_id) {
//     setError('Merchant ID not found. Please log in again.');
//     return;
//   }

//   if (!plan) {
//     setError('Plan information not available.');
//     return;
//   }

//   // For non-enterprise plans, check if scan is completed
//   if (plan.price !== 'SALES' && plan.name.toLowerCase() !== 'enterprise') {
//     if (!scanData) {
//       setError('Please complete the card scan process first.');
//       return;
//     }
//     // You might want to verify the scan completion status here
//     // This would require additional API integration
//   }

//   setSubmitting(true);
//   setError(null);

//   try {
//     // For Enterprise/Custom plans, handle contact form submission
//     if (plan.price === 'SALES' || plan.name.toLowerCase().includes('enterprise')) {
//       // You can implement contact form submission to your API here
//       console.log('Contact form submitted:', {
//         ...formData,
//         plan_id: plan.id,
//         merchant_id: userObj.merchant_id
//       });
      
//       alert('Your message has been sent! Our sales team will contact you soon.');
//       router.push('/dashboard'); // Redirect to dashboard or appropriate page
//       return;
//     }

//     // For package IDs 1 and 2 - Call payment API first
//     if (plan.id === 1 || plan.id === 2) {
//       const paymentData = {
//         merchant_id: userObj.merchant_id,
//         email: formData.email,
//         billing_address: formData.billingAddress,
//         city: formData.city,
//         zipcode: formData.zipCode,
//         country: formData.country
//       };

//       console.log('Submitting payment details:', paymentData);

//       const paymentResponse = await fetch('https://cardsecuritysystem-8xdez.ondigitalocean.app/api/payment/storeDetails', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(paymentData)
//       });

//       const paymentResult = await paymentResponse.json();

//       if (!paymentResponse.ok) {
//         throw new Error(paymentResult.message || `Payment API error! status: ${paymentResponse.status}`);
//       }

//       console.log('Payment details stored successfully:', paymentResult);
      
//       // If payment API succeeds, continue with subscription creation
//       if (!paymentResult.status && paymentResult.status !== undefined) {
//         throw new Error(paymentResult.message || 'Payment details storage failed');
//       }
//     }

//     // For regular subscription plans - Updated to match API requirements
//     const subscriptionData = {
//       merchant_id: userObj.merchant_id,
//       package_id: plan.id,
//       subscription_date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
//       scan_id: scanData?.scanID // Include scan ID if available
//     };

//     console.log('Submitting subscription:', subscriptionData);

//     const response = await fetch('https://cardsecuritysystem-8xdez.ondigitalocean.app/api/Subscriptions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(subscriptionData)
//     });

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(result.message || `HTTP error! status: ${response.status}`);
//     }

//     if (result.status) {
//       // Success
//       console.log('Subscription created successfully:', result);
      
//       // Update user data in localStorage if needed
//       // const updatedUserData = {
//       //   ...userData,
//       //   subscription: {
//       //     package_id: plan.id,
//       //     package_name: plan.name,
//       //     subscription_date: subscriptionData.subscription_date
//       //   }
//       // };
//       // localStorage.setItem('userData', JSON.stringify(updatedUserData));
//       setnotification('Subscription created successfully!');
//       router.push('/dashboard'); // Redirect to dashboard
//     } else {
//       throw new Error(result.message || 'Subscription creation failed');
//     }

//   } catch (err) {
//     console.error('Payment/Subscription error:', err);
//     setError(err.message || 'An error occurred while processing your payment/subscription');
//   } finally {
//     setSubmitting(false);
//   }
// };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD'
//     }).format(amount);
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-white">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading plan information...</p>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-white">
//         <div className="text-center max-w-md mx-auto p-6">
//           <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
//           <p className="text-red-600 mb-6">{error}</p>
//           <div className="space-x-4">
//             <button 
//               onClick={() => window.location.reload()} 
//               className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg"
//             >
//               Retry
//             </button>
//             <Link href="/" className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg inline-block">
//               Go Home
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!plan) {
//     return notFound();
//   }

//   return (
//     <div className="min-h-screen text-black bg-white">
//       {/* Header */}
//       <div className=''>
//         <nav className="bg-white backdrop-blur-md fixed top-0 left-0 right-0 z-50">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="flex justify-between items-center h-20">
//               {/* Logo */}
//               <Link href="/" className="flex-shrink-0">
//                 <video autoPlay loop muted playsInline width="70">
//                   <source src="/videos/cardnest.webm" type="video/webm" />
//                   Your browser does not support the video tag.
//                 </video> 
//               </Link>

//               <div className="ml-4 flex items-center space-x-4">
                
//               </div>
//             </div>
//           </div>
//         </nav>
//       </div>

//       {/* Main Content - Add pt-20 to account for fixed navbar height */}
//       <div className="max-w-7xl mx-auto px-4 py-8 pt-28">
//         <div className="grid lg:grid-cols-2 gap-12">
          
//           {/* Left Side - Plan Details */}
//           <div className="space-y-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                 Complete Your Subscription
//               </h1>
//               <p className="text-gray-600">
//                 You are subscribing to the {plan.name} plan
//               </p>
//               {userData && (
//                 <p className="text-sm text-gray-500 mt-2">
//                   Merchant ID: {(userData.user || userData).merchant_id}
//                 </p>
//               )}
//             </div>

//             {/* Plan Card */}
//             <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//               {/* Plan Header */}
//               <div className={`bg-gradient-to-br ${plan.gradient} p-6 text-white`}>
//                 <div className="flex justify-between items-start mb-4">
//                   <div>
//                     <h2 className="text-2xl font-bold">{plan.name}</h2>
//                     <p className="text-white/80">{plan.subtitle}</p>
//                   </div>
//                   {plan.popular && (
//                     <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
//                       RECOMMENDED
//                     </span>
//                   )}
//                 </div>
                
//                 <div className="flex items-baseline">
//                   <span className="text-4xl font-bold">{plan.price}</span>
//                   {plan.price !== 'SALES' && plan.price !== 'Free' && (
//                     <span className="text-white/80 ml-2">per month</span>
//                   )}
//                 </div>
//                 <p className="text-white/80 mt-1">{plan.apiScans}</p>
//               </div>

//               {/* Plan Features */}
//               <div className="p-6">
//                 <h3 className="font-semibold text-gray-900 mb-4">What is included:</h3>
//                 <ul className="space-y-3">
//                   {plan.features.map((feature, index) => (
//                     <li key={index} className="flex items-start">
//                       {feature.included ? (
//                         <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
//                       ) : (
//                         <X className="w-5 h-5 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
//                       )}
//                       <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
//                         {feature.text}
//                       </span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>

//             {/* Security Features */}
//             <div className="bg-white rounded-xl p-6 shadow-sm">
//               <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
//                 <Shield className="w-5 h-5 mr-2 text-green-500" />
//                 Security & Trust
//               </h3>
//               <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
//                 <div className="flex items-center">
//                   <Lock className="w-4 h-4 mr-2 text-green-500" />
//                   PCI/DSS Compliant
//                 </div>
//                 <div className="flex items-center">
//                   <Shield className="w-4 h-4 mr-2 text-green-500" />
//                   256-bit SSL Encryption
//                 </div>
//                 <div className="flex items-center">
//                   <CreditCard className="w-4 h-4 mr-2 text-green-500" />
//                   Secure Payment Processing
//                 </div>
//                 <div className="flex items-center">
//                   <Shield className="w-4 h-4 mr-2 text-green-500" />
//                   Secure Online Card Detection
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Side - Payment Form or Custom Plan Form */}
//           <div className="lg:sticky lg:top-28 lg:h-fit">
//             <div className="bg-white rounded-2xl shadow-lg p-8">
//               {/* Show error if any */}
//               {error && (
//                 <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
//                   <p className="text-red-600 text-sm">{error}</p>
//                 </div>
//               )}

//               {/* Conditional rendering based on plan type */}
//               {plan.price === 'SALES' || plan.name.toLowerCase().includes('enterprise') ? (
//                 // Custom Plan Contact Form
//                 <>
//                   <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Sales</h2>
//                   <p className="text-gray-600 mb-6">
//                     Get in touch with our sales team to discuss your custom requirements and pricing.
//                   </p>
                  
//                   <form onSubmit={handleSubmit} className="space-y-6 text-left">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
//                           Company Name *
//                         </label>
//                         <input
//                           type="text"
//                           id="companyName"
//                           name="companyName"
//                           required
//                           value={formData.companyName}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                           placeholder="Your company name"
//                           disabled={submitting}
//                         />
//                       </div>
                      
//                       <div>
//                         <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
//                           Contact Name *
//                         </label>
//                         <input
//                           type="text"
//                           id="contactName"
//                           name="contactName"
//                           required
//                           value={formData.contactName}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                           placeholder="Your full name"
//                           disabled={submitting}
//                         />
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                           Business Email *
//                         </label>
//                         <input
//                           type="email"
//                           id="email"
//                           name="email"
//                           required
//                           value={formData.email}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                           placeholder="you@company.com"
//                           disabled={submitting}
//                         />
//                       </div>
                      
//                       <div>
//                         <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
//                           Phone Number
//                         </label>
//                         <input
//                           type="tel"
//                           id="phone"
//                           name="phone"
//                           value={formData.phone}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                           placeholder="+1 (555) 123-4567"
//                           disabled={submitting}
//                         />
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
//                           Business Type *
//                         </label>
//                         <select
//                           id="businessType"
//                           name="businessType"
//                           required
//                           value={formData.businessType}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                           disabled={submitting}
//                         >
//                           <option value="">Select your business type</option>
//                           <option value="ecommerce">E-commerce</option>
//                           <option value="saas">SaaS/Software</option>
//                           <option value="marketplace">Marketplace</option>
//                           <option value="subscription">Subscription Business</option>
//                           <option value="retail">Retail/Physical Store</option>
//                           <option value="nonprofit">Non-profit</option>
//                           <option value="professional-services">Professional Services</option>
//                           <option value="other">Other</option>
//                         </select>
//                       </div>
                      
//                       <div>
//                         <label htmlFor="monthlyVolume" className="block text-sm font-medium text-gray-700 mb-2">
//                           Expected Monthly Volume
//                         </label>
//                         <select
//                           id="monthlyVolume"
//                           name="monthlyVolume"
//                           value={formData.monthlyVolume}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                           disabled={submitting}
//                         >
//                           <option value="">Select expected volume</option>
//                           <option value="under-10k">Under $10,000</option>
//                           <option value="10k-50k">$10,000 - $50,000</option>
//                           <option value="50k-100k">$50,000 - $100,000</option>
//                           <option value="100k-500k">$100,000 - $500,000</option>
//                           <option value="500k-1m">$500,000 - $1,000,000</option>
//                           <option value="over-1m">Over $1,000,000</option>
//                         </select>
//                       </div>
//                     </div>

//                     <div>
//                       <label htmlFor="currentProvider" className="block text-sm font-medium text-gray-700 mb-2">
//                         Current Payment Provider
//                       </label>
//                       <input
//                         type="text"
//                         id="currentProvider"
//                         name="currentProvider"
//                         value={formData.currentProvider}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                         placeholder="e.g., Stripe, Square, PayPal, or 'None'"
//                         disabled={submitting}
//                       />
//                     </div>

//                     <div>
//                       <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
//                         Tell us about your payment needs
//                       </label>
//                       <textarea
//                         id="message"
//                         name="message"
//                         rows={4}
//                         value={formData.message}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"
//                         placeholder="What specific payment features or challenges are you looking to address? Any integration requirements?"
//                         disabled={submitting}
//                       />
//                     </div>

//                     <div className="text-center">
//                       <button
//                         type="submit"
//                         disabled={submitting}
//                         className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         {submitting ? 'Sending...' : 'Send Message'}
//                       </button>
//                     </div>
//                   </form>
//                 </>
//               ) : (
              
//                 // Regular Payment Form
//                 <>
//                   <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h2>
         
//                   {notification && (
//                     <div className='bg-green-100 border border-green-400 text-green-800 rounded-md p-3 mb-5 flex items-center'>
//                       <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                       </svg>
//                       <span className="font-medium">Success:</span>
//                       <span className="ml-1">{notification}</span>
//                     </div>
//                   )}
                  
//                   <form onSubmit={handleSubmit} className="space-y-6">
//                     {/* Email */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Email Address
//                       </label>
//                       <input
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         placeholder="your@email.com"
//                         required
//                         disabled={submitting}
//                       />
//                     </div>

//                     {/* Card Security Scan Section */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Card Information
//                       </label>
                      
//                       {scanLoading ? (
//                         <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
//                           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-3"></div>
//                           <p className="text-gray-600">Generating secure scan link...</p>
//                         </div>
//                       ) : scanError ? (
//                         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//                           <p className="text-red-600 text-sm mb-3">{scanError}</p>
//                           <button
//                             type="button"
//                             onClick={() => generateScanToken(userData?.user || userData)}
//                             className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
//                           >
//                             Retry Scan Generation
//                           </button>
//                         </div>
//                       ) : scanData ? (
//                       <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
//   <h4 className="font-semibold text-gray-900 mb-3">Scan to Complete Payment</h4>
//   <div className="flex justify-center mb-4">
//     <QRCode 
//       value={scanData.scanURL} 
//       size={200}
//       level="H"
//     />
//   </div>
//   <p className="text-xs text-gray-500 mb-2">Scan ID: {scanData.scanID}</p>
//   <p className="text-sm text-gray-600">Scan this code with your mobile device</p>
// </div>
                        
//                       ) : (
//                         <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
//                           <p className="text-gray-600">Unable to generate scan link. Please refresh the page.</p>
//                         </div>
//                       )}
//                     </div>

//                     {/* Billing Address */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Billing Address
//                       </label>
//                       <div className="space-y-3">
//                         <input
//                           type="text"
//                           name="billingAddress"
//                           value={formData.billingAddress}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                           placeholder="Street address"
//                           required
//                           disabled={submitting}
//                         />
//                         <div className="grid grid-cols-2 gap-3">
//                           <input
//                             type="text"
//                             name="city"
//                             value={formData.city}
//                             onChange={handleInputChange}
//                             className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             placeholder="City"
//                             required
//                             disabled={submitting}
//                           />
//                           <input
//                             type="text"
//                             name="zipCode"
//                             value={formData.zipCode}
//                             onChange={handleInputChange}
//                             className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             placeholder="ZIP Code"
//                             required
//                             disabled={submitting}
//                           />
//                         </div>
//                      <input
//   type="text"
//   name="country"
//   value={formData.country}
//   onChange={handleInputChange}
//   placeholder="Enter your country"
//   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//   disabled={submitting}
// />

//                       </div>
//                     </div>

//                     {/* Order Summary with Tax Calculation */}
//                     <div className="border-t pt-6">
//                       <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                      
//                       <div className="space-y-3">
//                         <div className="flex justify-between items-center">
//                           <span className="text-gray-600">Plan:</span>
//                           <span className="font-medium">{plan.name}</span>
//                         </div>
                        
//                         <div className="flex justify-between items-center">
//                           <span className="text-gray-600">Billing:</span>
//                           <span className="font-medium">Monthly</span>
//                         </div>

//                         {/* Pricing Breakdown */}
//                         {plan.price !== 'SALES' && plan.price !== 'Free' && (
//                           <>
//                             <div className="flex justify-between items-center">
//                               <span className="text-gray-600">Subtotal:</span>
//                               <span className="font-medium">{formatCurrency(pricingCalculation.subtotal)}</span>
//                             </div>
                            
//                             <div className="flex justify-between items-center">
//                               <span className="text-gray-600">
//                                 Tax (3%):
//                               </span>
//                               <span className="font-medium">{formatCurrency(pricingCalculation.tax)}</span>
//                             </div>
                            
//                             <div className="border-t pt-3 flex justify-between items-center text-lg font-bold">
//                               <span>Total:</span>
//                               <span>{formatCurrency(pricingCalculation.total)}</span>
//                             </div>
//                           </>
//                         )}

//                         {/* For Free or Sales plans */}
//                         {(plan.price === 'SALES' || plan.price === 'Free') && (
//                           <div className="flex justify-between items-center text-lg font-bold">
//                             <span>Total:</span>
//                             <span>{plan.price === 'SALES' ? 'Contact Sales' : 'Free'}</span>
//                           </div>
//                         )}
//                       </div>
                      
//                       {/* Scan Status Indicator */}
//                       {scanData && (
//                         <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
//                           <p className="text-sm text-amber-800 flex items-center">
//                             <Shield className="w-4 h-4 mr-2" />
//                             Please complete the card scan before proceeding
//                           </p>
//                         </div>
//                       )}
//                     </div>

//                     {/* Submit Button */}
//                     <button
//                       type="submit"
//                       className={`w-full ${plan.buttonColor} text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
//                       disabled={submitting || (scanData && !scanData.scanURL)}
//                     >
//                       {submitting ? (
//                         <div className="flex items-center justify-center">
//                           <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                           Processing...
//                         </div>
//                       ) : (
//                         plan.price === 'SALES' 
//                           ? 'Contact Sales Team' 
//                           : plan.price === 'Free'
//                           ? 'Start Free Plan'
//                           : `Pay ${formatCurrency(pricingCalculation.total)}`
//                       )}
//                     </button>

//                     <p className="text-xs text-gray-500 text-center">
//                       By subscribing, you agree to our Terms of Service and Privacy Policy. 
//                       You can cancel anytime.
//                     </p>
//                   </form>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




'use client';

import React, { useState, use, useMemo, useEffect, useRef } from 'react';
import { Check, X, ArrowLeft, CreditCard, Shield, Lock, Salad, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import QRCode from "react-qr-code";
import { jwtDecode } from 'jwt-decode';
import { notFound, useRouter } from 'next/navigation';
import { decryptWithAES128 } from '@/app/lib/decrypt';

export default function PaymentPage({ params }) {
  const router = useRouter();
  const [authToken, setAuthToken] = useState(null);
const [decryptedCardData, setDecryptedCardData] = useState(null);
  const resolvedParams = use(params);
  const [plan, setPlan] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setnotification] = useState(null)
  const [Success, setSuccess] = useState(false)
  
  // New state for scan integration
  const [scanData, setScanData] = useState(null);
  const [scanLoading, setScanLoading] = useState(false);
  const [scanError, setScanError] = useState(null);
  
  // New state for encrypted data polling
  const [encryptedData, setEncryptedData] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);
  const pollingRef = useRef(null);

  const [formData, setFormData] = useState({
    email: '',
    billingAddress: '',
    city: '',
    zipCode: '',
    country: 'US',
    // Contact form fields
    companyName: '',
    contactName: '',
    phone: '',
    businessType: '',
    monthlyVolume: '',
    currentProvider: '',
    message: '',
    // New card fields
    cardNumber: '',
    cardholderName: '',
    expiryDate: ''
  });

  // Function to detect if device is mobile
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // Function to poll for encrypted data
  const pollEncryptedData = async (scanId) => {
    try {
      const response = await fetch('https://cardsecuritysystem-8xdez.ondigitalocean.app/api/scan/getEncryptedData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scanId })
      });

      const result = await response.json();

      if (response.ok && result.data && result.data.encrypted_data) {
        console.log('Encrypted data received:', result.data);
        setEncryptedData(result.data.encrypted_data);
        
        // Stop polling once we get the data
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
        
        return true; // Data received
      }
      return false; // No data yet
    } catch (err) {
      console.error('Error polling encrypted data:', err);
      return false;
    }
  };

  // Start polling for encrypted data
  const startPolling = (scanId) => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    pollingRef.current = setInterval(async () => {
      await pollEncryptedData(scanId);
    }, 30000); // Poll every 30 seconds

    // Also poll immediately
    pollEncryptedData(scanId);
  };

  // Clean up polling on component unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  // Function to generate scan token
const generateScanToken = async (userObj) => {
  setScanLoading(true);
  setScanError(null);
  
  try {
    const requestData = {
      merchantId: userObj.merchant_id,
      merchantcontact: userObj.phone_no || '',
      isMobile: isMobileDevice() ? "true" : "false"
    };

    const response = await fetch('https://cardsecuritysystem-8xdez.ondigitalocean.app/api/merchantscan/generateToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to generate scan token');
    }

    console.log('Scan token generated:', data);
    
    // Store authToken
    if (data.authToken) {
      setAuthToken(data.authToken);
      localStorage.setItem('authToken', data.authToken);
    }
    
    // Store other data
    if (data.scanURL) {
      localStorage.setItem('scanURL', data.scanURL);
    }
    
    if (data.scanID) {
      localStorage.setItem('scanID', data.scanID);
      startPolling(data.scanID);
    }
    
    setScanData(data);
  } catch (err) {
    console.error('Error generating scan token:', err);
    setScanError(err.message);
  } finally {
    setScanLoading(false);
  }
};


// Add decryption function

const decryptAndPopulateCardData = async () => {
  try {
    if (!authToken || !encryptedData) {
      console.log('Missing authToken or encryptedData');
      return;
    }

    // Decode JWT to get encryption_key
    const decodedToken = jwtDecode(authToken);
    const encryptionKey = decodedToken.encryption_key;

    if (!encryptionKey) {
      throw new Error('encryption_key not found in JWT token');
    }

    // Decrypt the card data
    const decryptedData = decryptWithAES128(encryptedData, encryptionKey);
    console.log('Decrypted card data:', decryptedData);

    // Check if scan was successful
    if (!decryptedData.complete_scan) {
      throw new Error('Card scan was not completed successfully');
    }

    // Extract card information from final_ocr object
    const finalOcr = decryptedData.final_ocr;
    if (!finalOcr) {
      throw new Error('Card OCR data not found');
    }

    // Extract and validate card details
    const cardNumber = finalOcr.card_number?.value || finalOcr.account_number?.value;
    const cardholderName = finalOcr.cardholder_name?.value;
    const expiryDate = finalOcr.expiry_date?.value;

    // Validate required fields
    if (!cardNumber) {
      throw new Error('Card number not detected in scan');
    }
    if (!expiryDate) {
      throw new Error('Expiry date not detected in scan');
    }

    console.log('Extracted card data:', {
      cardNumber,
      cardholderName: cardholderName || 'Not detected',
      expiryDate,
      confidence: decryptedData.confidence
    });

    // Update form data with extracted card information
    setFormData(prev => ({
      ...prev,
      cardNumber: cardNumber,
      cardholderName: cardholderName || '',
      expiryDate: expiryDate
    }));

    // Store the full decrypted data for reference
    setDecryptedCardData({
      ...decryptedData,
      extractedData: {
        cardNumber,
        cardholderName,
        expiryDate
      }
    });

    // Optional: Show confidence score to user if it's low
    if (decryptedData.confidence < 80) {
      console.warn('Low confidence score:', decryptedData.confidence);
      // You might want to show a warning to the user
    }

  } catch (error) {
    console.error('Error decrypting card data:', error);
    setError(`Failed to process card information: ${error.message}`);
  }
};

useEffect(() => {
  if (encryptedData && authToken) {
    decryptAndPopulateCardData();
  }
}, [encryptedData, authToken]);



  // Fetch plan data and user data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get user data from localStorage using the correct structure
        const storedUser = localStorage.getItem('userData');
        if (!storedUser) {
          setError('User not logged in. Please log in first.');
          return;
        }
        
        const parsedUser = JSON.parse(storedUser);
        console.log('User data found in localStorage:', parsedUser);
        
        // Handle nested user object structure
        const userObj = parsedUser.user || parsedUser;
        setUserData(userObj);
        
        console.log('User object:', userObj);
        console.log('Merchant ID:', userObj.merchant_id);
        
        // Pre-fill email if available
        if (userObj.email) {
          setFormData(prev => ({ ...prev, email: userObj.email }));
        }

        // Fetch packages from API
        const response = await fetch('https://cardsecuritysystem-8xdez.ondigitalocean.app/api/Packages');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (!data.status || !data.data) {
          throw new Error('Invalid API response format');
        }

        // Find the specific plan by ID
        const planId = parseInt(resolvedParams.plan);
        const foundPlan = data.data.find(p => p.id === planId);
        
        if (!foundPlan) {
          notFound();
          return;
        }

        // Map API data to component format
        const mappedPlan = mapApiDataToPlan(foundPlan);
        setPlan(mappedPlan);
        
        // Generate scan token for non-enterprise plans
        if (mappedPlan.price !== 'SALES' && mappedPlan.name.toLowerCase() !== 'enterprise') {
          await generateScanToken(userObj);
        }
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.plan]);

  // Function to map API data to component format
  const mapApiDataToPlan = (apiPlan) => {
    const planStyles = {
      'Standard': {
        gradient: 'from-purple-500 to-purple-700',
        bgGradient: 'from-purple-100 to-purple-50',
        buttonColor: 'bg-purple-500 hover:bg-purple-600',
        popular: false
      },
      'Premium': {
        gradient: 'from-cyan-400 to-blue-500',
        bgGradient: 'from-cyan-50 to-blue-50',
        buttonColor: 'bg-cyan-500 hover:bg-cyan-600',
        popular: true
      },
      'Enterprise': {
        gradient: 'from-pink-500 to-purple-600',
        bgGradient: 'from-pink-50 to-purple-50',
        buttonColor: 'bg-pink-500 hover:bg-pink-600',
        popular: false
      }
    };

    const style = planStyles[apiPlan.package_name] || planStyles['Standard'];
    const isEnterprise = apiPlan.package_name === 'Enterprise';
    
    // Static features that apply to all plans
    const staticFeatures = [
      { text: 'Front-side card scan', included: true },
      { text: 'Back-side scan', included: true },
      { text: 'AI fraud detection', included: true },
      { text: 'CardNest protection', included: true },
      { text: 'ML data accuracy', included: true },
      { text: 'PCI/DSS security', included: true },
      { text: 'API integration', included: true },
      { text: '24/7 fraud watch', included: true }
    ];

    // Add overage rate feature
    const features = [...staticFeatures];
    if (isEnterprise) {
      features.push({ text: 'Custom pricing/options', included: true });
    } else {
      features.push({ text: `$${apiPlan.overage_rate}/extra scan`, included: true });
    }

    return {
      id: apiPlan.id,
      name: apiPlan.package_name.toUpperCase(),
      subtitle: isEnterprise ? 'CONTACT SUPPORT' : 'FOR BUSINESS',
      price: isEnterprise ? 'SALES' : `$${apiPlan.package_price}`,
      period: apiPlan.package_period.toUpperCase(),
      apiScans: isEnterprise ? 'UNLIMITED*' : `${apiPlan.monthly_limit} API SCANS`,
      gradient: style.gradient,
      bgGradient: style.bgGradient,
      buttonColor: style.buttonColor,
      popular: style.popular,
      features: features,
      originalData: apiPlan
    };
  };

  // Calculate pricing with 3% tax
  const pricingCalculation = useMemo(() => {
    if (!plan || plan.price === 'SALES' || plan.price === 'Free') {
      return {
        subtotal: 0,
        tax: 0,
        total: 0,
        taxRate: 0,
        taxName: 'Tax'
      };
    }

    // Extract numeric value from price string (e.g., "$29" -> 29)
    const subtotal = parseFloat(plan.price.replace(/[$,]/g, ''));
    const taxRate = 0.03; // 3% tax rate
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return {
      subtotal,
      tax,
      total,
      taxRate,
      taxName: 'Tax'
    };
  }, [plan?.price]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Handle nested user object structure for merchant_id
  const userObj = userData?.user || userData;
  
  if (!userObj?.merchant_id) {
    setError('Merchant ID not found. Please log in again.');
    return;
  }

  if (!plan) {
    setError('Plan information not available.');
    return;
  }

  // For non-enterprise plans, check if scan is completed
  if (plan.price !== 'SALES' && plan.name.toLowerCase() !== 'enterprise') {
    if (!scanData) {
      setError('Please complete the card scan process first.');
      return;
    }
    
    // Check if encrypted data is available
    if (!encryptedData) {
      setError('Please complete the card scan process and ensure your card information is captured.');
      return;
    }
  }

  setSubmitting(true);
  setError(null);

  try {
    // For Enterprise/Custom plans, handle contact form submission
    if (plan.price === 'SALES' || plan.name.toLowerCase().includes('enterprise')) {
      // You can implement contact form submission to your API here
      console.log('Contact form submitted:', {
        ...formData,
        plan_id: plan.id,
        merchant_id: userObj.merchant_id
      });
      
      alert('Your message has been sent! Our sales team will contact you soon.');
      router.push('/dashboard'); // Redirect to dashboard or appropriate page
      return;
    }

    // For package IDs 1 and 2 - Call payment API first
    if (plan.id === 1 || plan.id === 2) {
      const paymentData = {
        merchant_id: userObj.merchant_id,
        email: formData.email,
        billing_address: formData.billingAddress,
        city: formData.city,
        zipcode: formData.zipCode,
        country: formData.country
      };

      console.log('Submitting payment details:', paymentData);

      const paymentResponse = await fetch('https://cardsecuritysystem-8xdez.ondigitalocean.app/api/payment/storeDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      const paymentResult = await paymentResponse.json();

      if (!paymentResponse.ok) {
        throw new Error(paymentResult.message || `Payment API error! status: ${paymentResponse.status}`);
      }

      console.log('Payment details stored successfully:', paymentResult);
      
      // If payment API succeeds, continue with subscription creation
      if (!paymentResult.status && paymentResult.status !== undefined) {
        throw new Error(paymentResult.message || 'Payment details storage failed');
      }
    }

    // For regular subscription plans - Updated to match API requirements
    const subscriptionData = {
      merchant_id: userObj.merchant_id,
      package_id: plan.id,
      subscription_date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      scan_id: scanData?.scanID // Include scan ID if available
    };

    console.log('Submitting subscription:', subscriptionData);

    const response = await fetch('https://cardsecuritysystem-8xdez.ondigitalocean.app/api/Subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriptionData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `HTTP error! status: ${response.status}`);
    }

    if (result.status) {
      // Success
      console.log('Subscription created successfully:', result);
      
      // Stop polling on successful subscription
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      
      setnotification('Subscription created successfully!');
      router.push('/dashboard'); // Redirect to dashboard
    } else {
      throw new Error(result.message || 'Subscription creation failed');
    }

  } catch (err) {
    console.error('Payment/Subscription error:', err);
    setError(err.message || 'An error occurred while processing your payment/subscription');
  } finally {
    setSubmitting(false);
  }
};

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading plan information...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-red-600 mb-6">{error}</p>
          <div className="space-x-4">
            <button 
              onClick={() => window.location.reload()} 
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg"
            >
              Retry
            </button>
            <Link href="/" className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg inline-block">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!plan) {
    return notFound();
  }

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
<source src="https://dw1u598x1c0uz.cloudfront.net/CardNest%20Logo%20Video.mp4" type="video/mp4" />
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
              {userData && (
                <p className="text-sm text-gray-500 mt-2">
                  Merchant ID: {(userData.user || userData).merchant_id}
                </p>
              )}
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
                  {plan.price !== 'SALES' && plan.price !== 'Free' && (
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
                  Secure Online Card Detection
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Payment Form or Custom Plan Form */}
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Show error if any */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Conditional rendering based on plan type */}
              {plan.price === 'SALES' || plan.name.toLowerCase().includes('enterprise') ? (
                // Custom Plan Contact Form
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Sales</h2>
                  <p className="text-gray-600 mb-6">
                    Get in touch with our sales team to discuss your custom requirements and pricing.
                  </p>
                  
                  <form onSubmit={handleSubmit} className="space-y-6 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name *
                        </label>
                        <input
                          type="text"
                          id="companyName"
                          name="companyName"
                          required
                          value={formData.companyName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Your company name"
                          disabled={submitting}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Name *
                        </label>
                        <input
                          type="text"
                          id="contactName"
                          name="contactName"
                          required
                          value={formData.contactName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Your full name"
                          disabled={submitting}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Business Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="you@company.com"
                          disabled={submitting}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="+1 (555) 123-4567"
                          disabled={submitting}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
                          Business Type *
                        </label>
                        <select
                          id="businessType"
                          name="businessType"
                          required
                          value={formData.businessType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          disabled={submitting}
                        >
                          <option value="">Select your business type</option>
                          <option value="ecommerce">E-commerce</option>
                          <option value="saas">SaaS/Software</option>
                          <option value="marketplace">Marketplace</option>
                          <option value="subscription">Subscription Business</option>
                          <option value="retail">Retail/Physical Store</option>
                          <option value="nonprofit">Non-profit</option>
                          <option value="professional-services">Professional Services</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="monthlyVolume" className="block text-sm font-medium text-gray-700 mb-2">
                          Expected Monthly Volume
                        </label>
                        <select
                          id="monthlyVolume"
                          name="monthlyVolume"
                          value={formData.monthlyVolume}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          disabled={submitting}
                        >
                          <option value="">Select expected volume</option>
                          <option value="under-10k">Under $10,000</option>
                          <option value="10k-50k">$10,000 - $50,000</option>
                          <option value="50k-100k">$50,000 - $100,000</option>
                          <option value="100k-500k">$100,000 - $500,000</option>
                          <option value="500k-1m">$500,000 - $1,000,000</option>
                          <option value="over-1m">Over $1,000,000</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="currentProvider" className="block text-sm font-medium text-gray-700 mb-2">
                        Current Payment Provider
                      </label>
                      <input
                        type="text"
                        id="currentProvider"
                        name="currentProvider"
                        value={formData.currentProvider}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="e.g., Stripe, Square, PayPal, or 'None'"
                        disabled={submitting}
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Tell us about your payment needs
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"
                        placeholder="What specific payment features or challenges are you looking to address? Any integration requirements?"
                        disabled={submitting}
                      />
                    </div>

                    <div className="text-center">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? 'Sending...' : 'Send Message'}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
              
                // Regular Payment Form
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h2>
         
                  {notification && (
                    <div className='bg-green-100 border border-green-400 text-green-800 rounded-md p-3 mb-5 flex items-center'>
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Success:</span>
                      <span className="ml-1">{notification}</span>
                    </div>
                  )}
                  
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
                        disabled={submitting}
                      />
                    </div>

                    {/* Card Information Section - Conditional Rendering */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Information
                      </label>
                      
                      {/* Show card form fields if encrypted data is available */}
                      {encryptedData ? (
                        <div className="space-y-4">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                            <p className="text-green-800 text-sm flex items-center">
                              <Check className="w-4 h-4 mr-2" />
                              Card scan completed successfully
                            </p>
                          </div>
                          
                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                              Card Number
                                            </label>
                                            <input
                                              type="text"
                                              name="cardNumber"
                                              value={formData.cardNumber}
                                              onChange={handleInputChange}
                                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                                              placeholder="**** **** **** ****"
                                              required
                                              disabled={submitting || decryptedCardData} // Disable if card data is decrypted
                                              readOnly={decryptedCardData} // Make it read-only if decrypted
                                            />
                                            {decryptedCardData && (
                                              <p className="text-xs text-green-600 mt-1">✓ Auto-filled from secure scan</p>
                                            )}
                                          </div>

                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                              Cardholder Name
                                            </label>
                                            <input
                                              type="text"
                                              name="cardholderName"
                                              value={formData.cardholderName}
                                              onChange={handleInputChange}
                                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                                              placeholder=""
                                              required
                                              disabled={submitting || decryptedCardData}
                                              readOnly={decryptedCardData}
                                            />
                                            {decryptedCardData && (
                                              <p className="text-xs text-green-600 mt-1">✓ Auto-filled from secure scan</p>
                                            )}
                                          </div>

                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                              Expiry Date
                                            </label>
                                            <input
                                              type="text"
                                              name="expiryDate"
                                              value={formData.expiryDate}
                                              onChange={handleInputChange}
                                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                                              placeholder="MM/YY"
                                              required
                                              disabled={submitting || decryptedCardData}
                                              readOnly={decryptedCardData}
                                            />
                                            {decryptedCardData && (
                                              <p className="text-xs text-green-600 mt-1">✓ Auto-filled from secure scan</p>
                                            )}
                                          </div>
                       
                        </div>
                      ) : (
                        // Show QR code or loading state if encrypted data is not available
                        <>
                          {scanLoading ? (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-3"></div>
                              <p className="text-gray-600">Generating secure scan link...</p>
                            </div>
                          ) : scanError ? (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                              <p className="text-red-600 text-sm mb-3">{scanError}</p>
                              <button
                                type="button"
                                onClick={() => generateScanToken(userData?.user || userData)}
                                className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
                              >
                                Retry Scan Generation
                              </button>
                            </div>
                          ) : scanData ? (
                            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                              <h4 className="font-semibold text-gray-900 mb-3">Scan to Complete Payment</h4>
                              <div className="flex justify-center mb-4">
                                <QRCode 
                                  value={scanData.scanURL} 
                                  size={200}
                                  level="H"
                                />
                              </div>
                              <p className="text-xs text-gray-500 mb-2">Scan ID: {scanData.scanID}</p>
                              <p className="text-sm text-gray-600">Scan this code with your mobile device</p>
                              {pollingRef.current && (
                                <div className="mt-3 flex items-center justify-center text-xs text-gray-500">
                                  <div className="animate-pulse h-2 w-2 bg-cyan-500 rounded-full mr-2"></div>
                                  Waiting for card scan...
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                              <p className="text-gray-600">Unable to generate scan link. Please refresh the page.</p>
                            </div>
                          )}
                        </>
                      )}
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
                          disabled={submitting}
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
                            disabled={submitting}
                          />
                          <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="ZIP Code"
                            required
                            disabled={submitting}
                          />
                        </div>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          placeholder="Enter your country"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={submitting}
                        />
                      </div>
                    </div>

                    {/* Order Summary with Tax Calculation */}
                    <div className="border-t pt-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Plan:</span>
                          <span className="font-medium">{plan.name}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Billing:</span>
                          <span className="font-medium">Monthly</span>
                        </div>

                        {/* Pricing Breakdown */}
                        {plan.price !== 'SALES' && plan.price !== 'Free' && (
                          <>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Subtotal:</span>
                              <span className="font-medium">{formatCurrency(pricingCalculation.subtotal)}</span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">
                                Tax (3%):
                              </span>
                              <span className="font-medium">{formatCurrency(pricingCalculation.tax)}</span>
                            </div>
                            
                            <div className="border-t pt-3 flex justify-between items-center text-lg font-bold">
                              <span>Total:</span>
                              <span>{formatCurrency(pricingCalculation.total)}</span>
                            </div>
                          </>
                        )}

                        {/* For Free or Sales plans */}
                        {(plan.price === 'SALES' || plan.price === 'Free') && (
                          <div className="flex justify-between items-center text-lg font-bold">
                            <span>Total:</span>
                            <span>{plan.price === 'SALES' ? 'Contact Sales' : 'Free'}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Scan Status Indicator */}
                      {scanData && !encryptedData && (
                        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-sm text-amber-800 flex items-center">
                            <Shield className="w-4 h-4 mr-2" />
                            Please complete the card scan before proceeding
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className={`w-full ${plan.buttonColor} text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                      disabled={submitting || (scanData && !encryptedData)}
                    >
                      {submitting ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        plan.price === 'SALES' 
                          ? 'Contact Sales Team' 
                          : plan.price === 'Free'
                          ? 'Start Free Plan'
                          : `Pay ${formatCurrency(pricingCalculation.total)}`
                      )}
                    </button>

                    <p className="text-xs text-gray-500 text-center">
                      By subscribing, you agree to our Terms of Service and Privacy Policy. 
                      You can cancel anytime.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
