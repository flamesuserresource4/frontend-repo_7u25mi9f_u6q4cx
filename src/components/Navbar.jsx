import React from 'react';
import { Home, LogOut } from 'lucide-react';

const Navbar = ({ title, tabs = [], activeTab, onTabChange, onBackHome, onLogout }) => {
  return (
    <header className="relative z-20 w-full border-b bg-emerald-600">
      {/* decorative quarter circle */}
      <div className="pointer-events-none absolute left-0 top-0 h-24 w-24 rounded-br-full bg-emerald-700" />

      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-wide text-white">FRESH PICK</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-white/90">smart management, seamless operations</span>
            </div>
            {title && (
              <span className="ml-4 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white">{title}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onBackHome}
              className="inline-flex items-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20"
            >
              <Home className="mr-2 h-4 w-4" /> Home Page
            </button>
            <button
              onClick={onLogout}
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </button>
          </div>
        </div>
        {tabs.length > 0 && (
          <nav className="-mb-px flex gap-2 overflow-x-auto border-t border-white/20 py-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold ${
                  activeTab === tab
                    ? 'bg-white text-emerald-700'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
