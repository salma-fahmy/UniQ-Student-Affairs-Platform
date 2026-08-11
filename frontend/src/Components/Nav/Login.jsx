import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useAuth from '../../features/auth/useAuth';
import { getDashboardPath, getRoleLabel } from '../../features/auth/roleRouting';

import Avatar from '../Shared/Avatar';

import {
  FiLogOut,
  FiLayout,
  FiChevronDown,
  FiUser,
} from 'react-icons/fi';

const Login = () => {
  const navigate = useNavigate();

  const { isAuthenticated, user, userRole, signOut } = useAuth();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isAuthenticated && user) {
    const rawName =
      user.name ||
      [user.firstName, user.secondName]
        .filter(Boolean)
        .join(' ') ||
      [user.first_name, user.second_name]
        .filter(Boolean)
        .join(' ') ||
      'User';

    const fullName = rawName
      .split(' ')
      .map((word) =>
        word
          ? word.charAt(0).toUpperCase() +
            word.slice(1).toLowerCase()
          : ''
      )
      .join(' ');

    const avatar =
      user.photoURL ||
      user.photo_url ||
      user.avatar ||
      '';

    const dashboardLink = getDashboardPath(userRole);

    const displayRole = getRoleLabel(userRole);

    return (
      <div className="flex items-center justify-end">
        
        <div className="relative" ref={dropdownRef}>
          
          <button
            onClick={() =>
              setIsDropdownOpen(!isDropdownOpen)
            }
            className="group flex items-center gap-3 rounded-full p-1.5 pr-3 transition-all duration-300 hover:bg-slate-50 focus:outline-none"
          >
            
            <Avatar
              src={avatar}
              alt={fullName}
              name={fullName}
              size="md"
              className="ring-2 ring-indigo-50 transition-all duration-300 group-hover:ring-indigo-200 group-hover:shadow-md"
            />

            {/* User text */}
            <div className="hidden lg:flex max-w-[140px] flex-col text-left">
              
              <span className="truncate text-[14px] font-bold leading-tight text-indigo-900 transition-colors group-hover:text-indigo-700">
                {fullName}
              </span>

              <span className="truncate mt-0.5 text-[12px] font-medium text-slate-500">
                {displayRole}
              </span>

            </div>

            <FiChevronDown
              className={`ml-1 text-indigo-900 transition-transform duration-300 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
              size={18}
            />

          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 z-50 mt-3 w-52 origin-top-right rounded-2xl border border-slate-100 bg-white py-2 shadow-[0_15px_30px_-10px_rgba(49,46,129,0.15)] animate-in fade-in slide-in-from-top-2">
              
              {/* Mobile user info */}
              <div className="border-b border-slate-100 px-5 py-3 lg:hidden">
                <p className="truncate text-sm font-bold text-indigo-900">
                  {fullName}
                </p>

                <p className="truncate text-xs font-medium text-slate-500">
                  {displayRole}
                </p>
              </div>

              {/* Profile */}
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  navigate('/profile');
                }}
                className="flex w-full items-center gap-3 px-5 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-900"
                type="button"
              >
                <FiUser
                  size={18}
                  className="text-indigo-700"
                />

                Profile
              </button>

              {/* Dashboard */}
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  navigate(dashboardLink);
                }}
                className="flex w-full items-center gap-3 px-5 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-900"
                type="button"
              >
                <FiLayout
                  size={18}
                  className="text-indigo-700"
                />

                Dashboard
              </button>

              <div className="mx-4 my-1 h-px bg-slate-100"></div>

              {/* Logout */}
              <button
                onClick={async (e) => {
                  e.preventDefault();

                  setIsDropdownOpen(false);

                  await signOut();

                  navigate('/', {
                    replace: true,
                  });
                }}
                className="flex w-full items-center gap-3 px-5 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-indigo-900"
                type="button"
              >
                <FiLogOut
                  size={18}
                  className="text-indigo-700"
                />

                Logout
              </button>

            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end">
      
      <button
        onClick={() => navigate('/login')}
        className="rounded-full bg-indigo-900 px-7 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-[1.03] hover:shadow-lg active:scale-95"
      >
        Login
      </button>

    </div>
  );
};

export default Login;