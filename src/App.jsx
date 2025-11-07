import React, { useMemo, useState } from 'react';
import Login from './components/Login';
import HomeDashboard from './components/HomeDashboard';
import SectionLayout from './components/SectionLayout';
import Modal from './components/Modal';
import { Edit2, Trash2, Plus } from 'lucide-react';

// Row item for list views
const Row = ({ item, onEdit, onDelete, fields }) => (
  <div className="grid grid-cols-12 items-center gap-4 rounded-lg border bg-white p-3">
    {fields.map((f, idx) => (
      <div key={idx} className="col-span-2 truncate text-sm text-gray-800">{item[f] ?? '-'}</div>
    ))}
    <div className="col-span-2 flex justify-end gap-2">
      <button onClick={() => onEdit(item)} className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50">
        <Edit2 className="mr-1 h-4 w-4"/> Edit
      </button>
      <button onClick={() => onDelete(item)} className="inline-flex items-center rounded-md bg-rose-600 px-2 py-1 text-xs font-medium text-white hover:bg-rose-700">
        <Trash2 className="mr-1 h-4 w-4"/> Delete
      </button>
    </div>
  </div>
);

// Section header with actions
const SectionHeader = ({ title, actions }) => (
  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
    <div className="flex items-center gap-2">{actions}</div>
  </div>
);

