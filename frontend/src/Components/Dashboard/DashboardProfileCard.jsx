import React from 'react';
import { FiArrowRight } from 'react-icons/fi';
import DashboardBadge from './DashboardBadge';
import DashboardCard from './DashboardCard';

const getInitials = (name = '') => {
  const cleanedName = name.trim();

  if (!cleanedName) {
    return 'U';
  }

  return cleanedName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
};

const DashboardProfileCard = ({
  title = 'Profile Preview',
  avatar,
  name,
  subtitle,
  details = [],
  actionLabel,
  onAction,
  className = '',
  headerClassName = '',
  ...props
}) => {
  const displayName = name || 'Student';

  return (
    <DashboardCard
      title={title}
      className={className}
      headerClassName={headerClassName}
      bodyClassName="space-y-5"
      {...props}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-200 via-indigo-400 to-indigo-600 text-lg font-bold text-white shadow-[0_12px_28px_-14px_rgba(49,46,129,0.75)]">
          {avatar ? <img src={avatar} alt={displayName} className="h-full w-full object-cover" /> : getInitials(displayName)}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-[var(--brand-text)]">{displayName}</h3>
          {subtitle ? <p className="text-sm text-[var(--brand-muted)]">{subtitle}</p> : null}
        </div>
      </div>

      <div className="space-y-3">
        {details.map((entry) => (
          <div key={entry.label} className="flex items-center gap-3 rounded-2xl bg-slate-50/80 px-4 py-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-indigo-700 shadow-sm">{entry.icon}</span>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">{entry.label}</p>
              <p className="mt-0.5 text-sm font-semibold text-[var(--brand-text)]">{entry.value}</p>
            </div>

            {entry.badge ? <DashboardBadge tone={entry.badgeTone || 'neutral'}>{entry.badge}</DashboardBadge> : null}
          </div>
        ))}
      </div>

      {actionLabel ? (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand-primary)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_38px_-20px_rgba(49,46,129,0.7)] transition-all hover:bg-[var(--brand-primary-hover)]"
        >
          <span>{actionLabel}</span>
          <FiArrowRight />
        </button>
      ) : null}
    </DashboardCard>
  );
};

export default DashboardProfileCard;