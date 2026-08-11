import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    FiArrowLeft, FiFileText, FiCalendar, FiCreditCard, 
    FiMessageSquare, FiClock, FiUser, FiPaperclip, FiX
} from 'react-icons/fi';
import useAuth from '../../auth/useAuth';
import { getStatusStyle, formatStatusText } from '../../../Components/Records/recordHelpers';

const formatRecordDate = (dateStr) => {
    if (!dateStr) return null;
    try {
        return new Intl.DateTimeFormat('en-US', { 
            year: 'numeric', month: 'short', day: 'numeric' 
        }).format(new Date(dateStr));
    } catch {
        return dateStr;
    }
};

const isPlainObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const hasRenderableValue = (value) => {
    if (value === null || value === undefined) {
        return false;
    }

    if (typeof value === 'string') {
        return value.trim() !== '';
    }

    if (Array.isArray(value)) {
        return value.some((item) => hasRenderableValue(item));
    }

    if (typeof value === 'object') {
        return Object.keys(value).length > 0;
    }

    return true;
};

const pickFirstValue = (...values) => {
    for (const value of values) {
        if (!hasRenderableValue(value)) {
            continue;
        }

        return value;
    }

    return undefined;
};

const humanizeFieldKey = (key) => String(key || '')
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase()) || 'Field';

const REQUEST_FIELD_LABELS = {
    student_name: 'Student Name',
    student_name_quad: 'Student Name (Quad)',
    student_id: 'Student ID',
    national_id: 'National ID',
    faculty: 'Faculty',
    university: 'University',
    year_group: 'Year Group',
    department: 'Department',
    kind: 'Gender',
    education_system: 'Education System',
    detailed_address: 'Detailed Address',
    mobile_phone: 'Mobile Phone',
    program: 'Program',
    cgpa: 'CGPA',
    credit_hours: 'Credit Hours',
    certificates_count_and_language: 'Certificates Count and Language',
    university_email: 'University Email',
    phone: 'Phone Number',
    email: 'Email',
    level: 'Level',
    academic_year: 'Academic Year',
    semester: 'Semester',
};

const AUTO_FILLED_FIELD_KEYS = new Set([
    'student_name',
    'student_name_quad',
    'student_id',
    'national_id',
    'faculty',
    'university',
    'year_group',
    'department',
    'kind',
    'education_system',
    'detailed_address',
    'mobile_phone',
    'program',
    'cgpa',
    'credit_hours',
    'certificates_count_and_language',
    'university_email',
    'phone',
    'email',
    'level',
    'academic_year',
    'semester',
]);

const REQUEST_META_KEYS = new Set([
    'id',
    'raw',
    'title',
    'type',
    'status',
    'category',
    'kind',
    'description',
    'submittedAt',
    'processedAt',
    'updatedBy',
    'updatedAt',
    'processed_at',
    'resolved_at',
    'created_at',
    'updated_at',
    'updated_by',
    'price',
    'price_at_request',
    'comments',
    'attachment',
    'attachments',
    'attachment_links',
    'request_number',
    'request_id',
    'request_type',
    'requestType',
    'request_body',
    'requestBody',
    'requestTypeId',
    'requestTypeCode',
    'requestTypeName',
    'requestTypeNameAr',
    'request_type_id',
    'request_type_code',
    'request_type_name',
    'request_type_name_ar',
    'request_type_title',
    'form_schema',
    'formSchema',
    'solutionText',
    'resolutionNote',
    'resolutionText',
    'processedBy',
]);

const REQUEST_FIELD_ORDER = [
    'student_name',
    'student_name_quad',
    'student_id',
    'national_id',
    'email',
    'university_email',
    'phone',
    'mobile_phone',
    'level',
    'year_group',
    'academic_year',
    'semester',
    'program',
    'faculty',
    'department',
    'university',
    'cgpa',
    'completed_hours',
    'registered_hours_current',
    'registered_hours',
    'total_earned_hours',
    'hours_before_withdrawal',
    'hours_after_withdrawal',
    'course_to_withdraw',
    'requested_courses',
    'registered_courses',
    'credit_hours',
    'kind',
    'education_system',
    'detailed_address',
    'certificates_count_and_language',
];

