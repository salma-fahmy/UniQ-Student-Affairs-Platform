import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  FiArrowLeft,
  FiFileText,
  FiCalendar,
  FiUser,
  FiInfo,
  FiClock,
  FiMessageSquare,
  FiPaperclip,
  FiX,
} from "react-icons/fi";
import useAuth from "../../auth/useAuth";
import {
  getStatusStyle,
  formatStatusText,
} from "../../../Components/Records/recordHelpers";
import DecisionActionsPanel from "../components/DecisionActionsPanel";
import RecordActionModal from "../components/RecordActionModal";
import {
  approveRequest,
  rejectRequest,
  resolveComplaint,
  rejectComplaint,
} from "../recordActionService";

const formatRecordDate = (dateStr) => {
  if (!dateStr) return null;
  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
};

const formatMoney = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  const numericValue = Number(value);
  if (Number.isFinite(numericValue))
    return numericValue === 0 ? "0" : `${numericValue} EGP`;
  return String(value);
};

const formatDisplayValue = (value, fallback = "-") => {
  if (value === null || value === undefined) return fallback;
  if (Array.isArray(value)) {
    const normalizedValues = value
      .map((item) => formatDisplayValue(item, ""))
      .filter(Boolean);
    return normalizedValues.length > 0 ? normalizedValues.join(", ") : fallback;
  }
  if (typeof value === "object") {
    const directText =
      value.text ?? value.message ?? value.label ?? value.name ?? value.value;
    if (directText !== undefined && directText !== null) {
      const textValue = String(directText).trim();
      if (textValue) return textValue;
    }
    const nestedValues = Object.values(value)
      .map((item) => formatDisplayValue(item, ""))
      .filter(Boolean);
    return nestedValues.length > 0 ? nestedValues.join(", ") : fallback;
  }
  return String(value).trim() || fallback;
};

const REQUEST_FIELD_PRIORITY = [
  { label: "Student Name", keys: ["student_name", "student_name_quad"] },
  { label: "Student ID", keys: ["student_id"] },
  { label: "National ID", keys: ["national_id"] },
  { label: "Email", keys: ["email", "university_email"] },
  { label: "Phone Number", keys: ["phone", "mobile", "mobile_phone"] },
  { label: "Level", keys: ["level"] },
  { label: "Year Group", keys: ["year_group"] },
  { label: "Academic Year", keys: ["academic_year"] },
  { label: "Semester", keys: ["semester"] },
  { label: "Program", keys: ["program"] },
  { label: "Faculty", keys: ["faculty"] },
  { label: "Department", keys: ["department"] },
  { label: "University", keys: ["university"] },
  { label: "CGPA", keys: ["cgpa"] },
  { label: "Completed Hours", keys: ["completed_hours"] },
  { label: "Registered Hours Current", keys: ["registered_hours_current"] },
  { label: "Registered Hours", keys: ["registered_hours"] },
  { label: "Total Earned Hours", keys: ["total_earned_hours"] },
  { label: "Hours Before Withdrawal", keys: ["hours_before_withdrawal"] },
  { label: "Hours After Withdrawal", keys: ["hours_after_withdrawal"] },
  { label: "Course To Withdraw", keys: ["course_to_withdraw"] },
  { label: "Requested Courses", keys: ["requested_courses"] },
  { label: "Registered Courses", keys: ["registered_courses"] },
  { label: "Credit Hours", keys: ["credit_hours"] },
  { label: "Gender", keys: ["kind"] },
  { label: "Education System", keys: ["education_system"] },
  { label: "Detailed Address", keys: ["detailed_address"] },
  {
    label: "Certificates Count and Language",
    keys: ["certificates_count_and_language"],
  },
  { label: "Total Fees", keys: ["total_fees"] },
  { label: "First Installment Amount", keys: ["first_installment_amount"] },
  { label: "Second Installment Amount", keys: ["second_installment_amount"] },
  { label: "First Installment Date", keys: ["first_installment_date"] },
  { label: "Second Installment Date", keys: ["second_installment_date"] },
];

