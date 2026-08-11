// src/features/affairs/components/RecordActionModal.jsx
//
// A reusable, accessible modal that renders a dynamic form based on the
// action type (approve / reject / resubmit / resolve).
// It keeps its own local state and calls an onConfirm(fields) callback.
// No existing logic is touched; this is purely additive.

import React, { useEffect, useRef, useState } from 'react';
import { FiAlertCircle, FiCheck, FiLoader, FiX } from 'react-icons/fi';

// ─── action config ─────────────────────────────────────────────────────────────
// Defines label, colours, icon, and the fields each action needs.
// `fields` is an array of { name, label, placeholder, required, maxLength, minLength }
const ACTION_CONFIG = {
  approve: {
    title: 'Approve Request',
    description: 'Confirm that you want to approve this request. This action will notify the student.',
    confirmLabel: 'Approve',
    colorClass: {
      header:  'bg-emerald-50 border-emerald-100',
      icon:    'bg-emerald-100 text-emerald-600',
      button:  'bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500',
      title:   'text-emerald-800',
    },
    fields: [], // no extra input needed
  },
  reject: {
    title: 'Reject Request',
    description: 'Provide a clear reason so the student understands why their request was rejected.',
    confirmLabel: 'Reject',
    colorClass: {
      header:  'bg-rose-50 border-rose-100',
      icon:    'bg-rose-100 text-rose-600',
      button:  'bg-rose-600 hover:bg-rose-700 focus-visible:ring-rose-500',
      title:   'text-rose-800',
    },
    fields: [
      {
        name: 'comment',
        label: 'Rejection Reason',
        placeholder: 'e.g. Insufficient GPA for this program.',
        required: true,
        minLength: 10,
        maxLength: 500,
        type: 'textarea',
      },
    ],
  },
  resubmit: {
    title: 'Request Resubmission',
    description: 'Ask the student to fix or re-upload specific information.',
    confirmLabel: 'Send to Student',
    colorClass: {
      header:  'bg-blue-50 border-blue-100',
      icon:    'bg-blue-100 text-blue-600',
      button:  'bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500',
      title:   'text-blue-800',
    },
    fields: [
      {
        name: 'comment',
        label: 'Resubmission Instructions',
        placeholder: 'e.g. Please re-upload the birth certificate with clearer image quality.',
        required: true,
        minLength: 10,
        maxLength: 500,
        type: 'textarea',
      },
    ],
  },
  resolve: {
    title: 'Resolve Complaint',
    description: 'Provide resolution details that will be visible to the student.',
    confirmLabel: 'Mark as Resolved',
    colorClass: {
      header:  'bg-emerald-50 border-emerald-100',
      icon:    'bg-emerald-100 text-emerald-600',
      button:  'bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500',
      title:   'text-emerald-800',
    },
    fields: [
      {
        name: 'resolutionText',
        label: 'Resolution Details',
        placeholder: 'Describe how this complaint was resolved…',
        required: true,
        minLength: 10,
        maxLength: 500,
        type: 'textarea',
      },
    ],
  },
  reject_complaint: {
    title: 'Reject Complaint',
    description: 'Provide a reason so the student understands why their complaint was rejected.',
    confirmLabel: 'Reject Complaint',
    colorClass: {
      header:  'bg-rose-50 border-rose-100',
      icon:    'bg-rose-100 text-rose-600',
      button:  'bg-rose-600 hover:bg-rose-700 focus-visible:ring-rose-500',
      title:   'text-rose-800',
    },
    fields: [
      {
        name: 'resolutionText',
        label: 'Rejection Reason',
        placeholder: 'e.g. This matter falls outside the scope of student affairs.',
        required: true,
        minLength: 10,
        maxLength: 500,
        type: 'textarea',
      },
    ],
  },
};

// ─── component ─────────────────────────────────────────────────────────────────
/**
 * @param {object}   props
 * @param {boolean}  props.isOpen       – controls visibility
 * @param {string}   props.actionType   – 'approve' | 'reject' | 'resubmit' | 'resolve' | 'reject_complaint'
 * @param {boolean}  props.isSubmitting – shows spinner, disables buttons
 * @param {string}   [props.error]      – server-side error message to display
 * @param {function} props.onConfirm    – called with field values object on submit
 * @param {function} props.onClose      – called when user cancels / closes
 */
