import React, { useMemo, useState } from 'react';
import Login from './components/Login';
import SectionLayout from './components/SectionLayout';
import HomeDashboard from './components/HomeDashboard';
import Billing from './components/Billing';

const ALL_MODULES = ['Home','Billing'];

const roleAccess = {
  admin: ALL_MODULES,
  manager: ALL_MODULES,
  cashier: ['Home','Billing'],
  stock_manager: ['Home'],
};

export default function App() {
  const [user, setUser] = useState(null);
  const [section, setSection] = useState('Home');

  const accessible = useMemo(() => {
    if (!user) return [];
    return roleAccess[user.role] || ['Home'];
  }, [user]);

  const navigate = (to) => setSection(to);

  if (!user) return <Login onLogin={(u) => { setUser(u); setSection('Home'); }} />;

  const onBackHome = () => setSection('Home');
  const onLogout = () => { setUser(null); setSection('Home'); };
  const onRoleChange = (r) => setUser((u)=> ({ ...u, role: r }));

  if (section === 'Home') {
    return (
      <SectionLayout title="FRESH PICK — Admin Dashboard" onBackHome={onBackHome} onLogout={onLogout} user={user} onRoleChange={onRoleChange}>
        <div className="mb-5">
          <div className="text-sm text-emerald-700">Welcome</div>
          <h2 className="text-2xl font-semibold text-emerald-900">Choose a module</h2>
        </div>
        <HomeDashboard onNavigate={(k) => accessible.includes(k) ? navigate(k) : null} />
      </SectionLayout>
    );
  }

  if (section === 'Billing') {
    return <Billing onBackHome={onBackHome} onLogout={onLogout} user={user} onRoleChange={onRoleChange} />;
  }

  return null;
}
