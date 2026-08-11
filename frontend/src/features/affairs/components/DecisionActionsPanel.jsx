import React from 'react';
import { FiCheck, FiEdit2, FiX, FiCheckCircle } from 'react-icons/fi';

// ─── helpers ───────────────────────────────────────────────────────────────────
const TERMINAL_STATUSES = ['accepted', 'approved', 'rejected', 'denied', 'resolved'];

const isTerminal = (status) =>
  TERMINAL_STATUSES.includes(String(status ?? '').toLowerCase().trim());

// ─── button atoms ──────────────────────────────────────────────────────────────
const ActionButton = ({ icon: Icon, label, onClick, variant = 'default', disabled = false }) => {
  const styles = {
    approve: `
      bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700
      text-white border-transparent shadow-sm shadow-emerald-200
    `,
    reject: `
      bg-rose-100 hover:bg-rose-200 active:bg-rose-300
      text-rose-700 border-rose-200
    `,
    resubmit: `
      bg-white hover:bg-slate-50 active:bg-slate-100
      text-indigo-600 border-indigo-200 hover:border-indigo-300
    `,
    resolve: `
      bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700
      text-white border-transparent shadow-sm shadow-emerald-200
    `,
    default: `
      bg-white hover:bg-slate-50 text-slate-700 border-slate-200
    `,
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex w-full items-center justify-center gap-2.5 rounded-2xl border px-4 py-3.5
        text-[14.5px] font-bold tracking-[0.01em] transition-all duration-150
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-1
        disabled:cursor-not-allowed disabled:opacity-40
        ${styles[variant] ?? styles.default}
      `}
    >
      <Icon size={17} strokeWidth={2.5} />
      {label}
    </button>
  );
};

// ─── main component ────────────────────────────────────────────────────────────
/**
 * @param {object}   props
 * @param {'request'|'complaint'} props.recordKind
 * @param {string}   props.currentStatus   – raw status string from API
 * @param {string}   props.userRole        – from useAuth()
 * @param {boolean}  props.isSubmitting    – disables all buttons during API call
 * @param {function} props.onAction        – (actionType: string) => void
 *   actionType values: 'approve' | 'reject' | 'resubmit' | 'resolve' | 'reject_complaint'
 */
const DecisionActionsPanel = ({
  recordKind = 'request',
  currentStatus = 'pending',
  userRole = '',
  isSubmitting = false,
  onAction,
}) => {
  const isRequest   = recordKind === 'request';
  const isComplaint = recordKind === 'complaint';
  const status      = String(currentStatus ?? '').toLowerCase().trim();
  const terminal    = isTerminal(status);

  // Academic staff can only approve/reject — no resubmit for complaints
  const isAcademic  = userRole === 'academic_staff';

  // ── Nothing to show once settled ─────────────────────────────────────────
  if (terminal) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="mb-3 text-[16px] font-bold text-indigo-950">Decision Actions</h3>
        <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 py-5 text-center">
          <FiCheckCircle size={22} className="text-slate-300" />
          <p className="text-[13px] font-semibold text-slate-400">
            This {isComplaint ? 'complaint' : 'request'} has already been{' '}
            {status === 'accepted' ? 'approved' : status === 'resolved' ? 'resolved' : status}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-[16px] font-bold text-indigo-950">Decision Actions</h3>

      <div className="flex flex-col gap-3">
        {/* ── REQUEST actions ──────────────────────────────────────────────── */}
        {isRequest && (
          <>
            <ActionButton
              icon={FiCheck}
              label="Approve Request"
              variant="approve"
              disabled={isSubmitting}
              onClick={() => onAction('approve')}
            />
            {/* {!isAcademic && (
              <ActionButton
                icon={FiEdit2}
                label="Resubmit Document"
                variant="resubmit"
                disabled={isSubmitting}
                onClick={() => onAction('resubmit')}
              />
            )} */}
            <ActionButton
              icon={FiX}
              label="Reject Request"
              variant="reject"
              disabled={isSubmitting}
              onClick={() => onAction('reject')}
            />
          </>
        )}

        {/* ── COMPLAINT actions ─────────────────────────────────────────────── */}
        {isComplaint && (
          <>
            <ActionButton
              icon={FiCheck}
              label="Mark as Resolved"
              variant="resolve"
              disabled={isSubmitting}
              onClick={() => onAction('resolve')}
            />
            <ActionButton
              icon={FiX}
              label="Reject Complaint"
              variant="reject"
              disabled={isSubmitting}
              onClick={() => onAction('reject_complaint')}
            />
          </>
        )}
      </div>

      {isSubmitting && (
        <p className="mt-3 text-center text-[12px] font-medium text-slate-400 animate-pulse">
          Processing action…
        </p>
      )}
    </div>
  );
};

export default DecisionActionsPanel;