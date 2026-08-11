import api from '../../services/api';

/**
 * Fetch paginated users list.
 * @param {string} accessToken
 * @param {{ page?: number, limit?: number, role?: string }} params
 * @returns {{ items: object[], pagination: object }}
 */
export const fetchAllUsers = async (accessToken, { page = 1, limit = 20, role = '' } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (role) params.set('role', role);

  const response = await api.get(`/users/admin/all?${params.toString()}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const body = response?.data ?? {};
  const items = Array.isArray(body.data) ? body.data : [];
  const meta  = body.meta ?? {};

  return {
    items,
    pagination: {
      page:       Number(meta.page       ?? page),
      limit:      Number(meta.limit      ?? limit),
      total:      Number(meta.total      ?? items.length),
      totalPages: Number(meta.totalPages ?? 1),
    },
  };
};

/**
 * Fetch a single user by ID.
 * @param {string} accessToken
 * @param {string} userId
 * @returns {object}
 */
export const fetchUserById = async (accessToken, userId) => {
  const response = await api.get(`/users/admin/all`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: { limit: 1000 }, // fetch all, filter client-side
  });

  const items = Array.isArray(response?.data?.data) ? response.data.data : [];
  return items.find((u) => u.user_id === userId) ?? null;
};



// ─── Get single user full details ────────────────────────────────────────────
export const fetchAdminUserDetails = async (userId, accessToken) => {
    try {
        const response = await api.get(`/users/admin/${userId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return response.data?.data;
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
    }
};

// ─── Update editable user fields ─────────────────────────────────────────────
export const updateAdminUser = async (userId, fields, accessToken) => {
    try {
        const response = await api.patch(`/users/admin/${userId}`, fields, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return response.data?.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

// ─── Update user photo (admin updates any user's photo) ──────────────────────
// Reuses the same PATCH /users/admin/:userId endpoint with photo_url + photo_public_id
export const updateAdminUserPhoto = async (userId, photoUrl, photoPublicId, accessToken) => {
    try {
        const response = await api.patch(
            `/users/admin/${userId}`,
            { photo_url: photoUrl, photo_public_id: photoPublicId },
            { headers: { Authorization: `Bearer ${accessToken}` } },
        );
        return response.data?.data;
    } catch (error) {
        console.error('Error updating user photo:', error);
        throw error;
    }
};