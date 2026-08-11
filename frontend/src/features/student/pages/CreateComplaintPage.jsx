import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowLeft, FiSend, FiAlertCircle, FiCheckCircle,
  FiMessageSquare,
} from 'react-icons/fi';
import useAuth from '../../auth/useAuth';
import { submitComplaint } from '../complaintService';

// ─── Constants ───────────────────────────────────────────────────────────────

const COMPLAINT_TYPES = [
  { value: 'academic',       label: 'Academic — أكاديمي' },
  { value: 'financial',      label: 'Financial — مالي' },
  { value: 'administrative', label: 'Administrative — إداري' },
  { value: 'doctor_complaint', label: 'Confidential Complaint — شكوى خاصة' },
];

const PRIORITIES = [
  { value: 'low',    label: 'Low — منخفض',    color: 'text-emerald-700 bg-emerald-50 ring-emerald-100' },
  { value: 'medium', label: 'Medium — متوسط',  color: 'text-amber-700 bg-amber-50 ring-amber-100' },
  { value: 'high',   label: 'High — عالي',     color: 'text-rose-700 bg-rose-50 ring-rose-100' },
];

const INITIAL_STATE = {
  complaintType: '',
  complaintText: '',
  priority: 'low', // hardcoded default — not shown to user
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const validate = (values) => {
  const errors = {};
  if (!values.complaintType) errors.complaintType = 'Please select a complaint type';
  if (!values.complaintText || values.complaintText.trim().length < 10)
    errors.complaintText = 'Please describe your complaint (at least 10 characters)';
  return errors;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const FieldLabel = ({ htmlFor, label, required }) => (
  <label htmlFor={htmlFor} className="text-[13px] font-bold text-slate-600 flex items-center gap-1">
    {label}
    {required && <span className="text-rose-500 text-[14px] leading-none">*</span>}
  </label>
);

const FieldError = ({ message }) =>
  message ? (
    <p className="text-[12px] font-semibold text-rose-500 flex items-center gap-1 mt-1">
      <FiAlertCircle size={12} className="shrink-0" />
      {message}
    </p>
  ) : null;

const inputBase =
  'w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[14px] font-medium text-slate-800 ' +
  'placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 ' +
  'transition-all duration-200 disabled:bg-slate-50 disabled:cursor-not-allowed appearance-none';

const errorBorder = 'border-rose-300 focus:ring-rose-200 focus:border-rose-400';

// ─── Priority selector (visual cards) ────────────────────────────────────────

const PrioritySelector = ({ value, onChange, error, disabled }) => (
  <div className="flex flex-col gap-1.5">
    <FieldLabel label="Priority — الأولوية" required />
    <div className="grid grid-cols-3 gap-3">
      {PRIORITIES.map((p) => (
        <button
          key={p.value}
          type="button"
          disabled={disabled}
          onClick={() => onChange('priority', p.value)}
          className={`flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-xl border-2
            text-[13px] font-bold transition-all duration-200 active:scale-95
            ${value === p.value
              ? `${p.color} ring-1 ring-inset border-current shadow-sm`
              : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50'}
            ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span className="text-[18px]">
            {p.value === 'low' ? '🟢' : p.value === 'medium' ? '🟡' : '🔴'}
          </span>
          <span>{p.value === 'low' ? 'Low' : p.value === 'medium' ? 'Medium' : 'High'}</span>
        </button>
      ))}
    </div>
    <FieldError message={error} />
  </div>
);

// ─── Confirm Modal ────────────────────────────────────────────────────────────

const ConfirmModal = ({ values, onConfirm, onCancel, submitting }) => {
  const typeLabel = COMPLAINT_TYPES.find((t) => t.value === values.complaintType)?.label ?? values.complaintType;
  const priorityInfo = PRIORITIES.find((p) => p.value === values.priority);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div
        style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.3)', backdropFilter: 'blur(2px)' }}
        onClick={!submitting ? onCancel : undefined}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 flex flex-col gap-5 z-10">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center">
            <FiMessageSquare size={24} className="text-indigo-700 stroke-[2px]" />
          </div>
          <h2 className="font-['Manrope'] text-[20px] font-bold text-indigo-950">Confirm Complaint</h2>
          <p className="text-[14px] text-slate-500 font-medium">
            Please review your complaint before submitting.
          </p>
        </div>

        {/* Summary */}
        <div className="bg-slate-50 rounded-2xl p-4 flex flex-col gap-3 border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Type</span>
            <span className="text-[13px] font-bold text-slate-700">{values.complaintType}</span>
          </div>
          <div className="border-t border-slate-100 pt-3">
            <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Description</span>
            <p className="text-[13px] text-slate-600 font-medium leading-relaxed line-clamp-4">
              {values.complaintText}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="flex-1 py-2.5 rounded-full border border-slate-200 text-[14px] font-semibold
                       text-slate-600 hover:bg-slate-50 transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting}
            className="flex-1 py-2.5 rounded-full bg-indigo-900 text-white text-[14px] font-semibold
                       hover:bg-indigo-800 shadow-md shadow-indigo-900/20 transition-all duration-200
                       active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Submitting…
              </>
            ) : 'Submit Complaint'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Success Banner ───────────────────────────────────────────────────────────

const SuccessBanner = ({ complaintNumber }) => (
  <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
    <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center shadow-sm">
      <FiCheckCircle size={40} className="text-emerald-500 stroke-[1.5px]" />
    </div>
    <div>
      <h3 className="font-['Manrope'] text-[22px] font-bold text-indigo-950">Complaint Submitted!</h3>
      {complaintNumber && (
        <p className="text-[14px] font-mono text-slate-500 mt-1">{complaintNumber}</p>
      )}
      <p className="text-[14px] text-slate-500 mt-2 font-medium">
        Redirecting you to your complaints…
      </p>
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const CreateComplaintPage = () => {
  const navigate = useNavigate();
  const { accessToken, userId } = useAuth();

  const [values, setValues]           = useState(INITIAL_STATE);
  const [errors, setErrors]           = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess]         = useState(null);

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => { const e = { ...prev }; delete e[name]; return e; });
  };

  const handleSubmitClick = () => {
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setShowConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    setSubmitting(true);
    setSubmitError('');
    try {
      const result = await submitComplaint(accessToken, {
        studentId: userId,
        complaintType: values.complaintType,
        complaintText: values.complaintText,
        priority: values.priority,
      });
      setSuccess({ complaintNumber: result?.complaint_number ?? '' });
      setShowConfirm(false);
      setTimeout(() => navigate('/dashboard/student/complaints'), 2000);
    } catch (err) {
      setSubmitError(err?.response?.data?.message ?? 'Submission failed. Please try again.');
      setShowConfirm(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 md:bg-slate-50 md:shadow-sm md:rounded-[32px] md:border border-slate-200
                    p-4 md:p-8 min-h-full flex flex-col pt-6 md:pt-8">

      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-white
                       text-slate-500 shadow-sm border border-slate-200
                       hover:bg-slate-100 hover:text-indigo-900 transition-all duration-300 shrink-0"
          >
            <FiArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="font-['Manrope'] text-2xl md:text-[28px] font-bold text-indigo-950 tracking-tight leading-tight">
              New Complaint
            </h1>
            <p className="text-slate-500 mt-0.5 text-[14px] font-medium">
              Describe your issue and we'll look into it
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      {success ? (
        <SuccessBanner complaintNumber={success.complaintNumber} />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 flex flex-col gap-6">

          {/* Complaint Type */}
          <div className="flex flex-col gap-1.5">
            <FieldLabel htmlFor="complaintType" label="Complaint Type — نوع الشكوى" required />
            <div className="relative">
              <select
                id="complaintType"
                value={values.complaintType}
                onChange={(e) => handleChange('complaintType', e.target.value)}
                disabled={submitting}
                className={`${inputBase} pr-10 cursor-pointer
                  ${!values.complaintType ? 'text-slate-400' : ''}
                  ${errors.complaintType ? errorBorder : ''}`}
              >
                <option value="" disabled>— Select type —</option>
                {COMPLAINT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </div>
            <FieldError message={errors.complaintType} />
          </div>

          {/* Complaint Text */}
          <div className="flex flex-col gap-1.5">
            <FieldLabel htmlFor="complaintText" label="Description — وصف المشكلة" required />
            <textarea
              id="complaintText"
              value={values.complaintText}
              onChange={(e) => handleChange('complaintText', e.target.value)}
              placeholder="Describe your complaint in detail…"
              disabled={submitting}
              rows={6}
              dir="auto"
              className={`${inputBase} resize-none ${errors.complaintText ? errorBorder : ''}`}
            />
            <div className="flex items-center justify-between">
              <FieldError message={errors.complaintText} />
              <span className={`text-[12px] font-semibold ml-auto
                ${values.complaintText.length < 10 ? 'text-slate-300' : 'text-slate-400'}`}>
                {values.complaintText.length} chars
              </span>
            </div>
          </div>

          {/* Submit error */}
          {submitError && (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-100
                            text-rose-600 text-[13px] font-semibold p-4 rounded-xl">
              <FiAlertCircle size={16} className="shrink-0" />
              {submitError}
            </div>
          )}

          {/* Submit button */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSubmitClick}
              disabled={submitting}
              className="group flex items-center gap-2 rounded-full px-8 py-3
                         bg-indigo-900 text-white text-[14px] font-semibold
                         shadow-[0_10px_20px_-10px_rgba(49,46,129,0.5)]
                         hover:bg-indigo-800 hover:shadow-[0_15px_25px_-10px_rgba(49,46,129,0.7)]
                         transition-all duration-300 active:scale-95
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FiSend size={16} className="stroke-[2px] group-hover:translate-x-0.5 transition-transform" />
              Submit Complaint
            </button>
          </div>
        </div>
      )}

      {/* Confirm modal */}
      {showConfirm && (
        <ConfirmModal
          values={values}
          onConfirm={handleConfirmSubmit}
          onCancel={() => setShowConfirm(false)}
          submitting={submitting}
        />
      )}
    </div>
  );
};

export default CreateComplaintPage;