import React from 'react';
import { FiArrowRight } from 'react-icons/fi';
import DashboardBadge from './DashboardBadge';
import DashboardCard from './DashboardCard';
import DashboardListItem from './DashboardListItem';

const summaryAccentStyles = {
  indigo: 'bg-indigo-50/80 text-indigo-900 ring-indigo-100/80',
  sky: 'bg-sky-50/80 text-sky-900 ring-sky-100/80',
  emerald: 'bg-emerald-50/80 text-emerald-900 ring-emerald-100/80',
  amber: 'bg-amber-50/80 text-amber-900 ring-amber-100/80',
  rose: 'bg-rose-50/80 text-rose-900 ring-rose-100/80',
};

const DashboardFinanceCard = ({
  title = 'Dues & Payment',
  subtitle,
  summary = [],
  items = [],
  actionLabel,
  onAction,
  className = '',
  headerClassName = '',
  ...props
}) => {
  return (
    <DashboardCard
      title={title}
      subtitle={subtitle}
      className={className}
      headerClassName={headerClassName}
      bodyClassName="space-y-5"
      {...props}
    >
      {summary.length > 0 ? (
        <div className={`grid gap-3 ${summary.length > 2 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
          {summary.map((entry) => {
            const summaryClassName = summaryAccentStyles[entry.accent] || summaryAccentStyles.indigo;

            return (
              <div key={entry.label} className={`rounded-2xl px-4 py-4 ring-1 ${summaryClassName}`}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] opacity-70">{entry.label}</p>
                <p className="mt-2 text-xl font-bold">{entry.value}</p>
                {entry.helperText ? <p className="mt-1 text-xs opacity-75">{entry.helperText}</p> : null}
              </div>
            );
          })}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-slate-100">
        {items.map((item, index) => (
          <DashboardListItem
            key={item.id || item.title || index}
            icon={item.icon}
            title={item.title}
            description={item.description}
            meta={item.meta}
            rightContent={
              <div className="flex items-center gap-3">
                {item.amount ? <span className="text-sm font-semibold text-[var(--brand-text)]">{item.amount}</span> : null}
                {item.badge ? <DashboardBadge tone={item.badgeTone || 'neutral'}>{item.badge}</DashboardBadge> : null}
              </div>
            }
          />
        ))}
      </div>

      {actionLabel ? (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(165,180,252,0.35)] bg-white px-5 py-3 text-sm font-semibold text-[var(--brand-text)] transition-colors hover:bg-indigo-50"
        >
          <span>{actionLabel}</span>
          <FiArrowRight />
        </button>
      ) : null}
    </DashboardCard>
  );
};

export default DashboardFinanceCard;