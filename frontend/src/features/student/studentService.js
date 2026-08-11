import api from '../../services/api';

const getResponseData = (response) => response?.data?.data ?? response?.data ?? {};

const getHeaderConfig = (accessToken) =>
	accessToken
		? {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}
		: undefined;

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

const extractRequestTitle = (request = {}) => normalizeTextValue(
	request.request_type?.name
		?? request.request_type?.name_ar
		?? request.request_type?.title
		?? request.request_type_name
		?? request.request_type_title
		?? request.request_title
		?? request.title
		?? request.type
		?? request.description
		?? '',
	'Request',
);

const normalizeObject = (value) => (value && typeof value === 'object' && !Array.isArray(value) ? value : {});

const extractRequestTypeMeta = (request = {}) => normalizeObject(request.request_type || request.requestType);

const extractRequestBody = (request = {}) => {
	const requestBodyCandidates = [
		request.request_body,
		request.requestBody,
		request.form_data,
		request.formData,
		request.submission_data,
		request.submissionData,
		request.payload,
	];

	for (const candidate of requestBodyCandidates) {
		if (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) {
			return candidate;
		}
	}

	return {};
};


const extractComplaintTitle = (complaint = {}) => normalizeTextValue(
	complaint.complaint_type?.name
		?? complaint.complaint_type?.title
		?? complaint.complaint_type_name
		?? complaint.complaint_type_title
		?? complaint.complaint_type
		?? complaint.title
		?? complaint.type
		?? complaint.description
		?? '',
	'Complaint',
);
const toTimestamp = (value) => {
	const textValue = normalizeTextValue(value, '');

	if (!textValue) {
		return 0;
	}

	const dateValue = new Date(textValue);

	if (!Number.isNaN(dateValue.getTime())) {
		return dateValue.getTime();
	}

	return 0;
};

const normalizeComplaint = (item = {}) => {
	const resolutionText = normalizeTextValue(item.resolution_text, '');
	const title = extractComplaintTitle(item);

	return {
		id: normalizeTextValue(item.complaint_number, item.id || ''),
		title,
		type: title,
		description: normalizeTextValue(item.complaint_text, ''),
		submittedAt: formatDateLabel(item.created_at),
		status: normalizeTextValue(item.status, 'Pending'),
		category: 'Complaint',
		kind: 'complaint',
		solutionText: resolutionText,
		resolutionNote: resolutionText,
		resolvedAt: item.resolved_at ? formatDateLabel(item.resolved_at) : '',
		isResolved: Boolean(item.resolved_at),
		comments: Array.isArray(item.comments) ? item.comments : [],
		sortTimestamp: toTimestamp(item.created_at),
	};
};

const normalizeRequest = (item = {}) => {
	const title = extractRequestTitle(item);
	const requestType = extractRequestTypeMeta(item);
	const requestBody = extractRequestBody(item);

	return {
		id: normalizeTextValue(item.request_number, item.id || ''),
		title,
		type: title,
		requestTypeId: item.request_type_id ?? requestType.request_type_id ?? requestType.id ?? null,
		requestTypeCode: normalizeTextValue(requestType.code ?? item.request_type_code ?? '', ''),
		requestTypeName: normalizeTextValue(requestType.name ?? '', ''),
		requestTypeNameAr: normalizeTextValue(requestType.name_ar ?? '', ''),
		description: normalizeTextValue(item.description ?? item.request_description, ''),
		submittedAt: formatDateLabel(item.created_at),
		status: normalizeTextValue(item.status, 'Pending'),
		category: 'Request',
		kind: 'request',
		price: item.price_at_request,
		processedAt: item.processed_at ? formatDateLabel(item.processed_at) : '',
		updatedBy: item.updated_by || null,
		isProcessed: Boolean(item.processed_at),
		comments: Array.isArray(item.comments) ? item.comments : [],
		requestBody,
		requestType,
		formSchema: requestType.form_schema || null,
		raw: item,
		sortTimestamp: toTimestamp(item.created_at),
	};
};

export const fetchStudentOperationsSummary = async (accessToken) => {
	const response = await api.get('/students/operations-summary', getHeaderConfig(accessToken));

	return getResponseData(response);
};

export const fetchStudentPaymentSummary = async (accessToken) => {
	const response = await api.get('/students/payment-summary', getHeaderConfig(accessToken));

	return getResponseData(response);
};

export const fetchStudentStudyInfo = async (accessToken) => {
	const response = await api.get('/students/study-info', getHeaderConfig(accessToken));

	return getResponseData(response);
};

export const fetchStudentRequests = async (accessToken) => {
	const response = await api.get('/students/requests', getHeaderConfig(accessToken));
	const responseData = getResponseData(response);
	const requests = Array.isArray(responseData) ? responseData : [];

	return requests.map(normalizeRequest);
};

export const fetchStudentComplaints = async (accessToken) => {
	const response = await api.get('/students/complaints', getHeaderConfig(accessToken));
	const responseData = getResponseData(response);
	const complaints = Array.isArray(responseData) ? responseData : [];

	return complaints.map(normalizeComplaint);
};

