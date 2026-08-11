import React from 'react';

const RoleDashboard = ({ title, description }) => {
  return (
    <section className="rounded-[2rem] border border-indigo-100 bg-white p-6 shadow-sm shadow-indigo-100/40 md:p-8">
      <p className="text-xs font-semibold  tracking-[0.3em] text-indigo-500">Protected area</p>
      <h2 className="mt-2 text-3xl font-bold text-indigo-900">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm text-slate-500">
        {description || 'This dashboard section is ready for the next role-specific blocks.'}
      </p>
    </section>
  );
};

export default RoleDashboard;
