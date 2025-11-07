import React, { useState } from 'react';
import { Lock, Badge } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (employeeId.trim() && password.trim()) {
        onLogin({ name: 'Team Member', employeeId });
      } else {
        setError('Please enter employee ID and password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-white px-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="relative bg-emerald-600 p-6">
          <div className="pointer-events-none absolute left-0 top-0 h-20 w-20 rounded-br-full bg-emerald-700" />
          <div className="relative">
            <h1 className="text-2xl font-extrabold tracking-wide text-white">FRESH PICK</h1>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/90">smart management, seamless operations</p>
          </div>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-800">Employee ID</label>
              <div className="relative">
                <Badge className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full rounded-md border px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  placeholder="EMP-1234"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-800">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  placeholder="••••••••"
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
