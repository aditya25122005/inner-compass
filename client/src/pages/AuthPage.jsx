import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Login from "../components/Login";
import Signup from "../components/Signup";
import bgImage from "../assests/bg-img1.png";

const AuthPage = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);

 
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
    <div className="min-h-screen flex relative overflow-hidden">
      <div 
        className="w-[60%] min-h-screen flex flex-col px-12 lg:px-20 py-8"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="mb-auto">
          <h1 className="text-3xl font-bold text-gray-800 animate-fade-in-down">
            Inner Compass
          </h1>
        </div>

        <div className="max-w-2xl animate-fade-in-left">
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-8 leading-tight">
            Inner Compass
          </h2>
          
          <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
            Begin your journey to emotional healing with Inner Compass—where compassionate guidance, personalised support, and a safe, nurturing space help you rediscover balance, build resilience, and move confidently toward a happier, healthier, and more empowered you.
          </p>
        </div>

        <div className="mt-auto"></div>
      </div>

      <div className="fixed right-0 top-0 w-[40%] h-screen bg-white shadow-2xl flex items-center justify-center overflow-y-auto">
        <Link 
          to="/" 
          className="absolute top-6 right-6 flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-all duration-300 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">Back to Home</span>
        </Link>
        
        <div className="w-full max-w-md px-8 py-12 animate-fade-in-right">
          <div className="mb-8 text-center">
            
          </div>
          
          <div className="animate-slide-up">
            {isLogin ? (
              <Login onToggleMode={toggleMode} />
            ) : (
              <Signup onToggleMode={toggleMode} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
