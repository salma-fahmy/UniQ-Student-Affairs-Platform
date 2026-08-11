import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../../features/auth/useAuth';
import { getRoleLabel } from '../../features/auth/roleRouting';
import AuthGateLoader from '../../Components/Shared/AuthGateLoader';

import StudentProfile from './StudentProfile';
import StaffProfile from './StaffProfile';

const ProfilePage = () => {
  const { user, userRole, accessToken, isAuthReady } = useAuth();

  if (!isAuthReady) {
    return <AuthGateLoader title="Loading profile" subtitle="Fetching your profile information..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isStudent = userRole === 'student' || user?.role === 'student' || !!user?.student;
  const displayRoleLabel = isStudent ? 'Student' : getRoleLabel(userRole || user.role);

  if (isStudent) {
    return <StudentProfile user={user} displayRoleLabel={displayRoleLabel} accessToken={accessToken} />;
  }

  return <StaffProfile user={user} displayRoleLabel={displayRoleLabel} accessToken={accessToken} />;
};

export default ProfilePage;