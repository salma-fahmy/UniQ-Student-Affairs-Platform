import api from '../../services/api';

const studentNamePromisesCache = new Map();

const normalizeTextValue = (value, fallback = '') => {
  if (value === null || value === undefined) {
    return fallback;
  }
  const textValue = String(value).trim();
  return textValue || fallback;
};

const formatDateLabel = (value) => {
  const textValue = normalizeTextValue(value, '');
  if (!textValue) {
    return '';
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(textValue)) {
    return textValue.slice(0, 10);
  }
  const dateValue = new Date(textValue);
  if (!Number.isNaN(dateValue.getTime())) {
    return dateValue.toISOString().slice(0, 10);
  }
  return textValue;
};

const extractListResponse = (response) => {
  const body = response?.data ?? {};
  const rootData = body?.data ?? body;

  const items = Array.isArray(rootData)
    ? rootData
    : Array.isArray(rootData?.items)
      ? rootData.items
      : Array.isArray(rootData?.records)
        ? rootData.records
        : Array.isArray(body?.items)
          ? body.items
          : Array.isArray(body?.records)
            ? body.records
            : [];

  const pagination = rootData?.pagination ?? body?.pagination ?? rootData?.meta?.pagination ?? body?.meta?.pagination ?? null;

  return { items, pagination };
};

