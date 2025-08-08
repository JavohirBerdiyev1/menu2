import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const categoryOptions = [
  'soft_drinks','coffee','teas','lemonades','smoothies_detox','alcohol_drinks','beer','tequila','rum','liqueurs','brandy','vodka','whisky','infusions','gin','imported_wine','sparkling_wine'
];

export default function AdminBar() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [barData, setBarData] = useState({});

  const [categoryKey, setCategoryKey] = useState(categoryOptions[0]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [volume, setVolume] = useState('');
  const [unit, setUnit] = useState('');
  const [description, setDescription] = useState('');

  const [editingId, setEditingId] = useState('');
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editVolume, setEditVolume] = useState('');
  const [editUnit, setEditUnit] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const [visibleCategory, setVisibleCategory] = useState('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (!t) {
      router.push('/login');
      return;
    }
    setToken(t);
    fetch('/api/bar')
      .then((r) => r.json())
      .then(setBarData);
  }, [router]);

  const addItem = async () => {
    const id = `${categoryKey}_${Date.now()}`;
    const item = {
      id,
      name,
      price: price ? Number(price) : null,
      volume: volume ? Number(volume) : null,
      unit: unit || null,
      description: description || null,
    };
    const res = await fetch('/api/bar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ categoryKey, item }),
    });
    if (!res.ok) return;
    setBarData({
      ...barData,
      [categoryKey]: [...(barData[categoryKey] || []), item],
    });
    setName('');
    setPrice('');
    setVolume('');
    setUnit('');
    setDescription('');
  };

  const resetForm = () => {
    setCategoryKey(categoryOptions[0]);
    setName('');
    setPrice('');
    setVolume('');
    setUnit('');
    setDescription('');
  };

  const deleteItem = async (id) => {
    const res = await fetch('/api/bar', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id }),
    });
    if (!res.ok && res.status !== 204) return;
    const next = { ...barData };
    for (const key of Object.keys(next)) {
      next[key] = (next[key] || []).filter((x) => x.id !== id);
    }
    setBarData(next);
  };

  const startEdit = (it) => {
    setEditingId(it.id);
    setEditName(it.name || '');
    setEditPrice(it.price ?? '');
    setEditVolume(it.volume ?? '');
    setEditUnit(it.unit ?? '');
    setEditDescription(it.description ?? '');
  };

  const cancelEdit = () => {
    setEditingId('');
    setEditName('');
    setEditPrice('');
    setEditVolume('');
    setEditUnit('');
    setEditDescription('');
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const updates = {
      name: editName,
      price: editPrice === '' ? null : Number(editPrice),
      volume: editVolume === '' ? null : Number(editVolume),
      unit: editUnit || null,
      description: editDescription || null,
    };
    const res = await fetch('/api/bar', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id: editingId, updates }),
    });
    if (!res.ok) return;
    const updated = await res.json();
    const next = { ...barData };
    for (const key of Object.keys(next)) {
      next[key] = (next[key] || []).map((x) => (x.id === editingId ? updated : x));
    }
    setBarData(next);
    cancelEdit();
  };

  // Helpers
  const allKeys = Object.keys(barData);
  const orderedKeys = allKeys.sort((a, b) => categoryOptions.indexOf(a) - categoryOptions.indexOf(b));
  const visibleKeys = orderedKeys.filter((k) => visibleCategory === 'all' || k === visibleCategory);

  return (
    <div className="min-h-screen w-full bg-base text-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold">Bar Items</h1>
          <button className="text-[#e0d3a3] hover:opacity-80 underline" onClick={() => router.push('/admin')}>Back to Admin</button>
        </div>

        {/* Create form */}
        <div className="bg-white/5 border border-white/10 rounded-xl shadow-lg backdrop-blur p-4 md:p-6 mb-8">
          <h2 className="text-lg font-medium mb-4">Add New Item</h2>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
            <div className="md:col-span-3">
              <label className="block text-sm text-gray-300 mb-1">Category</label>
              <select className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3]" value={categoryKey} onChange={(e) => setCategoryKey(e.target.value)}>
                {categoryOptions.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm text-gray-300 mb-1">Name</label>
              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3]" placeholder="E.g. Mojito" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-300 mb-1">Price</label>
              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3]" placeholder="50000" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-300 mb-1">Volume</label>
              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3]" placeholder="400" value={volume} onChange={(e) => setVolume(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-300 mb-1">Unit</label>
              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3]" placeholder="мл / л" value={unit} onChange={(e) => setUnit(e.target.value)} />
            </div>
            <div className="md:col-span-8">
              <label className="block text-sm text-gray-300 mb-1">Description (optional)</label>
              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3]" placeholder="Short description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="md:col-span-4 flex items-end gap-2">
              <button className="bg-[#e0d3a3] text-black px-4 py-2 rounded-md hover:opacity-90 w-full md:w-auto" onClick={addItem}>Add Item</button>
              <button className="px-4 py-2 rounded-md border border-white/20 hover:bg-white/10 w-full md:w-auto" onClick={resetForm}>Reset</button>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-300">View</label>
            <select className="p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3]" value={visibleCategory} onChange={(e) => setVisibleCategory(e.target.value)}>
              <option value="all">All</option>
              {categoryOptions.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <input className="w-64 p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3]" placeholder="Search by name" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>

        {/* List */}
        {visibleKeys.length === 0 ? (
          <p className="text-gray-300">No data yet. Add your first item.</p>
        ) : (
          visibleKeys.map((key) => {
            const items = (barData[key] || []).filter((it) =>
              !query.trim() || (String(it.name || '')).toLowerCase().includes(query.toLowerCase())
            );
            return (
              <div key={key} className="mb-8">
                <div className="sticky top-0 z-10 -mx-4 px-4 py-2 bg-base/80 backdrop-blur border-b border-white/10">
                  <h2 className="text-lg md:text-xl font-medium flex items-center gap-2">
                    <span className="opacity-80">{key}</span>
                    <span className="text-xs text-gray-400">({items.length})</span>
                  </h2>
                </div>
                <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {items.map((it) => (
                    <li key={it.id} className="rounded-lg border border-white/10 bg-white/5 p-3 md:p-4">
                      {editingId === it.id ? (
                        <div className="space-y-2">
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                            <div className="md:col-span-5">
                              <label className="block text-xs text-gray-300 mb-1">Name</label>
                              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3]" value={editName} onChange={(e) => setEditName(e.target.value)} />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-xs text-gray-300 mb-1">Price</label>
                              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3]" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} placeholder="Price" />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-xs text-gray-300 mb-1">Volume</label>
                              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3]" value={editVolume} onChange={(e) => setEditVolume(e.target.value)} placeholder="Volume" />
                            </div>
                            <div className="md:col-span-3">
                              <label className="block text-xs text-gray-300 mb-1">Unit</label>
                              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3]" value={editUnit} onChange={(e) => setEditUnit(e.target.value)} placeholder="Unit" />
                            </div>
                            <div className="md:col-span-12">
                              <label className="block text-xs text-gray-300 mb-1">Description</label>
                              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3]" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="Description" />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="bg-[#e0d3a3] text-black px-3 py-2 rounded-md hover:opacity-90" onClick={saveEdit}>Save</button>
                            <button className="px-3 py-2 rounded-md border border-white/20 hover:bg-white/10" onClick={cancelEdit}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-base md:text-lg font-medium">{it.name}</div>
                            <div className="text-sm text-gray-400 mt-0.5">
                              <span className="mr-2">{it.price ?? '-'}</span>
                              {it.unit ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-gray-200 text-xs">{it.volume ?? ''}{it.unit}</span> : null}
                            </div>
                            {it.description ? (
                              <div className="text-xs text-gray-400 mt-1 line-clamp-2">{it.description}</div>
                            ) : null}
                          </div>
                          <div className="shrink-0 flex items-center gap-2">
                            <button className="bg-blue-600/80 hover:bg-blue-600 px-3 py-1.5 rounded-md" onClick={() => startEdit(it)}>Edit</button>
                            <button className="bg-red-600/80 hover:bg-red-600 px-3 py-1.5 rounded-md" onClick={() => deleteItem(it.id)}>Delete</button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}