export const fetchStudentRequestDetails = async (accessToken, requestId) => {
	try {
		const response = await api.get(`/students/requests/${requestId}`, getHeaderConfig(accessToken));
		const data = getResponseData(response);
		const normalizedRequest = normalizeRequest(data);
		const requestType = normalizedRequest.requestType || extractRequestTypeMeta(data);
		const requestBody = extractRequestBody(data);
		const title = extractRequestTitle({
			...data,
			request_type: requestType,
		});
		const finalRequestBody = Object.keys(requestBody).length > 0 ? requestBody : normalizedRequest.requestBody;

		return {
			...normalizedRequest,
			title: normalizeTextValue(requestType.name ?? requestType.name_ar ?? title ?? normalizedRequest.title, normalizedRequest.title),
			type: normalizeTextValue(requestType.name ?? requestType.name_ar ?? title ?? normalizedRequest.type, normalizedRequest.type),
			requestTypeId: data.request_type_id ?? normalizedRequest.requestTypeId ?? requestType.request_type_id ?? requestType.id ?? null,
			requestTypeCode: normalizeTextValue(requestType.code ?? normalizedRequest.requestTypeCode ?? data.request_type_code ?? '', ''),
			requestTypeName: normalizeTextValue(requestType.name ?? normalizedRequest.requestTypeName ?? '', ''),
			requestTypeNameAr: normalizeTextValue(requestType.name_ar ?? normalizedRequest.requestTypeNameAr ?? '', ''),
			requestType,
			requestBody: finalRequestBody,
			formSchema: requestType.form_schema || normalizedRequest.formSchema || null,
			processedAt: data.processed_at ? formatDateLabel(data.processed_at) : '',
			isProcessed: Boolean(data.processed_at),
			comments: Array.isArray(data.comments) ? data.comments : [],
			raw: data,
		};
	} catch (error) {
		console.error('Error fetching request details:', error);
		throw error;
	}
};

export const fetchStudentComplaintDetails = async (accessToken, complaintId) => {
	try {
		const response = await api.get(`/students/complaints/${complaintId}`, getHeaderConfig(accessToken));
		const data = getResponseData(response);
		const resolutionText = normalizeTextValue(data.resolution_text, '');
		const title = extractComplaintTitle(data);

		return {
			...normalizeComplaint(data),
			title,
			type: title,
			solutionText: resolutionText,
			resolutionNote: resolutionText,
			resolvedAt: data.resolved_at ? formatDateLabel(data.resolved_at) : '',
			isResolved: Boolean(data.resolved_at),
			comments: Array.isArray(data.comments) ? data.comments : [],
		};
	} catch (error) {
		console.error('Error fetching complaint details:', error);
		throw error;
	}
};

export const fetchStudentRecentActivities = async (accessToken, limit = 5) => {
	const [requests, complaints] = await Promise.all([
		fetchStudentRequests(accessToken),
		fetchStudentComplaints(accessToken),
	]);

	return [...requests, ...complaints]
		.sort((left, right) => (right.sortTimestamp ?? 0) - (left.sortTimestamp ?? 0))
		.slice(0, limit);
};

export const fetchStudentDashboardMetrics = async (accessToken) => {
	const [operationsSummary, paymentSummary] = await Promise.all([
		fetchStudentOperationsSummary(accessToken),
		fetchStudentPaymentSummary(accessToken),
	]);

	return {
		complaintsCount: operationsSummary?.complaintsCount ?? 0,
		requestsCount: operationsSummary?.requestsCount ?? 0,
		paymentsCount: operationsSummary?.paymentsCount ?? 0,
		totalPaymentAmount: paymentSummary?.totalAmount ?? 0,
		operationsSummary,
		paymentSummary,
	};
};

// ─── REPLACE everything after fetchStudentDashboardMetrics with this ─────────

export const fetchStudentProfile = async (accessToken) => {
  const response = await api.get('/users/profile', getHeaderConfig(accessToken));
  return getResponseData(response);
};


export const getPhotoUploadSignature = async (accessToken) => {
  const response = await api.get(
    '/users/photo-signature?folderName=profile-photo',
    getHeaderConfig(accessToken)
  );

  return getResponseData(response);
};

export const updateStudentProfilePhoto = async (
  accessToken,
  profilePhoto,
  publicId
) => {
  const response = await api.patch(
    '/users/profile-photo',
    {
      profilePhoto,
      publicId,
    },
    getHeaderConfig(accessToken)
  );

  return getResponseData(response);
};

export const fetchStudentPayments = async (accessToken) => {
  const response = await api.get('/students/payments', getHeaderConfig(accessToken));
  const data = getResponseData(response);
  return Array.isArray(data) ? data : [];
};

export const fetchStudentFailedCourses = async (accessToken) => {
  const response = await api.get('/students/failed-courses', getHeaderConfig(accessToken));
  const data = getResponseData(response);
  return Array.isArray(data) ? data : [];
};

export const getAttachmentUploadSignature = async (accessToken) => {
  const response = await api.get(
    '/users/photo-signature?folderName=attachments',
    getHeaderConfig(accessToken),
  );
  return getResponseData(response);
};
 
 
 
