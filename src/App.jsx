import React, { useMemo, useState } from 'react';
import Login from './components/Login';
import HomeDashboard from './components/HomeDashboard';
import SectionLayout from './components/SectionLayout';
import { Edit2, Trash2 } from 'lucide-react';

const Row = ({ item, onEdit, onDelete, fields }) => {
  return (
    <div className="grid grid-cols-12 items-center gap-4 rounded-lg border bg-white p-3">
      {fields.map((f, idx) => (
        <div key={idx} className="col-span-3 truncate text-sm text-gray-800">{item[f] ?? '-'}</div>
      ))}
      <div className="col-span-3 flex justify-end gap-2">
        <button onClick={() => onEdit(item)} className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50">
          <Edit2 className="mr-1 h-4 w-4"/> Edit
        </button>
        <button onClick={() => onDelete(item)} className="inline-flex items-center rounded-md bg-rose-600 px-2 py-1 text-xs font-medium text-white hover:bg-rose-700">
          <Trash2 className="mr-1 h-4 w-4"/> Delete
        </button>
      </div>
    </div>
  );
};

const SectionHeader = ({ title, actions }) => (
  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
    <div className="flex items-center gap-2">{actions}</div>
  </div>
);

const FilterBar = ({ children }) => (
  <div className="mb-4 grid grid-cols-1 gap-3 rounded-lg border bg-white p-3 sm:grid-cols-2 lg:grid-cols-4">
    {children}
  </div>
);

