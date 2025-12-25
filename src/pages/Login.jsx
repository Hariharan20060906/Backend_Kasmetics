import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const { dispatch } = useApp();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin && !isAdminLogin) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      let endpoint, payload;
      
      if (isAdminLogin) {
        endpoint = '/auth/admin-login';
        payload = { email: formData.email, password: formData.password };
      } else if (isLogin) {
        endpoint = '/auth/login';
        payload = { email: formData.email, password: formData.password };
      } else {
        endpoint = '/auth/register';
        payload = { name: formData.name, email: formData.email, password: formData.password };
      }

      const response = await api.post(endpoint, payload);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        dispatch({ type: 'SET_USER', payload: response.data });
        
        if (response.data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Authentication failed';
      setErrors({ submit: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setIsAdminLogin(false);
    setFormData({
      email: '',
      password: '',
      name: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  const toggleAdminLogin = () => {
    setIsAdminLogin(!isAdminLogin);
    setIsLogin(true);
    setFormData({
      email: isAdminLogin ? '' : 'admin@kasmetics.com',
      password: isAdminLogin ? '' : 'admin123',
      name: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="brand-logo">Kasmetics</div>
            <h1 className="login-title">
              {isAdminLogin ? 'Admin Login' : isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="login-subtitle">
              {isAdminLogin 
                ? 'Access admin dashboard' 
                : isLogin 
                  ? 'Sign in to continue your beauty journey' 
                  : 'Join thousands of beauty enthusiasts'
              }
            </p>
          </div>

          <div className="login-body">
            <form onSubmit={handleSubmit} className="login-form">
              {!isLogin && !isAdminLogin && (
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="Enter your email"
                  readOnly={isAdminLogin}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Enter your password"
                  readOnly={isAdminLogin}
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              {!isLogin && !isAdminLogin && (
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                </div>
              )}

              {errors.submit && (
                <div className="submit-error">
                  {errors.submit}
                </div>
              )}

              <button type="submit" className="login-btn" disabled={false}>
                {isAdminLogin ? 'Admin Login' : isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="login-footer">
              {!isAdminLogin && (
                <p className="toggle-text">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button 
                    type="button" 
                    onClick={toggleMode}
                    className="toggle-btn"
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              )}
              
              <p className="toggle-text">
                <button 
                  type="button" 
                  onClick={toggleAdminLogin}
                  className="toggle-btn admin-toggle"
                >
                  {isAdminLogin ? 'User Login' : 'Admin Login'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;