const REQUEST_FIELD_LABELS = {
  student_name: "Student Name",
  student_name_quad: "Student Name (Quad)",
  student_id: "Student ID",
  national_id: "National ID",
  email: "Email",
  university_email: "University Email",
  phone: "Phone Number",
  mobile: "Phone Number",
  mobile_phone: "Phone Number",
  program: "Program",
  level: "Level",
  year_group: "Year Group",
  academic_year: "Academic Year",
  semester: "Semester",
  faculty: "Faculty",
  department: "Department",
  university: "University",
  cgpa: "CGPA",
  completed_hours: "Completed Hours",
  registered_hours_current: "Registered Hours Current",
  registered_hours: "Registered Hours",
  total_earned_hours: "Total Earned Hours",
  hours_before_withdrawal: "Hours Before Withdrawal",
  hours_after_withdrawal: "Hours After Withdrawal",
  course_to_withdraw: "Course To Withdraw",
  requested_courses: "Requested Courses",
  registered_courses: "Registered Courses",
  credit_hours: "Credit Hours",
  kind: "Gender",
  education_system: "Education System",
  detailed_address: "Detailed Address",
  certificates_count_and_language: "Certificates Count and Language",
  total_fees: "Total Fees",
  first_installment_amount: "First Installment Amount",
  second_installment_amount: "Second Installment Amount",
  first_installment_date: "First Installment Date",
  second_installment_date: "Second Installment Date",
};

const EXCLUDED_META_KEYS = new Set([
  "attachment",
  "attachments",
  "attachment_links"
]);