const RecordActionModal = ({
  isOpen,
  actionType,
  isSubmitting = false,
  error = '',
  onConfirm,
  onClose,
}) => {
  const config = ACTION_CONFIG[actionType] ?? ACTION_CONFIG.approve;
  const firstFieldRef = useRef(null);
  const overlayRef    = useRef(null);

  // local field state: { fieldName: value }
  const [fieldValues, setFieldValues] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  // Reset form whenever modal opens with a fresh action
  useEffect(() => {
    if (isOpen) {
      const initial = {};
      config.fields.forEach((f) => { initial[f.name] = ''; });
      setFieldValues(initial);
      setValidationErrors({});
      // Focus first interactive element after paint
      setTimeout(() => firstFieldRef.current?.focus(), 50);
    }
  }, [isOpen, actionType]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape' && !isSubmitting) onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  // ── validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const errors = {};
    config.fields.forEach((f) => {
      const val = String(fieldValues[f.name] ?? '').trim();
      if (f.required && !val) {
        errors[f.name] = `${f.label} is required.`;
      } else if (f.minLength && val.length < f.minLength) {
        errors[f.name] = `Must be at least ${f.minLength} characters.`;
      } else if (f.maxLength && val.length > f.maxLength) {
        errors[f.name] = `Cannot exceed ${f.maxLength} characters.`;
      }
    });
    return errors;
  };

  const handleSubmit = () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    // Trim all values before handing off
    const trimmed = {};
    Object.entries(fieldValues).forEach(([k, v]) => { trimmed[k] = String(v).trim(); });
    onConfirm(trimmed);
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current && !isSubmitting) onClose();
  };

  const { colorClass } = config;

  return (
    // ── Overlay ──────────────────────────────────────────────────────────────
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(3px)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* ── Dialog ─────────────────────────────────────────────────────────── */}
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        style={{ animation: 'modalSlideIn 0.18s ease-out both' }}
      >
        {/* Header */}
        <div className={`border-b px-6 py-5 ${colorClass.header}`}>
          <div className="flex items-start gap-4">
            <div className={`shrink-0 rounded-xl p-2.5 ${colorClass.icon}`}>
              {actionType === 'approve' || actionType === 'resolve' ? (
                <FiCheck size={20} />
              ) : (
                <FiX size={20} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 id="modal-title" className={`text-[17px] font-bold ${colorClass.title}`}>
                {config.title}
              </h2>
              <p className="mt-0.5 text-[13px] text-slate-500 leading-relaxed">
                {config.description}
              </p>
            </div>
            {!isSubmitting && (
              <button
                onClick={onClose}
                className="shrink-0 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close modal"
              >
                <FiX size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Server error */}
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
              <FiAlertCircle size={16} className="mt-0.5 shrink-0 text-rose-500" />
              <p className="text-[13px] font-medium text-rose-700">{error}</p>
            </div>
          )}

          {/* Dynamic fields */}
          {config.fields.length === 0 ? (
            <p className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-4 text-[14px] font-medium text-slate-600">
              This action requires no additional information. Click confirm to proceed.
            </p>
          ) : (
            config.fields.map((field, idx) => (
              <div key={field.name} className="flex flex-col gap-1.5">
                <label
                  htmlFor={`modal-field-${field.name}`}
                  className="text-[13px] font-semibold text-slate-700"
                >
                  {field.label}
                  {field.required && <span className="ml-1 text-rose-500">*</span>}
                </label>

                {field.type === 'textarea' ? (
                  <textarea
                    id={`modal-field-${field.name}`}
                    ref={idx === 0 ? firstFieldRef : undefined}
                    rows={4}
                    maxLength={field.maxLength}
                    placeholder={field.placeholder}
                    value={fieldValues[field.name] ?? ''}
                    disabled={isSubmitting}
                    onChange={(e) => {
                      setFieldValues((prev) => ({ ...prev, [field.name]: e.target.value }));
                      if (validationErrors[field.name]) {
                        setValidationErrors((prev) => { const next = { ...prev }; delete next[field.name]; return next; });
                      }
                    }}
                    className={`
                      w-full resize-none rounded-xl border px-4 py-3 text-[14px] font-medium text-slate-800
                      placeholder-slate-400 outline-none transition-all
                      focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100
                      disabled:cursor-not-allowed disabled:opacity-60
                      ${validationErrors[field.name]
                        ? 'border-rose-300 bg-rose-50/50 focus:border-rose-400 focus:ring-rose-100'
                        : 'border-slate-200 bg-slate-50/60'}
                    `}
                  />
                ) : (
                  <input
                    id={`modal-field-${field.name}`}
                    ref={idx === 0 ? firstFieldRef : undefined}
                    type={field.type ?? 'text'}
                    maxLength={field.maxLength}
                    placeholder={field.placeholder}
                    value={fieldValues[field.name] ?? ''}
                    disabled={isSubmitting}
                    onChange={(e) => {
                      setFieldValues((prev) => ({ ...prev, [field.name]: e.target.value }));
                      if (validationErrors[field.name]) {
                        setValidationErrors((prev) => { const next = { ...prev }; delete next[field.name]; return next; });
                      }
                    }}
                    className={`
                      w-full rounded-xl border px-4 py-3 text-[14px] font-medium text-slate-800
                      placeholder-slate-400 outline-none transition-all
                      focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100
                      disabled:cursor-not-allowed disabled:opacity-60
                      ${validationErrors[field.name]
                        ? 'border-rose-300 bg-rose-50/50'
                        : 'border-slate-200 bg-slate-50/60'}
                    `}
                  />
                )}

                {/* Character count + validation error row */}
                <div className="flex items-center justify-between px-1">
                  {validationErrors[field.name] ? (
                    <p className="text-[12px] font-medium text-rose-500">
                      {validationErrors[field.name]}
                    </p>
                  ) : (
                    <span />
                  )}
                  {field.maxLength && (
                    <span className="text-[11px] text-slate-400">
                      {(fieldValues[field.name] ?? '').length} / {field.maxLength}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-[13.5px] font-semibold text-slate-700
              transition-all hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`
              flex min-w-[110px] items-center justify-center gap-2 rounded-xl px-5 py-2.5
              text-[13.5px] font-bold text-white shadow-sm transition-all
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1
              disabled:cursor-not-allowed disabled:opacity-60
              ${colorClass.button}
            `}
          >
            {isSubmitting ? (
              <>
                <FiLoader size={14} className="animate-spin" />
                Processing…
              </>
            ) : (
              config.confirmLabel
            )}
          </button>
        </div>
      </div>

      {/* Keyframe animation injected once */}
      <style>{`
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(-12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)      scale(1);    }
        }
      `}</style>
    </div>
  );
};

export default RecordActionModal;