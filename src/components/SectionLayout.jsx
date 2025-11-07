import React from 'react';
import Navbar from './Navbar';

const SectionLayout = ({ title, tabs = [], activeTab, onTabChange, onBackHome, onLogout, children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        title={title}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        onBackHome={onBackHome}
        onLogout={onLogout}
      />
      <main className="mx-auto max-w-7xl px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default SectionLayout;
