import React from 'react';

const itemsStyle = 'rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3';

const AcademicStats = ({ level, gpa, status }) => {
  const stats = [
    { label: 'Level', value: level || '-' },
    { label: 'GPA', value: gpa || '-' },
    { label: 'Status', value: status || '-' },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {stats.map((item) => (
        <div key={item.label} className={itemsStyle}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
          <p className="mt-1 text-sm font-semibold text-[var(--brand-text)]">{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default AcademicStats;