import React from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <header className="absolute top-0 w-full p-6 flex justify-between items-center bg-gray-900 shadow-md">
        <h1 className="text-3xl font-bold">Inner Compass</h1>
        <nav className="space-x-4">
          <Link to="/login" className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300">Login</Link>
          <Link to="/signup" className="px-4 py-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-300">Sign Up</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="text-center p-8 mt-16">
        <h2 className="text-5xl font-extrabold leading-tight tracking-tight mb-4">
          Take Control of Your Mental Wellness
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
          Inner Compass is your personal AI-powered platform to track moods, get personalized insights, and find the right support, all in one secure place.
        </p>
        <div className="space-x-4">
          <Link to="/signup" className="px-6 py-3 rounded-full bg-green-500 text-lg font-semibold hover:bg-green-600 transition-colors duration-300 shadow-lg transform hover:scale-105">
            Get Started
          </Link>
          <a href="#features" className="px-6 py-3 rounded-full border border-gray-400 text-lg font-semibold hover:bg-gray-700 transition-colors duration-300">
            Learn More
          </a>
        </div>
      </main>

      {/* Features Section (simple placeholder) */}
      <section id="features" className="w-full max-w-4xl p-8 text-center mt-20">
        <h3 className="text-3xl font-bold mb-8">Features That Make a Difference</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h4 className="font-bold text-xl mb-2">Mood Tracking</h4>
            <p className="text-sm text-gray-400">Log your feelings and understand your emotional patterns over time.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h4 className="font-bold text-xl mb-2">AI-Powered Insights</h4>
            <p className="text-sm text-gray-400">Get personalized wellness suggestions and coping strategies.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h4 className="font-bold text-xl mb-2">Immediate Support</h4>
            <p className="text-sm text-gray-400">Find nearby mental health resources with a secure, map-based interface.</p>
          </div>
        </div>
      </section>

      <footer className="w-full text-center p-6 mt-12 text-sm text-gray-500">
        <p>&copy; 2025 Inner Compass. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Homepage;