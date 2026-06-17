/**
 * User Dashboard Page
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAlertCircle, FiCheckCircle, FiClock, FiTrendingUp } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext.jsx';
import { passwordAPI } from '../../services/apiService.js';
import { formatDate, getDaysUntil, getPasswordStrengthColor } from '../../utils/helpers.js';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statusRes, historyRes] = await Promise.all([
        passwordAPI.getPasswordStatus(),
        passwordAPI.getPasswordHistory(),
      ]);
      setPasswordStatus(statusRes.data.data);
      setHistory(historyRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome, {user?.name}!</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your password security</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Security Score */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Security Score</p>
              <p className="text-3xl font-bold text-primary-600 mt-2">{user?.securityScore || 0}</p>
            </div>
            <FiTrendingUp className="text-4xl text-primary-600 opacity-20" />
          </div>
        </div>

        {/* Last Change */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Last Changed</p>
              <p className="font-semibold text-gray-900 dark:text-white mt-2">
                {formatDate(passwordStatus?.lastPasswordChange)}
              </p>
            </div>
            <FiClock className="text-4xl text-blue-600 opacity-20" />
          </div>
        </div>

        {/* Password Status */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Password Status</p>
              <p className={`font-semibold mt-2 ${passwordStatus?.passwordExpired ? 'text-danger-600' : 'text-success-600'}`}>
                {passwordStatus?.passwordExpired ? 'Expired' : 'Active'}
              </p>
            </div>
            {passwordStatus?.passwordExpired ? (
              <FiAlertCircle className="text-4xl text-danger-600 opacity-20" />
            ) : (
              <FiCheckCircle className="text-4xl text-success-600 opacity-20" />
            )}
          </div>
        </div>

        {/* Days Until Expiry */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Days Until Expiry</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {passwordStatus?.daysUntilExpiry || 'N/A'}
              </p>
            </div>
            <FiClock className="text-4xl text-orange-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Password Warning */}
      {passwordStatus?.shouldWarn && (
        <div className="mb-8 p-4 bg-warning-100 dark:bg-warning-900 border border-warning-300 dark:border-warning-700 rounded-lg flex items-start gap-3">
          <FiAlertCircle className="text-warning-600 dark:text-warning-100 flex-shrink-0 mt-0.5 text-lg" />
          <div>
            <p className="font-semibold text-warning-800 dark:text-warning-100">{passwordStatus.warningMessage}</p>
            {passwordStatus?.shouldWarn && (
              <button
                onClick={() => navigate('/dashboard/change-password')}
                className="mt-2 text-warning-700 dark:text-warning-200 hover:underline font-medium"
              >
                Change Password Now →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Password History */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Password History</h2>
        {history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Changed Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Reason</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Strength</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-3 px-4">{formatDate(record.changedAt)}</td>
                    <td className="py-3 px-4 capitalize">{record.changeReason}</td>
                    <td className="py-3 px-4">
                      <span className={`badge badge-${getPasswordStrengthColor(record.passwordStrength)}`}>
                        {record.passwordStrength}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No password history available</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
