import { useCallback, useEffect, useMemo, useState } from 'react';
import { logoutUser, refreshAccessToken } from '../features/auth/authService';
import { AuthContext } from './authContext.js';

let authBootstrapPromise = null;

const AUTH_STORAGE_KEYS = ['accessToken', 'authToken', 'token', 'authUser', 'userRole', 'userId'];

const readStoredValue = (key, fallback = '') => {
  if (typeof window === 'undefined') {
    return fallback;
  }

  return localStorage.getItem(key) ?? fallback;
};

const readStoredUser = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawUser = localStorage.getItem('authUser');

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
};

const clearStoredAuth = () => {
  if (typeof window === 'undefined') {
    return;
  }

  AUTH_STORAGE_KEYS.forEach((key) => {
    localStorage.removeItem(key);
  });
};

const normalizeAuthUser = (user) => {
  if (!user) return null;

  const normalizedStudent = user.student || null;
  const normalizedProgram = normalizedStudent?.program || user.program || null;
  const normalizedPhotoUrl =
    user.photo_url ||
    user.photoURL ||
    user.photoUrl ||
    user.avatar ||
    '';

  return {
    ...user,
    userId: user.user_id ?? user.userId ?? normalizedStudent?.student_id ?? user.studentId ?? '',
    firstName: user.first_name || '',
    secondName: user.second_name || '',
    thirdName: user.third_name || '',
    fourthName: user.fourth_name || '',
    email: user.email || '',
    role: String(user.role || normalizedStudent?.role || '').toLowerCase(),
    photo_url: normalizedPhotoUrl,
    photoURL: normalizedPhotoUrl,
    photoUrl: normalizedPhotoUrl,
    avatar: normalizedPhotoUrl,
    lastLogin: user.last_login || '',
    phone: user.phone || '',
    birth: user.birth || '',
    isActive: user.is_active ?? false,
    staff: user.staff || null,
    student: normalizedStudent,
    studentId: normalizedStudent?.student_id ?? user.studentId ?? '',
    level: user.level ?? normalizedStudent?.level ?? '',
    cgpa: user.cgpa ?? normalizedStudent?.cgpa ?? '',
    status: user.status ?? normalizedStudent?.status ?? '',
    feesDue: user.fees_due ?? normalizedStudent?.fees_due ?? '',
    hoursTaken: user.hours_taken ?? normalizedStudent?.hours_taken ?? '',
    academicSemester: user.academic_semester ?? normalizedStudent?.academic_semester ?? null,
    program: normalizedProgram,
    college: user.college ?? normalizedProgram?.program_name_en ?? '',
  };
};

const runAuthBootstrap = () => {
  if (!authBootstrapPromise) {
    authBootstrapPromise = refreshAccessToken().finally(() => {
      authBootstrapPromise = null;
    });
  }

  return authBootstrapPromise;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => readStoredUser());
  const [accessToken, setAccessToken] = useState(() => readStoredValue('accessToken'));
  const [userRole, setUserRole] = useState(() => readStoredValue('userRole'));
  const [userId, setUserId] = useState(() => readStoredValue('userId'));
  const [isAuthReady, setIsAuthReady] = useState(false);

  const setAuth = useCallback(({
    user: nextUser = null,
    accessToken: nextAccessToken = '',
    userRole: nextUserRole = '',
    userId: nextUserId = '',
  } = {}) => {
    // Ensure role is preserved in the user object
    if (nextUser && nextUserRole && !nextUser.role) {
      nextUser.role = nextUserRole;
    }

    const normalizedUser = normalizeAuthUser(nextUser);
    const normalizedToken = nextAccessToken || '';
    const normalizedRole = nextUserRole || normalizedUser?.role || '';
    const normalizedUserId = nextUserId ?? '';

    setUser(normalizedUser);
    setAccessToken(normalizedToken);
    setUserRole(normalizedRole);
    setUserId(normalizedUserId === undefined || normalizedUserId === null ? '' : String(normalizedUserId));

    if (normalizedUser) {
      localStorage.setItem('authUser', JSON.stringify(normalizedUser));
    } else {
      localStorage.removeItem('authUser');
    }

    if (normalizedToken) {
      localStorage.setItem('accessToken', normalizedToken);
    } else {
      localStorage.removeItem('accessToken');
    }

    if (normalizedRole) {
      localStorage.setItem('userRole', normalizedRole);
    } else {
      localStorage.removeItem('userRole');
    }

    if (normalizedUserId !== '' && normalizedUserId !== undefined && normalizedUserId !== null) {
      localStorage.setItem('userId', String(normalizedUserId));
    } else {
      localStorage.removeItem('userId');
    }

    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
  }, []);

  const clearAuth = useCallback(() => {
    setUser(null);
    setAccessToken('');
    setUserRole('');
    setUserId('');
    clearStoredAuth();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const bootstrapAuth = async () => {
      try {
        const storedToken = localStorage.getItem('accessToken');

        // If no token stored, skip bootstrap
        if (!storedToken) {
          if (isMounted) {
            setIsAuthReady(true);
          }
          return;
        }

        // Add a 5-second timeout to the bootstrap process
        const bootstrapPromise = runAuthBootstrap();
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Bootstrap timeout')), 5000)
        );

        const response = await Promise.race([bootstrapPromise, timeoutPromise]);
        const responseData = response?.data?.data ?? {};
        const nextAccessToken = responseData?.accessToken ?? '';

        if (!nextAccessToken) {
          clearAuth();
          return;
        }

        if (!isMounted) {
          return;
        }

        setAuth({
          user: responseData.user ?? readStoredUser(),
          accessToken: nextAccessToken,
          userRole: responseData.user?.role ?? readStoredValue('userRole'),
          userId: readStoredValue('userId'),
        });
      } catch (error) {
        const status = error?.response?.status;

        if (status === 401 || status === 403) {
          clearAuth();
        }
        // For other errors (like timeout), silently continue with existing auth state
      } finally {
        if (isMounted) {
          setIsAuthReady(true);
        }
      }
    };

    bootstrapAuth();

    return () => {
      isMounted = false;
    };
  }, [clearAuth, setAuth]);

  const signOut = useCallback(async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout request failed', error);
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      userRole,
      userId,
      isAuthReady,
      isAuthenticated: Boolean(accessToken),
      setAuth,
      clearAuth,
      signOut,
    }),
    [accessToken, clearAuth, isAuthReady, setAuth, signOut, user, userId, userRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
