// src/Components/Charts/buildMonthlyData.js
//
// Extracted from MonthlyBarChart.jsx so that Fast Refresh can work correctly.
// A file must export only components OR only non-component values — not both.

const toMonthKey = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const SHORT_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const toLabel = (key) => {
  const [year, month] = key.split('-');
  return `${SHORT_MONTHS[Number(month) - 1]} ${year}`;
};

/**
 * buildMonthlyData
 * Merges one or two raw item arrays into a sorted month-keyed series.
 *
 * @param {{ items: object[], key: string, dateField?: string }[]} series
 * @param {number} lastNMonths  – only show the most recent N months (0 = all)
 */
export const buildMonthlyData = (series, lastNMonths = 12) => {
  const monthSet = new Set();

  const countMaps = series.map(({ items = [], dateField = 'created_at' }) => {
    const map = {};
    for (const item of items) {
      const mk = toMonthKey(item[dateField]);
      if (!mk) continue;
      map[mk] = (map[mk] ?? 0) + 1;
      monthSet.add(mk);
    }
    return map;
  });

  let months = [...monthSet].sort();
  if (lastNMonths > 0 && months.length > lastNMonths) {
    months = months.slice(-lastNMonths);
  }

  return months.map((mk) => {
    const row = { month: toLabel(mk) };
    series.forEach(({ key }, i) => {
      row[key] = countMaps[i][mk] ?? 0;
    });
    return row;
  });
};