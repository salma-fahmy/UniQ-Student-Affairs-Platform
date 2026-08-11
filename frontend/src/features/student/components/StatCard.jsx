import React from 'react';
import DashboardCard from '../../../Components/Dashboard/DashboardCard';

const accentStyles = {
  indigo: 'bg-indigo-50 text-indigo-700',
  sky: 'bg-sky-50 text-sky-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  rose: 'bg-rose-50 text-rose-700',
};

const StatCard = ({
  title,
  titleClassName = '',
  value,
  icon,
  accent = 'indigo',
  className = '',
}) => {
  const accentClassName = accentStyles[accent] || accentStyles.indigo;

  return (
    <DashboardCard
      showHeader={false}
      className={`transition-transform duration-300 hover:-translate-y-0.5 ${className}`.trim()}
      bodyClassName="!px-4 !py-4"
    >
      <div className="flex h-full items-center justify-between">
        <div>
          <p className={`text-sm font-semibold text-[var(--brand-text)] ${titleClassName}`.trim()}>{title}</p>
          <p className="mt-1 text-2xl font-bold text-indigo-900">{value}</p>
        </div>

        {icon ? <div className={`grid h-11 w-11 place-items-center rounded-2xl ${accentClassName}`}>{icon}</div> : null}
      </div>
    </DashboardCard>
  );
};

export default StatCard;