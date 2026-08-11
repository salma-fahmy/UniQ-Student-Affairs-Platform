import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import Card from '../Card/Card';

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
      <p style={{ fontWeight: 700, color: '#4C1D95', marginBottom: 6, lineHeight: 1.3 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ fontWeight: 600, margin: '3px 0', color: p.color }}>
          {p.name}: <span style={{ fontWeight: 800, color: '#4C1D95' }}>{p.value}</span>
        </p>
      ))}
    </div>
  );
};

/**
 * RequestTypeBarChart
 * @param {string}   title
 * @param {{ type: string, Total: number, 'This Month': number }[]} data
 * @param {boolean}  loading
 */
const RequestTypeBarChart = ({ title, data = [], loading = false, hideCallout = false }) => {
  const isEmpty = data.length === 0;
  const topValue = data[0]?.Total ?? 0;

  const truncate = (str, max = 28) =>
    str.length > max ? str.slice(0, max - 1) + '…' : str;

  const formatted = data.map((d) => ({ ...d, label: truncate(d.type) }));
  const chartHeight = Math.max(220, formatted.length * 64);

  // Only show "This Month" bar if at least one entry has a non-zero value
  const hasThisMonth = data.some((d) => (d['This Month'] ?? 0) > 0);

  const topThisMonth = data.reduce(
    (best, d) => (d['This Month'] > best['This Month'] ? d : best),
    data[0] ?? { type: '—', 'This Month': 0 },
  );

  return (
    <Card title={title} className="!font-sans">
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '8px 0' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                height: 14,
                width: 144,
                borderRadius: 8,
                background: 'linear-gradient(90deg, #EDE9FE 0%, #F5F3FF 100%)',
                animation: 'pulse 1.5s ease-in-out infinite',
                animationDelay: `${i * 100}ms`,
              }} />
              <div style={{
                height: 28,
                borderRadius: 8,
                background: 'linear-gradient(90deg, #DDD6FE 0%, #EDE9FE 100%)',
                width: `${40 + i * 12}%`,
                animation: 'pulse 1.5s ease-in-out infinite',
                animationDelay: `${i * 100}ms`,
              }} />
            </div>
          ))}
        </div>
      ) : isEmpty ? (
        <div style={{
          display: 'flex',
          height: 192,
          alignItems: 'center',
          justifyContent: 'center',
          color: '#C4B5FD',
          fontSize: '0.875rem',
          fontWeight: 500,
        }}>
          No request type data available
        </div>
      ) : (
        <>
          {/* Most demanded this month callout — hidden when not applicable */}
          {!hideCallout && hasThisMonth && (
            <div style={{
              borderRadius: 12,
              background: 'linear-gradient(135deg, #EDE9FE 0%, #F5F3FF 100%)',
              padding: '10px 14px',
              marginBottom: 16,
              boxShadow: '0 2px 8px rgba(124,106,247,0.08)',
            }}>
              <p style={{ margin: 0, fontSize: '0.68rem', fontWeight: 600, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Top this month
              </p>
              <p style={{ margin: '3px 0 0', fontSize: '0.85rem', fontWeight: 700, color: '#4C1D95' }}>
                {topThisMonth.type}
                <span style={{ marginLeft: 8, fontSize: '0.75rem', fontWeight: 500, color: '#A78BFA' }}>
                  — {topThisMonth['This Month']} {topThisMonth['This Month'] === 1 ? 'request' : 'requests'}
                </span>
              </p>
            </div>
          )}

          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart
              data={formatted}
              layout="vertical"
              barCategoryGap="25%"
              barGap={3}
              margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
            >
              <defs>
                <linearGradient id="totalGradTop" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#7C6AF7" stopOpacity={1} />
                  <stop offset="100%" stopColor="#A78BFA" stopOpacity={0.85} />
                </linearGradient>
                <linearGradient id="totalGradDim" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#C4B5FD" stopOpacity={0.5} />
                </linearGradient>
                <linearGradient id="monthGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity={1} />
                  <stop offset="100%" stopColor="#FCD34D" stopOpacity={0.8} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="4 4" stroke="#F3F0FF" horizontal={false} />

              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fontSize: 11, fill: '#C4B5FD' }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                type="category"
                dataKey="label"
                width={190}
                tick={{ fontSize: 11, fill: '#6D5AD6', fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(167,139,250,0.06)' }} />

              {/* Only show legend when there are meaningful This Month bars */}
              {!hideCallout && hasThisMonth && (
                <Legend
                  content={({ payload }) => (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', paddingTop: 10 }}>
                      {payload.map((entry) => {
                        const color = entry.dataKey === 'Total' ? '#7C6AF7' : '#F59E0B';
                        return (
                          <div key={entry.value} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <span style={{
                              display: 'inline-block',
                              width: 10, height: 10,
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
                  )}
                />
              )}

              <Bar dataKey="Total" name="Total" radius={[0, 6, 6, 0]}>
                {formatted.map((entry) => (
                  <Cell
                    key={entry.label}
                    fill={entry.Total === topValue ? 'url(#totalGradTop)' : 'url(#totalGradDim)'}
                    style={{
                      filter: entry.Total === topValue
                        ? 'drop-shadow(0 2px 6px rgba(124,106,247,0.3))'
                        : 'none',
                    }}
                  />
                ))}
              </Bar>

              <Bar
                dataKey="This Month"
                name="This Month"
                fill="url(#monthGrad)"
                radius={[0, 6, 6, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </Card>
  );
};

export default RequestTypeBarChart;