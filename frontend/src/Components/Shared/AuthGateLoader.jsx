import React from 'react';

const AuthGateLoader = ({ title = 'Checking your session', subtitle = 'Please wait while we verify your login.' }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[var(--brand-bg-start)] via-[var(--brand-bg-mid)] to-[var(--brand-bg-end)] px-4">
      <div className="w-full max-w-sm rounded-[1.75rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-8 text-center shadow-[0_24px_70px_-40px_rgba(49,46,129,0.55)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-[var(--brand-primary)]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-900" />
        </div>

        <h1 className="mt-5 text-xl font-semibold text-[var(--brand-text)]">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthGateLoader;