import React, { useMemo, useState } from 'react';
import SectionLayout from './SectionLayout';
import Modal from './Modal';

export default function Employees({ onBackHome, onLogout, user, onRoleChange }) {
  const tabs = ['Info', 'Attendance'];
  const [activeTab, setActiveTab] = useState('Info');
  const [employees, setEmployees] = useState([
    { employee_id: 'E001', emp_name: 'Anita', designation: 'Cashier', daily_wage: 800, password: '1234' },
    { employee_id: 'E002', emp_name: 'Ravi', designation: 'Manager', daily_wage: 1500, password: 'abcd' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ employee_id: '', emp_name: '', designation: '', daily_wage: '', password: '' });
  const [editingId, setEditingId] = useState(null);

  // Attendance state keyed by date -> employee_id -> boolean
  const today = new Date();
  const todayKey = today.toISOString().slice(0,10);
  const [attendance, setAttendance] = useState({ [todayKey]: {} });
  const [attendanceLockedDates, setAttendanceLockedDates] = useState([]); // dates already submitted

  const canEdit = ['admin','manager'].includes(user?.role);

  const openAdd = () => {
    setEditingId(null);
    setForm({ employee_id: '', emp_name: '', designation: '', daily_wage: '', password: '' });
    setShowModal(true);
  };
  const openEdit = (emp) => {
    setEditingId(emp.employee_id);
    setForm(emp);
    setShowModal(true);
  };
  const save = () => {
    if (editingId) {
      setEmployees(prev => prev.map(e => e.employee_id === editingId ? form : e));
    } else {
      setEmployees(prev => [...prev, { ...form, daily_wage: Number(form.daily_wage) }]);
    }
    setShowModal(false);
  };
  const removeEmp = (id) => setEmployees(prev => prev.filter(e => e.employee_id !== id));

  const AttendanceGrid = () => {
    const dateKey = todayKey; // simplified to today
    const locked = attendanceLockedDates.includes(dateKey);

    const toggle = (id) => {
      if (locked) return;
      setAttendance((prev) => ({
        ...prev,
        [dateKey]: { ...(prev[dateKey]||{}), [id]: !(prev[dateKey]?.[id]) }
      }));
    };

    const submitAttendance = () => {
      if (locked) return;
      setAttendanceLockedDates(prev => [...prev, dateKey]);
      // In real app, send to backend here
    };

    return (
      <div className="bg-white border border-emerald-100 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm text-emerald-600">Attendance Date</div>
            <div className="text-lg font-semibold text-emerald-900">{dateKey}</div>
          </div>
          <button
            onClick={submitAttendance}
            disabled={locked}
            className={`px-4 py-2 rounded-md text-white ${locked ? 'bg-emerald-300' : 'bg-emerald-600 hover:bg-emerald-700'}`}
          >{locked ? 'Submitted' : 'Submit'}</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-emerald-700">
                <th className="py-2">ID</th>
                <th className="py-2">Name</th>
                <th className="py-2">Present</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(e => (
                <tr key={e.employee_id} className="border-t">
                  <td className="py-2">{e.employee_id}</td>
                  <td className="py-2">{e.emp_name}</td>
                  <td className="py-2">
                    <input type="checkbox" checked={!!attendance[todayKey]?.[e.employee_id]} onChange={() => toggle(e.employee_id)} disabled={locked} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {locked && <p className="mt-2 text-xs text-emerald-700">Attendance locked for today. It will open again tomorrow.</p>}
      </div>
    );
  };

  return (
    <SectionLayout
      title="Employees"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onBackHome={onBackHome}
      onLogout={onLogout}
      user={user}
      onRoleChange={onRoleChange}
    >
      {activeTab === 'Info' && (
        <div className="bg-white border border-emerald-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm text-emerald-600">Manage Employees</div>
              <h3 className="text-lg font-semibold text-emerald-900">Info</h3>
            </div>
            {canEdit && <button onClick={openAdd} className="px-3 py-2 rounded-md bg-emerald-600 text-white text-sm">Add Employee</button>}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-emerald-700">
                  <th className="py-2">Employee ID</th>
                  <th className="py-2">Name</th>
                  <th className="py-2">Designation</th>
                  <th className="py-2">Daily Wage</th>
                  <th className="py-2">Password</th>
                  {canEdit && <th className="py-2">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {employees.map(e => (
                  <tr key={e.employee_id} className="border-t">
                    <td className="py-2">{e.employee_id}</td>
                    <td className="py-2">{e.emp_name}</td>
                    <td className="py-2">{e.designation}</td>
                    <td className="py-2">₹{e.daily_wage}</td>
                    <td className="py-2">{e.password}</td>
                    {canEdit && (
                      <td className="py-2 space-x-2">
                        <button onClick={()=>openEdit(e)} className="px-3 py-1 rounded border text-emerald-700 border-emerald-200">Edit</button>
                        <button onClick={()=>removeEmp(e.employee_id)} className="px-3 py-1 rounded border text-red-700 border-red-200">Delete</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Modal open={showModal} title={editingId ? 'Edit Employee' : 'Add Employee'} onClose={()=>setShowModal(false)} onSubmit={save}>
            <div>
              <label className="text-xs text-emerald-700">Employee ID</label>
              <input className="mt-1 w-full border rounded-md px-3 py-2 text-sm" value={form.employee_id} onChange={(e)=>setForm({...form, employee_id:e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-emerald-700">Name</label>
              <input className="mt-1 w-full border rounded-md px-3 py-2 text-sm" value={form.emp_name} onChange={(e)=>setForm({...form, emp_name:e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-emerald-700">Designation</label>
              <input className="mt-1 w-full border rounded-md px-3 py-2 text-sm" value={form.designation} onChange={(e)=>setForm({...form, designation:e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-emerald-700">Daily Wage</label>
              <input type="number" className="mt-1 w-full border rounded-md px-3 py-2 text-sm" value={form.daily_wage} onChange={(e)=>setForm({...form, daily_wage:e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-emerald-700">Password</label>
              <input className="mt-1 w-full border rounded-md px-3 py-2 text-sm" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} />
            </div>
          </Modal>
        </div>
      )}

      {activeTab === 'Attendance' && (
        <AttendanceGrid />
      )}
    </SectionLayout>
  );
}
