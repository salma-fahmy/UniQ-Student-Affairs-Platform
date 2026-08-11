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
} from 'recharts';
import Card from '../Card/Card';

const COLORS = {
  Approved: '#10b981',  // emerald
  Rejected: '#F87171',  // soft red
  Pending:  '#F59E0B',  // amber
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((sum, p) => sum + (p.value ?? 0), 0);
  return (
    <div style={{
      background: '#fff',
      borderRadius: '14px',
      border: '1px solid #EDE9FE',
      padding: '10px 16px',
      boxShadow: '0 8px 24px rgba(124,106,247,0.13)',
      fontSize: '0.8rem',
      minWidth: 180,
    }}>
      <p style={{ fontWeight: 700, color: '#4C1D95', marginBottom: 8, lineHeight: 1.3 }}>{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 4,
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, color: p.fill }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: p.fill,
              display: 'inline-block',
              boxShadow: `0 2px 4px ${p.fill}66`,
            }} />
            {p.name}
          </span>
          <span style={{ fontWeight: 800, color: '#4C1D95' }}>
            {p.value}{' '}
            <span style={{ color: '#A78BFA', fontWeight: 500 }}>
              ({total > 0 ? Math.round((p.value / total) * 100) : 0}%)
            </span>
          </span>
        </div>
      ))}
      <div style={{
        marginTop: 8,
        paddingTop: 8,
        borderTop: '1px solid #EDE9FE',
        display: 'flex',
        justifyContent: 'space-between',
        fontWeight: 800,
        color: '#4C1D95',
        fontSize: '0.75rem',
      }}>
        <span>Total</span>
        <span>{total}</span>
      </div>
    </div>
  );
};

/**
 * StackedTypeBarChart
 * @param {string}   title
 * @param {{ type: string, Approved: number, Rejected: number, Pending: number }[]} data
 * @param {boolean}  loading
 */
const StackedTypeBarChart = ({ title, data = [], loading = false }) => {
  const isEmpty = data.length === 0;

  const truncate = (str, max = 28) =>
    str.length > max ? str.slice(0, max - 1) + '…' : str;

  const formatted = data.map((d) => ({ ...d, label: truncate(d.type) }));
  const chartHeight = Math.max(220, formatted.length * 56);

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
                width: `${50 + i * 10}%`,
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
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            data={formatted}
            layout="vertical"
            barCategoryGap="30%"
            margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
          >
            <defs>
              <linearGradient id="stackApproved" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="#10b981" stopOpacity={1} />     
                <stop offset="100%" stopColor="#34d399" stopOpacity={0.9} />
              </linearGradient>
              <linearGradient id="stackRejected" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#F87171" stopOpacity={1} />
                <stop offset="100%" stopColor="#FCA5A5" stopOpacity={0.9} />
              </linearGradient>
              <linearGradient id="stackPending" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity={1} />
                <stop offset="100%" stopColor="#FCD34D" stopOpacity={0.9} />
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

            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{
                fontSize: '0.78rem',
                paddingTop: '0.75rem',
                color: '#7C6AF7',
              }}
            />

            <Bar dataKey="Approved" stackId="a" fill="url(#stackApproved)" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Rejected" stackId="a" fill="url(#stackRejected)" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Pending"  stackId="a" fill="url(#stackPending)"  radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};

export default StackedTypeBarChart;