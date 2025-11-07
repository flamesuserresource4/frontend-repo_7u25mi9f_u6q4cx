import React from 'react';

// Simple pie using conic-gradient. Expects data: [{label, value, color}]
export const PieChart = ({ size = 160, data = [] }) => {
  const total = data.reduce((s, d) => s + (d.value || 0), 0) || 1;
  let current = 0;
  const segments = data.map((d) => {
    const start = (current / total) * 360;
    const end = ((current + d.value) / total) * 360;
    current += d.value;
    return `${d.color} ${start}deg ${end}deg`;
  });
  const gradient = `conic-gradient(${segments.join(', ')})`;
  return (
    <div className="flex flex-col items-center">
      <div
        className="rounded-full border"
        style={{ width: size, height: size, background: gradient }}
        aria-label="Pie chart"
      />
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded" style={{ backgroundColor: d.color }} />
            <span className="text-gray-700">{d.label} ({total ? Math.round((d.value / total) * 100) : 0}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Simple bar chart (vertical). Expects data: [{label, value, color?}] and maxValue
export const BarChart = ({ height = 160, data = [], maxValue }) => {
  const max = maxValue || Math.max(1, ...data.map((d) => d.value || 0));
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((d) => (
        <div key={d.label} className="flex flex-col items-center justify-end gap-1">
          <div
            className="w-6 rounded-t bg-emerald-600"
            style={{ height: Math.max(4, Math.round(((d.value || 0) / max) * height)), backgroundColor: d.color || '#059669' }}
            title={`${d.label}: ${d.value}`}
          />
          <span className="text-[10px] text-gray-600">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

export default { PieChart, BarChart };
