import React from 'react';

const ReportsHistory = () => (
  <div className="bg-gray-800 p-6 rounded-2xl shadow-xl">
    <h2 className="text-2xl font-semibold mb-4 text-white">Reports History</h2>
    <div className="space-y-4 text-gray-300">
      <div className="flex justify-between items-center bg-gray-700 p-3 rounded-md">
        <span>Monthly Report - August 2025</span>
        <button className="bg-indigo-600 text-white text-sm py-1 px-3 rounded-full hover:bg-indigo-700">View</button>
      </div>
      <div className="flex justify-between items-center bg-gray-700 p-3 rounded-md">
        <span>Quarterly Report - Q2 2025</span>
        <button className="bg-indigo-600 text-white text-sm py-1 px-3 rounded-full hover:bg-indigo-700">View</button>
      </div>
    </div>
  </div>
);

export default ReportsHistory;
