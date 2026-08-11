import React, { useEffect, useState } from 'react';
import {
  FiInbox, FiCheckCircle, FiXCircle, FiClock, FiAlertCircle,
} from 'react-icons/fi';
import useAuth from '../../auth/useAuth';
import AffairsStatsGrid from '../components/AffairsStatsGrid';import StatusDonutChart from '../../../Components/Charts/StatusDonutChart';
import MonthlyBarChart, { buildMonthlyData } from '../../../Components/Charts/MonthlyBarChart';
import RequestTypeBarChart from '../../../Components/Charts/RequestTypeBarChart';
import { fetchRawRequests, fetchRawComplaints } from '../../dashboard/dashboardService';
import WelcomeCard from '../../student/components/WelcomeCard';

// ─── status aggregators ───────────────────────────────────────────────────────
// Both return { total, accepted, rejected, pending }
// UI displays 'accepted' as "Approved" (requests) or "Resolved" (complaints)

const aggregateRequests = (items) => {
  const counts = { total: items.length, accepted: 0, rejected: 0, pending: 0 };
  for (const item of items) {
    const s = String(item.status ?? '').toLowerCase().trim();
    if (s === 'accepted' || s === 'approved') counts.accepted += 1;
    else if (s === 'rejected' || s === 'denied') counts.rejected += 1;
    else if (s === 'pending' || s === 'under review' || s === 'in_progress') counts.pending += 1;
  }
  return counts;
};

const aggregateComplaints = (items) => {
  const counts = { total: items.length, accepted: 0, rejected: 0, pending: 0 };
  for (const item of items) {
    const s = String(item.status ?? '').toLowerCase().trim();
    if (s === 'accepted' || s === 'resolved') counts.accepted += 1;
    else if (s === 'rejected' || s === 'denied') counts.rejected += 1;
    else if (s === 'pending' || s === 'open' || s === 'in_progress') counts.pending += 1;
  }
  return counts;
};

// ─── request type distribution ────────────────────────────────────────────────
const buildTypeDistribution = (items) => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const map = {};
  for (const item of items) {
    const typeName = String(
      item.request_type?.name ??
      item.request_type?.title ??
      item.request_type_name ??
      item.type ??
      'Unknown',
    ).trim();
    const itemMonth = item.created_at ? item.created_at.slice(0, 7) : '';
    if (!map[typeName]) map[typeName] = { type: typeName, Total: 0, 'This Month': 0 };
    map[typeName].Total += 1;
    if (itemMonth === currentMonth) map[typeName]['This Month'] += 1;
  }
  return Object.values(map).sort((a, b) => (b['This Month'] - a['This Month']) || (b.Total - a.Total));
};

// ─── merge two monthly series ─────────────────────────────────────────────────
const mergeMonthly = (reqRows, cmpRows) => {
  const map = {};
  for (const r of reqRows)
    map[r.month] = { month: r.month, Requests: r.Requests ?? 0, Complaints: 0 };
  for (const r of cmpRows) {
    if (map[r.month]) map[r.month].Complaints = r.Complaints ?? 0;
    else map[r.month] = { month: r.month, Requests: 0, Complaints: r.Complaints ?? 0 };
  }
  return Object.values(map).sort(
    (a, b) => new Date('01 ' + a.month) - new Date('01 ' + b.month),
  );
};

// ─── initial state ────────────────────────────────────────────────────────────
const INIT_REQ = { total: null, accepted: null, rejected: null, pending: null };
const INIT_CMP = { total: null, accepted: null, rejected: null, pending: null };

