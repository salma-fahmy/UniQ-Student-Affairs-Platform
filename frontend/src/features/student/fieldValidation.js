
// ─── Regex helpers ────────────────────────────────────────────────────────────
const PHONE_RE   = /^[+]?[\d\s\-().]{7,20}$/;
const EMAIL_RE   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE     = /^https?:\/\/.+/;
const DATE_RE    = /^\d{4}-\d{2}-\d{2}$/;          // yyyy-mm-dd (HTML date input)
const TIME_RE    = /^\d{2}:\d{2}(:\d{2})?$/;        // hh:mm or hh:mm:ss
const INT_RE     = /^-?\d+$/;
const FLOAT_RE   = /^-?\d+(\.\d+)?$/;

// ─── Per-type validators ──────────────────────────────────────────────────────

const TYPE_VALIDATORS = {
  // Plain text — just check it's not blank
  text(val, field) {
    if (typeof val !== 'string' || val.trim() === '') return 'هذا الحقل مطلوب';
    if (field.minLength && val.trim().length < field.minLength)
      return `الحد الأدنى للأحرف هو ${field.minLength}`;
    if (field.maxLength && val.trim().length > field.maxLength)
      return `الحد الأقصى للأحرف هو ${field.maxLength}`;
    return null;
  },

  // Multi-line text — same rules as text
  textarea(val, field) {
    return TYPE_VALIDATORS.text(val, field);
  },

  // Strict number (integer or float depending on field.step / field.integer)
  number(val, field) {
    if (val === '' || val === null || val === undefined) return 'هذا الحقل مطلوب';
    const n = Number(val);
    if (Number.isNaN(n)) return 'يجب أن تكون القيمة رقماً';
    if (field.integer && !INT_RE.test(String(val).trim()))
      return 'يجب أن يكون الرقم صحيحاً (بدون كسور)';
    if (field.min !== undefined && n < Number(field.min))
      return `يجب أن تكون القيمة ${field.min} أو أكثر`;
    if (field.max !== undefined && n > Number(field.max))
      return `يجب أن تكون القيمة ${field.max} أو أقل`;
    return null;
  },

  // Email address
  email(val) {
    if (!val || String(val).trim() === '') return 'هذا الحقل مطلوب';
    if (!EMAIL_RE.test(String(val).trim()))
      return 'يرجى إدخال بريد إلكتروني صحيح';
    return null;
  },

  // Phone number
  phone(val) {
    if (!val || String(val).trim() === '') return 'هذا الحقل مطلوب';
    if (!PHONE_RE.test(String(val).trim()))
      return 'يرجى إدخال رقم هاتف صحيح';
    return null;
  },

  // URL
  url(val) {
    if (!val || String(val).trim() === '') return 'هذا الحقل مطلوب';
    if (!URL_RE.test(String(val).trim()))
      return 'يرجى إدخال رابط صحيح يبدأ بـ http:// أو https://';
    return null;
  },

  // Date (HTML date input → "yyyy-mm-dd")
  date(val, field) {
    if (!val || String(val).trim() === '') return 'هذا الحقل مطلوب';
    if (!DATE_RE.test(String(val).trim())) return 'يرجى إدخال تاريخ صحيح';
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return 'التاريخ غير صالح';
    if (field.minDate && new Date(val) < new Date(field.minDate))
      return `يجب أن يكون التاريخ بعد ${field.minDate}`;
    if (field.maxDate && new Date(val) > new Date(field.maxDate))
      return `يجب أن يكون التاريخ قبل ${field.maxDate}`;
    return null;
  },

  // Time
  time(val) {
    if (!val || String(val).trim() === '') return 'هذا الحقل مطلوب';
    if (!TIME_RE.test(String(val).trim())) return 'يرجى إدخال وقت صحيح';
    return null;
  },

  // Single select / dropdown
  select(val) {
    if (val === null || val === undefined || val === '')
      return 'يرجى الاختيار من القائمة';
    return null;
  },

  // Radio group — same as select
  radio(val) {
    return TYPE_VALIDATORS.select(val);
  },

  // Multi-select / checkboxes group (value expected as array)
  multiselect(val, field) {
    const arr = Array.isArray(val) ? val : [];
    if (arr.length === 0) return 'يرجى اختيار خيار واحد على الأقل';
    if (field.minSelect && arr.length < field.minSelect)
      return `يرجى اختيار ${field.minSelect} خيارات على الأقل`;
    if (field.maxSelect && arr.length > field.maxSelect)
      return `يمكنك اختيار ${field.maxSelect} خيارات كحد أقصى`;
    return null;
  },

  // Single boolean checkbox (e.g. "I agree to the terms")
  checkbox(val) {
    if (!val) return 'يجب الموافقة على هذا البند';
    return null;
  },

  // File upload — check a File object or a non-empty string (existing URL)
  file(val, field) {
    if (!val) return 'يرجى رفع الملف المطلوب';
    if (val instanceof File) {
      if (field.maxSizeMB) {
        const mb = val.size / (1024 * 1024);
        if (mb > field.maxSizeMB) return `حجم الملف يتجاوز الحد المسموح به (${field.maxSizeMB} MB)`;
      }
      if (field.accept) {
        const allowed = field.accept.split(',').map((s) => s.trim().toLowerCase());
        const ext = `.${val.name.split('.').pop().toLowerCase()}`;
        const mime = val.type.toLowerCase();
        const ok = allowed.some((a) => a === ext || a === mime || a === mime.split('/')[0] + '/*');
        if (!ok) return `نوع الملف غير مدعوم. الأنواع المقبولة: ${field.accept}`;
      }
    }
    return null;
  },

  // Hidden fields — never validated (they carry system values)
  hidden() {
    return null;
  },
};

// ─── Fallback for unknown types ───────────────────────────────────────────────

const DEFAULT_VALIDATOR = (val) => {
  const empty =
    val === null ||
    val === undefined ||
    val === '' ||
    (Array.isArray(val) && val.length === 0);
  return empty ? 'هذا الحقل مطلوب' : null;
};

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Validates all form fields with type-aware rules.
 *
 * @param {Array}  fields   - form_schema.fields array from the request type
 * @param {Object} values   - current form values keyed by field.name
 * @param {Set}    readOnly - set of field names that are auto-filled (skip validation)
 * @returns {Object} errors keyed by field name (empty object = valid)
 */
export const validateFields = (fields = [], values = {}, readOnly = new Set()) => {
  const errors = {};

  fields.forEach((field) => {
    // Never validate hidden or auto-filled fields
    if (field.type === 'hidden' || readOnly.has(field.name)) return;

    // Skip non-required fields that are completely empty
    if (!field.required) {
      const val = values[field.name];
      const isEmpty =
        val === null ||
        val === undefined ||
        val === '' ||
        (Array.isArray(val) && val.length === 0);
      if (isEmpty) return; // optional & empty → fine
      // If optional but filled, still run type validation so bad data is caught
    }

    const val = values[field.name];
    const type = (field.type ?? 'text').toLowerCase();
    const validator = TYPE_VALIDATORS[type] ?? DEFAULT_VALIDATOR;
    const error = validator(val, field);

    if (error) errors[field.name] = error;
  });

  return errors;
};