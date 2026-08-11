import React from 'react';
import DashboardCard from './DashboardCard';

const accentStyles = {
  indigo: 'bg-indigo-50 text-indigo-700',
  sky: 'bg-sky-50 text-sky-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  rose: 'bg-rose-50 text-rose-700',
};

const DashboardMetricCard = ({
  title,
  label,
  value,
  count,
  helperText,
  icon,
  accent = 'indigo',
  className = '',
  bodyClassName = '',
  headerClassName = '',
  valueClassName = '',
  ...props
}) => {
  const resolvedTitle = title ?? label ?? 'Metric';
  const resolvedValue = value ?? count ?? '-';
  const accentClassName = accentStyles[accent] || accentStyles.indigo;

  return (
    <DashboardCard
      title={resolvedTitle}
      action={
        icon ? (
          <div className={`grid h-11 w-11 place-items-center rounded-2xl ${accentClassName}`}>
            {icon}
          </div>
        ) : null
      }
      className={`transition-transform duration-300 hover:-translate-y-0.5 ${className}`}
      bodyClassName={`pt-2 ${bodyClassName}`.trim()}
      headerClassName={headerClassName}
      {...props}
    >
      <p className={`text-2xl font-bold text-indigo-900 ${valueClassName}`.trim()}>{resolvedValue}</p>
      {helperText ? <p className="mt-1 text-xs text-[var(--brand-muted)]">{helperText}</p> : null}
    </DashboardCard>
  );
};

export default DashboardMetricCard;