export default function App() {
  // Authentication + navigation (hooks must be declared before any return)
  const [user, setUser] = useState(null);
  const [section, setSection] = useState('home');

  // Delivery module UI state
  const [deliveryTab, setDeliveryTab] = useState('Daily Entries');

  // Demo data for Delivery
  const [suppliers, setSuppliers] = useState([
    { supplier_id: 'S-1001', supplier_name: 'Fresh Farms', contact_no: '555-0123', category: 'Produce' },
    { supplier_id: 'S-1002', supplier_name: 'Dairy Best', contact_no: '555-0456', category: 'Dairy' },
  ]);

  const [entries, setEntries] = useState([
    { supplier_id: 'S-1001', product_id: 'P-2001', expiry_date: '2026-02-10', quantity: 24, selling_price: 1.8, cost_price: 1.2 },
    { supplier_id: 'S-1002', product_id: 'P-2002', expiry_date: '2025-12-01', quantity: 18, selling_price: 2.9, cost_price: 2.2 },
  ]);

  // Dashboard demo data
  const [stockItems] = useState([
    { product_id: 'P-2001', name: 'Gala Apples', quantity: 8, reorder_level: 10 },
    { product_id: 'P-2002', name: 'Whole Milk 1L', quantity: 42, reorder_level: 20 },
    { product_id: 'P-2003', name: 'Brown Bread', quantity: 5, reorder_level: 12 },
    { product_id: 'P-2004', name: 'Free-range Eggs', quantity: 16, reorder_level: 15 },
  ]);
  const [deliveriesSchedule] = useState([
    { supplier: 'Fresh Farms', eta_date: new Date().toISOString().slice(0, 10), items: 5 },
    { supplier: 'Dairy Best', eta_date: new Date(Date.now() + 24*60*60*1000).toISOString().slice(0, 10), items: 3 },
  ]);
  const [salesToday] = useState({ amount: 1243.5, orders: 87 });

  // Supplier modal state
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [editingSupplierId, setEditingSupplierId] = useState(null);
  const emptySupplier = { supplier_id: '', supplier_name: '', contact_no: '', category: '' };
  const [supplierForm, setSupplierForm] = useState(emptySupplier);

  // Entry modal state
  const [entryModalOpen, setEntryModalOpen] = useState(false);
  const [editingEntryIndex, setEditingEntryIndex] = useState(null);
  const emptyEntry = { supplier_id: '', product_id: '', expiry_date: '', quantity: 0, selling_price: 0, cost_price: 0 };
  const [entryForm, setEntryForm] = useState(emptyEntry);

  // Derived dashboard values
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const expiringSoon = useMemo(() => {
    const now = new Date();
    const inTwoDays = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    return entries.filter((e) => {
      const d = new Date(e.expiry_date);
      return d >= now && d <= inTwoDays;
    });
  }, [entries]);
  const lowStock = useMemo(() => stockItems.filter((s) => s.quantity <= s.reorder_level), [stockItems]);
  const todaysDeliveries = useMemo(() => deliveriesSchedule.filter((d) => d.eta_date === todayStr), [deliveriesSchedule, todayStr]);

  // Event handlers
  const handleLogout = () => {
    setUser(null);
    setSection('home');
  };
  const goHome = () => setSection('home');

  const openAddSupplier = () => {
    setEditingSupplierId(null);
    setSupplierForm(emptySupplier);
    setSupplierModalOpen(true);
  };
  const openEditSupplier = (item) => {
    setEditingSupplierId(item.supplier_id);
    setSupplierForm({ ...item });
    setSupplierModalOpen(true);
  };
  const saveSupplier = () => {
    if (!supplierForm.supplier_id || !supplierForm.supplier_name) return;
    setSuppliers((prev) => {
      const exists = prev.find((s) => s.supplier_id === supplierForm.supplier_id);
      if (editingSupplierId || exists) {
        return prev.map((s) => (s.supplier_id === (editingSupplierId || supplierForm.supplier_id) ? { ...supplierForm } : s));
      }
      return [...prev, { ...supplierForm }];
    });
    setSupplierModalOpen(false);
  };
  const deleteSupplier = (item) => {
    if (confirm(`Delete supplier ${item.supplier_name}?`)) {
      setSuppliers((prev) => prev.filter((s) => s.supplier_id !== item.supplier_id));
    }
  };

  const openAddEntry = () => {
    setEditingEntryIndex(null);
    setEntryForm(emptyEntry);
    setEntryModalOpen(true);
  };
  const openEditEntry = (item) => {
    const index = entries.findIndex((e) => e === item);
    setEditingEntryIndex(index);
    setEntryForm({ ...item });
    setEntryModalOpen(true);
  };
  const saveEntry = () => {
    if (!entryForm.supplier_id || !entryForm.product_id) return;
    const normalized = {
      ...entryForm,
      quantity: Number(entryForm.quantity) || 0,
      selling_price: Number(entryForm.selling_price) || 0,
      cost_price: Number(entryForm.cost_price) || 0,
    };
    setEntries((prev) => {
      if (editingEntryIndex !== null && editingEntryIndex >= 0) {
        const clone = [...prev];
        clone[editingEntryIndex] = normalized;
        return clone;
      }
      return [...prev, normalized];
    });
    setEntryModalOpen(false);
  };
  const deleteEntry = (item) => {
    if (confirm(`Delete entry for product ${item.product_id}?`)) {
      setEntries((prev) => prev.filter((e) => e !== item));
    }
  };

  // Render
  if (!user) return <Login onLogin={setUser} />;
  if (section === 'home') return <HomeDashboard onSelect={setSection} />;

  switch (section) {
    case 'dashboard':
      return (
        <SectionLayout title="Dashboard" onBackHome={goHome} onLogout={handleLogout}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border bg-white p-4">
              <h3 className="mb-2 text-sm font-semibold text-gray-700">Expiring in 2 days</h3>
              <div className="space-y-2">
                {expiringSoon.length === 0 && <p className="text-sm text-gray-500">No products nearing expiry</p>}
                {expiringSoon.slice(0,5).map((e, i) => (
                  <div key={i} className="flex items-center justify-between rounded-md bg-emerald-50 px-3 py-2 text-sm">
                    <span className="font-medium text-emerald-900">{e.product_id}</span>
                    <span className="text-emerald-800">{e.expiry_date}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border bg-white p-4">
              <h3 className="mb-2 text-sm font-semibold text-gray-700">Low stock alerts</h3>
              <div className="space-y-2">
                {lowStock.length === 0 && <p className="text-sm text-gray-500">All items above threshold</p>}
                {lowStock.slice(0,5).map((s) => (
                  <div key={s.product_id} className="flex items-center justify-between rounded-md bg-orange-50 px-3 py-2 text-sm">
                    <span className="font-medium text-orange-900">{s.name}</span>
                    <span className="text-orange-800">{s.quantity} in stock</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border bg-white p-4">
              <h3 className="mb-2 text-sm font-semibold text-gray-700">Today’s sales</h3>
              <div className="rounded-lg bg-emerald-600 p-4 text-white">
                <div className="text-3xl font-extrabold">${salesToday.amount.toFixed(2)}</div>
                <div className="text-sm font-semibold opacity-90">{salesToday.orders} orders</div>
              </div>
            </div>
            <div className="rounded-xl border bg-white p-4">
              <h3 className="mb-2 text-sm font-semibold text-gray-700">Deliveries today</h3>
              <div className="space-y-2">
                {todaysDeliveries.length === 0 && <p className="text-sm text-gray-500">No deliveries scheduled</p>}
                {todaysDeliveries.slice(0,5).map((d, i) => (
                  <div key={i} className="flex items-center justify-between rounded-md bg-sky-50 px-3 py-2 text-sm">
                    <span className="font-medium text-sky-900">{d.supplier}</span>
                    <span className="text-sky-800">{d.items} items</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionLayout>
      );

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
            <div className="space-y-4">
              <SectionHeader
                title="Daily Delivery Entries"
                actions={(
                  <button onClick={openAddEntry} className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                    <Plus className="h-4 w-4"/> Add Entry
                  </button>
                )}
              />
              <div className="hidden lg:block text-xs text-gray-500">Columns: supplier_id, product_id, expiry_date, quantity, selling price, cost price</div>
              <div className="space-y-3">
                {entries.map((e, i) => (
                  <Row
                    key={i}
                    item={e}
                    fields={["supplier_id", "product_id", "expiry_date", "quantity", "selling_price", "cost_price"]}
                    onEdit={openEditEntry}
                    onDelete={deleteEntry}
                  />
                ))}
              </div>

              <Modal
                title={editingEntryIndex !== null ? 'Edit Delivery Entry' : 'Add Delivery Entry'}
                isOpen={entryModalOpen}
                onClose={() => setEntryModalOpen(false)}
                onSubmit={saveEntry}
                submitLabel={editingEntryIndex !== null ? 'Save Changes' : 'Create Entry'}
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    value={entryForm.supplier_id}
                    onChange={(e) => setEntryForm((f) => ({ ...f, supplier_id: e.target.value }))}
                    placeholder="Supplier ID"
                    className="rounded-md border px-3 py-2 text-sm"
                  />
                  <input
                    value={entryForm.product_id}
                    onChange={(e) => setEntryForm((f) => ({ ...f, product_id: e.target.value }))}
                    placeholder="Product ID"
                    className="rounded-md border px-3 py-2 text-sm"
                  />
                  <input
                    type="date"
                    value={entryForm.expiry_date}
                    onChange={(e) => setEntryForm((f) => ({ ...f, expiry_date: e.target.value }))}
                    className="rounded-md border px-3 py-2 text-sm"
                  />
                  <input
                    type="number"
                    value={entryForm.quantity}
                    onChange={(e) => setEntryForm((f) => ({ ...f, quantity: e.target.value }))}
                    placeholder="Quantity"
                    className="rounded-md border px-3 py-2 text-sm"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={entryForm.selling_price}
                    onChange={(e) => setEntryForm((f) => ({ ...f, selling_price: e.target.value }))}
                    placeholder="Selling Price"
                    className="rounded-md border px-3 py-2 text-sm"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={entryForm.cost_price}
                    onChange={(e) => setEntryForm((f) => ({ ...f, cost_price: e.target.value }))}
                    placeholder="Cost Price"
                    className="rounded-md border px-3 py-2 text-sm"
                  />
                </div>
              </Modal>
            </div>
          ) : (
            <div className="space-y-4">
              <SectionHeader
                title="Suppliers Info"
                actions={(
                  <button onClick={openAddSupplier} className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                    <Plus className="h-4 w-4"/> Add Supplier
                  </button>
                )}
              />
              <div className="hidden lg:block text-xs text-gray-500">Columns: supplier_id, supplier_name, contact no, category</div>
              <div className="space-y-3">
                {suppliers.map((s) => (
                  <Row
                    key={s.supplier_id}
                    item={s}
                    fields={["supplier_id", "supplier_name", "contact_no", "category"]}
                    onEdit={openEditSupplier}
                    onDelete={deleteSupplier}
                  />
                ))}
              </div>

              <Modal
                title={editingSupplierId ? 'Edit Supplier' : 'Add Supplier'}
                isOpen={supplierModalOpen}
                onClose={() => setSupplierModalOpen(false)}
                onSubmit={saveSupplier}
                submitLabel={editingSupplierId ? 'Save Changes' : 'Create Supplier'}
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    value={supplierForm.supplier_id}
                    onChange={(e) => setSupplierForm((f) => ({ ...f, supplier_id: e.target.value }))}
                    placeholder="Supplier ID"
                    className="rounded-md border px-3 py-2 text-sm"
                  />
                  <input
                    value={supplierForm.supplier_name}
                    onChange={(e) => setSupplierForm((f) => ({ ...f, supplier_name: e.target.value }))}
                    placeholder="Supplier Name"
                    className="rounded-md border px-3 py-2 text-sm"
                  />
                  <input
                    value={supplierForm.contact_no}
                    onChange={(e) => setSupplierForm((f) => ({ ...f, contact_no: e.target.value }))}
                    placeholder="Contact No"
                    className="rounded-md border px-3 py-2 text-sm"
                  />
                  <input
                    value={supplierForm.category}
                    onChange={(e) => setSupplierForm((f) => ({ ...f, category: e.target.value }))}
                    placeholder="Category"
                    className="rounded-md border px-3 py-2 text-sm"
                  />
                </div>
              </Modal>
            </div>
          )}
        </SectionLayout>
      );

    default:
      return <HomeDashboard onSelect={setSection} />;
  }
}
