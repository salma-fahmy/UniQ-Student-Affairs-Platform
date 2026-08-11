import React from 'react';
import {
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiInfo,
  FiRefreshCw,
} from 'react-icons/fi';

export const getStatusStyle = (status) => {
  const normalizedStatus = String(status || '')
    .toLowerCase()
    .replace(/[\s_-]+/g, '');

  switch (normalizedStatus) {

    // ─────────────────────────────
    // SUCCESS
    // ─────────────────────────────
    case 'approved':
    case 'accepted':
    case 'resolved':
    case 'completed':
    case 'done':
      return 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100';

    // ─────────────────────────────
    // REVIEW / INFORMATION
    // ─────────────────────────────
    case 'open':
    case 'review':
    case 'underreview':
    case 'inreview':
    case 'investigating':
      return 'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-100';

    // ─────────────────────────────
    // PENDING
    // ─────────────────────────────
    case 'pending':
    case 'pendingdoctorapproval':
    case 'pending_doctor_approval':
      return 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-100';

    // ─────────────────────────────
    // PROCESSING
    // ─────────────────────────────
    case 'processing':
    case 'inprogress':
      return 'bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-100';

    // ─────────────────────────────
    // RESUBMIT
    // ─────────────────────────────
    case 'resubmit':
      return 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-100';

    // ─────────────────────────────
    // REJECTED
    // ─────────────────────────────
    case 'rejected':
    case 'canceled':
    case 'declined':
      return 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-100';

    // ─────────────────────────────
    // CLOSED
    // ─────────────────────────────
    case 'closed':
      return 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200';

    default:
      return 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200';
  }
};

export const getStatusIcon = (status, iconProps = {}) => {
  const normalizedStatus = String(status || '')
    .toLowerCase()
    .replace(/[\s_-]+/g, '');

  switch (normalizedStatus) {

    case 'approved':
    case 'resolved':
    case 'completed':
    case 'done':
      return React.createElement(FiCheckCircle, iconProps);

    case 'pending':
    case 'pendingdoctorapproval':
    case 'pending_doctor_approval':
    case 'processing':
    case 'inprogress':
      return React.createElement(FiClock, iconProps);

    case 'resubmit':
      return React.createElement(FiRefreshCw, iconProps);

    case 'open':
    case 'review':
    case 'underreview':
    case 'inreview':
    case 'investigating':
    case 'closed':
      return React.createElement(FiInfo, iconProps);

    case 'rejected':
    case 'canceled':
    case 'declined':
      return React.createElement(FiXCircle, iconProps);

    default:
      return React.createElement(FiInfo, iconProps);
  }
};

export const formatStatusText = (status) => {
  if (!status) return 'Pending';

  const normalizedText = String(status)
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

  if (!normalizedText) return 'Pending';

  return normalizedText
    .split(' ')
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(' ');
};