import React, { useMemo, useState } from 'react';
import SectionLayout from './SectionLayout';

function PieChart({ percent, colors = ['#10b981', '#d1fae5'] }) {
  const bg = `conic-gradient(${colors[0]} 0% ${percent}%, ${colors[1]} ${percent}% 100%)`;
  return (
    <div className="w-32 h-32 rounded-full" style={{ background: bg }} />
  );
}

function BarChart({ data = [] }) {
  const max = Math.max(1, ...data.map(d => d.value));
  return (
    <div className="flex items-end gap-2 h-40">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-8 bg-emerald-500 rounded-t" style={{ height: `${(d.value/max)*100}%` }} />
          <div className="text-[10px] mt-1 text-emerald-700">{d.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function Sales({ onBackHome, onLogout, user, onRoleChange }) {
  const tabs = ['Overview'];
  const [activeTab, setActiveTab] = useState('Overview');

  const canAccess = ['admin','manager'].includes(user?.role);
  if (!canAccess) {
    return (
      <SectionLayout title="Sales" onBackHome={onBackHome} onLogout={onLogout} user={user} onRoleChange={onRoleChange}>
        <div className="bg-white border rounded-xl p-6 text-emerald-800">You do not have access to Sales.</div>
      </SectionLayout>
    );
  }

  const pie = 62;
  const monthly = [
    { label: 'Jan', value: 10 }, { label: 'Feb', value: 12 }, { label: 'Mar', value: 15 }, { label: 'Apr', value: 20 },
    { label: 'May', value: 18 }, { label: 'Jun', value: 24 },
  ];
  const yearly = [
    { label: '2022', value: 120 }, { label: '2023', value: 160 }, { label: '2024', value: 210 },
  ];

  return (
    <SectionLayout
      title="Sales"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onBackHome={onBackHome}
      onLogout={onLogout}
      user={user}
      onRoleChange={onRoleChange}
    >
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-emerald-100 rounded-xl p-4 flex flex-col items-center justify-center">
          <div className="text-sm text-emerald-600">Profit vs Loss</div>
          <PieChart percent={pie} />
        </div>
        <div className="bg-white border border-emerald-100 rounded-xl p-4">
          <div className="text-sm text-emerald-600 mb-2">Monthly Profit</div>
          <BarChart data={monthly} />
        </div>
        <div className="bg-white border border-emerald-100 rounded-xl p-4">
          <div className="text-sm text-emerald-600 mb-2">Yearly Profit</div>
          <BarChart data={yearly} />
        </div>
      </div>
    </SectionLayout>
  );
}
