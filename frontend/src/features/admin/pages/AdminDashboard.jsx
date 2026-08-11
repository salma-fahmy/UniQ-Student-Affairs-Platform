import React, { useEffect, useState } from 'react';
import {
  FiInbox, FiCheckCircle, FiXCircle, FiClock, FiAlertCircle,
} from 'react-icons/fi';
import useAuth from '../../auth/useAuth';
import AffairsStatsGrid from '../../affairs/components/AffairsStatsGrid';
import StatusDonutChart from '../../../Components/Charts/StatusDonutChart';
import MonthlyBarChart, { buildMonthlyData } from '../../../Components/Charts/MonthlyBarChart';
import RequestTypeBarChart from '../../../Components/Charts/RequestTypeBarChart';
import TrendLineChart from '../../../Components/Charts/TrendLineChart';
import StackedTypeBarChart from '../../../Components/Charts/StackedTypeBarChart';
import { fetchRawRequests, fetchRawComplaints, fetchRawPrograms } from '../../dashboard/dashboardService';
import WelcomeCard from '../../student/components/WelcomeCard';

// ─── helpers ──────────────────────────────────────────────────────────────────
const SHORT_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const toMonthLabel = (key) => {
  const [year, month] = key.split('-');
  return `${SHORT_MONTHS[Number(month) - 1]} ${year}`;
};

const getRequestTypeName = (item) =>
  String(
    item.request_type?.name ??
    item.request_type?.title ??
    item.request_type_name ??
    item.type ??
    'Unknown',
  ).trim();

// ─── aggregators ──────────────────────────────────────────────────────────────
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

// Total vs This Month per type
const buildTypeDistribution = (items) => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const map = {};
  for (const item of items) {
    const typeName = getRequestTypeName(item);
    const itemMonth = item.created_at ? item.created_at.slice(0, 7) : '';
    if (!map[typeName]) map[typeName] = { type: typeName, Total: 0, 'This Month': 0 };
    map[typeName].Total += 1;
    if (itemMonth === currentMonth) map[typeName]['This Month'] += 1;
  }
  return Object.values(map).sort((a, b) => (b['This Month'] - a['This Month']) || (b.Total - a.Total));
};

// Stacked status per type
const buildStackedTypeData = (items) => {
  const map = {};
  for (const item of items) {
    const typeName = getRequestTypeName(item);
    if (!map[typeName]) map[typeName] = { type: typeName, Approved: 0, Rejected: 0, Pending: 0 };
    const s = String(item.status ?? '').toLowerCase().trim();
    if (s === 'accepted' || s === 'approved') map[typeName].Approved += 1;
    else if (s === 'rejected' || s === 'denied') map[typeName].Rejected += 1;
    else if (s === 'pending' || s === 'under review' || s === 'in_progress') map[typeName].Pending += 1;
  }
  return Object.values(map).sort(
    (a, b) => (b.Approved + b.Rejected + b.Pending) - (a.Approved + a.Rejected + a.Pending),
  );
};

// ─── FIXED: Monthly approval rate — last 12 months ────────────────────────────
// Buckets by updated_at (when the employee acted), excludes pending items.
// Formula: approved / (approved + rejected) × 100
// A month only appears if at least one decision was made that month.
const buildApprovalRateTrend = (items) => {
  const map = {};
  for (const item of items) {
    const s = String(item.status ?? '').toLowerCase().trim();
    const isApproved = s === 'accepted' || s === 'approved';
    const isRejected = s === 'rejected' || s === 'denied';
    if (!isApproved && !isRejected) continue; // skip pending — no decision yet

    // updated_at = when the employee made the decision; fall back to created_at
    const mk = (item.updated_at ?? item.created_at)?.slice(0, 7);
    if (!mk) continue;

    if (!map[mk]) map[mk] = { decided: 0, approved: 0 };
    map[mk].decided += 1;
    if (isApproved) map[mk].approved += 1;
  }
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([mk, { decided, approved }]) => ({
      month: toMonthLabel(mk),
      'Approval Rate': decided > 0 ? Math.round((approved / decided) * 100) : 0,
    }));
};

// ─── FIXED: Monthly resolution rate — last 12 months ─────────────────────────
// Buckets by updated_at (when the employee acted), excludes pending complaints.
// Formula: resolved / (resolved + rejected) × 100
// A month only appears if at least one decision was made that month.
const buildResolutionRateTrend = (items) => {
  const map = {};
  for (const item of items) {
    const s = String(item.status ?? '').toLowerCase().trim();
    const isResolved = s === 'accepted' || s === 'resolved';
    const isRejected = s === 'rejected' || s === 'denied';
    if (!isResolved && !isRejected) continue; // skip pending — no decision yet

    // updated_at = when the employee made the decision; fall back to created_at
    const mk = (item.updated_at ?? item.created_at)?.slice(0, 7);
    if (!mk) continue;

    if (!map[mk]) map[mk] = { decided: 0, resolved: 0 };
    map[mk].decided += 1;
    if (isResolved) map[mk].resolved += 1;
  }
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([mk, { decided, resolved }]) => ({
      month: toMonthLabel(mk),
      'Resolution Rate': decided > 0 ? Math.round((resolved / decided) * 100) : 0,
    }));
};

// Merge two monthly series
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

// Programs → horizontal bar data
const buildProgramData = (programs) =>
  programs
    .map((p) => ({
      type:  p.program_name_en ?? p.name ?? p.program_name ?? 'Unknown',
      Count: Number(p.student_count ?? p.students_count ?? p.count ?? 0),
    }))
    .filter((p) => p.Count > 0)
    .sort((a, b) => b.Count - a.Count);

