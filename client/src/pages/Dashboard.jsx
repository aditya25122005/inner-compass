import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return <div className="text-center p-8">You are not logged in.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <h1 className="text-xl font-bold mb-4">
        Welcome, {JSON.stringify(user)}!
      </h1>
      <br />
      <p className="text-lg text-gray-700 break-words max-w-xl">
        token: {token}
      </p>
      <p className="text-lg text-gray-700">
        This is your Inner Compass Dashboard.
      </p>
      <button
        onClick={handleLogout}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;