const formatRequestFieldLabel = (key) => {
  if (REQUEST_FIELD_LABELS[key]) return REQUEST_FIELD_LABELS[key];
  return String(key || "")
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatRequestFieldValue = (key, value) => {
  if (value === null || value === undefined || value === "") return "-";
  if (Array.isArray(value)) {
    const items = value
      .map((item) => formatDisplayValue(item, ""))
      .filter(Boolean);
    return items.length > 0 ? items.join(", ") : "-";
  }
  if (typeof value === "object") return formatDisplayValue(value, "-");
  if (/date$/i.test(key)) return formatRecordDate(value) || "-";
  if (/(amount|price|fee|fees|total_fees)/i.test(key))
    return formatMoney(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return formatDisplayValue(value, "-");
};

const buildRequestFieldsFlat = (requestBody = {}) => {
  const normalizedBody =
    requestBody && typeof requestBody === "object" ? requestBody : {};
  const usedKeys = new Set();
  const flatFields = [];

  const pushField = (key, label, rawValue) => {
    if (rawValue === null || rawValue === undefined || rawValue === "") {
      return;
    }

    usedKeys.add(key);
    flatFields.push({
      key,
      label,
      value: formatRequestFieldValue(key, rawValue),
    });
  };

  const findPriorityValue = (keys) => {
    for (const key of keys) {
      const rawValue = normalizedBody[key];
      if (rawValue !== null && rawValue !== undefined && rawValue !== "") {
        return { key, value: rawValue };
      }
    }

    return null;
  };

  REQUEST_FIELD_PRIORITY.forEach(({ label, keys }) => {
    const match = findPriorityValue(keys);
    if (!match) {
      return;
    }

    keys.forEach((key) => usedKeys.add(key));
    pushField(match.key, label, match.value);
  });

  Object.entries(normalizedBody).forEach(([key, value]) => {
    if (
      !usedKeys.has(key) &&
      !EXCLUDED_META_KEYS.has(key) &&
      value !== null &&
      value !== undefined &&
      value !== ""
    ) {
      flatFields.push({
        key,
        label: formatRequestFieldLabel(key),
        value: formatRequestFieldValue(key, value),
      });
    }
  });

  return flatFields;
};

const formatStudentName = (studentUser = {}) =>
  [studentUser.first_name, studentUser.second_name]
    .filter(Boolean)
    .join(" ")
    .trim() || "-";
const formatStudentLevel = (value) =>
  value
    ? /^level\s*/i.test(String(value).trim())
      ? String(value).trim()
      : `Level ${String(value).trim()}`
    : "-";

const buildStudentOverviewFieldsFlat = (studentData = {}) => {
  const studentRecord = studentData.student || studentData || {};
  const studentUser = studentRecord.user || {};
  const program = studentRecord.program || {};
  const academicSemester = studentRecord.academic_semester || {};

  const fields = [];
  const usedKeys = new Set([
    "student",
    "user",
    "program",
    "academic_semester",
    "student_id",
    "level",
    "cgpa",
    "completedHours",
    "totalRegisteredHours",
    "fees_due",
    "phone",
    "email",
    "is_active",
    "first_name",
    "second_name",
  ]);

  const studentName = formatStudentName(studentUser);
  if (studentName !== "-")
    fields.push({
      key: "student_name",
      label: "Student Name",
      value: studentName,
    });
  if (studentRecord.student_id)
    fields.push({
      key: "student_id",
      label: "Student ID",
      value: studentRecord.student_id,
    });

  const progName = program.program_name_ar || program.program_name_en;
  if (progName)
    fields.push({ key: "program", label: "Program", value: progName });
  if (academicSemester.semester_name)
    fields.push({
      key: "semester",
      label: "Academic Semester",
      value: academicSemester.semester_name,
    });

  if (studentData.level)
    fields.push({
      key: "level",
      label: "Level",
      value: formatStudentLevel(studentData.level),
    });
  if (studentData.cgpa !== undefined && studentData.cgpa !== null)
    fields.push({ key: "cgpa", label: "CGPA", value: studentData.cgpa });
  if (
    studentData.completedHours !== undefined &&
    studentData.completedHours !== null
  )
    fields.push({
      key: "completed_hours",
      label: "Completed Hours",
      value: studentData.completedHours,
    });
  if (
    studentData.totalRegisteredHours !== undefined &&
    studentData.totalRegisteredHours !== null
  )
    fields.push({
      key: "registered_hours",
      label: "Registered Hours",
      value: studentData.totalRegisteredHours,
    });

  if (
    studentRecord.fees_due !== undefined &&
    studentRecord.fees_due !== null &&
    studentRecord.fees_due !== ""
  ) {
    fields.push({
      key: "fees_due",
      label: "Fees Due",
      value: formatMoney(studentRecord.fees_due),
    });
  }

  if (studentUser.phone)
    fields.push({ key: "phone", label: "Phone", value: studentUser.phone });
  if (studentUser.email)
    fields.push({ key: "email", label: "Email", value: studentUser.email });
  if (studentUser.is_active !== undefined)
    fields.push({
      key: "status",
      label: "Account Status",
      value: studentUser.is_active ? "Active" : "Inactive",
    });

  Object.entries(studentData).forEach(([key, value]) => {
    if (
      !usedKeys.has(key) &&
      value !== null &&
      value !== undefined &&
      value !== "" &&
      typeof value !== "object"
    ) {
      fields.push({
        key,
        label: formatRequestFieldLabel(key),
        value: formatRequestFieldValue(key, value),
      });
      usedKeys.add(key);
    }
  });

  Object.entries(studentRecord).forEach(([key, value]) => {
    if (
      !usedKeys.has(key) &&
      value !== null &&
      value !== undefined &&
      value !== "" &&
      typeof value !== "object"
    ) {
      fields.push({
        key,
        label: formatRequestFieldLabel(key),
        value: formatRequestFieldValue(key, value),
      });
      usedKeys.add(key);
    }
  });

  return fields;
};

const DetailField = ({ label, value, className = "" }) => (
  <div
    className={`rounded-xl border border-slate-100 bg-white p-4 shadow-sm ${className}`.trim()}
  >
    <span className="mb-1 block text-[12.5px] font-semibold text-slate-500">
      {label}
    </span>
    <span className="block break-words whitespace-pre-wrap text-[15px] font-bold leading-relaxed text-indigo-950">
      {value}
    </span>
  </div>
);

const AttachmentsList = ({ attachments, onImageClick }) => {
  if (!attachments || attachments.length === 0) return null;
  return (
      <div className="flex flex-wrap gap-4 mt-4">
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

const RequestSpecificDetails = ({
  details,
  displayTitle,
  hasRequestBody,
  requestFieldsFlat,
  attachments,
  onImageClick
}) => (
  <>
    <div className="rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-md p-6 shadow-sm relative z-10">
      <div className="flex items-start gap-4 mb-4">
        <div className="shrink-0 rounded-xl bg-slate-100 p-2.5 text-slate-500">
          <FiFileText size={20} />
        </div>
        <div className="flex flex-col">
          <span className="mb-0.5 text-[20px] text-slate-500">
            Request Type
          </span>
          <span className="text-[16px] font-bold leading-tight text-indigo-900">
            {displayTitle}
          </span>
        </div>
      </div>
      <p dir="auto" className="mt-4 rounded-xl border border-slate-100 bg-white/50 p-4 text-[15px] font-medium leading-relaxed text-indigo-950">
        {details.description || "No request description available."}
      </p>
    </div>

    <div className="rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-md p-6 shadow-sm relative z-10">
      <h3 className="mb-4 flex items-center gap-2 text-[16px] font-bold text-indigo-950">
        <FiInfo className="text-indigo-500" />
        Request Details
      </h3>
      {hasRequestBody && requestFieldsFlat.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {requestFieldsFlat.map((field) => (
            <DetailField
              key={field.key}
              label={field.label}
              value={field.value}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white/50 p-6 text-center text-[14px] font-medium text-slate-500">
          No request payload available.
        </div>
      )}

      {attachments && attachments.length > 0 && (
        <div className={(hasRequestBody && requestFieldsFlat.length > 0) ? "mt-6 border-t border-slate-100 pt-5" : "mt-4"}>
          <h4 className="flex items-center gap-2 text-[14px] font-bold text-slate-500 mb-4">
            <FiPaperclip size={16} />
            Attachments
          </h4>
          <AttachmentsList attachments={attachments} onImageClick={onImageClick} />
        </div>
      )}
    </div>
  </>
);

const ComplaintSpecificDetails = ({
  details,
  studentInfo,
  studentOverviewFieldsFlat,
  attachments,
  onImageClick
}) => (
  <>
    <div className="rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-md p-6 shadow-sm relative z-10">
      <div className="flex items-start gap-4 mb-4">
        <div className="shrink-0 rounded-xl bg-slate-100 p-2.5 text-slate-500">
          <FiFileText size={20} />
        </div>
        <div className="flex flex-col">
          <span className="mb-0.5 text-[20px] text-slate-500">
            Complaint Type
          </span>
          <span className="text-[16px] font-bold leading-tight text-indigo-900">
            {details.type}
          </span>
        </div>
      </div>
      <p dir="auto" className="mt-4 rounded-xl border border-slate-100 bg-white/50 p-4 text-[15px] font-medium leading-relaxed text-indigo-950">
        {details.description || "No description provided."}
      </p>

      {attachments && attachments.length > 0 && (
        <div className="mt-6 border-t border-slate-100 pt-5">
          <h4 className="flex items-center gap-2 text-[14px] font-bold text-slate-500 mb-4">
            <FiPaperclip size={16} />
            Attachments
          </h4>
          <AttachmentsList attachments={attachments} onImageClick={onImageClick} />
        </div>
      )}
    </div>

    {studentInfo && (
      <div className="rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-md p-6 shadow-sm relative z-10">
        <h3 className="mb-4 flex items-center gap-2 text-[16px] font-bold text-indigo-950">
          <FiUser className="text-indigo-500" />
          Student Overview
        </h3>
        {studentOverviewFieldsFlat.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {studentOverviewFieldsFlat.map((field) => (
              <DetailField
                key={field.key}
                label={field.label}
                value={field.value}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white/50 p-6 text-center text-[14px] font-medium text-slate-500">
            No student details available.
          </div>
        )}
      </div>
    )}
  </>
);

const INITIAL_ACTION_STATE = {
  modalOpen: false,
  actionType: null,
  isSubmitting: false,
  error: "",
};

const AffairsRecordDetailsPage = ({
  recordKind = "request",
  pageTitle = "",
  loadRecordDetails,
}) => {
  const { accessToken, isAuthReady, userRole } = useAuth();
  const { recordId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const [actionState, setActionState] = useState(INITIAL_ACTION_STATE);

  const isComplaint = recordKind === "complaint";
  const screenTitle =
    pageTitle || `${isComplaint ? "Complaint" : "Request"} Details`;

  const fetchDetails = useCallback(async () => {
    if (!recordId || !loadRecordDetails || !accessToken) return;
    setLoading(true);
    try {
      const data = await loadRecordDetails(recordId, accessToken);
      setDetails(data);
    } catch {
      setError("Unable to load record details.");
    } finally {
      setLoading(false);
    }
  }, [accessToken, loadRecordDetails, recordId]);

  useEffect(() => {
    if (!recordId || !loadRecordDetails) {
      setLoading(false);
      setError("Unable to load record details.");
      return;
    }
    if (!isAuthReady || !accessToken) return;

    let isMounted = true;
    const run = async () => {
      setLoading(true);
      try {
        const data = await loadRecordDetails(recordId, accessToken);
        if (isMounted) setDetails(data);
      } catch {
        if (isMounted) setError("Unable to load record details.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    run();

    return () => {
      isMounted = false;
    };
  }, [accessToken, isAuthReady, loadRecordDetails, recordId]);


  const handleAction = useCallback((actionType) => {
    setActionState({ modalOpen: true, actionType, isSubmitting: false, error: "" });
  }, []);

  const handleCloseModal = useCallback(() => {
    if (actionState.isSubmitting) return;
    setActionState(INITIAL_ACTION_STATE);
  }, [actionState.isSubmitting]);


  const handleConfirm = useCallback(
    async (fieldValues) => {
      setActionState((prev) => ({ ...prev, isSubmitting: true, error: "" }));
      try {
        const { actionType } = actionState;
        const roleCtx = { userRole };          

        if (actionType === "approve") {
          await approveRequest(recordId, accessToken, roleCtx);
        } else if (actionType === "reject") {
          await rejectRequest(recordId, fieldValues.comment, accessToken, roleCtx);
        } else if (actionType === "resolve") {
          await resolveComplaint(recordId, fieldValues.resolutionText, accessToken);
        } else if (actionType === "reject_complaint") {
          await rejectComplaint(recordId, fieldValues.resolutionText, accessToken);
        }

        await fetchDetails();
        setActionState(INITIAL_ACTION_STATE);
      } catch (err) {
        const serverMsg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.response?.data?.errors?.[0]?.message ||
          (err?.response?.status
            ? `Server error ${err.response.status}: ${err?.response?.statusText || "Unknown error"}`
            : err?.message) ||
          "Something went wrong. Please try again.";
        setActionState((prev) => ({ ...prev, isSubmitting: false, error: serverMsg }));
      }
    },
    [actionState, accessToken, recordId, userRole, fetchDetails],
  );
  
  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-[5px] border-slate-200 border-t-indigo-600" />
          <span className="text-sm font-semibold tracking-wide text-slate-400">
            Loading details...
          </span>
        </div>
      </div>
    );
  }

  if (error)
    return <div className="p-8 text-center text-rose-500">{error}</div>;
  if (!details)
    return (
      <div className="p-8 text-center text-slate-500">
        No record details available.
      </div>
    );

  const dateValue = formatRecordDate(details.submittedAt) || "-";
  const rawStatus = details.status || "pending";
  const isPending = rawStatus === "pending" || rawStatus === "in_progress";

  const studentData = details.studentData || {};
  const studentInfo = studentData.student || studentData;
  const requestBody = details.requestBody || details.studentData || {};
  const hasRequestBody = Object.keys(requestBody).length > 0;

  const rawData = details.raw || details || {};
  const rawAttachments = rawData.attachment_links || rawData.attachments || details.attachment || details.attachments || [];
  const attachmentsArray = Array.isArray(rawAttachments) ? rawAttachments : (typeof rawAttachments === 'string' ? [rawAttachments] : []);

  const requestFieldsFlat = buildRequestFieldsFlat(requestBody);
  const studentOverviewFieldsFlat = isComplaint
    ? buildStudentOverviewFieldsFlat(studentData)
    : [];

  const displayTitle =
    details.type !== "Request"
      ? details.type
      : location.state?.requestName || "Request";

  const requestSummaryRows = [
    { label: "Submitted Date", value: dateValue },
    { label: "Price at Request", value: formatMoney(details.price) },
  ];

  const requestStudentOverviewRows = !isComplaint
    ? [
        {
          label: "Student Name",
          value:
            `${studentData?.user?.first_name || ""} ${studentData?.user?.second_name || ""}`.trim() ||
            "-",
        },
        {
          label: "Student ID",
          value: studentData?.student_id || "-",
        },
        {
          label: "Email",
          value: studentData?.user?.email || "-",
        },
        {
          label: "Phone",
          value: studentData?.user?.phone || "-",
        },
        {
          label: "Fees Due",
          value: formatMoney(studentData?.fees_due),
        },
      ]
    : studentOverviewFieldsFlat.slice(0, 5);

  const timelineItems = [];

  if (isComplaint) {
    timelineItems.push({
      label: "Resolved At",
      icon: FiClock,
      value: details.resolvedAt
        ? formatRecordDate(details.resolvedAt)
        : isPending
          ? "Not yet"
          : "Not recorded",
    });
    timelineItems.push({
      label: "Handled By",
      icon: FiUser,
      value: details.handledBy || (isPending ? "Not yet" : "System"),
    });
  } else {
    timelineItems.push({
      label: "Processed At",
      icon: FiClock,
      value: details.processedAt
        ? formatRecordDate(details.processedAt)
        : isPending
          ? "Not yet"
          : "Not recorded",
    });
  }

  timelineItems.push({
    label: "Last Updated At",
    icon: FiCalendar,
    value: details.updatedAt ? formatRecordDate(details.updatedAt) : "Not yet",
  });

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#f8f9ff] pb-12 pt-6 rounded-[2rem]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.06),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.04),transparent_40%)] pointer-events-none z-0"></div>
      <div className="absolute -left-40 top-20 h-[30rem] w-[30rem] rounded-full bg-indigo-200/30 blur-3xl pointer-events-none z-0"></div>
      <div className="absolute top-1/4 -right-20 h-[25rem] w-[25rem] rounded-full bg-blue-200/30 blur-3xl pointer-events-none z-0"></div>

      <RecordActionModal
        isOpen={actionState.modalOpen}
        actionType={actionState.actionType}
        isSubmitting={actionState.isSubmitting}
        error={actionState.error}
        onConfirm={handleConfirm}
        onClose={handleCloseModal}
      />

      <div className="relative z-10 mx-auto max-w-[1240px] space-y-6 px-4 md:px-8">
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex w-fit items-center gap-2 text-[14px] font-medium text-slate-500 transition-colors hover:text-indigo-700"
          >
            <FiArrowLeft className="h-4 w-4" /> Back
          </button>
          <div className="flex items-center gap-4">
            <h1 className="text-[24px] font-bold text-indigo-950">
              {screenTitle}
            </h1>
            <span className="rounded-md bg-white px-3 py-1 text-[14px] font-semibold tracking-wide text-indigo-900 shadow-sm border border-slate-100">
              {details.recordId}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 flex flex-col gap-6">
            {!isComplaint ? (
              <RequestSpecificDetails
                details={details}
                displayTitle={displayTitle}
                hasRequestBody={hasRequestBody}
                requestFieldsFlat={requestFieldsFlat}
                attachments={attachmentsArray}
                onImageClick={setSelectedImage}
              />
            ) : (
              <ComplaintSpecificDetails
                details={details}
                studentInfo={studentInfo}
                studentOverviewFieldsFlat={studentOverviewFieldsFlat}
                attachments={attachmentsArray}
                onImageClick={setSelectedImage}
              />
            )}

            <div className="rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-md p-6 shadow-sm relative z-10">
              <h3 className="mb-4 flex items-center gap-2 text-[16px] font-bold text-indigo-950">
                <FiMessageSquare className="text-indigo-500" />
                {isComplaint ? "Resolution Details" : "Staff Comment"}
              </h3>
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white/50 p-8 text-center">
                {details.comments || details.resolutionText ? (
                  <p className="w-full text-left text-[15px] font-medium leading-relaxed text-indigo-950">
                    {isComplaint ? details.resolutionText : details.comments}
                  </p>
                ) : (
                  <>
                    <FiMessageSquare
                      className="mb-3 text-slate-400"
                      size={24}
                    />
                    <p className="text-[14px] font-semibold text-slate-700">
                      {isPending
                        ? isComplaint
                          ? "No resolution provided yet."
                          : "No staff comment yet."
                        : "Action taken by system or staff without additional comments."}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-6 relative z-10">

            <DecisionActionsPanel
              recordKind={recordKind}
              currentStatus={rawStatus}
              userRole={userRole}
              isSubmitting={actionState.isSubmitting}
              onAction={handleAction}
            />

            <div className="rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-md p-6 shadow-sm">
              <h3 className="mb-4 text-[16px] font-bold text-indigo-950">
                Summary
              </h3>
              <div className="mb-6 flex items-center gap-3">
                <span className="text-[13px] text-slate-500">
                  Current Status
                </span>
                <span
                  className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide shadow-sm ${getStatusStyle(rawStatus)}`}
                >
                  {formatStatusText(rawStatus)}
                </span>
              </div>
              <div className="overflow-hidden rounded-xl border border-slate-200">
                {(isComplaint
                  ? [
                      { label: "Submitted Date", value: dateValue },
                    ]
                  : requestSummaryRows
                ).map((row, index, rows) => (
                  <div
                    key={row.label}
                    className={`flex items-center justify-between p-3.5 bg-white ${index < rows.length - 1 ? "border-b border-slate-200" : ""}`}
                  >
                    <span className="text-[13.5px] font-semibold text-slate-600">
                      {row.label}
                    </span>
                    <span className="text-[13.5px] font-bold text-indigo-900">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              {!isComplaint && requestStudentOverviewRows.length > 0 && (
                <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
                  <div className="border-b border-slate-200 bg-slate-50/50 px-3.5 py-3">
                    <h4 className="flex items-center gap-2 text-[14px] font-bold text-indigo-950">
                      <FiUser className="text-indigo-500" />
                      Student Overview
                    </h4>
                  </div>
                  <div>
                    {requestStudentOverviewRows.map((row, index, rows) => (
                      <div
                        key={row.key}
                        className={`flex items-center justify-between gap-3 p-3.5 bg-white ${index < rows.length - 1 ? "border-b border-slate-200" : ""}`}
                      >
                        <span className="text-[13.5px] font-semibold text-slate-600">
                          {row.label}
                        </span>
                        <span className="max-w-[62%] break-words text-right text-[13.5px] font-bold text-indigo-900">
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-md p-6 shadow-sm">
              <h3 className="mb-5 text-[16px] font-bold text-indigo-950">
                Processing Timeline
              </h3>
              <div className="relative flex flex-col">
                {timelineItems.length > 1 && (
                  <div className="absolute left-[19px] top-6 bottom-6 z-0 w-[1.5px] bg-slate-200" />
                )}

                {timelineItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className={`relative z-10 flex gap-4 ${idx < timelineItems.length - 1 ? "mb-6" : ""}`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white bg-indigo-50 text-indigo-500 shadow-sm">
                        <Icon size={16} />
                      </div>

                      <div className="flex flex-col pt-1">
                        <span className="mb-0.5 text-[13px] font-medium text-slate-500">
                          {item.label}:
                        </span>

                        <span className="text-[14.5px] font-bold text-indigo-900">
                          {item.value}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
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

export default AffairsRecordDetailsPage;