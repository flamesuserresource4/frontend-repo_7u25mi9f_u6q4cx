import React, { useState } from 'react';
import SectionLayout from './SectionLayout';
import Modal from './Modal';

export default function Billing({ onBackHome, onLogout }) {
  const [tab, setTab] = useState('Build Bill');
  const [items, setItems] = useState([{ product_id: 'P-2001', quantity: 1 }]);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);

  const addRow = () => setItems((prev) => [...prev, { product_id: '', quantity: 1 }]);
  const removeRow = (idx) => setItems((prev) => prev.filter((_, i) => i !== idx));

  const makeBill = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/billing/price`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items.map((i) => ({ product_id: i.product_id, quantity: Number(i.quantity)||0 })) }),
      });
      const data = await res.json();
      setReceipt(data);
    } catch (e) {
      console.error(e);
      alert('Failed to fetch prices');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionLayout
      title="Billing"
      tabs={["Build Bill", receipt ? "Receipt" : null].filter(Boolean)}
      activeTab={tab}
      onTabChange={setTab}
      onBackHome={onBackHome}
      onLogout={onLogout}
    >
      {tab === 'Build Bill' ? (
        <div className="space-y-4">
          <div className="mb-2 text-sm text-gray-600">Enter product ID and quantity, then click Make Bill to fetch prices and generate the final receipt.</div>
          <div className="space-y-2">
            {items.map((row, idx) => (
              <div key={idx} className="flex items-center gap-2 rounded-lg border bg-white p-3">
                <input
                  value={row.product_id}
                  onChange={(e) => setItems((prev) => prev.map((r, i) => i===idx ? { ...r, product_id: e.target.value } : r))}
                  placeholder="Product ID"
                  className="flex-1 rounded-md border px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  min={1}
                  value={row.quantity}
                  onChange={(e) => setItems((prev) => prev.map((r, i) => i===idx ? { ...r, quantity: e.target.value } : r))}
                  placeholder="Qty"
                  className="w-28 rounded-md border px-3 py-2 text-sm"
                />
                <button onClick={() => removeRow(idx)} className="rounded-md border px-3 py-2 text-sm">Remove</button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={addRow} className="rounded-md border px-3 py-2 text-sm">Add Item</button>
            <button onClick={makeBill} disabled={loading} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
              {loading ? 'Making Bill...' : 'Make Bill'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {receipt ? (
            <div className="rounded-xl border bg-white p-4">
              <h3 className="mb-3 text-lg font-semibold">Receipt</h3>
              <div className="space-y-2">
                {receipt.lines?.map((l, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{l.product_id} × {l.quantity}</span>
                    <span className="font-medium">${l.line_total.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 h-px w-full bg-gray-100" />
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Total</span>
                <span className="text-lg font-bold">${Number(receipt.total || 0).toFixed(2)}</span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-600">No receipt yet. Build a bill first.</div>
          )}
        </div>
      )}
    </SectionLayout>
  );
}
