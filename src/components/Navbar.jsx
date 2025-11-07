import React from 'react';
import { Home, LogOut, User } from 'lucide-react';

const roles = [
  { key: 'admin', label: 'Admin' },
  { key: 'manager', label: 'Manager' },
  { key: 'cashier', label: 'Cashier' },
  { key: 'stock_manager', label: 'Stock Manager' },
];

export default function Navbar({ title, tabs, activeTab, onTabChange, onBackHome, onLogout, user, onRoleChange }) {
  return (
    <header className="w-full bg-white/90 backdrop-blur border-b border-emerald-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-emerald-700 font-semibold">
            {/* Simple leaf-like logo */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 13c6 0 9-3 9-9 0 0 7 5 7 12a7 7 0 0 1-7 7c-7 0-9-7-9-10z" />
            </svg>
            <span className="tracking-wide">FRESH PICK</span>
          </div>
          <span className="text-sm text-emerald-500">|</span>
          <h1 className="text-base font-medium text-emerald-900">{title}</h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button onClick={onBackHome} className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-emerald-50 text-emerald-700">
            <Home size={16} /> Home
          </button>
          <button onClick={onLogout} className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-rose-50 text-rose-600">
            <LogOut size={16} /> Logout
          </button>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <User size={18} />
            </div>
            <div className="leading-tight hidden sm:block">
              <div className="text-sm font-medium text-emerald-900">{user?.name || 'User'}</div>
              <div className="text-xs text-emerald-600 capitalize">{user?.role || 'guest'}</div>
            </div>
          </div>
          <select
            className="text-sm border border-emerald-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            value={user?.role}
            onChange={(e) => onRoleChange?.(e.target.value)}
          >
            {roles.map(r => (
              <option key={r.key} value={r.key}>{r.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      {tabs?.length > 0 && (
        <nav className="max-w-6xl mx-auto px-4 pb-3">
          <ul className="flex flex-wrap items-center gap-2">
            {tabs.map((tab) => (
              <li key={tab}
                  className={`px-3 py-1.5 rounded-full text-sm cursor-pointer border ${activeTab === tab ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'}`}
                  onClick={() => onTabChange(tab)}>
                {tab}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
