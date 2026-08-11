import React from 'react';

const DashboardCard = ({ title, subtitle, action, children, className = '', bodyClassName = '', headerClassName = '', titleClassName = '', showHeader = true, ...props }) => {
  return (
    <section
      className={`overflow-hidden rounded-[1.5rem] border border-[rgba(165,180,252,0.35)] bg-white shadow-[0_18px_50px_-28px_rgba(49,46,129,0.45)] ${className}`}
      {...props}
    >
      {showHeader && (title || subtitle || action) ? (
        <div className={`flex items-start justify-between gap-4 border-b border-[rgba(165,180,252,0.18)] px-5 py-4 ${headerClassName}`}>
          <div>
            {title ? <h3 className={`text-lg font-semibold text-[var(--brand-text)] ${titleClassName}`}>{title}</h3> : null}
            {subtitle ? <p className="mt-1 text-sm text-[var(--brand-muted)]">{subtitle}</p> : null}
          </div>

          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}

      <div className={`px-5 py-5 ${bodyClassName}`}>{children}</div>
    </section>
  );
};

export default DashboardCard;