// ─────────────────────────────────────────────────────────────────────────────
const AffairsDashboard = () => {
  const { accessToken, user } = useAuth();

  const [reqStats,         setReqStats]         = useState(INIT_REQ);
  const [cmpStats,         setCmpStats]         = useState(INIT_CMP);
  const [reqLoading,       setReqLoading]       = useState(true);
  const [cmpLoading,       setCmpLoading]       = useState(true);
  const [reqError,         setReqError]         = useState(null);
  const [cmpError,         setCmpError]         = useState(null);
  const [reqMonthly,       setReqMonthly]       = useState([]);
  const [cmpMonthly,       setCmpMonthly]       = useState([]);
  const [combinedMonthly,  setCombinedMonthly]  = useState([]);
  const [typeDistribution, setTypeDistribution] = useState([]);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    setReqLoading(true);
    setReqError(null);
    fetchRawRequests(accessToken)
      .then((items) => {
        if (cancelled) return;
        setReqStats(aggregateRequests(items));
        setReqMonthly(buildMonthlyData([{ items, key: 'Requests' }], 12));
        setTypeDistribution(buildTypeDistribution(items));
      })
      .catch(() => { if (!cancelled) setReqError('Could not load request statistics.'); })
      .finally(() => { if (!cancelled) setReqLoading(false); });
    return () => { cancelled = true; };
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    setCmpLoading(true);
    setCmpError(null);
    fetchRawComplaints(accessToken)
      .then((items) => {
        if (cancelled) return;
        setCmpStats(aggregateComplaints(items));
        setCmpMonthly(buildMonthlyData([{ items, key: 'Complaints' }], 12));
      })
      .catch(() => { if (!cancelled) setCmpError('Could not load complaint statistics.'); })
      .finally(() => { if (!cancelled) setCmpLoading(false); });
    return () => { cancelled = true; };
  }, [accessToken]);

  useEffect(() => {
    if (reqMonthly.length === 0 && cmpMonthly.length === 0) return;
    setCombinedMonthly(mergeMonthly(reqMonthly, cmpMonthly));
  }, [reqMonthly, cmpMonthly]);

  const displayName =
    [user?.firstName, user?.secondName].filter(Boolean).join(' ') ||
    [user?.first_name, user?.second_name].filter(Boolean).join(' ') ||
    'Staff';

  const isLoading = reqLoading || cmpLoading;

  return (
    <section className="space-y-8">

      <div className="space-y-6">
        <WelcomeCard name={displayName} />

        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Requests</p>
          {reqError ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{reqError}</div>
          ) : (
            <AffairsStatsGrid items={[
              { title: 'Total',    value: isLoading ? '...' : (reqStats.total    ?? 0), accent: 'indigo',  icon: <FiInbox size={20} /> },
              { title: 'Approved', value: isLoading ? '...' : (reqStats.accepted ?? 0), accent: 'emerald', icon: <FiCheckCircle size={20} /> },
              { title: 'Rejected', value: isLoading ? '...' : (reqStats.rejected ?? 0), accent: 'rose',    icon: <FiXCircle size={20} /> },
              { title: 'Pending',  value: isLoading ? '...' : (reqStats.pending  ?? 0), accent: 'amber',   icon: <FiClock size={20} /> },
            ]} />
          )}
        </div>

        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Complaints</p>
          {cmpError ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{cmpError}</div>
          ) : (
            <AffairsStatsGrid  items={[
              { title: 'Total',    value: isLoading ? '...' : (cmpStats.total    ?? 0), accent: 'indigo',  icon: <FiAlertCircle size={20} /> },
              { title: 'Resolved', value: isLoading ? '...' : (cmpStats.accepted ?? 0), accent: 'emerald', icon: <FiCheckCircle size={20} /> },
              { title: 'Rejected', value: isLoading ? '...' : (cmpStats.rejected ?? 0), accent: 'rose',    icon: <FiXCircle size={20} /> },
              { title: 'Pending',  value: isLoading ? '...' : (cmpStats.pending  ?? 0), accent: 'amber',   icon: <FiClock size={20} /> },
            ]} />
          )}
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Status Overview</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatusDonutChart
              title="Request Status"
              data={{ Approved: reqStats.accepted ?? 0, Rejected: reqStats.rejected ?? 0, Pending: reqStats.pending ?? 0 }}
              loading={isLoading}
            />
            <StatusDonutChart
              title="Complaint Status"
              data={{ Resolved: cmpStats.accepted ?? 0, Rejected: cmpStats.rejected ?? 0, Pending: cmpStats.pending ?? 0 }}
              loading={isLoading}
            />
          </div>
        </div>

      </div>

      <div className="space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Analysis</h3>

        <MonthlyBarChart
          title="Requests vs Complaints — Last 12 Months"
          data={combinedMonthly}
          series={[
            { key: 'Requests',   color: '#6366f1' },
            { key: 'Complaints', color: '#06b6d4' },
          ]}
          loading={isLoading}
        />

        <RequestTypeBarChart
          title="Request Type Distribution"
          data={typeDistribution}
          loading={reqLoading}
        />
      </div>

    </section>
  );
};

export default AffairsDashboard;