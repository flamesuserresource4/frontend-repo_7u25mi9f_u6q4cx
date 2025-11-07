import React from 'react';
import Navbar from './Navbar';

export default function SectionLayout({ title, tabs = [], activeTab, onTabChange, onBackHome, onLogout, children, user, onRoleChange }) {
  return (
    <div className="min-h-screen bg-emerald-50/30">
      <Navbar
        title={title}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        onBackHome={onBackHome}
        onLogout={onLogout}
        user={user}
        onRoleChange={onRoleChange}
      />
      <main className="max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
