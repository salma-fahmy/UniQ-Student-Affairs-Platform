import api from '../../services/api';

const getResponseData = (response) => response?.data?.data ?? response?.data ?? {};

const authConfig = (accessToken) =>
  accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined;

/**
 * GET /api/v1/users/notifications
 * Returns all notifications for the logged-in user.
 */
export const fetchNotifications = async (accessToken) => {
  const response = await api.get('/users/notifications', authConfig(accessToken));
  const data = getResponseData(response);
  return Array.isArray(data) ? data : [];
};

/**
 * PATCH /api/v1/notifications/:id/read
 * Marks a single notification as read.
 */
export const markNotificationRead = async (accessToken, notificationId) => {
  const response = await api.patch(
    `/notifications/${notificationId}/read`,
    {},
    authConfig(accessToken),
  );
  return getResponseData(response);
};

/**
 * DELETE /api/v1/notifications/delete
 * Deletes ALL notifications for the logged-in user.
 */
export const deleteAllNotifications = async (accessToken) => {
  const response = await api.delete('/notifications/delete', authConfig(accessToken));
  return getResponseData(response);
};