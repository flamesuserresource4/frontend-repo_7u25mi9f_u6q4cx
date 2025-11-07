import React, { useMemo, useState } from 'react';
import SectionLayout from './SectionLayout';
import Modal from './Modal';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const Row = ({ item, onEdit, onDelete, fields }) => (
  <div className="grid grid-cols-12 items-center gap-4 rounded-lg border bg-white p-3">
    {fields.map((f, idx) => (
      <div key={idx} className="col-span-2 truncate text-sm text-gray-800">{String(item[f] ?? '-')}</div>
    ))}
    <div className="col-span-2 ml-auto flex justify-end gap-2">
      <button onClick={() => onEdit(item)} className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50">
        <Edit2 className="mr-1 h-4 w-4"/> Edit
      </button>
      <button onClick={() => onDelete(item)} className="inline-flex items-center rounded-md bg-rose-600 px-2 py-1 text-xs font-medium text-white hover:bg-rose-700">
        <Trash2 className="mr-1 h-4 w-4"/> Delete
      </button>
    </div>
  </div>
);

const SectionHeader = ({ title, actions }) => (
  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
    <div className="flex items-center gap-2">{actions}</div>
  </div>
);

export default function Employees({ onBackHome, onLogout }) {
  const [tab, setTab] = useState('Info');

  // Demo data
  const [employees, setEmployees] = useState([
    { employee_id: 'E-1001', emp_name: 'Ava Patel', designation: 'Cashier', daily_wage: 45, password: 'ava123' },
    { employee_id: 'E-1002', emp_name: 'Liam Chen', designation: 'Stock Lead', daily_wage: 60, password: 'liam@456' },
  ]);

  const [attendance, setAttendance] = useState({}); // { '2025-11-07': { 'E-1001': true, 'E-1002': false } }

  const [empModalOpen, setEmpModalOpen] = useState(false);
  const [editingEmpId, setEditingEmpId] = useState(null);
  const emptyEmp = { employee_id: '', emp_name: '', designation: '', daily_wage: 0, password: '' };
  const [empForm, setEmpForm] = useState(emptyEmp);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const todayAttendance = attendance[today] || {};

  const openAddEmp = () => { setEditingEmpId(null); setEmpForm(emptyEmp); setEmpModalOpen(true); };
  const openEditEmp = (item) => { setEditingEmpId(item.employee_id); setEmpForm({ ...item }); setEmpModalOpen(true); };
  const saveEmp = () => {
    if (!empForm.employee_id || !empForm.emp_name) return;
    const normalized = { ...empForm, daily_wage: Number(empForm.daily_wage) || 0 };
    setEmployees((prev) => {
      const exists = prev.find((e) => e.employee_id === normalized.employee_id);
      if (editingEmpId || exists) {
        return prev.map((e) => (e.employee_id === (editingEmpId || normalized.employee_id) ? normalized : e));
      }
      return [...prev, normalized];
    });
    setEmpModalOpen(false);
  };
  const deleteEmp = (item) => {
    if (confirm(`Delete employee ${item.emp_name}?`)) {
      setEmployees((prev) => prev.filter((e) => e.employee_id !== item.employee_id));
      setAttendance((prev) => {
        const copy = { ...prev };
        Object.keys(copy).forEach((date) => { if (copy[date]) delete copy[date][item.employee_id]; });
        return copy;
      });
    }
  };

  const toggleAttendance = (empId) => {
    setAttendance((prev) => {
      const copy = { ...prev };
      const day = copy[today] ? { ...copy[today] } : {};
      day[empId] = !day[empId];
      copy[today] = day;
      return copy;
    });
  };

  return (
    <SectionLayout
      title="Employees"
      tabs={["Info", "Attendance"]}
      activeTab={tab}
      onTabChange={setTab}
      onBackHome={onBackHome}
      onLogout={onLogout}
    >
      {tab === 'Info' ? (
        <div className="space-y-4">
          <SectionHeader
            title="Employees Info"
            actions={(
              <button onClick={openAddEmp} className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                <Plus className="h-4 w-4"/> Add Employee
              </button>
            )}
          />
          <div className="hidden lg:block text-xs text-gray-500">Columns: employee id, emp name, designation, daily wage, password</div>
          <div className="space-y-3">
            {employees.map((e) => (
              <Row
                key={e.employee_id}
                item={e}
                fields={["employee_id", "emp_name", "designation", "daily_wage", "password"]}
                onEdit={openEditEmp}
                onDelete={deleteEmp}
              />
            ))}
          </div>

          <Modal
            title={editingEmpId ? 'Edit Employee' : 'Add Employee'}
            isOpen={empModalOpen}
            onClose={() => setEmpModalOpen(false)}
            onSubmit={saveEmp}
            submitLabel={editingEmpId ? 'Save Changes' : 'Create Employee'}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                value={empForm.employee_id}
                onChange={(e) => setEmpForm((f) => ({ ...f, employee_id: e.target.value }))}
                placeholder="Employee ID"
                className="rounded-md border px-3 py-2 text-sm"
              />
              <input
                value={empForm.emp_name}
                onChange={(e) => setEmpForm((f) => ({ ...f, emp_name: e.target.value }))}
                placeholder="Employee Name"
                className="rounded-md border px-3 py-2 text-sm"
              />
              <input
                value={empForm.designation}
                onChange={(e) => setEmpForm((f) => ({ ...f, designation: e.target.value }))}
                placeholder="Designation"
                className="rounded-md border px-3 py-2 text-sm"
              />
              <input
                type="number"
                value={empForm.daily_wage}
                onChange={(e) => setEmpForm((f) => ({ ...f, daily_wage: e.target.value }))}
                placeholder="Daily Wage"
                className="rounded-md border px-3 py-2 text-sm"
              />
              <input
                value={empForm.password}
                onChange={(e) => setEmpForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="Password"
                className="rounded-md border px-3 py-2 text-sm"
              />
            </div>
          </Modal>
        </div>
      ) : (
        <div className="space-y-4">
          <SectionHeader title={`Attendance for ${today}`} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {employees.map((e) => {
              const checked = !!todayAttendance[e.employee_id];
              return (
                <label key={e.employee_id} className="flex cursor-pointer items-center justify-between rounded-lg border bg-white p-3">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{e.emp_name}</div>
                    <div className="text-xs text-gray-600">{e.designation}</div>
                  </div>
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-emerald-600"
                    checked={checked}
                    onChange={() => toggleAttendance(e.employee_id)}
                  />
                </label>
              );
            })}
          </div>
        </div>
      )}
    </SectionLayout>
  );
}
