// src/Components/Shared/StatsCard.jsx
import React from 'react';

const variantStyles = {
  default:  { border: 'border-slate-200',  icon: 'bg-slate-100 text-slate-500',   value: 'text-slate-800' },
  blue:     { border: 'border-blue-100',   icon: 'bg-blue-50 text-blue-500',      value: 'text-blue-700'  },
  green:    { border: 'border-emerald-100',icon: 'bg-emerald-50 text-emerald-500',value: 'text-emerald-700'},
  red:      { border: 'border-red-100',    icon: 'bg-red-50 text-red-500',        value: 'text-red-700'   },
  amber:    { border: 'border-amber-100',  icon: 'bg-amber-50 text-amber-500',    value: 'text-amber-700' },
  indigo:   { border: 'border-indigo-100', icon: 'bg-indigo-50 text-indigo-500',  value: 'text-indigo-700'},
};

/**
 * StatsCard
 * @param {string}  label    – card label (e.g. "Total Requests")
 * @param {number|string} value – numeric value to display
 * @param {React.ReactNode} icon – icon element
 * @param {'default'|'blue'|'green'|'red'|'amber'|'indigo'} variant
 * @param {boolean} loading  – show skeleton state
 */
const StatsCard = ({ label, value, icon, variant = 'default', loading = false }) => {
  const styles = variantStyles[variant] ?? variantStyles.default;

  return (
    <div
      className={`
        relative flex items-center gap-4 rounded-2xl border bg-white p-5
        shadow-sm transition-shadow hover:shadow-md
        ${styles.border}
      `}
    >
      {/* Icon */}
      <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-xl ${styles.icon}`}>
        {icon}
      </div>

      {/* Text */}
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold uppercase tracking-widest text-slate-400">
          {label}
        </p>

        {loading ? (
          <div className="mt-1.5 h-7 w-16 animate-pulse rounded-lg bg-slate-100" />
        ) : (
          <p className={`mt-0.5 text-2xl font-bold leading-none ${styles.value}`}>
            {value ?? '—'}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;