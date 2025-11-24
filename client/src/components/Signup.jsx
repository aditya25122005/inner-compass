import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Signup = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    age: "",
    sex: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("auth/register", formData);
      
      if (response.data.message?.includes("registered successfully")) {
        setMessage("🎉 Registration successful! Please use OTP to login.");
        setIsError(false);
        setTimeout(() => onToggleMode(), 2000);
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
      <div className="text-center mb-8 animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Create Account</h2>
        <p className="text-gray-600 text-base">
          Start your wellness journey
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4 animate-slide-up">
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3.5 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-400 placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3">
              Age
            </label>
            <input
              type="number"
              name="age"
              placeholder="25"
              value={formData.age}
              onChange={handleChange}
              required
              className="w-full px-4 py-3.5 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-400 placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="animate-slide-up">
          <label className="block text-base font-semibold text-gray-700 mb-3">
            Gender
          </label>
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            required
            className="w-full px-4 py-3.5 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-400"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="animate-slide-up">
          <label className="block text-base font-semibold text-gray-700 mb-3">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3.5 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-400 placeholder:text-gray-400"
          />
        </div>

        <div className="pt-4 animate-slide-up">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-4 text-lg rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Create Account
          </button>
        </div>
      </form>

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

      <div className="mt-8 text-center animate-fade-in">
        <p className="text-base text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onToggleMode}
            className="text-blue-500 font-bold hover:text-blue-600 hover:underline focus:outline-none transition-colors duration-300"
          >
            Log in here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
