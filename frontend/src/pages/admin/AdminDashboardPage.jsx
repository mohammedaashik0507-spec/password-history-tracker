/**
 * Admin Dashboard Page
 */

import React, { useEffect, useState } from 'react';
import { FiUsers, FiAlertCircle, FiBarChart2, FiRefreshCw } from 'react-icons/fi';
import { adminAPI } from '../../services/apiService.js';
import { formatDateTime } from '../../utils/helpers.js';

const AdminDashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [securityReport, setSecurityReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usersPage, setUsersPage] = useState(1);
  const [logsPage, setLogsPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, [usersPage, logsPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, logsRes, reportRes] = await Promise.all([
        adminAPI.getUsers(usersPage, 10),
        adminAPI.getAuditLogs(logsPage, 10),
        adminAPI.getSecurityReport(
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          new Date().toISOString()
        ),
      ]);
      setUsers(usersRes.data.data);
      setAuditLogs(logsRes.data.data);
      setSecurityReport(reportRes.data.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor users and security activity</p>
        </div>
        <button
          onClick={fetchData}
          className="btn-secondary flex items-center gap-2"
        >
          <FiRefreshCw className="text-lg" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-primary-600 mt-2">{securityReport?.statistics?.totalUsers || 0}</p>
            </div>
            <FiUsers className="text-4xl text-primary-600 opacity-20" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Active Users</p>
              <p className="text-3xl font-bold text-success-600 mt-2">{securityReport?.statistics?.activeUsers || 0}</p>
            </div>
            <FiBarChart2 className="text-4xl text-success-600 opacity-20" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Locked Accounts</p>
              <p className="text-3xl font-bold text-danger-600 mt-2">{securityReport?.statistics?.lockedUsers || 0}</p>
            </div>
            <FiAlertCircle className="text-4xl text-danger-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Role</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className="badge badge-primary capitalize">{user.role}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Audit Logs</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Action</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">IP Address</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4">{log.action}</td>
                  <td className="py-3 px-4">{log.ipAddress}</td>
                  <td className="py-3 px-4">
                    <span className={`badge ${log.status === 'success' ? 'badge-success' : 'badge-danger'}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{formatDateTime(log.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
