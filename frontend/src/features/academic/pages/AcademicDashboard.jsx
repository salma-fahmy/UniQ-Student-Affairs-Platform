import React, { useEffect, useState } from 'react';
import {
  FiInbox,
  FiCheckCircle,
  FiXCircle,
  FiClock,
} from 'react-icons/fi';
import useAuth from '../../auth/useAuth';
import AffairsStatsGrid from '../../affairs/components/AffairsStatsGrid';
import { fetchRequestStats } from '../../dashboard/dashboardService';
import WelcomeCard from '../../student/components/WelcomeCard';

// dashboardService now returns { total, accepted, rejected, pending }
const INITIAL_STATE = { total: null, accepted: null, rejected: null, pending: null };

const ACADEMIC_REQUEST_TYPES = [
  'Course Registration Request',
  'Course Withdrawal Request',
];

const AcademicDashboard = () => {
  const { accessToken, user } = useAuth();

  const [stats, setStats]     = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchRequestStats(accessToken, ACADEMIC_REQUEST_TYPES)
      .then((s) => { if (!cancelled) setStats(s); })
      .catch(() => { if (!cancelled) setError('Could not load course request statistics.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [accessToken]);

  const displayName =
    [user?.firstName, user?.secondName].filter(Boolean).join(' ') ||
    [user?.first_name, user?.second_name].filter(Boolean).join(' ') ||
    'Staff';

  return (
    <section className="space-y-6">
      <WelcomeCard name={displayName} />

      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
          Course Registration &amp; Withdrawal Requests
        </p>
        {error ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</div>
        ) : (
          <AffairsStatsGrid  items={[
            { title: 'Total',    value: loading ? '...' : (stats.total    ?? 0), accent: 'indigo',  icon: <FiInbox size={20} /> },
            { title: 'Approved', value: loading ? '...' : (stats.accepted ?? 0), accent: 'emerald', icon: <FiCheckCircle size={20} /> },
            { title: 'Rejected', value: loading ? '...' : (stats.rejected ?? 0), accent: 'rose',    icon: <FiXCircle size={20} /> },
            { title: 'Pending',  value: loading ? '...' : (stats.pending  ?? 0), accent: 'amber',   icon: <FiClock size={20} /> },
          ]} />
        )}
      </div>
    </section>
  );
};

export default AcademicDashboard;