import React, { useState } from 'react';
import SectionLayout from './SectionLayout';

export default function Delivery({ onBackHome, onLogout, user, onRoleChange }) {
  const tabs = ['Overview'];
  const [activeTab, setActiveTab] = useState('Overview');

  const canAccess = ['admin','manager','stock_manager'].includes(user?.role);
  if (!canAccess) {
    return (
      <SectionLayout title="Delivery" onBackHome={onBackHome} onLogout={onLogout} user={user} onRoleChange={onRoleChange}>
        <div className="bg-white border rounded-xl p-6 text-emerald-800">You do not have access to Delivery.</div>
      </SectionLayout>
    );
  }

  const rows = [
    { order_id: 'D-1001', vendor: 'Green Farms', items: 12, status: 'In Transit' },
    { order_id: 'D-1002', vendor: 'DairyPure', items: 8, status: 'Delivered' },
  ];

  return (
    <SectionLayout
      title="Delivery"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onBackHome={onBackHome}
      onLogout={onLogout}
      user={user}
      onRoleChange={onRoleChange}
    >
      <div className="bg-white border border-emerald-100 rounded-xl p-4">
        <div className="mb-3">
          <div className="text-sm text-emerald-600">Incoming Orders</div>
          <h3 className="text-lg font-semibold text-emerald-900">Overview</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-emerald-700">
                <th className="py-2">Order ID</th>
                <th className="py-2">Vendor</th>
                <th className="py-2">Items</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r)=> (
                <tr key={r.order_id} className="border-t">
                  <td className="py-2">{r.order_id}</td>
                  <td className="py-2">{r.vendor}</td>
                  <td className="py-2">{r.items}</td>
                  <td className="py-2">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SectionLayout>
  );
}
