import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = ({ onToggleMode }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [clientId, setClientId] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  // Load Phone.Email config
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await API.get("/auth/phone-email-config");
        setClientId(response.data.clientId);
        console.log("Phone.Email Client ID loaded:", response.data.clientId);
      } catch (error) {
        console.error("Error loading config:", error);
        setMessage("Failed to load configuration. Please refresh.");
        setIsError(true);
      }
    };
    loadConfig();
  }, []);

  // Setup Phone.Email listener
  useEffect(() => {
    if (clientId && step === 2) {
      // Load Phone.Email script
      const script = document.createElement("script");
      script.src = "https://www.phone.email/verify_email_v1.js";
      script.async = true;
      script.onload = () => {
        console.log("Phone.Email script loaded");
      };
      document.body.appendChild(script);

      // Setup global listener for Phone.Email callback
      window.phoneEmailReceiver = async (userObj) => {
        console.log("Phone.Email callback received:", userObj);
        const user_json_url = userObj.user_json_url;
        
        setIsLoading(true);
        setMessage("Verifying your email...");
        
        try {
          const response = await API.post("/auth/verify-otp-login", {
            userJsonUrl: user_json_url,
          });
          
          console.log("Login response:", response.data);
          
          if (response.data.message === "Login successful via OTP") {
            login(response.data.user, response.data.accessToken, response.data.refreshToken);
            setMessage("✅ Login successful! Redirecting...");
            setIsError(false);
            setTimeout(() => navigate("/dashboard"), 1500);
          }
        } catch (error) {
          console.error("Login error:", error);
          setMessage(error.response?.data?.message || "Login failed. Please try again.");
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
  }, [clientId, step, login, navigate]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setMessage("Please enter your email address");
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await API.post("/auth/send-otp", { email });
      console.log("OTP request response:", response.data);
      
      setStep(2);
      setMessage("📧 Check your email for the verification code");
      setIsError(false);
    } catch (error) {
      console.error("OTP request error:", error);
      setMessage(error.response?.data?.message || "Failed to send OTP. Please try again.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8 animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Welcome Back</h2>
        <p className="text-gray-600 text-base">
          {step === 1 ? "Sign in with email verification" : "Enter the code sent to your email"}
        </p>
      </div>

      {/* Step 1: Enter Email */}
      {step === 1 && (
        <form onSubmit={handleSendOTP} className="space-y-6 animate-fade-in">
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3">
              📧 Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-3.5 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-400 placeholder:text-gray-400 disabled:bg-gray-100"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 text-lg rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? "Sending OTP..." : "🔐 Send OTP"}
          </button>
        </form>
      )}

      {/* Step 2: Phone.Email Widget */}
      {step === 2 && clientId && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <p className="text-blue-700 text-sm">
              📧 <strong>Verification email sent to:</strong><br/>
              <span className="font-mono">{email}</span>
            </p>
          </div>

          <div className="flex justify-center">
            <div
              className="pe_verify_email"
              data-client-id={clientId}
            ></div>
          </div>

          <button
            type="button"
            onClick={() => {
              setStep(1);
              setMessage("");
              setIsError(false);
            }}
            className="w-full bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-all duration-300"
          >
            ← Change Email
          </button>
        </div>
      )}

      {/* Message Display */}
      {message && (
        <div
          className={`mt-6 p-4 text-center text-base rounded-lg animate-fade-in ${
            isError
              ? "bg-red-50 text-red-600 border-2 border-red-200"
              : "bg-green-50 text-green-600 border-2 border-green-200"
          }`}
        >
          {message}
        </div>
      )}

      {/* Sign Up Link */}
      <div className="mt-8 text-center animate-fade-in">
        <p className="text-base text-gray-600">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onToggleMode}
            className="text-blue-500 font-bold hover:text-blue-600 hover:underline focus:outline-none transition-colors duration-300"
          >
            Sign up now
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