export default function App() {
  const [user, setUser] = useState(null);
  const [section, setSection] = useState('home');

  // Tabs per section
  const [deliveryTab, setDeliveryTab] = useState('Daily Entries');
  const [stockTab, setStockTab] = useState('Available Stock');
  const [employeeTab, setEmployeeTab] = useState('Employee Info');
  const [billingStep, setBillingStep] = useState('Add Items');

  const handleLogout = () => {
    setUser(null);
    setSection('home');
  };

  const onEdit = (item) => alert('Edit entry: ' + JSON.stringify(item));
  const onDelete = (item) => alert('Delete entry: ' + JSON.stringify(item));

  if (!user) return <Login onLogin={setUser} />;

  if (section === 'home') {
    return <HomeDashboard onSelect={setSection} />;
  }

  // Dummy data used for UI demonstration only
  const deliveryEntries = useMemo(() => ([
    { date: '2025-11-01', supplier: 'Fresh Farms', items: 24, status: 'Received' },
    { date: '2025-11-02', supplier: 'Green Valley', items: 18, status: 'Pending' },
  ]), []);

  const suppliers = useMemo(() => ([
    { name: 'Fresh Farms', contact: 'fresh@farm.com', phone: '555-0123' },
    { name: 'Green Valley', contact: 'valley@green.com', phone: '555-0456' },
  ]), []);

  const stockAvailable = useMemo(() => ([
    { product: 'Milk 1L', qty: 120, batch: 'B102', expiry: '2026-02-10' },
    { product: 'Eggs 12pc', qty: 60, batch: 'B221', expiry: '2025-12-01' },
  ]), []);

  const stockExpired = useMemo(() => ([
    { product: 'Yogurt 200g', qty: 14, batch: 'B099', expiry: '2025-10-01' },
  ]), []);

  const employees = useMemo(() => ([
    { id: 'E-101', name: 'Alice', role: 'Cashier' },
    { id: 'E-102', name: 'Bob', role: 'Stock' },
  ]), []);

  const [attendance, setAttendance] = useState({});
  const toggleAttendance = (id) => setAttendance((prev) => ({ ...prev, [id]: !prev[id] }));

  // Billing state
  const [cart, setCart] = useState([]);
  const [productInput, setProductInput] = useState({ name: '', qty: 1 });

  const addToCart = () => {
    if (!productInput.name || productInput.qty <= 0) return;
    setCart((c) => [...c, { ...productInput }]);
    setProductInput({ name: '', qty: 1 });
  };

  const removeFromCart = (idx) => setCart((c) => c.filter((_, i) => i !== idx));

  const fakePrices = { 'Milk 1L': 1.2, 'Eggs 12pc': 2.5, Bread: 1.0 };
  const billTotal = cart.reduce((sum, it) => sum + (fakePrices[it.name] || 1.5) * it.qty, 0);

  // SALES/PROFITS demo data
  const productsProfit = useMemo(() => ([
    { product: 'Milk 1L', monthly: 420, annual: 5120 },
    { product: 'Eggs 12pc', monthly: 310, annual: 3880 },
    { product: 'Bread', monthly: 220, annual: 2400 },
  ]), []);

  const [filters, setFilters] = useState({ name: '', from: '', to: '' });
  const filteredProfit = productsProfit.filter((p) => (
    (!filters.name || p.product.toLowerCase().includes(filters.name.toLowerCase()))
  ));

  const goHome = () => setSection('home');

  // Render sections
  switch (section) {
    case 'delivery':
      return (
        <SectionLayout
          title="Delivery"
          tabs={["Daily Entries", "Suppliers Info"]}
          activeTab={deliveryTab}
          onTabChange={setDeliveryTab}
          onBackHome={goHome}
          onLogout={handleLogout}
        >
          {deliveryTab === 'Daily Entries' ? (
            <div>
              <SectionHeader title="Daily Delivery Entries" />
              <div className="space-y-3">
                {deliveryEntries.map((e, i) => (
                  <Row key={i} item={e} fields={["date", "supplier", "items", "status"]} onEdit={onEdit} onDelete={onDelete} />
                ))}
              </div>
            </div>
          ) : (
            <div>
              <SectionHeader title="Suppliers" />
              <div className="space-y-3">
                {suppliers.map((s, i) => (
                  <Row key={i} item={s} fields={["name", "contact", "phone"]} onEdit={onEdit} onDelete={onDelete} />
                ))}
              </div>
            </div>
          )}
        </SectionLayout>
      );

    case 'stock':
      return (
        <SectionLayout
          title="Stock"
          tabs={["Available Stock", "Expired Stock"]}
          activeTab={stockTab}
          onTabChange={setStockTab}
          onBackHome={goHome}
          onLogout={handleLogout}
        >
          {stockTab === 'Available Stock' ? (
            <div className="space-y-6">
              <SectionHeader title="Available Stock" />
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-xl border bg-white p-4">
                  <h3 className="mb-2 font-medium">Monthly Profit</h3>
                  <div className="h-48 rounded-md bg-gradient-to-br from-emerald-100 to-emerald-50"></div>
                </div>
                <div className="rounded-xl border bg-white p-4">
                  <h3 className="mb-2 font-medium">Annual Profit</h3>
                  <div className="h-48 rounded-md bg-gradient-to-br from-blue-100 to-blue-50"></div>
                </div>
              </div>
              <div className="space-y-3">
                {stockAvailable.map((s, i) => (
                  <Row key={i} item={s} fields={["product", "qty", "batch", "expiry"]} onEdit={onEdit} onDelete={onDelete} />
                ))}
              </div>
            </div>
          ) : (
            <div>
              <SectionHeader title="Expired Stock" />
              <div className="space-y-3">
                {stockExpired.map((s, i) => (
                  <Row key={i} item={s} fields={["product", "qty", "batch", "expiry"]} onEdit={onEdit} onDelete={onDelete} />
                ))}
              </div>
            </div>
          )}
        </SectionLayout>
      );

    case 'employees':
      return (
        <SectionLayout
          title="Employees"
          tabs={["Employee Info", "Attendance"]}
          activeTab={employeeTab}
          onTabChange={setEmployeeTab}
          onBackHome={goHome}
          onLogout={handleLogout}
        >
          {employeeTab === 'Employee Info' ? (
            <div>
              <SectionHeader title="Employee Info" />
              <div className="space-y-3">
                {employees.map((e, i) => (
                  <Row key={i} item={e} fields={["id", "name", "role"]} onEdit={onEdit} onDelete={onDelete} />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <SectionHeader title="Daily Attendance" />
              <div className="space-y-3">
                {employees.map((e) => (
                  <div key={e.id} className="grid grid-cols-12 items-center gap-4 rounded-lg border bg-white p-3">
                    <div className="col-span-3 text-sm">{e.id}</div>
                    <div className="col-span-3 text-sm">{e.name}</div>
                    <div className="col-span-3 text-sm">{e.role}</div>
                    <div className="col-span-3 flex items-center justify-end gap-4">
                      <label className="inline-flex items-center gap-2 text-sm">
                        <input type="checkbox" className="h-4 w-4" checked={!!attendance[e.id]} onChange={() => toggleAttendance(e.id)} /> Present
                      </label>
                      <button onClick={() => onEdit(e)} className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50">
                        <Edit2 className="mr-1 h-4 w-4"/> Edit
                      </button>
                      <button onClick={() => onDelete(e)} className="inline-flex items-center rounded-md bg-rose-600 px-2 py-1 text-xs font-medium text-white hover:bg-rose-700">
                        <Trash2 className="mr-1 h-4 w-4"/> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionLayout>
      );

    case 'billing':
      return (
        <SectionLayout
          title="Billing"
          tabs={["Add Items", "Make Bill"]}
          activeTab={billingStep}
          onTabChange={setBillingStep}
          onBackHome={goHome}
          onLogout={handleLogout}
        >
          {billingStep === 'Add Items' ? (
            <div className="space-y-4">
              <SectionHeader title="Add Products to Bill" />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <input
                  value={productInput.name}
                  onChange={(e) => setProductInput((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Product name"
                  className="rounded-md border px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  min={1}
                  value={productInput.qty}
                  onChange={(e) => setProductInput((p) => ({ ...p, qty: Number(e.target.value) }))}
                  placeholder="Qty"
                  className="rounded-md border px-3 py-2 text-sm"
                />
                <button onClick={addToCart} className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">Add</button>
              </div>
              <div className="space-y-3">
                {cart.map((it, idx) => (
                  <div key={idx} className="grid grid-cols-12 items-center gap-4 rounded-lg border bg-white p-3">
                    <div className="col-span-4 text-sm">{it.name}</div>
                    <div className="col-span-4 text-sm">Qty: {it.qty}</div>
                    <div className="col-span-4 flex justify-end">
                      <button onClick={() => removeFromCart(idx)} className="rounded-md bg-rose-600 px-3 py-1 text-xs font-medium text-white hover:bg-rose-700">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <SectionHeader title="Bill Summary" />
              <div className="space-y-3">
                {cart.map((it, idx) => (
                  <div key={idx} className="grid grid-cols-12 items-center gap-4 rounded-lg border bg-white p-3">
                    <div className="col-span-4 text-sm">{it.name}</div>
                    <div className="col-span-4 text-sm">Qty: {it.qty}</div>
                    <div className="col-span-4 text-right text-sm">Price: ${((fakePrices[it.name] || 1.5) * it.qty).toFixed(2)}</div>
                  </div>
                ))}
                <div className="flex items-center justify-between rounded-lg border bg-white p-3 font-semibold">
                  <span>Total</span>
                  <span>${billTotal.toFixed(2)}</span>
                </div>
                <button className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">Confirm & Print</button>
              </div>
            </div>
          )}
        </SectionLayout>
      );

    case 'sales':
      return (
        <SectionLayout
          title="Sales & Profit"
          onBackHome={goHome}
          onLogout={handleLogout}
        >
          <SectionHeader title="Overview" />
          <FilterBar>
            <input
              value={filters.name}
              onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))}
              placeholder="Filter by product"
              className="rounded-md border px-3 py-2 text-sm"
            />
            <input type="date" value={filters.from} onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))} className="rounded-md border px-3 py-2 text-sm" />
            <input type="date" value={filters.to} onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))} className="rounded-md border px-3 py-2 text-sm" />
            <button className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">Apply</button>
          </FilterBar>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl border bg-white p-4">
              <h3 className="mb-2 font-medium">Monthly Profit</h3>
              <div className="h-48 rounded-md bg-gradient-to-br from-amber-100 to-amber-50"></div>
            </div>
            <div className="rounded-xl border bg-white p-4">
              <h3 className="mb-2 font-medium">Annual Profit</h3>
              <div className="h-48 rounded-md bg-gradient-to-br from-indigo-100 to-indigo-50"></div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <h3 className="text-lg font-semibold">Per-Product Profit/Loss</h3>
            {filteredProfit.map((p, i) => (
              <div key={i} className="grid grid-cols-12 items-center gap-4 rounded-lg border bg-white p-3">
                <div className="col-span-4 text-sm">{p.product}</div>
                <div className="col-span-4 text-sm">Monthly: ${p.monthly}</div>
                <div className="col-span-4 text-sm">Annual: ${p.annual}</div>
              </div>
            ))}
          </div>
        </SectionLayout>
      );

    default:
      return <HomeDashboard onSelect={setSection} />;
  }
}
