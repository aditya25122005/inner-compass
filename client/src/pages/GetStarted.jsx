import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Mail, ArrowRight, Loader } from "lucide-react";

const GetStarted = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [clientId, setClientId] = useState("");
  
  // New user signup form states
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [signupData, setSignupData] = useState({
    name: "",
    age: "",
    sex: ""
  });
  const [verifiedEmail, setVerifiedEmail] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Load Phone.Email config and show widget immediately
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await API.get("/auth/phone-email-config");
        setClientId(response.data.clientId);
        console.log("Phone.Email Client ID loaded:", response.data.clientId);
      } catch (error) {
        console.error("Error loading config:", error);
        setMessage("Failed to load configuration. Please refresh the page.");
        setIsError(true);
      }
    };
    loadConfig();
  }, []);

  // Setup Phone.Email widget and listener
  useEffect(() => {
    if (clientId && !showSignupForm) {
      // Load Phone.Email script
      const script = document.createElement("script");
      script.src = "https://www.phone.email/verify_email_v1.js";
      script.async = true;
      script.onload = () => {
        console.log("Phone.Email script loaded successfully");
      };
      document.body.appendChild(script);

      // Setup global callback for Phone.Email
      window.phoneEmailReceiver = async (userObj) => {
        console.log("Phone.Email callback received:", userObj);
        const user_json_url = userObj.user_json_url;
        
        setIsLoading(true);
        setMessage("Verifying your email...");
        
        try {
          const response = await API.post("/auth/verify-otp-login", {
            userJsonUrl: user_json_url,
          });
          
          console.log("Verification response:", response.data);
          
          // Check if user exists or is new
          if (response.data.userExists === false) {
            // New user - show signup form
            console.log("New user detected, showing signup form");
            setVerifiedEmail(response.data.email);
            setShowSignupForm(true);
            setMessage("📝 Please complete your profile to continue");
            setIsError(false);
          } else {
            // Existing user - login directly
            console.log("Existing user, logging in...");
            login(response.data.user, response.data.accessToken);
            localStorage.setItem("token", response.data.accessToken);
            setMessage("✅ Welcome back! Redirecting to dashboard...");
            setIsError(false);
            setTimeout(() => navigate("/dashboard"), 1500);
          }
        } catch (error) {
          console.error("Verification error:", error);
          setMessage(error.response?.data?.message || "Verification failed. Please try again.");
          setIsError(true);
        } finally {
          setIsLoading(false);
        }
      };

      return () => {
        if (script.parentNode) {
          document.body.removeChild(script);
        }
        delete window.phoneEmailReceiver;
      };
    }
  }, [clientId, showSignupForm, login, navigate]);

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    
    if (!signupData.name || !signupData.age || !signupData.sex) {
      setMessage("Please fill in all fields");
      setIsError(true);
      return;
    }

    if (signupData.age < 13 || signupData.age > 120) {
      setMessage("Please enter a valid age (13-120)");
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setMessage("Creating your account...");

    try {
      const response = await API.post("/auth/register", {
        email: verifiedEmail,
        name: signupData.name,
        age: parseInt(signupData.age),
        sex: signupData.sex,
        isEmailVerified: true
      });

      console.log("Registration successful:", response.data);
      
      // Generate tokens and login
      const loginResponse = await API.post("/auth/complete-registration", {
        email: verifiedEmail
      });

      login(loginResponse.data.user, loginResponse.data.accessToken);
      localStorage.setItem("token", loginResponse.data.accessToken);
      
      setMessage("✅ Account created! Welcome to Inner Compass!");
      setIsError(false);
      
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      console.error("Registration error:", error);
      setMessage(error.response?.data?.message || "Registration failed. Please try again.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/60">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl mb-4">
              <Mail className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {showSignupForm ? "Complete Your Profile" : "Get Started"}
            </h2>
            <p className="text-gray-600">
              {showSignupForm 
                ? "Just a few more details to create your account" 
                : "Verify your email to begin your journey"
              }
            </p>
          </div>

          {/* Phone.Email OTP Widget - Show immediately */}
          {!showSignupForm && clientId && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 border-2 border-emerald-200 rounded-xl p-5">
                <p className="text-gray-700 text-sm font-medium text-center mb-4">
                  🔐 <strong>Secure Email Verification</strong>
                </p>
                <p className="text-gray-600 text-xs text-center">
                  Click the button below to verify your email with OTP
                </p>
              </div>

              <div className="flex flex-col items-center space-y-4">
                <div
                  className="pe_verify_email"
                  data-client-id={clientId}
                ></div>
              </div>

              {isLoading && (
                <div className="flex items-center justify-center space-x-2 text-emerald-600">
                  <Loader className="w-5 h-5 animate-spin" />
                  <span className="text-sm font-medium">Processing...</span>
                </div>
              )}
            </div>
          )}

          {/* Signup Form for New Users */}
          {showSignupForm && (
            <form onSubmit={handleSignupSubmit} className="space-y-5 animate-fade-in">
              <div className="bg-cyan-50 border-2 border-cyan-200 rounded-xl p-3 mb-4">
                <p className="text-cyan-700 text-sm font-medium">
                  ✅ Email verified: <span className="font-mono">{verifiedEmail}</span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={signupData.name}
                  onChange={handleSignupChange}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  placeholder="Enter your age"
                  value={signupData.age}
                  onChange={handleSignupChange}
                  required
                  min="13"
                  max="120"
                  disabled={isLoading}
                  className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  name="sex"
                  value={signupData.sex}
                  onChange={handleSignupChange}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 disabled:bg-gray-100"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-4 rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Message Display */}
          {message && (
            <div
              className={`mt-6 p-4 text-center text-sm rounded-xl animate-fade-in font-medium ${
                isError
                  ? "bg-red-50 text-red-600 border-2 border-red-200"
                  : "bg-green-50 text-green-600 border-2 border-green-200"
              }`}
            >
              {message}
            </div>
          )}

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
