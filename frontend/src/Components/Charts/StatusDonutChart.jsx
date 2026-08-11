import React, { useId } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Card from '../Card/Card';

// ─── palette ──────────────────────────────────────────────────────────────────
const COLORS = {
  Approved: '#10b981',  // emerald green (matches Resolved)
  Resolved: '#10b981',  // emerald green
  Rejected: '#F87171',  // soft red
  Pending:  '#F59E0B',  // amber
};

const FALLBACK_COLOR = '#C4B5FD';

// ─── custom legend ────────────────────────────────────────────────────────────
const renderCustomLegend = (props) => {
  const { payload } = props;
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: 16,
      flexWrap: 'wrap',
      marginTop: 8,
    }}>
      {payload.map((entry) => {
        const color = COLORS[entry.value] ?? FALLBACK_COLOR;
        return (
          <div key={entry.value} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: color,
              boxShadow: `0 2px 6px ${color}88`,
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

// ─── custom tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      border: '1px solid #EDE9FE',
      padding: '8px 14px',
      boxShadow: '0 8px 24px rgba(124,106,247,0.13)',
      fontSize: '0.8rem',
      fontWeight: 700,
      color: '#4C1D95',
    }}>
      {name}: <span style={{ color: COLORS[name] ?? FALLBACK_COLOR }}>{value}</span>
    </div>
  );
};

/**
 * StatusDonutChart
 *
 * @param {string}   title
 * @param {object}   data    – e.g. { Approved: 12, Rejected: 3, Pending: 5 }
 * @param {boolean}  loading
 */
const StatusDonutChart = ({ title, data = {}, loading = false }) => {
  const uid = useId().replace(/:/g, '');

  const chartData = Object.entries(data)
    .filter(([, value]) => typeof value === 'number' && value > 0)
    .map(([key, value]) => ({
      name:  key.charAt(0).toUpperCase() + key.slice(1),
      value,
    }));

  const isEmpty = chartData.length === 0;
  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card title={title} className="!font-sans h-full">
      {loading ? (
        <div style={{
          display: 'flex',
          height: 200,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #EDE9FE 0%, #F5F3FF 100%)',
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
        </div>
      ) : isEmpty ? (
        <div style={{
          display: 'flex',
          height: 200,
          alignItems: 'center',
          justifyContent: 'center',
          color: '#C4B5FD',
          fontSize: '0.875rem',
          fontWeight: 500,
        }}>
          No data available
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <defs>
                {chartData.map((entry) => {
                  const base = COLORS[entry.name] ?? FALLBACK_COLOR;
                  return (
                    <radialGradient
                      key={entry.name}
                      id={`donut-grad-${uid}-${entry.name}`}
                      cx="50%" cy="50%" r="50%"
                    >
                      <stop offset="0%" stopColor={base} stopOpacity={1} />
                      <stop offset="100%" stopColor={base} stopOpacity={0.7} />
                    </radialGradient>
                  );
                })}
              </defs>

              <Pie
                data={chartData}
                cx="50%"
                cy="48%"
                innerRadius={58}
                outerRadius={88}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={`url(#donut-grad-${uid}-${entry.name})`}
                    style={{ filter: `drop-shadow(0 4px 8px ${(COLORS[entry.name] ?? FALLBACK_COLOR)}44)` }}
                  />
                ))}
              </Pie>

              <Tooltip content={<CustomTooltip />} />
              <Legend content={renderCustomLegend} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div style={{
            position: 'absolute',
            top: '46%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4C1D95', lineHeight: 1 }}>
              {total}
            </div>
            <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#A78BFA', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Total
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default StatusDonutChart;