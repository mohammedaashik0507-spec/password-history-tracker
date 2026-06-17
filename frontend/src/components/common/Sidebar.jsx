/**
 * Sidebar Component
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiLock, FiSettings, FiBarChart2 } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext.jsx';

const Sidebar = () => {
  const { user } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FiHome },
    { path: '/dashboard/change-password', label: 'Change Password', icon: FiLock },
    { path: '/dashboard/settings', label: 'Settings', icon: FiSettings },
  ];

  const adminItems = [
    { path: '/admin', label: 'Admin Dashboard', icon: FiBarChart2 },
  ];

  return (
    <aside className="fixed left-0 top-16 w-64 h-screen bg-white dark:bg-gray-800 shadow-lg overflow-y-auto">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-100'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <item.icon className="text-xl" />
            <span>{item.label}</span>
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <>
            <hr className="my-4 border-gray-200 dark:border-gray-700" />
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Admin
            </div>
            {adminItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-100'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                <item.icon className="text-xl" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
