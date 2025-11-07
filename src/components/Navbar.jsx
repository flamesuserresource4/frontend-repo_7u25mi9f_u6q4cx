import React from 'react';
import { Home, LogOut, ChevronLeft } from 'lucide-react';

const Navbar = ({ title, tabs = [], activeTab, onTabChange, onBackHome, onLogout }) => {
  return (
    <header className="sticky top-0 z-20 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onBackHome}
              className="inline-flex items-center rounded-md border px-2.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Home
            </button>
            <h1 className="ml-3 text-lg font-semibold text-gray-900">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onBackHome}
              className="hidden sm:inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Home className="mr-2 h-4 w-4" /> Dashboard
            </button>
            <button
              onClick={onLogout}
              className="inline-flex items-center rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </button>
          </div>
        </div>
        {tabs.length > 0 && (
          <nav className="-mb-px flex gap-2 overflow-x-auto border-t py-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ${
                  activeTab === tab
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
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
