import React from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../../features/auth/useAuth';
import Logoo from '../Nav/Logoo';
import {
  FiHome,
  FiCreditCard,
  FiFileText,
  FiList,
  FiX,
  FiUsers,
} from 'react-icons/fi';

const DashboardSidebar = ({ isOpen, onClose }) => {
  const { userRole } = useAuth();

  const getNavItems = () => {
    if (userRole === 'affairs_staff') {
      return [
        {
          name: 'Home',
          path: '/dashboard/affairs',
          icon: FiHome,
        },
        {
          name: 'Request',
          path: '/dashboard/affairs/requests',
          icon: FiFileText,
        },
        {
          name: 'Complaints',
          path: '/dashboard/affairs/complaints',
          icon: FiList,
        },
      ];
    }

    if (userRole === 'academic_staff') {
      return [
        {
          name: 'Home',
          path: '/dashboard/academic',
          icon: FiHome,
        },
        {
          name: 'Requests',
          path: '/dashboard/academic/requests',
          icon: FiFileText,
        },
        // {
        //   name: 'My Students',
        //   path: '/dashboard/academic/students',
        //   icon: FiUsers,
        // },
      ];
    }

    if (userRole === 'admin') {
      return [
        {
          name: 'Home',
          path: '/dashboard/admin',
          icon: FiHome,
        },
        {
          name: 'Users Management',
          path: '/dashboard/admin/users',
          icon: FiUsers,
        },
        {
          name: 'Requests',
          path: '/dashboard/admin/requests',
          icon: FiFileText,
        },
        {
          name: 'Complaints',
          path: '/dashboard/admin/complaints',
          icon: FiList,
        },
      ];
    }

    // Default: student
    return [
      {
        name: 'Home',
        path: '/dashboard/student',
        icon: FiHome,
      },
      {
        name: 'Dues & Payment',
        path: '/dashboard/student/dues',
        icon: FiCreditCard,
      },
      {
        name: 'Request',
        path: '/dashboard/student/requests',
        icon: FiFileText,
      },
      {
        name: 'Complaints',
        path: '/dashboard/student/complaints',
        icon: FiList,
      },
    ];
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[110] bg-slate-900/20 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-[120] flex w-[280px] transform flex-col border-r border-slate-100 bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-transparent p-6">
          <Logoo />

          <button
            onClick={onClose}
            className="rounded-full bg-slate-50 p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-indigo-900"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-6">
          {navItems.map((item) => {
            const isHome =
              item.path.endsWith('/student') ||
              item.path.endsWith('/affairs') ||
              item.path.endsWith('/academic') ||
              item.path.endsWith('/admin');

            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={isHome}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-4 rounded-xl px-5 py-3.5 font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#1e1b4b] text-white shadow-md'
                      : 'text-[#1e1b4b] hover:bg-indigo-50/50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      size={20}
                      className={
                        isActive
                          ? 'text-white'
                          : 'text-[#1e1b4b]'
                      }
                    />

                    <span className="text-[15px]">
                      {item.name}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default DashboardSidebar;