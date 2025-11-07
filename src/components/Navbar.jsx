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
    <header className="relative w-full bg-white border-b border-emerald-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand + Quarter Circle */}
        <div className="relative flex items-center gap-3">
          {/* Quarter-square background */}
          <div className="relative h-56 w-56 rounded-br-full bg-emerald-600 overflow-hidden">
            <div className="absolute inset-0 p-4 pointer-events-none flex flex-col">
              {/* Logo and name */}
              <div className="flex items-center gap-2 text-white font-semibold">
                {/* Simple leaf-like logo */}
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 13c6 0 9-3 9-9 0 0 7 5 7 12a7 7 0 0 1-7 7c-7 0-9-7-9-10z" fill="currentColor"/>
                </svg>
                <span className="text-lg tracking-wide">FRESH PICK</span>
              </div>
              <span className="mt-1 text-white/80 text-xs leading-snug max-w-[12rem]">
                smart management, seamless operations
              </span>
            </div>
          </div>
          <div className="ml-2">
            <h1 className="text-xl font-semibold text-emerald-800">{title}</h1>
            <div className="mt-1 flex items-center gap-2 text-sm text-emerald-700">
              <button onClick={onBackHome} className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-emerald-50">
                <Home size={16} /> Home
              </button>
              <span className="text-emerald-300">|</span>
              <button onClick={onLogout} className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-emerald-50">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* User avatar and role */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <User size={18} />
            </div>
            <div className="leading-tight">
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
