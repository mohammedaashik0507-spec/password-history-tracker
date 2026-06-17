/**
 * Change Password Page
 */

import React, { useState } from 'react';
import { FiLock, FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle, FiZap } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext.jsx';
import { passwordAPI, authAPI } from '../../services/apiService.js';
import { isStrongPassword } from '../../utils/helpers.js';

const ChangePasswordPage = () => {
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (!isStrongPassword(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase, number, and special character';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));

    // Check password strength for new password field
    if (name === 'newPassword' && value) {
      try {
        const response = await passwordAPI.checkPasswordStrength(value);
        setPasswordStrength(response.data.data);
      } catch (error) {
        console.error('Error checking password strength:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    try {
      setLoading(true);
      await passwordAPI.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      // Refresh user data
      const userRes = await authAPI.getCurrentUser();
      setUser(userRes.data.data);

      setSuccess('Password changed successfully!');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordStrength(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Change Password</h1>
        <p className="text-gray-600 dark:text-gray-400">Update your password to keep your account secure</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-success-100 dark:bg-success-900 border border-success-300 dark:border-success-700 rounded-lg flex items-gap-3">
          <FiCheckCircle className="text-success-600 dark:text-success-100 flex-shrink-0 mt-0.5 text-lg" />
          <p className="text-success-700 dark:text-success-100">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-danger-100 dark:bg-danger-900 border border-danger-300 dark:border-danger-700 rounded-lg flex items-gap-3">
          <FiAlertCircle className="text-danger-600 dark:text-danger-100 flex-shrink-0 mt-0.5 text-lg" />
          <p className="text-danger-700 dark:text-danger-100">{error}</p>
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400 text-lg" />
              <input
                type={showPasswords.current ? 'text' : 'password'}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter your current password"
                className="input-field pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.current ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
              </button>
            </div>
            {errors.currentPassword && <p className="error-text">{errors.currentPassword}</p>}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400 text-lg" />
              <input
                type={showPasswords.new ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter a strong password"
                className="input-field pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.new ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
              </button>
            </div>
            {errors.newPassword && <p className="error-text">{errors.newPassword}</p>}

            {/* Password Strength Indicator */}
            {passwordStrength && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Password Strength</span>
                  <span className={`text-sm font-semibold ${passwordStrength.isStrong ? 'text-success-600' : 'text-warning-600'}`}>
                    {passwordStrength.strength}
                  </span>
                </div>
                <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      passwordStrength.percentage >= 80
                        ? 'bg-success-600'
                        : passwordStrength.percentage >= 60
                        ? 'bg-blue-600'
                        : 'bg-warning-600'
                    }`}
                    style={{ width: `${passwordStrength.percentage}%` }}
                  />
                </div>
                {passwordStrength.recommendations.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {passwordStrength.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <FiZap className="text-yellow-500" /> {rec}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400 text-lg" />
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your new password"
                className="input-field pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.confirm ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full font-medium flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Changing password...
              </>
            ) : (
              'Change Password'
            )}
          </button>
        </form>
      </div>

      {/* Security Tips */}
      <div className="mt-8 card bg-blue-50 dark:bg-blue-900">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Password Security Tips</h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>✓ Use at least 8 characters</li>
          <li>✓ Include uppercase and lowercase letters</li>
          <li>✓ Add numbers and special characters (@$!%*?&)</li>
          <li>✓ Never reuse your last 5 passwords</li>
          <li>✓ Change password every 90 days</li>
        </ul>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
