import React, { useState } from 'react';
import { Lock } from 'lucide-react';

const USERS = [
  { username: 'admin', password: 'admin', name: 'Aisha Khan', role: 'admin' },
  { username: 'manager', password: 'manager', name: 'Rohit Verma', role: 'manager' },
  { username: 'cashier', password: 'cashier', name: 'Sara Patel', role: 'cashier' },
  { username: 'stock', password: 'stock', name: 'Manoj Shah', role: 'stock_manager' },
];

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const user = USERS.find(u => u.username === username && u.password === password);
    if (!user) return setError('Invalid credentials');
    onLogin({ name: user.name, role: user.role });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50/50 p-6">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-700 mb-4">
          <Lock />
          <h2 className="font-semibold text-lg">Sign in</h2>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-xs text-emerald-700">Username</label>
            <input value={username} onChange={(e)=>setUsername(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" placeholder="Enter username" />
          </div>
          <div>
            <label className="text-xs text-emerald-700">Password</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" placeholder="Enter password" />
          </div>
          {error && <div className="text-xs text-red-600">{error}</div>}
          <button type="submit" className="w-full mt-2 bg-emerald-600 text-white rounded-md py-2 text-sm hover:bg-emerald-700">Login</button>
        </form>
      </div>
    </div>
  );
}
