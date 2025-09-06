import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Login from "../components/Login";
import Signup from "../components/Signup";
import bgImage from "../assests/bg-img1.png";

const AuthPage = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);

  // Set initial mode based on current route
  useEffect(() => {
    setIsLogin(location.pathname === '/login');
  }, [location.pathname]);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  const handleNavToggle = (mode) => {
    setIsLogin(mode === 'login');
  };

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Navbar with slide-down animation */}
      <nav className="w-full p-4 lg:p-6 flex justify-between items-center bg-white/10 backdrop-blur-sm animate-fade-in-down">
        <div className="flex items-center gap-2 group">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 transition-all duration-300 group-hover:text-gray-900">
            Inner Compass
          </h1>
            <div className="w-4 h-4 bg-gray-700 rounded-full relative">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-3 bg-white rounded-full"></div>
            </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => handleNavToggle('login')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105 ${
              isLogin 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'bg-white/20 text-gray-700 hover:bg-white/30 hover:shadow-md'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => handleNavToggle('signup')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105 ${
              !isLogin 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'bg-white/20 text-gray-700 hover:bg-white/30 hover:shadow-md'
            }`}
          >
            Sign Up
          </button>
        </div>
      </nav>

      <div className="flex-1 flex">
        {/* Left Section - Branding */}
        <div className="flex-1 flex flex-col justify-center pl-12 lg:pl-20">
          <div className="text-left max-w-lg animate-fade-in-left">
            <div className="mb-8">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-4 animate-slide-up hover:text-blue-600 transition-colors duration-500">
                INNER
              </h1>
<div className="flex items-center gap-3 mb-8">
  <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 animate-slide-up hover:text-blue-600 transition-colors duration-500" style={{ animationDelay: '0.2s' }}>
    C
    <span className="inline-flex items-center justify-center mx-1" style={{ transform: 'translateY(-9px)' }}>
      <div
        className="w-10 h-10 lg:w-12 lg:h-12 border-4 border-gray-700 rounded-full flex items-center justify-center hover:animate-spin transition-all duration-300 hover:border-blue-600"
        style={{ animationDelay: '0.4s' }}
      >
        <div className="w-5 h-5 lg:w-6 lg:h-6 bg-gray-700 rounded-full relative hover:bg-blue-600 transition-colors duration-300">
          {/* Compass needle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-3 lg:h-4 bg-white rounded-full animate-pulse"></div>
        </div>
      </div>
    </span>
    MPASS
  </h1>
</div>



            </div>
            
            {/* Single catchy tagline */}
            <div className="text-gray-700 animate-fade-in" style={{animationDelay: '0.6s'}}>
              <p className="text-lg lg:text-xl font-semibold hover:text-gray-900 transition-colors duration-300 cursor-default">
                Navigate your mental wellness journey with AI-powered emotional guidance
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Auth Forms */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white/95 backdrop-blur-sm shadow-2xl p-6 w-96 h-[500px] animate-fade-in-right hover:shadow-3xl transition-all duration-300 border border-white/20 hover:border-blue-200">
            <div className="mb-2 text-center animate-fade-in">
              <h3 className="text-base font-semibold text-gray-600 mb-1 transition-colors duration-300">
                {isLogin ? "Sign In" : "Sign Up"}
              </h3>
              <h2 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-300 cursor-default">
                Inner Compass
              </h2>
            </div>
            
            {/* Auth Form */}
            <div className="mt-4 animate-slide-up" style={{animationDelay: '0.1s'}}>
              {isLogin ? (
                <Login onToggleMode={toggleMode} />
              ) : (
                <Signup onToggleMode={toggleMode} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
