import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import PricingSection from '../SubscriptionsCard';

function SubscriptionsScreen() {
  const router = useRouter();
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        // Get user data from localStorage
        const storedUser = localStorage.getItem('userData');
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const userObj = parsedUser.user || parsedUser;
          
          // Get merchant_id from user object
          const merchantId = userObj.merchant_id;
          
          if (merchantId) {
            // Call the API with merchant_id
            console.log('Checking subscription for merchant_id:', merchantId);
            
            // Try different parameter variations with GET method
            const paramVariations = [
              `merchant_id=${merchantId}`,
              `merchantId=${merchantId}`,
              `id=${merchantId}`,
              `MerchantID=${merchantId}`,
              `UserID=${merchantId}`
            ];
            
            let subscriptionFound = false;
            
            for (const param of paramVariations) {
              if (subscriptionFound) break;
              
              console.log(`Trying GET with parameter: ${param}`);
              
              try {
                const response = await fetch(
                  `https://cardsecuritysystem-8xdez.ondigitalocean.app/api/Subscriptions/GetByUserIDorMerchantID?${param}`,
                  {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                    }
                  }
                );
                
                console.log(`Response status for ${param}:`, response.status);
                
                if (response.ok) {
                  const data = await response.json();
                  console.log('Subscription data:', data);
                  
                  // Check if status is true
                  if (data.status === true) {
                    setHasActiveSubscription(true);
                    subscriptionFound = true;
                    console.log('Active subscription found!');
                  }
                  break; // Stop trying if we get a successful response
                }
              } catch (error) {
                console.error(`Error with ${param}:`, error);
              }
            }
            
            // If no variation worked, log it
            if (!subscriptionFound) {
              console.log('No active subscription found or API endpoint not working with any parameter variation');
            }
          }
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, []);

  const handleBrowsePlans = () => {
    router.push("/plans");
    console.log('Browse plans clicked');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Subscriptions</h2>
        <div className="text-center py-8">
          <p className="text-gray-600">Loading subscription status...</p>
        </div>
      </div>
    );
  }

return (
  <div className="bg-white rounded-lg shadow-sm border p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Subscriptions</h2>

    <div className="text-center py-8">
      {hasActiveSubscription ? (
        <div>
          <p className="text-green-600 font-semibold mb-4">✓ Active Subscription</p>
          <p className="text-gray-600">You have an active subscription</p>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-4">No active subscriptions</p>
          <button
            onClick={handleBrowsePlans}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Browse Plans
          </button>
        </>
      )}
    </div>

    {/* Always show Available Plans Section */}
    <div className="mt-8 border-t pt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Plans</h3>
      <div>
        <PricingSection />
      </div>
    </div>
  </div>
);

}

export default SubscriptionsScreen;