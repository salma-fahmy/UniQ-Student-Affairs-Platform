// src/Components/Dashboard/DashboardNavbar.jsx
//
// Change from original: reads unreadCount from NotificationContext
// instead of doing its own fetch. This means the badge updates
// immediately when the user marks notifications as read on the page.

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../features/auth/useAuth';
import { getRoleLabel } from '../../features/auth/roleRouting';
import Avatar from '../Shared/Avatar';
import Logoo from '../Nav/Logoo';
import { FiLogOut, FiUser, FiBell, FiChevronDown, FiMenu } from 'react-icons/fi';
import { useNotifications } from '../../features/notifications/NotificationContext';

const DashboardNavbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, userRole, signOut } = useAuth();
  const { unreadCount } = useNotifications();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const rawName =
    user?.name ||
    [user?.firstName, user?.secondName].filter(Boolean).join(' ') ||
    [user?.first_name, user?.second_name].filter(Boolean).join(' ') ||
    'Student';

  const fullName = rawName
    .split(' ')
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : ''))
    .join(' ');

  const avatar = user?.photoURL || user?.photo_url || user?.avatar || '';
  const displayRole = getRoleLabel(userRole);

  return (
    <nav className="sticky top-0 z-[100] w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-8">

        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 text-indigo-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
            aria-label="Toggle Menu"
          >
            <FiMenu size={24} />
          </button>
          <Link to="/">
            <Logoo />
          </Link>
        </div>

        <div className="flex items-center gap-5 md:gap-7">

          {/* Bell → notifications page */}
          <button
            type="button"
            onClick={() => navigate('/notifications')}
            className="relative flex items-center justify-center p-2 text-indigo-900
                       hover:bg-slate-100 rounded-full transition-colors focus:outline-none"
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
          >
            <FiBell size={22} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center
                               min-w-[16px] h-4 px-1 rounded-full bg-rose-500
                               ring-2 ring-white text-white text-[9px] font-bold leading-none">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          <div className="hidden h-10 w-px bg-slate-200 md:block"></div>

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 focus:outline-none group text-left"
            >
              <Avatar
                src={avatar}
                alt={fullName}
                name={fullName}
                size="md"
                className="ring-2 ring-indigo-50 transition-all duration-300 group-hover:ring-indigo-200 group-hover:shadow-md"
              />
              <div className="hidden flex-col justify-center md:flex">
                <span className="text-[15px] leading-none font-bold text-indigo-900 group-hover:text-indigo-700 transition-colors">
                  {fullName}
                </span>
                <span className="text-[12.5px] font-medium text-slate-500 mt-1">
                  {displayRole}
                </span>
              </div>
              <FiChevronDown
                className={`ml-1 text-indigo-900 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                size={18}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-4 w-52 bg-white rounded-2xl shadow-[0_15px_30px_-10px_rgba(49,46,129,0.15)] border border-slate-100 py-2 z-50 transform origin-top-right transition-all animate-in fade-in slide-in-from-top-2">
                <div className="px-5 py-3 border-b border-slate-100 md:hidden">
                  <p className="text-sm font-bold text-indigo-900">{fullName}</p>
                  <p className="text-xs font-medium text-slate-500">{displayRole}</p>
                </div>

                <button
                  onClick={() => { setIsDropdownOpen(false); navigate('/profile'); }}
                  className="w-full flex items-center gap-3 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-indigo-50 hover:text-indigo-900 transition-colors"
                  type="button"
                >
                  <FiUser size={18} className="text-indigo-700" />
                  Profile
                </button>

                <div className="mx-4 my-1 h-px bg-slate-100"></div>

                <button
                  onMouseDown={async (e) => {
                    e.preventDefault();
                    setIsDropdownOpen(false);
                    await signOut();
                    navigate('/', { replace: true });
                  }}
                  className="w-full flex items-center gap-3 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-900 transition-colors"
                  type="button"
                >
                  <FiLogOut size={18} className="text-indigo-700" />
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;