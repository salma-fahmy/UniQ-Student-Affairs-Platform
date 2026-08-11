// src/Components/Shared/SummaryGrid.jsx
import React from 'react';

/**
 * SummaryGrid
 * Wraps a section of StatsCards with a title and optional error/loading state.
 *
 * @param {string}           title    – section heading
 * @param {React.ReactNode}  children – StatsCard elements
 * @param {boolean}          loading  – propagated to children via React.cloneElement if needed
 * @param {string|null}      error    – error message to display
 */
const SummaryGrid = ({ title, children, error }) => (
  <section>
    <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
      {title}
    </h3>

    {error ? (
      <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
        {error}
      </div>
    ) : (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {children}
      </div>
    )}
  </section>
);

export default SummaryGrid;