import React, { useState } from 'react';
import { LucideEye, LucideEyeOff, LucideLogIn, LucideUserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Login = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, demoLogin } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const result = await login(formData);
    
    if (!result.success) {
      setError(result.message);
    }
    
    setIsSubmitting(false);
  };

  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log('Starting demo login...');
      const result = await demoLogin();
      console.log('Demo login result:', result);
      
      if (!result.success) {
        setError(result.message);
      }
    } catch (err) {
      console.error('Demo login error:', err);
      setError('Demo login failed. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your Inner Compass account</p>
          <div className="demo-credentials">
            <h3 className="demo-title">Try Demo</h3>
            <p className="demo-text">Experience the dashboard instantly</p>
            <button 
              type="button" 
              onClick={handleDemoLogin}
              className="demo-login-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="loading-spinner"></div>
              ) : (
                'Open Demo Dashboard'
              )}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="emailOrUsername" className="form-label">Email or Username</label>
            <input
              type="text"
              id="emailOrUsername"
              name="emailOrUsername"
              value={formData.emailOrUsername}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your email or username"
              required
            />
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
                placeholder="Enter your password"
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
                <LucideLogIn size={20} className="button-icon" />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-switch-text">
            Don't have an account?
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="auth-switch-button"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
