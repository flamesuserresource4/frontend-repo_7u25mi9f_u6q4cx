import React from 'react';
import { Home, LogOut } from 'lucide-react';

const Navbar = ({ title, tabs = [], activeTab, onTabChange, onBackHome, onLogout }) => {
  return (
    <header className="relative z-20 w-full">
      {/* Big decorative quarter circle that holds brand name and quote */}
      <div className="relative h-40">
        <div className="absolute left-0 top-0 h-40 w-72 rounded-br-full bg-emerald-600" />
        <div className="absolute left-4 top-4 text-white">
          <div className="text-2xl font-extrabold tracking-wide">FRESH PICK</div>
          <div className="text-xs font-semibold uppercase tracking-wide opacity-90">smart management, seamless operations</div>
        </div>

        <div className="absolute right-4 top-3 flex items-center gap-2">
          <button
            onClick={onBackHome}
            className="inline-flex items-center rounded-md bg-emerald-600/10 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-600/15"
          >
            <Home className="mr-2 h-4 w-4" /> Home Page
          </button>
          <button
            onClick={onLogout}
            className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </button>
        </div>
      </div>

      {tabs.length > 0 && (
        <nav className="mx-auto -mb-px flex max-w-7xl gap-2 overflow-x-auto px-4 py-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold ${
                activeTab === tab
                  ? 'bg-emerald-600 text-white'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      )}

      <div className="mx-auto max-w-7xl px-4">
        {title && (
          <div className="py-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">{title}</span>
          </div>
        )}
      </div>

      <div className="h-px w-full bg-gray-100" />
    </header>
  );
};

export default Navbar;
