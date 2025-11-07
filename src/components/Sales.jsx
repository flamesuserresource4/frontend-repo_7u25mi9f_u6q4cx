import React, { useMemo, useState } from 'react';
import SectionLayout from './SectionLayout';
import { PieChart as Pie, BarChart as Bar } from './Charts';

export default function Sales({ onBackHome, onLogout }) {
  const [filterProduct, setFilterProduct] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Demo dataset
  const [products] = useState([
    { product_id: 'P-2001', product_name: 'Gala Apples', revenue: 1200, profit: 300 },
    { product_id: 'P-2002', product_name: 'Whole Milk 1L', revenue: 2200, profit: 420 },
    { product_id: 'P-2003', product_name: 'Brown Bread', revenue: 900, profit: 180 },
    { product_id: 'P-2004', product_name: 'Free-range Eggs', revenue: 1500, profit: 350 },
  ]);

  const monthData = [
    { label: 'W1', value: 1200, color: '#10b981' },
    { label: 'W2', value: 1600, color: '#34d399' },
    { label: 'W3', value: 900, color: '#6ee7b7' },
    { label: 'W4', value: 1800, color: '#059669' },
  ];
  const yearData = [
    { label: 'Q1', value: 3200 },
    { label: 'Q2', value: 4200 },
    { label: 'Q3', value: 3800 },
    { label: 'Q4', value: 5100 },
  ];

  const pieData = [
    { label: 'Profit', value: products.reduce((s, p) => s + p.profit, 0), color: '#10b981' },
    { label: 'Loss', value: 450, color: '#ef4444' },
  ];

  const filtered = useMemo(() => {
    let data = products;
    if (filterProduct) data = data.filter((p) => p.product_id === filterProduct || p.product_name.toLowerCase().includes(filterProduct.toLowerCase()));
    // dateFrom/dateTo filters could be applied when real dated data is available
    return data;
  }, [products, filterProduct, dateFrom, dateTo]);

  return (
    <SectionLayout title="Sales" onBackHome={onBackHome} onLogout={onLogout}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Profit vs Loss (Month)</h3>
          <Pie size={180} data={pieData} />
        </div>
        <div className="rounded-xl border bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Monthly Profit</h3>
          <Bar height={180} data={monthData} />
        </div>
        <div className="rounded-xl border bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Yearly Profit</h3>
          <Bar height={180} data={yearData} />
        </div>
      </div>

      <div className="mt-6 rounded-xl border bg-white p-4">
        <div className="mb-4 flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600">Filter by product</label>
            <input
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
              placeholder="Product ID or name"
              className="rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600">From</label>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600">To</label>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="mb-2 text-xs text-gray-500">Columns: product id, product name, revenue, profit</div>
        <div className="space-y-3">
          {filtered.map((p) => (
            <div key={p.product_id} className="grid grid-cols-12 items-center gap-4 rounded-lg border bg-white p-3 text-sm">
              <div className="col-span-3">{p.product_id}</div>
              <div className="col-span-3">{p.product_name}</div>
              <div className="col-span-3">${p.revenue.toFixed(2)}</div>
              <div className="col-span-3 font-semibold ${p.profit>=0 ? 'text-emerald-700' : 'text-rose-600'}">${p.profit.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
    </SectionLayout>
  );
}
