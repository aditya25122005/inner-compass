import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("auth/login", formData);
      if (response.data.message === "Login successful") {
        login(response.data.user, response.data.accessToken);
        localStorage.setItem("token", response.data.accessToken); // new line added
        setMessage("Login successful! Redirecting...");
        setIsError(false);
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An error occurred. Please try again.");
      }
      setIsError(true);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-2">
        <p className="text-gray-600 text-xs">
          You can reach everything you are looking for
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Email input - separate line */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="text"
            name="username"
            placeholder="Enter your email"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full p-2.5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400"
          />
        </div>

        {/* Password input - separate line */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2.5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2.5 text-base hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Sign In
        </button>
      </form>

      {/* Message */}
      {message && (
        <div
          className={`mt-3 p-2 text-center text-sm ${
            isError
              ? "bg-red-50 text-red-600 border border-red-200"
              : "bg-green-50 text-green-600 border border-green-200"
          }`}
        >
          {message}
        </div>
      )}

      {/* Toggle to signup */}
      <p className="mt-3 text-center text-sm text-gray-600">
        Create new user?{" "}
        <button
          type="button"
          onClick={onToggleMode}
          className="text-blue-500 font-semibold hover:underline focus:outline-none"
        >
          Sign up
        </button>
      </p>
    </div>
  );
};

export default Login;