const REQUEST_FIELD_PRIORITY = new Map(
    REQUEST_FIELD_ORDER.map((key, index) => [key, index]),
);

const formatMoney = (value) => {
    if (value === null || value === undefined || value === '') return '-';
    const numericValue = Number(value);
    if (Number.isFinite(numericValue)) return numericValue === 0 ? 'Free' : `${numericValue} EGP`;
    return String(value);
};

const formatDisplayValue = (value, fallback = '-') => {
    if (value === null || value === undefined) return fallback;
    if (Array.isArray(value)) {
        const normalizedValues = value.map((item) => formatDisplayValue(item, '')).filter(Boolean);
        return normalizedValues.length > 0 ? normalizedValues.join(', ') : fallback;
    }
    if (typeof value === 'object') {
        const directText = value.text ?? value.message ?? value.label ?? value.name ?? value.title ?? value.value ?? value.code;
        if (directText !== undefined && directText !== null) {
            const textValue = String(directText).trim();
            if (textValue) return textValue;
        }
        const nestedValues = Object.values(value).map((item) => formatDisplayValue(item, '')).filter(Boolean);
        return nestedValues.length > 0 ? nestedValues.join(', ') : fallback;
    }
    return String(value).trim() || fallback;
};

const formatFieldLabel = (key, schemaField = null) => schemaField?.label || REQUEST_FIELD_LABELS[key] || humanizeFieldKey(key);

const findNestedValue = (source, key) => {
    if (!isPlainObject(source)) {
        return undefined;
    }

    if (Object.prototype.hasOwnProperty.call(source, key)) {
        const directValue = source[key];
        if (hasRenderableValue(directValue)) {
            return directValue;
        }
    }

    for (const value of Object.values(source)) {
        if (!isPlainObject(value)) {
            continue;
        }

        const nestedValue = findNestedValue(value, key);
        if (nestedValue !== undefined) {
            return nestedValue;
        }
    }

    return undefined;
};

const formatFieldValue = (key, value, schemaField = null) => {
    if (!hasRenderableValue(value)) {
        return '-';
    }

    if (Array.isArray(value)) {
        const items = value.map((item) => formatDisplayValue(item, '')).filter(Boolean);
        return items.length > 0 ? items.join(', ') : '-';
    }

    if (typeof value === 'object') {
        return formatDisplayValue(value, '-');
    }

    if (schemaField?.type === 'number' || /(^|_)(count|hours?|days?|credit_hours)$|cgpa$/i.test(key)) {
        return String(value).trim() || '-';
    }

    if (/(price|fee|fees|amount|cost|total)/i.test(key)) {
        return formatMoney(value);
    }

    if (/date|_at$/i.test(key)) {
        return formatRecordDate(value) || formatDisplayValue(value, '-');
    }

    if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
    }

    return formatDisplayValue(value, '-');
};

