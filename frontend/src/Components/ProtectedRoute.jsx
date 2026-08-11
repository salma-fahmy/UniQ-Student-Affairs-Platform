import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../features/auth/useAuth.js';
import { getDashboardPath, isRoleAllowed } from '../features/auth/roleRouting.js';
import AuthGateLoader from './Shared/AuthGateLoader.jsx';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const location = useLocation();
  const { isAuthenticated, isAuthReady, userRole } = useAuth();

  if (!isAuthReady) {
    return <AuthGateLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isRoleAllowed(userRole, allowedRoles)) {
    return <Navigate to={getDashboardPath(userRole)} replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;