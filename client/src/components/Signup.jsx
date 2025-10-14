import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Signup = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
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
      // Use email as username for backend compatibility
      const submitData = {
        ...formData,
        username: formData.email
      };
      const response = await API.post("auth/register", submitData);
      if (response.data.message === "User registered successfully") {
        setMessage("🎉 Registration successful! You can now sign in.");
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
      <div className="text-center mb-2">
        <p className="text-gray-600 text-xs">
          You can reach everything you are looking for
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Full Name and Gender on one line */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2.5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              required
              className="w-full p-2.5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Email field - separate line */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2.5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400"
          />
        </div>

        <div className="grid grid-cols-5 gap-3">
          <div className="col-span-4">
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

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              required
              className="w-full p-2.5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2.5 text-base hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Sign Up
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

      {/* Toggle to login */}
      <p className="mt-3 text-center text-sm text-gray-600">
        Existing user?{" "}
        <button
          type="button"
          onClick={onToggleMode}
          className="text-blue-500 font-semibold hover:underline focus:outline-none"
        >
          Log in
        </button>
      </p>
    </div>
  );
};

export default Signup;
