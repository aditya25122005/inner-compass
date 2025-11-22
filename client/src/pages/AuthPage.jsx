import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Login from "../components/Login";
import Signup from "../components/Signup";
import bgImage from "../assests/bg-img1.png";

const AuthPage = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    setIsLogin(location.pathname === "/login");
  }, [location.pathname]);

  const toggleMode = () => setIsLogin(!isLogin);

  const handleNavToggle = (mode) => {
    setIsLogin(mode === "login");
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* NAVBAR */}
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
            onClick={() => handleNavToggle("login")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105 ${
              isLogin
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-white/20 text-gray-700 hover:bg-white/30 hover:shadow-md"
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => handleNavToggle("signup")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105 ${
              !isLogin
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-white/20 text-gray-700 hover:bg-white/30 hover:shadow-md"
            }`}
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* MAIN PAGE */}
      <div className="flex-1 flex">
        {/* LEFT SIDE BRANDING */}
        <div className="flex-1 flex flex-col justify-center pl-12 lg:pl-20">
          <div className="text-left max-w-lg animate-fade-in-left">
            <div className="mb-8">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-4 animate-slide-up hover:text-blue-600 transition-colors duration-500">
                INNER
              </h1>

              <div className="flex items-center gap-3 mb-8">
                <h1
                  className="text-5xl lg:text-6xl font-bold text-gray-800 animate-slide-up hover:text-blue-600 transition-colors duration-500"
                  style={{ animationDelay: "0.2s" }}
                >
                  C
                  <span
                    className="inline-flex items-center justify-center mx-1"
                    style={{ transform: "translateY(-9px)" }}
                  >
                    <div
                      className="w-10 h-10 lg:w-12 lg:h-12 border-4 border-gray-700 rounded-full flex items-center justify-center hover:animate-spin transition-all duration-300 hover:border-blue-600"
                      style={{ animationDelay: "0.4s" }}
                    >
                      <div className="w-5 h-5 lg:w-6 lg:h-6 bg-gray-700 rounded-full relative hover:bg-blue-600 transition-colors duration-300">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-3 lg:h-4 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </span>
                  MPASS
                </h1>
              </div>
            </div>

            <p
              className="text-lg lg:text-xl text-gray-700 font-semibold animate-fade-in"
              style={{ animationDelay: "0.6s" }}
            >
              Navigate your mental wellness journey with AI-powered emotional
              guidance
            </p>
          </div>
        </div>

        {/* RIGHT SIDE AUTH FORM */}
        <div className="flex-1 flex items-center justify-center p-6 md:pr-16">
          <div
            className="
              bg-white/95 
              backdrop-blur-md 
              shadow-2xl 
              p-8 
              w-[480px]
              md:w-[520px]
              lg:w-[560px]
              rounded-2xl
              border border-white/30
            "
          >
            {/* Header */}
            <div className="text-center mb-6">
              <h3 className="text-gray-600 text-lg font-semibold">
                {isLogin ? "Sign In" : "Sign Up"}
              </h3>
              <h2 className="text-2xl font-bold text-gray-800">
                Inner Compass
              </h2>
              {!isLogin && (
                <p className="text-gray-500 text-sm mt-1">
                  Create Account
                </p>
              )}
            </div>

            {/* Form */}
            <div className="mt-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
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
