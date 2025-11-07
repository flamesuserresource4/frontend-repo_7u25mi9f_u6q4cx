import React, { useMemo, useState } from 'react';
import SectionLayout from './SectionLayout';

export default function Billing({ onBackHome, onLogout, user, onRoleChange }) {
  const tabs = ['Build Bill', 'Receipt'];
  const [activeTab, setActiveTab] = useState('Build Bill');
  const [items, setItems] = useState([{ product_id: '', quantity: 1 }]);
  const [receipt, setReceipt] = useState(null);

  const canAccess = ['admin','manager','cashier'].includes(user?.role);
  if (!canAccess) {
    return (
      <SectionLayout title="Billing" onBackHome={onBackHome} onLogout={onLogout} user={user} onRoleChange={onRoleChange}>
        <div className="bg-white border rounded-xl p-6 text-emerald-800">You do not have access to Billing.</div>
      </SectionLayout>
    );
  }

  const addRow = () => setItems(prev => [...prev, { product_id: '', quantity: 1 }]);
  const removeRow = (idx) => setItems(prev => prev.filter((_,i)=>i!==idx));
  const updateRow = (idx, key, val) => setItems(prev => prev.map((r,i)=> i===idx ? { ...r, [key]: val } : r));

  const makeBill = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/billing/price`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      });
      const data = await res.json();
      setReceipt(data);
      setActiveTab('Receipt');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SectionLayout
      title="Billing"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onBackHome={onBackHome}
      onLogout={onLogout}
      user={user}
      onRoleChange={onRoleChange}
    >
      {activeTab === 'Build Bill' && (
        <div className="bg-white border border-emerald-100 rounded-xl p-4">
          <div className="mb-4">
            <div className="text-sm text-emerald-600">Enter Items</div>
            <h3 className="text-lg font-semibold text-emerald-900">Build Bill</h3>
          </div>
          <div className="space-y-3">
            {items.map((row, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-3">
                <div className="col-span-5">
                  <label className="text-xs text-emerald-700">Product ID</label>
                  <input value={row.product_id} onChange={(e)=>updateRow(idx, 'product_id', e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" placeholder="e.g., P001" />
                </div>
                <div className="col-span-3">
                  <label className="text-xs text-emerald-700">Quantity</label>
                  <input type="number" value={row.quantity} onChange={(e)=>updateRow(idx, 'quantity', Number(e.target.value))} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" />
                </div>
                <div className="col-span-4 flex items-end gap-2">
                  <button onClick={()=>removeRow(idx)} className="px-3 py-2 rounded-md border text-red-700 border-red-200">Remove</button>
                  {idx === items.length - 1 && (
                    <button onClick={addRow} className="px-3 py-2 rounded-md border text-emerald-700 border-emerald-200">Add Row</button>
                  )}
                </div>
              </div>
            ))}
            <div>
              <button onClick={makeBill} className="mt-2 px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">Make Bill</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Receipt' && (
        <div className="bg-white border border-emerald-100 rounded-xl p-4">
          <div className="mb-3">
            <div className="text-sm text-emerald-600">Receipt</div>
            <h3 className="text-lg font-semibold text-emerald-900">Summary</h3>
          </div>
          {!receipt ? (
            <p className="text-sm text-emerald-700">No receipt yet. Build a bill first.</p>
          ) : (
            <div className="text-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-emerald-700">
                      <th className="py-2">Product ID</th>
                      <th className="py-2">Quantity</th>
                      <th className="py-2">Unit Price</th>
                      <th className="py-2">Line Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receipt.lines.map((l, i) => (
                      <tr key={i} className="border-t">
                        <td className="py-2">{l.product_id}</td>
                        <td className="py-2">{l.quantity}</td>
                        <td className="py-2">₹{l.unit_price}</td>
                        <td className="py-2">₹{l.line_total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 text-right text-emerald-900 font-semibold">Grand Total: ₹{receipt.total}</div>
            </div>
          )}
        </div>
      )}
    </SectionLayout>
  );
}
