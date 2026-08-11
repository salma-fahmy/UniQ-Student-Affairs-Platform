import React, { useId } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Card from '../Card/Card';
import { buildMonthlyData } from './buildMonthlyData';

export { buildMonthlyData };

const FALLBACK_COLORS = ['#7C6AF7', '#F59E0B', '#10B981', '#F87171'];

// ─── custom tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#fff',
      borderRadius: '14px',
      border: '1px solid #EDE9FE',
      padding: '10px 16px',
      boxShadow: '0 8px 24px rgba(124,106,247,0.13)',
      fontSize: '0.8rem',
      minWidth: 150,
    }}>
      <p style={{ fontWeight: 700, color: '#4C1D95', marginBottom: 6 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color ?? '#7C6AF7', fontWeight: 600, margin: '2px 0' }}>
          {p.name}:{' '}
          <span style={{ fontWeight: 800, color: '#1e1b4b' }}>
            {p.value} {p.value === 1 ? 'submission' : 'submissions'}
          </span>
        </p>
      ))}
    </div>
  );
};

// ─── loading skeleton ─────────────────────────────────────────────────────────
// height is passed as a prop to the parent; skeleton uses a fixed ratio
const LoadingSkeleton = ({ height }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: Math.round(height * 0.75), padding: '16px 8px 0' }}>
    {[65, 85, 50, 95, 70, 80, 55, 90, 75, 60, 88, 72].map((h, i) => (
      <div
        key={i}
        style={{
          flex: 1,
          height: `${h}%`,
          borderRadius: '6px 6px 0 0',
          background: 'linear-gradient(180deg, #EDE9FE 0%, #F5F3FF 100%)',
          animation: 'pulse 1.5s ease-in-out infinite',
          animationDelay: `${i * 80}ms`,
        }}
      />
    ))}
  </div>
);

// ─── custom legend — only shown for multi-series ──────────────────────────────
// Builds a color map from the series prop so dots always match the bars.
const buildLegendRenderer = (series) => (props) => {
  const { payload } = props;
  const colorMap = Object.fromEntries(series.map((s) => [s.key, s.color]));
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', paddingTop: 6 }}>
      {payload.map((entry) => {
        const color = colorMap[entry.value] ?? entry.color ?? '#7C6AF7';
        return (
          <div key={entry.value} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: color,
              boxShadow: `0 2px 5px ${color}88`,
              flexShrink: 0,
            }} />
            <span style={{ fontSize: '0.75rem', color: '#6D5AD6', fontWeight: 600 }}>
              {entry.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/**
 * MonthlyBarChart
 * @param {string}   title
 * @param {object[]} data       – output of buildMonthlyData()
 * @param {{ key: string, color?: string }[]} series
 * @param {boolean}  loading
 * @param {number}   height
 */
const MonthlyBarChart = ({ title, data = [], series = [], loading = false, height = 260 }) => {
  const uid = useId().replace(/:/g, '');
  const isEmpty = data.length === 0;

  return (
    <Card title={title} className="!font-sans h-full">
      {loading ? (
        <LoadingSkeleton height={height} />
      ) : isEmpty ? (
        <div style={{
          display: 'flex', height, alignItems: 'center', justifyContent: 'center',
          color: '#C4B5FD', fontSize: '0.875rem', fontWeight: 500,
        }}>
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} barCategoryGap="35%" barGap={4} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <defs>
              {series.map(({ key, color }, i) => {
                const base = color ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length];
                return (
                  <linearGradient key={key} id={`bar-grad-${uid}-${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={base} stopOpacity={1} />
                    <stop offset="100%" stopColor={base} stopOpacity={0.6} />
                  </linearGradient>
                );
              })}
            </defs>

            <CartesianGrid strokeDasharray="4 4" stroke="#F3F0FF" vertical={false} />

            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#A78BFA', fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />

            {/* Y-axis: integer counts only, labelled "Count" */}
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: '#C4B5FD' }}
              axisLine={false}
              tickLine={false}
              width={32}
              label={{
                value: 'Count',
                angle: -90,
                position: 'insideLeft',
                offset: 10,
                style: { fontSize: 10, fill: '#C4B5FD', fontWeight: 600 },
              }}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(167,139,250,0.06)', radius: 6 }}
            />

            {/* Legend only for multi-series (e.g. Requests vs Complaints) */}
            {series.length > 1 && <Legend content={buildLegendRenderer(series)} />}

            {series.map(({ key }, i) => (
              <Bar
                key={key}
                dataKey={key}
                name={key}
                fill={`url(#bar-grad-${uid}-${i})`}
                radius={[6, 6, 0, 0]}
                maxBarSize={44}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};

export default MonthlyBarChart;