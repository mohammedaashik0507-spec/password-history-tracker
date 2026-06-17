/**
 * Main Layout Component
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar.jsx';
import Sidebar from '../common/Sidebar.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export const MainLayout = () => {
  const { isDark } = useTheme();

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-64 pt-16">
            <div className="container-base py-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
