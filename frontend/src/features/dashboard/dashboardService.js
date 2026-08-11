import api from '../../services/api';

/** Pull every item from a paginated endpoint (up to maxPages safety cap). */
const fetchAllPages = async (endpoint, accessToken, maxPages = 20) => {
  const limit = 100;
  let page = 1;
  let allItems = [];
  let totalPages = null;

  while (page <= maxPages) {
    const response = await api.get(`${endpoint}?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const body = response?.data ?? {};
    const rootData = body?.data ?? body;

    const items = Array.isArray(rootData)
      ? rootData
      : Array.isArray(rootData?.items)
        ? rootData.items
        : Array.isArray(rootData?.records)
          ? rootData.records
          : [];

    allItems = allItems.concat(items);

    if (totalPages === null) {
      const pagination =
        rootData?.pagination ??
        body?.pagination ??
        rootData?.meta?.pagination ??
        body?.meta?.pagination ??
        null;

      if (pagination) {
        const totalItems =
          Number(
            pagination.totalItems ??
              pagination.total_items ??
              pagination.totalCount ??
              pagination.total_count ??
              pagination.count ??
              null,
          ) || null;

        const rawTotalPages =
          pagination.totalPages ??
          pagination.total_pages ??
          pagination.pages ??
          pagination.lastPage ??
          pagination.last_page ??
          null;

        totalPages =
          rawTotalPages !== null
            ? Number(rawTotalPages) || 1
            : totalItems
              ? Math.max(1, Math.ceil(totalItems / limit))
              : 1;
      } else {
        totalPages = 1;
      }
    }

    if (page >= totalPages || items.length < limit) break;
    page += 1;
  }

  return allItems;
};

/**
 * Count requests by status.
 * DB stores 'accepted' — we count it under the 'accepted' key and
 * display it as "Approved" in the UI.
 * Returns: { total, accepted, rejected, pending }
 */
const countByStatus = (items) => {
  const counts = { total: items.length, accepted: 0, rejected: 0, pending: 0 };
  for (const item of items) {
    const raw = String(item.status ?? '').toLowerCase().trim();
    if (raw === 'accepted' || raw === 'approved') counts.accepted += 1;
    else if (raw === 'rejected' || raw === 'denied') counts.rejected += 1;
    else if (raw === 'pending' || raw === 'under review' || raw === 'in_progress') counts.pending += 1;
  }
  return counts;
};

/**
 * Count complaints by status.
 * DB stores 'accepted' for resolved complaints.
 * Returns: { total, accepted, rejected, pending }
 */
const countComplaintsByStatus = (items) => {
  const counts = { total: items.length, accepted: 0, rejected: 0, pending: 0 };
  for (const item of items) {
    const raw = String(item.status ?? '').toLowerCase().trim();
    if (raw === 'accepted' || raw === 'resolved') counts.accepted += 1;
    else if (raw === 'rejected' || raw === 'denied') counts.rejected += 1;
    else if (raw === 'pending' || raw === 'open' || raw === 'in_progress') counts.pending += 1;
  }
  return counts;
};

/**
 * Fetch aggregated request statistics.
 * @returns {{ total, accepted, rejected, pending }}
 */
export const fetchRequestStats = async (accessToken, typeFilter = null) => {
  const items = await fetchAllPages('/requests/all', accessToken);

  let filtered = items;
  if (typeFilter !== null) {
    const allowedNames = (Array.isArray(typeFilter) ? typeFilter : [typeFilter])
      .map((n) => String(n).toLowerCase().trim());
    filtered = items.filter((r) => {
      const typeName = String(
        r.request_type?.name ??
          r.request_type?.title ??
          r.request_type_name ??
          r.type ??
          '',
      ).toLowerCase().trim();
      return allowedNames.includes(typeName);
    });
  }

  return countByStatus(filtered);
};

/**
 * Fetch aggregated complaint statistics.
 * @returns {{ total, accepted, rejected, pending }}
 */
export const fetchComplaintStats = async (accessToken) => {
  const items = await fetchAllPages('/complaints/all-complaints', accessToken);
  return countComplaintsByStatus(items);
};

/** Fetch ALL raw request items (used by chart components). */
export const fetchRawRequests = async (accessToken) =>
  fetchAllPages('/requests/all', accessToken);

/** Fetch ALL raw complaint items (used by chart components). */
export const fetchRawComplaints = async (accessToken) =>
  fetchAllPages('/complaints/all-complaints', accessToken);

/** Fetch students-per-program data. */
export const fetchRawPrograms = async (accessToken) => {
  const response = await api.get('/programs/programs-students-count', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const body = response?.data ?? {};
  const data = body?.data ?? body;
  return Array.isArray(data) ? data : [];
};