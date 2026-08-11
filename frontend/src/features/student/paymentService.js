import api from '../../services/api';

const getResponseData = (response) => response?.data?.data ?? response?.data ?? {};

// ─── Free flow ────────────────────────────────────────────────────────────────

/**
 * POST /api/v1/requests/create-free
 * Used when price === 0.
 */
export const createFreeRequest = async ({ studentId, requestTypeId, price, body, description, attachmentLinks = [] }) => {
  const response = await api.post('/requests/create-free', {
    studentId,
    requestTypeId,
    price: 0,
    body,
    description: description || '',
    ...(attachmentLinks.length > 0 ? { attachment_links: attachmentLinks } : {}),
  });
  return getResponseData(response);
};

// ─── Paid flow ────────────────────────────────────────────────────────────────

/**
 * POST /api/v1/requests/preview
 * Step 1: Preview the request before payment.
 */
export const previewRequest = async ({ studentId, requestTypeId, price, body, description }) => {
  const response = await api.post('/requests/preview', {
    studentId,
    requestTypeId,
    price,
    body,
    description: description || '',
  });
  return getResponseData(response);
};

/**
 * POST /api/v1/payments/initiate
 * Step 2: Initiate payment — returns paymentNumber.
 */
export const initiatePayment = async ({ studentId, requestTypeId, price, body, description }) => {
  const response = await api.post('/payments/initiate', {
    studentId,
    requestTypeId,
    price,
    body,
    description: description || '',
  });
  return getResponseData(response);
};

/**
 * POST /api/v1/payments/:paymentNumber/confirm
 * Step 3A: Confirm successful payment.
 */
export const confirmPayment = async (paymentNumber, transactionId, { studentId, requestTypeId, price, body, attachmentLinks = [] }) => {
  const response = await api.post(`/payments/${paymentNumber}/confirm`, {
    transactionId,
    studentId,
    requestTypeId,
    price,
    body,
    ...(attachmentLinks.length > 0 ? { attachment_links: attachmentLinks } : {}),
  });
  return getResponseData(response);
};
 

/**
 * POST /api/v1/payments/:paymentNumber/fail
 * Step 3B: Mark payment as failed/cancelled.
 */
export const failPayment = async (paymentNumber) => {
  const response = await api.post(`/payments/${paymentNumber}/fail`);
  return getResponseData(response);
};