// ─── initial state ─────────────────────────────────────────────────────────────
const INIT_REQ = { total: null, accepted: null, rejected: null, pending: null };
const INIT_CMP = { total: null, accepted: null, rejected: null, pending: null };

// ─── section label ─────────────────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">{children}</p>
);

const Divider = () => <div className="border-t border-slate-100" />;

// ─────────────────────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { accessToken, user } = useAuth();

  const [reqStats,        setReqStats]        = useState(INIT_REQ);
  const [cmpStats,        setCmpStats]        = useState(INIT_CMP);
  const [reqLoading,      setReqLoading]      = useState(true);
  const [cmpLoading,      setCmpLoading]      = useState(true);
  const [progLoading,     setProgLoading]     = useState(true);
  const [reqError,        setReqError]        = useState(null);
  const [cmpError,        setCmpError]        = useState(null);
  const [progError,       setProgError]       = useState(null);
  const [reqMonthly,      setReqMonthly]      = useState([]);
  const [cmpMonthly,      setCmpMonthly]      = useState([]);
  const [combinedMonthly, setCombinedMonthly] = useState([]);
  const [typeDistrib,     setTypeDistrib]     = useState([]);
  const [stackedType,     setStackedType]     = useState([]);
  const [approvalTrend,   setApprovalTrend]   = useState([]);
  const [resolutionTrend, setResolutionTrend] = useState([]);
  const [programData,     setProgramData]     = useState([]);

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
        setTypeDistrib(buildTypeDistribution(items));
        setStackedType(buildStackedTypeData(items));
        setApprovalTrend(buildApprovalRateTrend(items));
      })
      .catch(() => { if (!cancelled) setReqError('Could not load request data.'); })
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
        setResolutionTrend(buildResolutionRateTrend(items));
      })
      .catch(() => { if (!cancelled) setCmpError('Could not load complaint data.'); })
      .finally(() => { if (!cancelled) setCmpLoading(false); });
    return () => { cancelled = true; };
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    setProgLoading(true);
    setProgError(null);
    fetchRawPrograms(accessToken)
      .then((programs) => {
        if (cancelled) return;
        setProgramData(buildProgramData(programs));
      })
      .catch(() => { if (!cancelled) setProgError('Could not load program data.'); })
      .finally(() => { if (!cancelled) setProgLoading(false); });
    return () => { cancelled = true; };
  }, [accessToken]);

  useEffect(() => {
    if (reqMonthly.length === 0 && cmpMonthly.length === 0) return;
    setCombinedMonthly(mergeMonthly(reqMonthly, cmpMonthly));
  }, [reqMonthly, cmpMonthly]);

  const displayName =
    [user?.firstName, user?.secondName].filter(Boolean).join(' ') ||
    [user?.first_name, user?.second_name].filter(Boolean).join(' ') ||
    'Admin';

  const isLoading = reqLoading || cmpLoading;

  return (
    <section className="space-y-8">

      <WelcomeCard name={displayName} />

      {/* ── Stat Cards ───────────────────────────────────────────────────── */}
      <div className="space-y-5">
        <div>
          <SectionLabel>Requests</SectionLabel>
          <div className="mt-3">
            {reqError ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{reqError}</div>
            ) : (
              <AffairsStatsGrid  items={[
                { title: 'Total',    value: isLoading ? '...' : (reqStats.total    ?? 0), accent: 'indigo',  icon: <FiInbox size={20} /> },
                { title: 'Approved', value: isLoading ? '...' : (reqStats.accepted ?? 0), accent: 'emerald', icon: <FiCheckCircle size={20} /> },
                { title: 'Rejected', value: isLoading ? '...' : (reqStats.rejected ?? 0), accent: 'rose',    icon: <FiXCircle size={20} /> },
                { title: 'Pending',  value: isLoading ? '...' : (reqStats.pending  ?? 0), accent: 'amber',   icon: <FiClock size={20} /> },
              ]} />
            )}
          </div>
        </div>

        <div>
          <SectionLabel>Complaints</SectionLabel>
          <div className="mt-3">
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
        </div>
      </div>

      <Divider />

      {/* ── Analysis ─────────────────────────────────────────────────────── */}
      <div className="space-y-6">
        <SectionLabel>Analysis</SectionLabel>

        {/* Row 1 — Status donuts */}
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

        

        {/* Row 3 — Combined full-width */}
        <MonthlyBarChart
          title="Requests vs Complaints — Last 12 Months"
          data={combinedMonthly}
          series={[
            { key: 'Requests',   color: '#6366f1' },
            { key: 'Complaints', color: '#06b6d4' },
          ]}
          loading={isLoading}
        />



        {/* Row 6 — Students per program full width */}
        {progError ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{progError}</div>
        ) : (
          <RequestTypeBarChart
            title="Request Type Distribution"
            data={typeDistrib}
            loading={reqLoading}
          />
          
        )}

        {/* Row 5 — Type distribution + Stacked outcomes side by side */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <RequestTypeBarChart
            title="Students per Program"
            data={programData.map((p) => ({ type: p.type, Total: p.Count, 'This Month': 0 }))}
            loading={progLoading}
          />
          <StackedTypeBarChart
            title="Request Outcomes by Type"
            data={stackedType}
            loading={reqLoading}
          />
        </div>
      </div>

    </section>
  );
};

export default AdminDashboard;