const roleRoutes = {
  student: '/dashboard/student',
  academic_staff: '/dashboard/academic',
  affairs_staff: '/dashboard/affairs',
  admin: '/dashboard/admin',
};

const roleLabels = {
  student: 'Student',
  academic_staff: 'Academic Staff',
  affairs_staff: 'Affairs Staff',
  admin: 'Admin',
};

export const normalizeRole = (role) => {
  const normalizedRole = String(role || '').trim().toLowerCase().replace(/\s+/g, '_');

  if (normalizedRole === 'staff') {
    return 'affairs_staff';
  }

  return normalizedRole;
};

export const getDashboardPath = (role) => roleRoutes[normalizeRole(role)] || '/dashboard';

export const getRoleLabel = (role) => roleLabels[normalizeRole(role)] || 'Student';

export const isRoleAllowed = (userRole, allowedRoles = []) => {
  if (!allowedRoles.length) {
    return true;
  }

  const normalizedUserRole = normalizeRole(userRole);

  return allowedRoles.some((allowedRole) => normalizeRole(allowedRole) === normalizedUserRole);
};