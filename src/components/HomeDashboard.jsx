import React from 'react';
import { BarChart3, Package, Users, ShoppingCart } from 'lucide-react';

export default function HomeDashboard({ onNavigate }) {
  const cards = [
    { key: 'Delivery', label: 'Delivery', icon: Package },
    { key: 'Stock', label: 'Stock', icon: BarChart3 },
    { key: 'Employees', label: 'Employees', icon: Users },
    { key: 'Billing', label: 'Billing', icon: ShoppingCart },
    { key: 'Sales', label: 'Sales', icon: BarChart3 },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((c) => (
        <button key={c.key} onClick={() => onNavigate(c.key)} className="group bg-white p-5 rounded-xl border border-emerald-100 hover:shadow-md transition flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <c.icon />
          </div>
          <div className="text-left">
            <div className="text-sm text-emerald-600">Module</div>
            <div className="text-lg font-semibold text-emerald-900">{c.label}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
