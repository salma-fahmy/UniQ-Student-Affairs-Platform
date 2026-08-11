import api from '../../services/api';

const getResponseData = (response) => response?.data?.data ?? response?.data ?? {};

const authConfig = (accessToken) =>
  accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined;

/**
 * GET /api/v1/requests/types
 * Returns all active request types available to the student.
 */
export const fetchRequestTypes = async (accessToken) => {
  const response = await api.get('/requests/types', authConfig(accessToken));
  const data = getResponseData(response);
  return Array.isArray(data) ? data : (Array.isArray(data.types) ? data.types : []);
};

/**
 * GET /api/v1/requests/types/:code
 * Fetches a single request type by its code (e.g. 'GRAD_CERT').
 * Returns the full object including form_schema.
 */
export const fetchRequestTypeByCode = async (accessToken, code) => {
  const response = await api.get(`/requests/types/${code}`, authConfig(accessToken));
  return getResponseData(response);
};

/**
 * POST /api/v1/requests/create
 * Submits a new request on behalf of the student.
 *
 * @param {string} accessToken
 * @param {{ studentId, requestTypeId, price, body, description? }} payload
 * @returns the created request object
 */
export const submitRequest = async (accessToken, { studentId, requestTypeId, price, body, description }) => {
  // Backend validator requires price to be a positive number.
  // For free requests (price === 0) we send 1 as a nominal value,
  // since the actual price is already stored on the request_type record.
  const sanitizedPrice = Number(price) > 0 ? Number(price) : 1;

  const response = await api.post(
    '/requests/create',
    {
      studentId,
      requestTypeId,
      price: sanitizedPrice,
      body,
      ...(description ? { description } : {}),
    },
    authConfig(accessToken),
  );
  return getResponseData(response);
};