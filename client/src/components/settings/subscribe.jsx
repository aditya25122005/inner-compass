import React from 'react';

const SubscriptionDetails = () => (
  <div className="bg-gray-800 p-6 rounded-2xl shadow-xl">
    <h2 className="text-2xl font-semibold mb-4 text-white">Subscription Details</h2>
    <div className="space-y-4 text-gray-300">
      <p>Current Plan: Pro</p>
      <p>Next Billing Date: September 21, 2025</p>
      <p>Payment Method: Visa ending in 1234</p>
      <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-indigo-700 transition-colors">
        Manage Subscription
      </button>
    </div>
  </div>
);

export default SubscriptionDetails;