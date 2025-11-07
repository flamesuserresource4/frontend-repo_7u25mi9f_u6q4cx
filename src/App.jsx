import React, { useMemo, useState } from 'react';
import Login from './components/Login';
import HomeDashboard from './components/HomeDashboard';
import SectionLayout from './components/SectionLayout';
import Modal from './components/Modal';
import { Edit2, Trash2, Plus } from 'lucide-react';

const Row = ({ item, onEdit, onDelete, fields }) => {
  return (
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
};

const SectionHeader = ({ title, actions }) => (
  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
    <div className="flex items-center gap-2">{actions}</div>
  </div>
);

export default function App() {
  const [user, setUser] = useState(null);
  const [section, setSection] = useState('home');

  // Tabs per section
  const [deliveryTab, setDeliveryTab] = useState('Daily Entries'); // default as requested

  const handleLogout = () => {
    setUser(null);
    setSection('home');
  };

  if (!user) return <Login onLogin={setUser} />;
  if (section === 'home') return <HomeDashboard onSelect={setSection} />;

  const goHome = () => setSection('home');

  // Delivery state (local demo data for now)
  const [suppliers, setSuppliers] = useState([
    { supplier_id: 'S-1001', supplier_name: 'Fresh Farms', contact_no: '555-0123', category: 'Produce' },
    { supplier_id: 'S-1002', supplier_name: 'Dairy Best', contact_no: '555-0456', category: 'Dairy' },
  ]);

  const [entries, setEntries] = useState([
    { supplier_id: 'S-1001', product_id: 'P-2001', expiry_date: '2026-02-10', quantity: 24, selling_price: 1.8, cost_price: 1.2 },
    { supplier_id: 'S-1002', product_id: 'P-2002', expiry_date: '2025-12-01', quantity: 18, selling_price: 2.9, cost_price: 2.2 },
  ]);

  // Supplier modal state
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [editingSupplierId, setEditingSupplierId] = useState(null);
  const emptySupplier = { supplier_id: '', supplier_name: '', contact_no: '', category: '' };
  const [supplierForm, setSupplierForm] = useState(emptySupplier);

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

  // Delivery entry modal state
  const [entryModalOpen, setEntryModalOpen] = useState(false);
  const [editingEntryIndex, setEditingEntryIndex] = useState(null);
  const emptyEntry = { supplier_id: '', product_id: '', expiry_date: '', quantity: 0, selling_price: 0, cost_price: 0 };
  const [entryForm, setEntryForm] = useState(emptyEntry);

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

  // Render sections (we only adjust Delivery per request)
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
            <div className="space-y-4">
              <SectionHeader
                title="Daily Delivery Entries"
                actions={(
                  <button onClick={openAddEntry} className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800">
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
                  <button onClick={openAddSupplier} className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800">
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
