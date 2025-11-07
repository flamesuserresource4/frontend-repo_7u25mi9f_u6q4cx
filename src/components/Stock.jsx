import React, { useState } from 'react';
import SectionLayout from './SectionLayout';

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

export default function Stock({ onBackHome, onLogout, user, onRoleChange }) {
  const tabs = ['Overview'];
  const [activeTab, setActiveTab] = useState('Overview');

  const canAccess = ['admin','manager','stock_manager'].includes(user?.role);
  if (!canAccess) {
    return (
      <SectionLayout title="Stock" onBackHome={onBackHome} onLogout={onLogout} user={user} onRoleChange={onRoleChange}>
        <div className="bg-white border rounded-xl p-6 text-emerald-800">You do not have access to Stock.</div>
      </SectionLayout>
    );
  }

  const stockData = [
    { label: 'Milk', value: 20 },
    { label: 'Eggs', value: 35 },
    { label: 'Apples', value: 15 },
    { label: 'Rice', value: 28 },
  ];
  const replenishment = [
    { label: 'Week1', value: 10 },
    { label: 'Week2', value: 18 },
    { label: 'Week3', value: 14 },
    { label: 'Week4', value: 22 },
  ];

  return (
    <SectionLayout
      title="Stock"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onBackHome={onBackHome}
      onLogout={onLogout}
      user={user}
      onRoleChange={onRoleChange}
    >
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-emerald-100 rounded-xl p-4">
          <div className="text-sm text-emerald-600 mb-2">Current Stock</div>
          <BarChart data={stockData} />
        </div>
        <div className="bg-white border border-emerald-100 rounded-xl p-4">
          <div className="text-sm text-emerald-600 mb-2">Replenishment</div>
          <BarChart data={replenishment} />
        </div>
      </div>
    </SectionLayout>
  );
}
