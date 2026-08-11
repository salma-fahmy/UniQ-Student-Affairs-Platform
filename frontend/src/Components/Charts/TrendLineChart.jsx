import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import Card from '../Card/Card';

const SERIES_COLORS = ['#7C6AF7', '#10b981', '#F59E0B', '#F87171'];

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
      minWidth: 160,
    }}>
      <p style={{ fontWeight: 700, color: '#4C1D95', marginBottom: 6 }}>{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ margin: '3px 0' }}>
          <span style={{ fontWeight: 600, color: p.color }}>{p.name}: </span>
          <span style={{ fontWeight: 800, color: '#1e1b4b' }}>
            {Number(p.value).toFixed(1)}%
          </span>
          {/* Plain-language interpretation */}
          <span style={{ fontSize: '0.72rem', color: '#A78BFA', marginLeft: 4 }}>
            {Number(p.value) >= 75 ? '· High' : Number(p.value) >= 50 ? '· Moderate' : '· Low'}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── custom legend ────────────────────────────────────────────────────────────
const renderLegend = (props) => {
  const { payload } = props;
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', paddingTop: 4 }}>
      {payload.map((entry) => (
        <div key={entry.value} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{
            width: 24, height: 3, borderRadius: 2,
            background: entry.color,
            boxShadow: `0 1px 4px ${entry.color}66`,
          }} />
          <span style={{ fontSize: '0.75rem', color: '#6D5AD6', fontWeight: 600 }}>
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

/**
 * TrendLineChart
 * @param {string}   title
 * @param {object[]} data    – [{ month, [key]: number (0-100) }, ...]
 * @param {{ key: string, color: string, label?: string }[]} series
 * @param {boolean}  loading
 * @param {number}   height
 */
const TrendLineChart = ({ title, data = [], series = [], loading = false, height = 260 }) => {
  const isEmpty = data.length === 0;

  const resolvedSeries = series.map((s, i) => ({
    ...s,
    resolvedColor: SERIES_COLORS[i % SERIES_COLORS.length],
  }));

  return (
    <Card title={title} className="!font-sans h-full">
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '16px 0' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{
              height: 20, borderRadius: 8,
              background: 'linear-gradient(90deg, #EDE9FE 0%, #F5F3FF 100%)',
              width: `${50 + i * 12}%`,
              animation: 'pulse 1.5s ease-in-out infinite',
              animationDelay: `${i * 100}ms`,
            }} />
          ))}
        </div>
      ) : isEmpty ? (
        <div style={{
          display: 'flex', height, alignItems: 'center', justifyContent: 'center',
          color: '#C4B5FD', fontSize: '0.875rem', fontWeight: 500,
        }}>
          Not enough data to show trends
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={{ top: 8, right: 16, left: 4, bottom: 4 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#F3F0FF" vertical={false} />

            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#A78BFA', fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />

            {/* Y-axis: 0–100%, explicit ticks at 25% intervals */}
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11, fill: '#C4B5FD' }}
              axisLine={false}
              tickLine={false}
              width={38}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Always show legend — even single series, it names what the line represents */}
            <Legend content={renderLegend} />

            {/* 50% reference line — labelled so users know its meaning */}
            <ReferenceLine
              y={50}
              stroke="#DDD6FE"
              strokeDasharray="5 5"
              label={{
                value: '50%',
                position: 'insideTopRight',
                style: { fontSize: 10, fill: '#C4B5FD', fontWeight: 600 },
              }}
            />

            {resolvedSeries.map(({ key, resolvedColor, label }) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={label ?? key}
                stroke={resolvedColor}
                strokeWidth={2.5}
                dot={{ r: 4, fill: resolvedColor, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: resolvedColor, strokeWidth: 3, stroke: '#fff' }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};

export default TrendLineChart;