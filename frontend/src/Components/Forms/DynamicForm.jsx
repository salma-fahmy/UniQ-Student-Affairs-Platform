import React from 'react';
import { FiLock, FiPaperclip, FiX, FiUploadCloud } from 'react-icons/fi';

// ─── Shared styles ───────────────────────────────────────────────────────────

const inputBase =
  'w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[14px] font-medium text-slate-800 ' +
  'placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 ' +
  'transition-all duration-200 disabled:cursor-not-allowed';

const readOnlyInputBase =
  'w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-[14px] font-medium text-slate-500 ' +
  'cursor-default select-none';

// ─── Field wrapper ───────────────────────────────────────────────────────────

const FieldWrapper = ({ field, error, isReadOnly, children }) => (
  <div className="flex flex-col gap-1.5">
    <label
      htmlFor={field.name}
      className="text-[13px] font-bold text-slate-600 flex items-center justify-between gap-2"
    >
      <span dir="rtl">
        {field.label}
        {field.required && !isReadOnly && (
          <span className="text-rose-500 text-[14px] leading-none mr-0.5"> *</span>
        )}
      </span>
      {isReadOnly && (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400
                         bg-slate-100 px-2 py-0.5 rounded-full whitespace-nowrap">
          <FiLock size={10} className="stroke-[2.5px]" />
          Auto-filled
        </span>
      )}
    </label>
    {children}
    {error && (
      <p className="text-[12px] font-semibold text-rose-500 flex items-center gap-1">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        {error}
      </p>
    )}
  </div>
);

// ─── Field components ────────────────────────────────────────────────────────

const TextField = ({ field, value, onChange, error, disabled, isReadOnly }) => (
  <FieldWrapper field={field} error={error} isReadOnly={isReadOnly}>
    {isReadOnly ? (
      <div className={readOnlyInputBase} dir="auto">{value || '—'}</div>
    ) : (
      <input
        id={field.name}
        type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
        value={value ?? ''}
        onChange={(e) => onChange(field.name, e.target.value)}
        placeholder={field.label}
        required={field.required}
        disabled={disabled}
        dir="auto"
        className={`${inputBase} ${error ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-400' : ''}`}
      />
    )}
  </FieldWrapper>
);

const TextareaField = ({ field, value, onChange, error, disabled, isReadOnly }) => (
  <FieldWrapper field={field} error={error} isReadOnly={isReadOnly}>
    {isReadOnly ? (
      <div className={`${readOnlyInputBase} min-h-[80px] whitespace-pre-wrap`} dir="auto">{value || '—'}</div>
    ) : (
      <textarea
        id={field.name}
        value={value ?? ''}
        onChange={(e) => onChange(field.name, e.target.value)}
        placeholder={field.label}
        required={field.required}
        disabled={disabled}
        rows={4}
        dir="auto"
        className={`${inputBase} resize-none ${error ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-400' : ''}`}
      />
    )}
  </FieldWrapper>
);