const buildRequestFieldSections = (requestBody = {}, requestType = {}, rawData = {}) => {
    const normalizedBody = isPlainObject(requestBody) ? requestBody : {};
    const normalizedRawData = isPlainObject(rawData) ? rawData : {};
    const schemaFields = Array.isArray(requestType.form_schema?.fields) ? requestType.form_schema.fields : [];
    const fields = [];
    const usedKeys = new Set();

    const addField = (key, label, value, schemaField = null) => {
        const field = {
            key,
            label,
            value: formatFieldValue(key, value, schemaField),
            sortOrder: REQUEST_FIELD_PRIORITY.has(key)
                ? REQUEST_FIELD_PRIORITY.get(key)
                : REQUEST_FIELD_ORDER.length + fields.length,
            sequence: fields.length,
        };

        fields.push(field);
        usedKeys.add(key);
    };

    const pickValue = (key) => pickFirstValue(
        findNestedValue(normalizedBody, key),
        findNestedValue(normalizedRawData, key),
    );

    if (schemaFields.length > 0) {
        schemaFields.forEach((schemaField) => {
            const key = schemaField?.name;
            if (!key) {
                return;
            }

            addField(key, formatFieldLabel(key, schemaField), pickValue(key), schemaField);
        });
    }

    Object.entries(normalizedBody).forEach(([key, value]) => {
        if (usedKeys.has(key) || !hasRenderableValue(value)) {
            return;
        }

        addField(key, formatFieldLabel(key), value);
    });

    Object.entries(normalizedRawData).forEach(([key, value]) => {
        if (usedKeys.has(key) || REQUEST_META_KEYS.has(key) || !hasRenderableValue(value)) {
            return;
        }

        addField(key, formatFieldLabel(key), value);
    });

    return fields
        .sort((left, right) => (left.sortOrder - right.sortOrder) || (left.sequence - right.sequence))
        .map((field) => ({
            key: field.key,
            label: field.label,
            value: field.value,
        }));
};

const DetailField = ({ label, value, className = '' }) => (
    <div className={`rounded-xl border border-slate-100 bg-white shadow-sm p-4 ${className}`.trim()}>
        <span className="mb-1 block text-[12.5px] font-semibold text-slate-500">{label}</span>
        <span className="block whitespace-pre-wrap break-words text-[15px] font-bold leading-relaxed text-indigo-950">
            {value}
        </span>
    </div>
);

const AttachmentsList = ({ attachments, onImageClick }) => {
    if (!attachments || attachments.length === 0) return null;
    return (
        <div className="flex flex-wrap gap-4">
            {attachments.map((link, index) => (
                <button
                    key={index}
                    type="button"
                    onClick={() => onImageClick(link)}
                    className="group relative h-28 w-28 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm transition-all duration-300 hover:border-indigo-400 hover:shadow-md hover:-translate-y-1"
                >
                    <img 
                        src={link} 
                        alt={`Attachment ${index + 1}`} 
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-indigo-900/0 transition-colors duration-300 group-hover:bg-indigo-900/10 flex items-center justify-center">
                        <FiFileText className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" size={24} />
                    </div>
                </button>
            ))}
        </div>
    );
};

const RequestFieldsCard = ({ fields = [], attachments = [], onImageClick }) => {
    const hasFields = fields.length > 0;
    const hasAttachments = attachments.length > 0;

    if (!hasFields && !hasAttachments) {
        return (
            <div className="bg-white/80 backdrop-blur-md border border-slate-100 shadow-sm rounded-2xl p-6 relative z-10">
                <h3 className="text-[16px] font-bold text-indigo-950 mb-4">Submitted Request Details</h3>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50/50 text-center">
                    <FiFileText className="text-slate-400 mb-3" size={24} />
                    <p className="text-[14px] font-semibold text-slate-700">No submitted request data is available.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/80 backdrop-blur-md border border-slate-100 shadow-sm rounded-2xl p-6 relative z-10">
            <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-[16px] font-bold text-indigo-950">Submitted Request Details</h3>
                </div>
            </div>

            {hasFields && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {fields.map((field) => (
                        <DetailField key={field.key} label={field.label} value={field.value} />
                    ))}
                </div>
            )}

            {hasAttachments && (
                <div className={hasFields ? "mt-6 border-t border-slate-100 pt-5" : ""}>
                    <h4 className="flex items-center gap-2 text-[14px] font-bold text-slate-500 mb-4">
                        <FiPaperclip size={16} />
                        Attachments
                    </h4>
                    <AttachmentsList attachments={attachments} onImageClick={onImageClick} />
                </div>
            )}
        </div>
    );
};

