import api from '../../services/api';

const getResponseData = (response) => response?.data?.data ?? response?.data ?? {};

const authConfig = (accessToken) =>
  accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined;

/**
 * POST /api/v1/complaints/create
 *
 * @param {string} accessToken
 * @param {{ studentId, complaintType, complaintText, priority }} payload
 * @returns the created complaint object
 */
export const submitComplaint = async (accessToken, { studentId, complaintType, complaintText, priority }) => {
  const response = await api.post(
    '/complaints/create',
    { studentId, complaintType, complaintText, priority },
    authConfig(accessToken),
  );
  return getResponseData(response);
};