const SelectField = ({ field, value, onChange, error, disabled, isReadOnly }) => (
  <FieldWrapper field={field} error={error} isReadOnly={isReadOnly}>
    {isReadOnly ? (
      <div className={readOnlyInputBase} dir="rtl">{value || '—'}</div>
    ) : (
      <div className="relative">
        <select
          id={field.name}
          value={value ?? ''}
          onChange={(e) => onChange(field.name, e.target.value)}
          required={field.required}
          disabled={disabled}
          dir="rtl"
          className={`${inputBase} appearance-none pr-10 cursor-pointer
            ${!value ? 'text-slate-400' : ''}
            ${error ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-400' : ''}`}
        >
          <option value="" disabled>— اختر —</option>
          {(field.options ?? []).map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>
    )}
  </FieldWrapper>
);

const CheckboxField = ({ field, value, onChange, error, disabled, isReadOnly }) => (
  <FieldWrapper field={field} error={error} isReadOnly={isReadOnly}>
    <label
      className={`flex items-start gap-3 p-4 rounded-xl border transition-all duration-200
        ${isReadOnly || disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        ${value
          ? 'border-indigo-300 bg-indigo-50/60'
          : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50'}`}
      dir="rtl"
    >
      <input
        id={field.name}
        type="checkbox"
        checked={!!value}
        onChange={(e) => !isReadOnly && onChange(field.name, e.target.checked)}
        disabled={disabled || isReadOnly}
        className="mt-0.5 w-4 h-4 accent-indigo-700 shrink-0 cursor-pointer"
      />
      <span className="text-[13px] font-medium text-slate-700 leading-relaxed">
        {field.label}
      </span>
    </label>
  </FieldWrapper>
);

const CheckboxGroupField = ({ field, value, onChange, error, disabled, isReadOnly }) => {
  const selected = Array.isArray(value) ? value : [];

  const toggle = (opt) => {
    if (isReadOnly) return;
    const next = selected.includes(opt)
      ? selected.filter((v) => v !== opt)
      : [...selected, opt];
    onChange(field.name, next);
  };

  return (
    <FieldWrapper field={field} error={error} isReadOnly={isReadOnly}>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" dir="rtl">
        {(field.options ?? []).map((opt) => {
          const isChecked = selected.includes(opt);
          return (
            <label
              key={opt}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border
                transition-all duration-200 text-[13px] font-medium
                ${isReadOnly || disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                ${isChecked
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-800'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-slate-50'}`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggle(opt)}
                disabled={disabled || isReadOnly}
                className="w-4 h-4 accent-indigo-700 shrink-0"
              />
              {opt}
            </label>
          );
        })}
      </div>
    </FieldWrapper>
  );
};

const FileField = ({ field, value, onChange, error, disabled, isReadOnly, accessToken }) => {
  const [uploading, setUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState('');
  const inputRef = React.useRef(null);

  const uploaded = Boolean(value);

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const sigRes = await fetch(
        `${import.meta.env.VITE_API_BASE_URL ?? ''}/api/v1/users/photo-signature?folderName=attachments`,
        { headers: { Authorization: `Bearer ${accessToken}` }, credentials: 'include' },
      );
      const sig = await sigRes.json();
      const { signature, timestamp, cloudName, apiKey, folder } = sig.data ?? sig;

      const form = new FormData();
      form.append('file', file);
      form.append('api_key', apiKey);
      form.append('timestamp', timestamp);
      form.append('signature', signature);
      form.append('folder', folder);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        { method: 'POST', body: form },
      );
      const uploadData = await uploadRes.json();
      if (!uploadData.secure_url) throw new Error('Upload failed');
      onChange(field.name, uploadData.secure_url);
    } catch (err) {
      setUploadError('فشل رفع الملف. حاول مرة أخرى.');
      console.error('Attachment upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange(field.name, '');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <FieldWrapper field={field} error={error || uploadError} isReadOnly={isReadOnly}>
      {isReadOnly && value ? (
        <a href={value} target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-indigo-600 underline">
          <FiPaperclip size={13} /> View Attachment
        </a>
      ) : uploaded ? (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50">
          <FiPaperclip size={15} className="text-emerald-600 shrink-0" />
          <a href={value} target="_blank" rel="noreferrer"
            className="flex-1 text-[13px] font-semibold text-emerald-700 truncate underline">
            {value.split('/').pop()}
          </a>
          {!disabled && (
            <button type="button" onClick={handleRemove}
              className="shrink-0 text-slate-400 hover:text-rose-500 transition-colors"
              aria-label="Remove attachment">
              <FiX size={15} />
            </button>
          )}
        </div>
      ) : (
        <label className={`flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-xl border-2 border-dashed
          transition-all duration-200 text-center
          ${disabled || uploading ? 'opacity-60 cursor-not-allowed border-slate-200 bg-slate-50' : 'cursor-pointer border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50 hover:border-indigo-300'}
          ${error ? 'border-rose-300 bg-rose-50/30' : ''}`}>
          <input
            ref={inputRef}
            id={field.name}
            type="file"
            accept={field.accept ?? '*/*'}
            disabled={disabled || uploading || isReadOnly}
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="sr-only"
          />
          {uploading ? (
            <>
              <div className="w-6 h-6 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
              <span className="text-[13px] font-semibold text-indigo-600">جارٍ الرفع…</span>
            </>
          ) : (
            <>
              <FiUploadCloud size={22} className="text-indigo-400" />
              <span className="text-[13px] font-semibold text-indigo-700">اضغط لرفع الملف</span>
              <span className="text-[11px] text-slate-400">
                {field.accept ? `الأنواع المقبولة: ${field.accept}` : 'جميع أنواع الملفات مقبولة'}
              </span>
            </>
          )}
        </label>
      )}
    </FieldWrapper>
  );
};

// ─── Field dispatcher ────────────────────────────────────────────────────────

const FULL_WIDTH_TYPES = new Set(['textarea', 'checkbox', 'checkbox_group', 'file']);

const isFullWidth = (field) => FULL_WIDTH_TYPES.has(field.type);

// accessToken is threaded through so FileField can reach it
const renderField = (field, values, onChange, errors, disabled, readOnly, accessToken) => {
  const value = values[field.name];
  const error = errors?.[field.name];
  const isReadOnly = readOnly?.has(field.name) ?? false;
  const props = { field, value, onChange, error, disabled, isReadOnly };

  switch (field.type) {
    case 'textarea':       return <TextareaField      key={field.name} {...props} />;
    case 'select':         return <SelectField        key={field.name} {...props} />;
    case 'checkbox':       return <CheckboxField      key={field.name} {...props} />;
    case 'checkbox_group': return <CheckboxGroupField key={field.name} {...props} />;
    case 'file':           return <FileField          key={field.name} {...props} accessToken={accessToken} />;
    case 'text':
    case 'number':
    case 'date':
    default:               return <TextField          key={field.name} {...props} />;
  }
};

// ─── Section divider ─────────────────────────────────────────────────────────

const SectionDivider = ({ label }) => (
  <div className="col-span-2 flex items-center gap-3 py-1">
    <div className="flex-1 h-px bg-slate-200" />
    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
      {label}
    </span>
    <div className="flex-1 h-px bg-slate-200" />
  </div>
);

// ─── Grid renderer ────────────────────────────────────────────────────────────

const renderFieldsInGrid = (fields, values, onChange, errors, disabled, readOnly, accessToken) =>
  fields.map((field) => (
    <div
      key={field.name}
      className={isFullWidth(field) ? 'col-span-2' : 'col-span-2 sm:col-span-1'}
    >
      {renderField(field, values, onChange, errors, disabled, readOnly, accessToken)}
    </div>
  ));

// ─── Main component ──────────────────────────────────────────────────────────

const DynamicForm = ({
  fields = [],
  values = {},
  onChange,
  errors = {},
  disabled = false,
  readOnly = new Set(),
  accessToken,           // ← needed by FileField
}) => {
  if (!fields.length) {
    return (
      <p className="text-slate-400 text-sm text-center py-8">
        No fields defined for this request type.
      </p>
    );
  }

  const autoFields   = fields.filter((f) => readOnly.has(f.name));
  const manualFields = fields.filter((f) => !readOnly.has(f.name));
  const hasBoth      = autoFields.length > 0 && manualFields.length > 0;

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-5">
      {autoFields.length > 0 && (
        <>
          {hasBoth && <SectionDivider label="Auto-filled from your profile" />}
          {renderFieldsInGrid(autoFields, values, onChange, errors, disabled, readOnly, accessToken)}
        </>
      )}
      {manualFields.length > 0 && (
        <>
          {hasBoth && <SectionDivider label="Please fill in" />}
          {renderFieldsInGrid(manualFields, values, onChange, errors, disabled, readOnly, accessToken)}
        </>
      )}
    </div>
  );
};

export default DynamicForm;