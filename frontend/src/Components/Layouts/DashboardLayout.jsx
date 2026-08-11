// src/Components/Layouts/DashboardLayout.jsx
//
// Change from original: wraps layout in NotificationProvider so that
// DashboardNavbar and NotificationsPage share the same notifications state.

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardNavbar from '../Dashboard/DashboardNavbar';
import DashboardSidebar from '../Dashboard/DashboardSidebar';
import { NotificationProvider } from '../../features/notifications/NotificationContext';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50 to-white flex flex-col">
        <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <DashboardNavbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-8 flex-1">
          <Outlet />
        </main>
      </div>
    </NotificationProvider>
  );
};

export default DashboardLayout;