const fetchAllPages = async (endpoint, accessToken, maxPages = 20) => {
  const limit = 100;
  let page = 1;
  let allItems = [];

  while (page <= maxPages) {
    const response = await api.get(`${endpoint}?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { items, pagination } = extractListResponse(response);
    allItems = allItems.concat(items);

    const normalizedPagination = normalizePagination(pagination, page, limit, items.length);

    if (normalizedPagination.totalPages && page >= normalizedPagination.totalPages) {
      break;
    }

    if (!normalizedPagination.totalPages && items.length < limit) {
      break;
    }

    if (!items.length) {
      break;
    }

    page += 1;
  }

  return allItems;
};

const normalizePagination = (pagination, page, limit, itemsLength = 0) => {
  if (!pagination) {
    return {
      page,
      limit,
      totalItems: null,
      totalPages: null,
      hasNextPage: itemsLength >= limit,
      hasPreviousPage: page > 1,
    };
  }

  const currentPage = Number(
    pagination.page
      ?? pagination.currentPage
      ?? pagination.current_page
      ?? page,
  ) || page;

  const pageSize = Number(
    pagination.limit
      ?? pagination.pageSize
      ?? pagination.perPage
      ?? pagination.per_page
      ?? limit,
  ) || limit;

  const totalItemsRaw = pagination.totalItems
    ?? pagination.total_items
    ?? pagination.totalCount
    ?? pagination.total_count
    ?? pagination.count
    ?? null;
  const totalItems = totalItemsRaw === null ? null : Number(totalItemsRaw) || null;

  const totalPagesRaw = pagination.totalPages
    ?? pagination.total_pages
    ?? pagination.pages
    ?? pagination.lastPage
    ?? pagination.last_page
    ?? null;
  const totalPages = totalPagesRaw === null
    ? (totalItems ? Math.max(1, Math.ceil(totalItems / pageSize)) : null)
    : Number(totalPagesRaw) || null;

  const hasNextPage = pagination.hasNextPage
    ?? pagination.has_next_page
    ?? (totalPages ? currentPage < totalPages : itemsLength >= pageSize);

  const hasPreviousPage = pagination.hasPreviousPage
    ?? pagination.has_previous_page
    ?? currentPage > 1;

  return {
    page: currentPage,
    limit: pageSize,
    totalItems,
    totalPages,
    hasNextPage: Boolean(hasNextPage),
    hasPreviousPage: Boolean(hasPreviousPage),
  };
};

const buildRequestStudentName = (request = {}) => {
  const studentUser = request.student?.user;

  if (studentUser && studentUser.first_name) {
    return `${normalizeTextValue(studentUser.first_name)} ${normalizeTextValue(studentUser.second_name)}`.trim();
  }

  return normalizeTextValue(request.request_body?.student_name, 'Unknown');
};

const buildComplaintStudentName = async (complaint = {}, accessToken) => {
  const studentUser = complaint.student?.user;

  if (studentUser && studentUser.first_name) {
    return `${normalizeTextValue(studentUser.first_name)} ${normalizeTextValue(studentUser.second_name)}`.trim();
  }

  const complaintId = complaint.complaint_number ?? complaint.complaint_id ?? complaint.id;

  if (!complaintId) {
    return 'Unknown';
  }

  if (studentNamePromisesCache.has(complaintId)) {
    return studentNamePromisesCache.get(complaintId);
  }

  const fetchPromise = (async () => {
    try {
      const response = await api.get(
        `/complaints/${complaintId}/student`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const studentData = response.data?.data;
      const user = studentData?.student?.user;

      if (user && user.first_name) {
        return `${normalizeTextValue(user.first_name)} ${normalizeTextValue(user.second_name)}`.trim();
      }

      return normalizeTextValue(studentData?.student?.student_id, 'Unknown');
    } catch (error) {
      console.error(`Failed to fetch student name for complaint ${complaintId}:`, error);
      return 'Unknown';
    }
  })();

  studentNamePromisesCache.set(complaintId, fetchPromise);
  return fetchPromise;
};

const normalizeRequestRecord = (request = {}) => ({
  id: normalizeTextValue(request.request_number, request.request_id || request.id || ''),
  title: normalizeTextValue(request.request_type?.name, 'Request'),
  description: normalizeTextValue(request.description, ''),
  status: normalizeTextValue(request.status, 'Pending'),
  submittedAt: formatDateLabel(request.created_at),
  studentName: buildRequestStudentName(request),
  studentId: normalizeTextValue(request.student_id ?? request.student?.student_id, ''),
});

const normalizeComplaintRecord = async (complaint = {}, accessToken) => ({
  id: normalizeTextValue(complaint.complaint_number, complaint.complaint_id || ''),
  title: normalizeTextValue(complaint.complaint_type, 'Complaint'),
  description: normalizeTextValue(complaint.complaint_text, ''),
  status: normalizeTextValue(complaint.status, 'Pending'),
  submittedAt: formatDateLabel(complaint.created_at),
  studentName: await buildComplaintStudentName(complaint, accessToken),
  studentId: normalizeTextValue(complaint.student_id ?? complaint.student?.student_id, ''),
});

export const fetchAffairsRequests = async (accessToken, page = 1, limit = 10) => {
  try {
    const response = await api.get(`requests/all?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { items, pagination } = extractListResponse(response);

    const titleMap = JSON.parse(sessionStorage.getItem('requestTitles') || '{}');
    items.forEach(item => {
      const reqNum = item.request_number || item.id;
      const reqName = item.request_type?.name;
      if (reqNum && reqName) {
        titleMap[reqNum] = reqName;
      }
    });
    sessionStorage.setItem('requestTitles', JSON.stringify(titleMap));

    return {
      items: items.map(normalizeRequestRecord),
      pagination: normalizePagination(pagination, page, limit, items.length),
    };
  } catch (error) {
    console.error('Error fetching affairs requests:', error);
    throw error;
  }
};

export const fetchAllAffairsRequests = async (accessToken) => {
  try {
    const items = await fetchAllPages('/requests/all', accessToken);

    const titleMap = JSON.parse(sessionStorage.getItem('requestTitles') || '{}');
    items.forEach(item => {
      const reqNum = item.request_number || item.id;
      const reqName = item.request_type?.name;
      if (reqNum && reqName) {
        titleMap[reqNum] = reqName;
      }
    });
    sessionStorage.setItem('requestTitles', JSON.stringify(titleMap));

    return {
      items: items.map(normalizeRequestRecord),
      pagination: null,
    };
  } catch (error) {
    console.error('Error fetching all affairs requests:', error);
    throw error;
  }
};

export const fetchAffairsComplaints = async (accessToken, page = 1, limit = 10) => {
  try {
    const response = await api.get(`/complaints/all-complaints?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { items, pagination } = extractListResponse(response);

    const normalizedItems = await Promise.all(
      items.map((item) => normalizeComplaintRecord(item, accessToken))
    );

    return {
      items: normalizedItems,
      pagination: normalizePagination(pagination, page, limit, items.length),
    };
  } catch (error) {
    console.error('Error fetching affairs complaints:', error);
    throw error;
  }
};

export const fetchAllAffairsComplaints = async (accessToken) => {
  try {
    const items = await fetchAllPages('/complaints/all-complaints', accessToken);

    const normalizedItems = await Promise.all(
      items.map((item) => normalizeComplaintRecord(item, accessToken))
    );

    return {
      items: normalizedItems,
      pagination: null,
    };
  } catch (error) {
    console.error('Error fetching all affairs complaints:', error);
    throw error;
  }
};

export const fetchAffairsComplaintDetails = async (recordId, accessToken) => {
  try {
    const response = await api.get(`/complaints/${recordId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    let studentDetails = null;
    try {
      const studentResponse = await api.get(`/complaints/${recordId}/student`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (studentResponse.data?.data) {
        studentDetails = studentResponse.data.data;
      }
    } catch (e) {
      console.error('Failed to fetch student details for complaint:', e);
    }

    const data = response.data?.data || {};
    const resolvedStudentName = await buildComplaintStudentName(data, accessToken);

    return {
      recordId: data.complaint_number || recordId,
      type: normalizeTextValue(data.complaint_type, 'Complaint'),
      status: data.status,
      description: data.complaint_text,
      attachment: data.attachment,
      resolutionText: data.resolution_text,
      submittedAt: data.created_at,
      resolvedAt: data.resolved_at,
      priority: data.priority,
      handledBy: data.handled_by,
      updatedBy: data.updated_by,
      updatedAt: data.updated_at,
      studentName: resolvedStudentName,
      studentData: studentDetails,
      raw: data,
    };
  } catch (error) {
    console.error('Error fetching affairs complaint details:', error);
    throw error;
  }
};

export const fetchAffairsRequestDetails = async (recordId, accessToken) => {
  try {
    const response = await api.get(`/requests/${recordId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = response.data?.data || {};
    const reqNumber = data.request_number || data.request_id || recordId;

    const titleMap = JSON.parse(sessionStorage.getItem('requestTitles') || '{}');
    const cachedTitle = titleMap[reqNumber];

    const finalTitle = normalizeTextValue(data.request_type?.name ?? cachedTitle, 'Request');

    return {
      recordId: reqNumber,
      type: finalTitle,
      requestTypeId: data.request_type_id ?? null,
      status: data.status,
      description: data.description,
      submittedAt: data.created_at,
      price: data.price_at_request,
      comments: data.comments,
      handledBy: data.handled_by,
      updatedBy: data.updated_by,
      updatedAt: data.updated_at,
      processedAt: data.processed_at,
      studentId: data.student_id,
      studentName: data.request_body?.student_name || 'Unknown',
      requestBody: data.request_body || {},
      studentData: data.student || {},
      raw: data,
    };
  } catch (error) {
    console.error('Error fetching affairs request details:', error);
    throw error;
  }
};