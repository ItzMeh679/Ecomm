import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Calendar, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import './SignInSignUp.css';

// Google OAuth Script Loader
const loadGoogleScript = () => {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve(window.google);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) {
        resolve(window.google);
      } else {
        reject(new Error('Google script loaded but window.google not available'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load Google script'));
    document.head.appendChild(script);
  });
};

const SignInSignUp = ({ onClose, defaultMode = 'signin' }) => {
  const { login, apiCall } = useAuth();
  
  // State management
  const [mode, setMode] = useState(defaultMode); // 'signin', 'signup', 'verify-otp', 'reset-password'
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', content: '' });
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    otp: '',
    userId: '',
    resetEmail: ''
  });

  // Google OAuth
  const [googleLoaded, setGoogleLoaded] = useState(false);

  // Load Google OAuth script
  useEffect(() => {
    const initializeGoogle = async () => {
      try {
        await loadGoogleScript();
        
        if (window.google?.accounts?.id) {
          window.google.accounts.id.initialize({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your-google-client-id',
            callback: handleGoogleResponse,
            auto_select: false,
            cancel_on_tap_outside: true
          });
          setGoogleLoaded(true);
        }
      } catch (error) {
        console.error('Failed to load Google OAuth:', error);
        setMessage({ type: 'error', content: 'Google OAuth unavailable. Please use email signup/signin.' });
      }
    };

    initializeGoogle();
  }, []);

  // Handle Google OAuth response
  const handleGoogleResponse = async (response) => {
    setIsLoading(true);
    setErrors({});
    setMessage({ type: '', content: '' });

    try {
      const data = await apiCall('/user/google-auth', {
        method: 'POST',
        body: JSON.stringify({ credential: response.credential })
      });

      if (data.status === 'SUCCESS') {
        login(data.data.user, data.data.token);
        setMessage({ type: 'success', content: data.message });
        setTimeout(() => onClose?.(), 1500);
      } else {
        setMessage({ type: 'error', content: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', content: 'Google authentication failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger Google Sign-In
  const handleGoogleSignIn = () => {
    if (window.google?.accounts?.id && googleLoaded) {
      window.google.accounts.id.prompt();
    } else {
      setMessage({ type: 'error', content: 'Google OAuth not available. Please refresh the page.' });
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (mode === 'signup') {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      else if (!/^[a-zA-Z ]+$/.test(formData.name.trim())) newErrors.name = 'Name should only contain letters';
      
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      else {
        const birthDate = new Date(formData.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 13) newErrors.dateOfBirth = 'You must be at least 13 years old';
      }
      
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }

    if (mode === 'signin' || mode === 'signup') {
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email.trim())) newErrors.email = 'Please enter a valid email';
      
      if (!formData.password) newErrors.password = 'Password is required';
      else if (mode === 'signup' && formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters long';
    }

    if (mode === 'verify-otp') {
      if (!formData.otp.trim()) newErrors.otp = 'OTP is required';
      else if (!/^\d{4}$/.test(formData.otp.trim())) newErrors.otp = 'Please enter a valid 4-digit OTP';
    }

    if (mode === 'reset-password') {
      if (!formData.resetEmail.trim()) newErrors.resetEmail = 'Email is required';
      else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.resetEmail.trim())) newErrors.resetEmail = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage({ type: '', content: '' });

    try {
      let endpoint, payload;

      switch (mode) {
        case 'signin':
          endpoint = '/user/signin';
          payload = {
            email: formData.email.trim(),
            password: formData.password
          };
          break;

        case 'signup':
          endpoint = '/user/signup';
          payload = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
            dateOfBirth: formData.dateOfBirth
          };
          break;

        case 'verify-otp':
          endpoint = '/user/verifyOTP';
          payload = {
            userId: formData.userId,
            otp: formData.otp.trim()
          };
          break;

        case 'reset-password':
          endpoint = '/user/requestPasswordReset';
          payload = {
            email: formData.resetEmail.trim(),
            redirectUrl: `${window.location.origin}/reset-password`
          };
          break;

        default:
          return;
      }

      const data = await apiCall(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (data.status === 'SUCCESS') {
        if (mode === 'signin' || mode === 'verify-otp') {
          login(data.data.user, data.data.token);
          setMessage({ type: 'success', content: data.message });
          setTimeout(() => onClose?.(), 1500);
        } else if (mode === 'reset-password') {
          setMessage({ type: 'success', content: data.message });
        }
      } else if (data.status === 'PENDING') {
        if (mode === 'signup') {
          setFormData(prev => ({ ...prev, userId: data.data.userId }));
          setMode('verify-otp');
          setMessage({ type: 'info', content: data.message });
        } else {
          setMessage({ type: 'info', content: data.message });
        }
      } else {
        if (data.requiresVerification) {
          setFormData(prev => ({ ...prev, userId: data.userId }));
          setMode('verify-otp');
        }
        setMessage({ type: 'error', content: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', content: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const data = await apiCall('/user/resendOTPVerificationCode', {
        method: 'POST',
        body: JSON.stringify({
          userId: formData.userId,
          email: formData.email
        })
      });

      if (data.status === 'PENDING') {
        setMessage({ type: 'success', content: 'New OTP sent to your email!' });
      } else {
        setMessage({ type: 'error', content: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', content: 'Failed to resend OTP. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Switch modes
  const switchMode = (newMode) => {
    setMode(newMode);
    setErrors({});
    setMessage({ type: '', content: '' });
    setFormData({
      name: '',
      email: formData.email || '',
      password: '',
      confirmPassword: '',
      dateOfBirth: '',
      otp: '',
      userId: formData.userId || '',
      resetEmail: formData.email || ''
    });
  };

  // Get current form title and description
  const getFormInfo = () => {
    switch (mode) {
      case 'signin':
        return {
          title: 'Welcome Back!',
          description: 'Sign in to access your account and continue shopping'
        };
      case 'signup':
        return {
          title: 'Join Just Small Gifts',
          description: 'Create your account to start your gifting journey'
        };
      case 'verify-otp':
        return {
          title: 'Verify Your Email',
          description: `We've sent a 4-digit code to ${formData.email}. Please enter it below.`
        };
      case 'reset-password':
        return {
          title: 'Reset Your Password',
          description: 'Enter your email address and we\'ll send you a reset link'
        };
      default:
        return { title: '', description: '' };
    }
  };

  const { title, description } = getFormInfo();

  return (
    <div className="auth-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="auth-modal">
        <div className="auth-modal-header">
          {mode !== 'signin' && mode !== 'signup' && (
            <button 
              className="auth-back-button"
              onClick={() => switchMode('signin')}
              disabled={isLoading}
            >
              <ArrowLeft size={20} />
            </button>
          )}
          
          <button 
            className="auth-close-button"
            onClick={onClose}
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <div className="auth-modal-content">
          <div className="auth-header">
            <div className="auth-logo">
              <div className="logo-placeholder">
                JSG
              </div>
            </div>
            <h2 className="auth-title">{title}</h2>
            <p className="auth-description">{description}</p>
          </div>

          {/* Message Display */}
          {message.content && (
            <div className={`auth-message ${message.type}`}>
              <div className="auth-message-icon">
                {message.type === 'success' && <CheckCircle size={16} />}
                {message.type === 'error' && <AlertCircle size={16} />}
                {message.type === 'info' && <AlertCircle size={16} />}
              </div>
              <span>{message.content}</span>
            </div>
          )}

          {/* Google OAuth Button */}
          {(mode === 'signin' || mode === 'signup') && (
            <div className="auth-google-section">
              <button 
                type="button"
                className="auth-google-button"
                onClick={handleGoogleSignIn}
                disabled={isLoading || !googleLoaded}
              >
                <div className="google-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                {mode === 'signin' ? 'Continue with Google' : 'Sign up with Google'}
              </button>
              
              <div className="auth-divider">
                <span>OR</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Sign Up Fields */}
            {mode === 'signup' && (
              <>
                <div className="auth-field">
                  <label className="auth-label">Full Name</label>
                  <div className="auth-input-container">
                    <User size={20} className="auth-input-icon" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className={`auth-input ${errors.name ? 'error' : ''}`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.name && <div className="auth-error">{errors.name}</div>}
                </div>

                <div className="auth-field">
                  <label className="auth-label">Date of Birth</label>
                  <div className="auth-input-container">
                    <Calendar size={20} className="auth-input-icon" />
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className={`auth-input ${errors.dateOfBirth ? 'error' : ''}`}
                      max={new Date(Date.now() - 13 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.dateOfBirth && <div className="auth-error">{errors.dateOfBirth}</div>}
                </div>
              </>
            )}

            {/* Email Field */}
            {(mode === 'signin' || mode === 'signup') && (
              <div className="auth-field">
                <label className="auth-label">Email Address</label>
                <div className="auth-input-container">
                  <Mail size={20} className="auth-input-icon" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className={`auth-input ${errors.email ? 'error' : ''}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && <div className="auth-error">{errors.email}</div>}
              </div>
            )}

            {/* Password Field */}
            {(mode === 'signin' || mode === 'signup') && (
              <div className="auth-field">
                <label className="auth-label">Password</label>
                <div className="auth-input-container">
                  <Lock size={20} className="auth-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={mode === 'signup' ? 'Create a password (min 8 characters)' : 'Enter your password'}
                    className={`auth-input ${errors.password ? 'error' : ''}`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <div className="auth-error">{errors.password}</div>}
              </div>
            )}

            {/* Confirm Password Field */}
            {mode === 'signup' && (
              <div className="auth-field">
                <label className="auth-label">Confirm Password</label>
                <div className="auth-input-container">
                  <Lock size={20} className="auth-input-icon" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className={`auth-input ${errors.confirmPassword ? 'error' : ''}`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && <div className="auth-error">{errors.confirmPassword}</div>}
              </div>
            )}

            {/* OTP Field */}
            {mode === 'verify-otp' && (
              <div className="auth-field">
                <label className="auth-label">Verification Code</label>
                <div className="auth-input-container">
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    placeholder="Enter 4-digit code"
                    className={`auth-input otp-input ${errors.otp ? 'error' : ''}`}
                    maxLength="4"
                    disabled={isLoading}
                  />
                </div>
                {errors.otp && <div className="auth-error">{errors.otp}</div>}
                
                <div className="auth-otp-actions">
                  <p>Didn't receive the code?</p>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="auth-resend-button"
                    disabled={isLoading}
                  >
                    Resend Code
                  </button>
                </div>
              </div>
            )}

            {/* Reset Email Field */}
            {mode === 'reset-password' && (
              <div className="auth-field">
                <label className="auth-label">Email Address</label>
                <div className="auth-input-container">
                  <Mail size={20} className="auth-input-icon" />
                  <input
                    type="email"
                    name="resetEmail"
                    value={formData.resetEmail}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className={`auth-input ${errors.resetEmail ? 'error' : ''}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.resetEmail && <div className="auth-error">{errors.resetEmail}</div>}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="auth-submit-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {mode === 'signin' && 'Sign In'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'verify-otp' && 'Verify Email'}
                  {mode === 'reset-password' && 'Send Reset Link'}
                </>
              )}
            </button>
          </form>

          {/* Footer Actions */}
          <div className="auth-footer">
            {mode === 'signin' && (
              <>
                <button
                  type="button"
                  onClick={() => switchMode('reset-password')}
                  className="auth-link-button"
                  disabled={isLoading}
                >
                  Forgot Password?
                </button>
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('signup')}
                    className="auth-link-button primary"
                    disabled={isLoading}
                  >
                    Sign Up
                  </button>
                </p>
              </>
            )}

            {mode === 'signup' && (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className="auth-link-button primary"
                  disabled={isLoading}
                >
                  Sign In
                </button>
              </p>
            )}

            {mode === 'reset-password' && (
              <p>
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className="auth-link-button primary"
                  disabled={isLoading}
                >
                  Sign In
                </button>
              </p>
            )}
          </div>

          {/* Terms and Privacy */}
          {mode === 'signup' && (
            <div className="auth-terms">
              <p>
                By creating an account, you agree to our{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>
                {' '}and{' '}
                <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignInSignUp;