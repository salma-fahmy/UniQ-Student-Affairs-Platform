import React from 'react';
import { getStatusStyle, formatStatusText, getStatusIcon } from '../../../Components/Records/recordHelpers';

const categoryStyles = {
  request: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
  complaint: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
};

const normalizeCategory = (category = '') => String(category).replace(/\s+/g, '').toLowerCase();

const formatCategoryLabel = (category = '') => {
  const value = String(category).trim();

  if (!value) {
    return 'Activity';
  }

  const normalizedValue = value
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

  return normalizedValue
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const RequestCard = ({ title, description, submittedAt, status, category }) => {
  const statusIcon = getStatusIcon(status, { size: 20, className: 'text-slate-800 shrink-0' });
  const tone = getStatusStyle(status);
  const statusLabel = formatStatusText(status);
  const categoryToneKey = normalizeCategory(category);
  const categoryTone = categoryStyles[categoryToneKey] || 'bg-slate-100 text-slate-700 ring-slate-200';
  const categoryLabel = formatCategoryLabel(category);

  return (
    <article className="flex items-start justify-between gap-3 sm:gap-4 bg-white px-5 sm:px-6 py-5 transition-colors hover:bg-slate-50/50">
      
      <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
        <div className="mt-0.5 shrink-0">
          {statusIcon}
        </div>

        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[0.95rem] sm:text-[1.05rem] font-bold text-indigo-900 leading-snug break-words">
              {title}
            </h3>
            <span className={`inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-[0.7rem] font-semibold ring-1 ring-inset ${categoryTone}`}>
              {categoryLabel}
            </span>
          </div>
          
          {description && (
            <p className="text-[0.85rem] sm:text-[0.9rem] font-medium text-slate-600 line-clamp-2">
              {description}
            </p>
          )}
          
          {submittedAt && (
            <p className="text-[0.75rem] sm:text-[0.8rem] font-medium text-slate-500">
              Submitted on {submittedAt}
            </p>
          )}
        </div>
      </div>

      <div className="shrink-0 ml-2 mt-0.5">
        <span className={`inline-flex items-center justify-center rounded-full px-4 py-1.5 text-[0.7rem] sm:text-xs font-bold whitespace-nowrap ring-1 ring-inset ${tone}`}>
          {statusLabel}
        </span>
      </div>

    </article>
  );
};

export default RequestCard;