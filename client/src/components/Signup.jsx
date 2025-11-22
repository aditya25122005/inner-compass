import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

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
      const submitData = { ...formData, username: formData.email };

      const response = await API.post("auth/register", submitData);

      if (response.data.message === "User registered successfully") {
        setMessage("🎉 Registration successful! You can now sign in.");
        setIsError(false);
        setTimeout(() => onToggleMode(), 2000);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Something went wrong. Try again."
      );
      setIsError(true);
    }
  };

  return (
    <div className="w-full">
      {/* <h2 className="text-xl font-bold text-center text-gray-800 mb-1">
        Create Account
      </h2> */}
      <p className="text-center text-gray-600 text-sm mb-4">
        You can reach everything you are looking for
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Full Name */}
        <div>
          <label className="text-sm text-gray-700 font-medium">Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter full name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        {/* Gender + Age */}
        <div className="grid grid-cols-2 gap-4">

          {/* Gender */}
          <div>
            <label className="text-sm text-gray-700 font-medium">Gender</label>
            <select
              name="sex"
              required
              value={formData.sex}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Age — clean stylish number input (NO ARROWS) */}
          <div>
            <label className="text-sm text-gray-700 font-medium">Age</label>
            <input
              type="number"
              name="age"
              placeholder="Age"
              required
              value={formData.age}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition
                         [appearance:textfield] 
                         [&::-webkit-outer-spin-button]:appearance-none 
                         [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-gray-700 font-medium">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-sm text-gray-700 font-medium">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition shadow"
        >
          Sign Up
        </button>
      </form>

      {/* Message */}
      {message && (
        <p
          className={`mt-4 text-center p-2 rounded ${
            isError
              ? "bg-red-50 text-red-600 border border-red-200"
              : "bg-green-50 text-green-700 border border-green-200"
          }`}
        >
          {message}
        </p>
      )}

      {/* Toggle login */}
      <p className="mt-4 text-center text-sm text-gray-600">
        Existing user?{" "}
        <button onClick={onToggleMode} className="text-indigo-600 font-medium">
          Log in
        </button>
      </p>
    </div>
  );
};

export default Signup;
