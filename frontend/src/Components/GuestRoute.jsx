import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../features/auth/useAuth.js';
import { getDashboardPath } from '../features/auth/roleRouting.js';
import AuthGateLoader from './Shared/AuthGateLoader.jsx';

const GuestRoute = () => {
  const location = useLocation();
  const { isAuthenticated, userRole, isAuthReady, accessToken } = useAuth();

  if (!isAuthReady) {
    return <AuthGateLoader />;
  }

  // Only redirect if user is actually authenticated AND has a valid access token
  if (isAuthenticated && accessToken) {
    return <Navigate to={getDashboardPath(userRole)} replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default GuestRoute;
