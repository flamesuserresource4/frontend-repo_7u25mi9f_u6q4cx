import React from 'react';
import { Truck, Boxes, Users, Receipt, LayoutDashboard, BarChart3 } from 'lucide-react';

const features = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'from-emerald-600 to-teal-500' },
  { key: 'delivery', label: 'Delivery', icon: Truck, color: 'from-blue-500 to-cyan-500' },
  { key: 'stock', label: 'Stock', icon: Boxes, color: 'from-emerald-500 to-teal-500' },
  { key: 'employees', label: 'Employees', icon: Users, color: 'from-purple-500 to-fuchsia-500' },
  { key: 'sales', label: 'Sales', icon: BarChart3, color: 'from-amber-500 to-orange-500' },
  { key: 'billing', label: 'Billing', icon: Receipt, color: 'from-rose-500 to-pink-500' },
];

const HomeDashboard = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-wide text-emerald-700">FRESH PICK</h1>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-emerald-700/80">smart management, seamless operations</p>
          <p className="mt-4 text-gray-700">Choose a module to manage daily operations</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ key, label, icon: Icon, color }) => (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`group rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md`}
            >
              <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${color} p-3 text-white`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
                  <p className="mt-1 text-sm text-gray-600">Open the {label.toLowerCase()} module</p>
                </div>
                <span className="text-2xl transition-transform group-hover:translate-x-1">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
