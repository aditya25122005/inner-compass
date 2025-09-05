import React, { useState } from 'react';
import { LucideEye, LucideEyeOff, LucideUserPlus, LucideLogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    age: '',
    sex: 'Other'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: name === 'age' ? Number(value) : value
    }));
    if (error) setError('');
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('handleSubmit is called!');
  setIsSubmitting(true);
  setError('');

  // Basic validation
  if (formData.password.length < 6) {
    setError('Password must be at least 6 characters long');
    setIsSubmitting(false);
    return;
  }

  if (formData.age && (formData.age < 13 || formData.age > 120)) {
    setError('Age must be between 13 and 120');
    setIsSubmitting(false);
    return;
  }

  try {
    const result = await register(formData);

    if (!result.success) {
      console.error('Registration failed backend response:', result); // <-- log full result
      setError(result.message || 'Something went wrong. Please try again.');
    }
  } catch (err) {
    console.error('Registration unexpected error:', err); // catches unexpected errors
    setError('Registration failed. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="auth-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join Inner Compass to track your mental wellness</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-input"
                placeholder="Choose a username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age" className="form-label">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="form-input"
                placeholder="Your age"
                min="13"
                max="120"
              />
            </div>

            <div className="form-group">
              <label htmlFor="sex" className="form-label">Gender</label>
              <select
                id="sex"
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                className="form-input"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input password-input"
                placeholder="Create a strong password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <LucideEyeOff size={20} /> : <LucideEye size={20} />}
              </button>
            </div>
            <p className="password-hint">
              Password must be at least 6 characters long
            </p>
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="loading-spinner"></div>
            ) : (
              <>
                <LucideUserPlus size={20} className="button-icon" />
                Create Account
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-switch-text">
            Already have an account?
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="auth-switch-button"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
