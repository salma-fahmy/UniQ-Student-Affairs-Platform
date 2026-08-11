import api from '../../services/api';

const authHeader = (accessToken) => ({
  headers: { Authorization: `Bearer ${accessToken}` },
});

// ─── Request actions ──────────────────────────────────────────────────────────

/**
 * Approve a request.
 *   affairs_staff / admin : PATCH /requests/:id/approve          (no body)
 *   academic_staff        : PATCH /academic/requests/:id/status  { status: 'accepted', comments }
 */
export const approveRequest = async (recordId, accessToken, { userRole, comment = '' } = {}) => {
  if (userRole === 'academic_staff') {
    const response = await api.patch(
      `/academic/requests/${recordId}/status`,
      { status: 'accepted', comments: comment },
      authHeader(accessToken),
    );
    return response.data;
  }

  const response = await api.patch(
    `/requests/${recordId}/approve`,
    {},
    authHeader(accessToken),
  );
  return response.data;
};

/**
 * Reject a request.
 *   affairs_staff / admin : PATCH /requests/:id/reject           { comment }
 *   academic_staff        : PATCH /academic/requests/:id/status  { status: 'rejected', comments }
 */
export const rejectRequest = async (recordId, comment, accessToken, { userRole } = {}) => {
  if (userRole === 'academic_staff') {
    const response = await api.patch(
      `/academic/requests/${recordId}/status`,
      { status: 'rejected', comments: comment },
      authHeader(accessToken),
    );
    return response.data;
  }

  const response = await api.patch(
    `/requests/${recordId}/reject`,
    { comment },
    authHeader(accessToken),
  );
  return response.data;
};

// /**
//  * Ask student to resubmit (affairs_staff / admin only — academic staff cannot resubmit).
//  *   PATCH /requests/:id/resubmit  { comment }
//  */
// export const resubmitRequest = async (recordId, comment, accessToken) => {
//   const response = await api.patch(
//     `/requests/${recordId}/resubmit`,
//     { comment },
//     authHeader(accessToken),
//   );
//   return response.data;
// };

// ─── Complaint actions (unchanged — complaints have no academic endpoint) ──────

/**
 * Resolve a complaint → PATCH /complaints/:id/approve  { resolutionText }
 */
export const resolveComplaint = async (recordId, resolutionText, accessToken) => {
  const response = await api.patch(
    `/complaints/${recordId}/approve`,
    { resolutionText },
    authHeader(accessToken),
  );
  return response.data;
};

/**
 * Reject a complaint → PATCH /complaints/:id/reject  { resolutionText }
 */
export const rejectComplaint = async (recordId, resolutionText, accessToken) => {
  const response = await api.patch(
    `/complaints/${recordId}/reject`,
    { resolutionText },
    authHeader(accessToken),
  );
  return response.data;
};