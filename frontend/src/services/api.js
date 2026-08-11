import axios from 'axios';

const resolveApiBaseURL = (value) => {
  const fallbackBaseURL = 'http://localhost:3000/api/v1';
  const rawValue = String(value || '').trim();

  if (!rawValue) {
    return fallbackBaseURL;
  }

  if (/^https?:\/\//i.test(rawValue)) {
    return rawValue.replace(/\/$/, '');
  }

  const normalizedPath = rawValue.startsWith('/') ? rawValue : `/${rawValue}`;

  return `http://localhost:3000${normalizedPath}`;
};

const apiBaseURL = resolveApiBaseURL(import.meta.env.VITE_API_BASE_URL);

const api = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const authRoutesWithoutBearer = ['/auth/login', '/auth/refresh-token', '/auth/forget-password', '/auth/reset-password', '/auth/contact-form', '/collageInfo/stats'];
const shouldSkipRefresh = (url = '') =>
  ['/auth/login', '/auth/refresh-token', '/auth/logout', '/auth/forget-password', '/auth/reset-password', '/auth/contact-form', '/collageInfo/stats'].some((path) =>
    url.includes(path),
  );

api.interceptors.request.use((config) => {
  const storedToken = localStorage.getItem('accessToken');
  const isAuthRoute = authRoutesWithoutBearer.some((path) => config.url?.includes(path));

  if (storedToken && !isAuthRoute) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${storedToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !shouldSkipRefresh(originalRequest.url || '')
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await api.post('/auth/refresh-token', {}, {
          withCredentials: true
        });
        const newAccessToken = refreshResponse?.data?.data?.accessToken;

        if (!newAccessToken) {
          throw new Error('Missing access token from refresh response');
        }

        localStorage.setItem('accessToken', newAccessToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;