const ImageViewerModal = ({ src, onClose }) => {
    if (!src) return null;

    return (
        <div 
            className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 transition-all"
            onClick={onClose}
        >
            <div 
                className="relative max-h-full max-w-4xl rounded-2xl bg-white p-2 shadow-2xl animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute -right-4 -top-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-white shadow-lg hover:bg-rose-500 hover:scale-110 transition-all duration-200"
                >
                    <FiX size={20} strokeWidth={2.5} />
                </button>
                <img 
                    src={src} 
                    alt="Attachment Preview" 
                    className="max-h-[85vh] w-auto rounded-xl object-contain"
                />
            </div>
        </div>
    );
};

const StudentRecordDetailsPage = ({
    recordKind = 'request',
    pageTitle = '',
    backPath,
    loadRecordDetails,
}) => {
    const { accessToken, isAuthReady } = useAuth();
    const { recordId } = useParams();
    const navigate = useNavigate();
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    const isComplaint = recordKind === 'complaint';
    const screenTitle = pageTitle || `${isComplaint ? 'Complaint' : 'Request'} Details`;

    useEffect(() => {
        if (!recordId || !loadRecordDetails) {
            setLoading(false);
            setError('Unable to load record details.');
            return;
        }
        if (!isAuthReady || !accessToken) return;

        let isMounted = true;
        const fetchDetails = async () => {
            setLoading(true);
            try {
                const data = await loadRecordDetails(accessToken, recordId);
                if (isMounted) setDetails(data);
            } catch {
                if (isMounted) setError('Unable to load record details.');
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchDetails();
        return () => { isMounted = false; };
    }, [accessToken, isAuthReady, loadRecordDetails, recordId]);

    if (loading) {
        return (
            <div className="flex min-h-[320px] items-center justify-center p-8">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-[5px] border-slate-200 border-t-indigo-600" />
                    <span className="text-sm font-semibold tracking-wide text-slate-400">Loading details...</span>
                </div>
            </div>
        );
    }

    if (error) return <div className="p-8 text-center text-rose-500">{error}</div>;
    if (!details) return <div className="p-8 text-center text-slate-500">No record details available.</div>;

    const rawData = details.raw || details;
    const requestType = details.requestType || rawData.request_type || rawData.requestType || {};
    const requestBody = details.requestBody || details.request_body || rawData.request_body || rawData.requestBody || rawData.form_data || rawData.submission_data || rawData.payload || {};
    const requestTypeForFields = {
        ...requestType,
        form_schema: details.formSchema || requestType.form_schema || null,
    };

    const typeValue = requestType.name
        || requestType.name_ar
        || rawData.request_type?.name
        || rawData.request_type?.name_ar
        || rawData.complaint_type
        || details.type
        || (isComplaint ? 'Complaint' : 'Request');

    const dateValue = formatRecordDate(rawData.created_at)
        || details.submittedAt
        || '-';

    const actualPrice = rawData.price_at_request !== undefined
        ? rawData.price_at_request
        : details.price;
    const feeValue = actualPrice !== undefined && actualPrice !== null
        ? (actualPrice == 0 ? 'Free' : `${actualPrice} EGP`)
        : 'Free';

    const rawStatus = rawData.status || details.status || 'pending';
    const isPending = rawStatus === 'pending' || rawStatus === 'in_progress';
    const requestFieldFields = !isComplaint
        ? buildRequestFieldSections(requestBody, requestTypeForFields, rawData)
        : [];

    const getResolutionText = () => {
        const rawValue = rawData.resolution_text
            || details.solutionText
            || details.resolutionNote
            || rawData.comments
            || '';

        let text = '';
        if (typeof rawValue === 'string') {
            text = rawValue.trim();
        } else if (Array.isArray(rawValue)) {
            text = rawValue
                .map(item => (typeof item === 'string' ? item : item?.text ?? item?.message ?? ''))
                .filter(Boolean)
                .join(' ')
                .trim();
        } else if (rawValue && typeof rawValue === 'object') {
            text = String(rawValue.text ?? rawValue.message ?? '').trim();
        } else {
            text = String(rawValue).trim();
        }

        if (/^(no resolution yet|no response yet)$/i.test(text)) return '';
        return text;
    };

    const resolvedOrProcessedDate = formatRecordDate(
        rawData.resolved_at
        || rawData.processed_at
        || details.resolvedAt
        || details.processedAt
    );

    const replyText = getResolutionText();
    const hasReply = Boolean(replyText) || (isComplaint && Boolean(rawData.resolved_at || details.resolvedAt));
    const attachments = rawData.attachment_links || [];

    const handleBack = () => {
        if (backPath) {
            navigate(backPath);
            return;
        }
        navigate(-1);
    };

    return (
        <section className="relative min-h-screen overflow-hidden bg-[#f8f9ff] pb-12 pt-6 rounded-[2rem]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.06),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.04),transparent_40%)] pointer-events-none z-0"></div>
            <div className="absolute -left-40 top-20 h-[30rem] w-[30rem] rounded-full bg-indigo-200/30 blur-3xl pointer-events-none z-0"></div>
            <div className="absolute top-1/4 -right-20 h-[25rem] w-[25rem] rounded-full bg-blue-200/30 blur-3xl pointer-events-none z-0"></div>

            <div className="relative z-10 mx-auto max-w-[1240px] px-4 md:px-8 space-y-6">
                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleBack}
                        className="flex w-fit items-center gap-2 text-[14px] font-medium text-slate-500 hover:text-indigo-700 transition-colors"
                    >
                        <FiArrowLeft className="h-4 w-4" /> Back
                    </button>
                    <div className="flex items-center gap-4 flex-wrap">
                        <h1 className="text-[24px] font-bold text-indigo-950">{screenTitle}</h1>
                        <span className="bg-slate-200/60 text-indigo-900 px-3 py-1 rounded-md text-[14px] font-semibold tracking-wide">
                            {rawData.request_number || rawData.complaint_number || details.id || 'REQ-000'}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide whitespace-nowrap shadow-sm ${getStatusStyle(rawStatus)}`}>
                            {formatStatusText(rawStatus)}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="bg-white/80 backdrop-blur-md border border-slate-100 shadow-sm rounded-2xl p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 md:divide-x divide-slate-300">
                                <div className="flex items-start gap-4 md:pr-6">
                                    <div className="bg-slate-100 text-slate-500 p-2.5 rounded-xl shrink-0">
                                        <FiFileText size={20} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[13px] text-slate-500 mb-1">
                                            {isComplaint ? 'Complaint Type' : 'Request Type'}
                                        </span>
                                        <span className="text-[15px] font-bold text-indigo-900 leading-tight">{typeValue}</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 md:px-6">
                                    <div className="bg-slate-100 text-slate-500 p-2.5 rounded-xl shrink-0">
                                        <FiCalendar size={20} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[13px] text-slate-500 mb-1">
                                            {isComplaint ? 'Complaint Date' : 'Request Date'}
                                        </span>
                                        <span className="text-[15px] font-bold text-indigo-900">{dateValue}</span>
                                    </div>
                                </div>

                                {!isComplaint && (
                                    <div className="flex items-start gap-4 md:pl-6">
                                        <div className="bg-slate-100 text-slate-500 p-2.5 rounded-xl shrink-0">
                                            <FiCreditCard size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[13px] text-slate-500 mb-1">Request Fees</span>
                                            <span className="text-[15px] font-bold text-indigo-900">{feeValue}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

<div className="bg-white/80 backdrop-blur-md border border-slate-100 shadow-sm rounded-2xl p-6">
    <h3 className="flex items-center gap-2 text-[16px] font-bold text-indigo-950 mb-4">
        <FiFileText className="text-indigo-500" />
        Student Description
    </h3>
    <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-5">
        <p dir="auto" className="whitespace-pre-wrap text-[15px] font-medium leading-relaxed text-slate-700">
            {rawData.description || rawData.complaint_text || 'No description available.'}
        </p>
    </div>
</div>

                        {isComplaint && attachments.length > 0 && (
                            <div className="bg-white/80 backdrop-blur-md border border-slate-100 shadow-sm rounded-2xl p-6">
                                <h3 className="flex items-center gap-2 text-[16px] font-bold text-indigo-950 mb-4">
                                    <FiPaperclip className="text-indigo-500" />
                                    Attachments
                                </h3>
                                <AttachmentsList attachments={attachments} onImageClick={setSelectedImage} />
                            </div>
                        )}

                        {isComplaint && (
                            <div className="bg-white/80 backdrop-blur-md border border-slate-100 shadow-sm rounded-2xl p-6">
                                <h3 className="text-[16px] font-bold text-indigo-950 mb-4">Feedback</h3>
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center bg-white/50">
                                    {hasReply ? (
                                        <div className="w-full text-left">
                                            <p className="text-[15px] text-indigo-900 leading-relaxed font-medium">
                                                {replyText || 'Record reviewed and processed.'}
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <FiMessageSquare className="text-slate-400 mb-3" size={24} />
                                            <p className="text-[14px] font-semibold text-slate-700">
                                                No comments or feedback provided yet.
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {!isComplaint && (
                            <RequestFieldsCard 
                                fields={requestFieldFields} 
                                attachments={attachments} 
                                onImageClick={setSelectedImage} 
                            />
                        )}
                    </div>

                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <div className="bg-white/80 backdrop-blur-md border border-slate-100 shadow-sm rounded-2xl p-6">
                            <h3 className="text-[16px] font-bold text-indigo-950 mb-5">Processing Timeline</h3>
                            <div className="flex flex-col relative">
                                <div className="absolute left-[19px] top-6 bottom-6 w-[1.5px] bg-slate-200 z-0" />

                                <div className="flex gap-4 relative z-10 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-[#F4F1FD] text-indigo-500 flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
                                        <FiClock size={16} />
                                    </div>
                                    <div className="flex flex-col pt-1">
                                        <span className="text-[13px] text-slate-500 font-medium mb-0.5">
                                            {isComplaint ? 'Resolved At:' : 'Processed At:'}
                                        </span>
                                        <span className="text-[14.5px] font-bold text-indigo-900">
                                            {resolvedOrProcessedDate || (isPending ? 'Waiting for action' : 'Not recorded')}
                                        </span>
                                    </div>
                                </div>

                                {!isComplaint && (
                                    <div className="flex gap-4 relative z-10">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
                                            <FiUser size={16} />
                                        </div>
                                        <div className="flex flex-col pt-1">
                                            <span className="text-[13px] text-slate-500 font-medium mb-0.5">Updated by:</span>
                                            <span className="text-[14.5px] font-bold text-indigo-900">
                                                {rawData.updated_by || details.updatedBy || (isPending ? 'Pending' : 'No updates yet')}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {!isComplaint && (
                            <div className="bg-white/80 backdrop-blur-md border border-slate-100 shadow-sm rounded-2xl p-6">
                                <h3 className="text-[16px] font-bold text-indigo-950 mb-4">Feedback</h3>
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center bg-white/50">
                                    {hasReply ? (
                                        <div className="w-full text-left">
                                            <p className="text-[15px] text-indigo-900 leading-relaxed font-medium">
                                                {replyText || 'Record reviewed and processed.'}
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <FiMessageSquare className="text-slate-400 mb-3" size={24} />
                                            <p className="text-[14px] font-semibold text-slate-700">
                                                No comments or feedback provided yet.
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ImageViewerModal 
                src={selectedImage} 
                onClose={() => setSelectedImage(null)} 
            />
        </section>
    );
};

export default StudentRecordDetailsPage;