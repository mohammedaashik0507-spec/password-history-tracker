/**
 * Login Page Component
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { isValidEmail } from '../../utils/helpers.js';
import { CONSTANTS } from '../../config/constants.js';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = CONSTANTS.ERRORS.INVALID_EMAIL;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || CONSTANTS.ERRORS.SERVER_ERROR);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full animate-fadeIn">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-block bg-primary-600 p-3 rounded-lg mb-4">
          <FiLock className="text-white text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Password Tracker</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Secure Password Management</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-danger-100 dark:bg-danger-900 border border-danger-300 dark:border-danger-700 rounded-lg flex items-gap-3">
          <FiAlertCircle className="text-danger-600 dark:text-danger-100 flex-shrink-0 mt-0.5" />
          <p className="text-danger-700 dark:text-danger-100">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <FiMail className="absolute left-3 top-3 text-gray-400 text-lg" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="input-field pl-10"
            />
          </div>
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <FiLock className="absolute left-3 top-3 text-gray-400 text-lg" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="input-field pl-10"
            />
          </div>
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full mt-6 font-medium flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
