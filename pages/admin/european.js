import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const categoryOptions = ['cold_appetizer', 'nuts', 'salad', 'second_course'];

export default function AdminEuropean() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [europeanData, setEuropeanData] = useState({});

  const [categoryKey, setCategoryKey] = useState(categoryOptions[0]);
  const [name, setName] = useState({ uz: '', ru: '', en: '' });
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState({ uz: '', ru: '', en: '' });
  const [image, setImage] = useState('');

  const [editingId, setEditingId] = useState('');
  const [editName, setEditName] = useState({ uz: '', ru: '', en: '' });
  const [editPrice, setEditPrice] = useState('');
  const [editDescription, setEditDescription] = useState({ uz: '', ru: '', en: '' });
  const [editImage, setEditImage] = useState('');

  const [visibleCategory, setVisibleCategory] = useState('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (!t) {
      router.push('/login');
      return;
    }
    setToken(t);
    fetch('/api/menu?menuType=european')
      .then((r) => r.json())
      .then(setEuropeanData);
  }, [router]);

  const addItem = async () => {
    const id = Date.now();
    const item = {
      id,
      name,
      price: price ? Number(price) : null,
      description: description,
      image: image || null,
    };
    const res = await fetch('/api/menu?menuType=european', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ categoryKey, item }),
    });
    if (!res.ok) return;
    setEuropeanData({
      ...europeanData,
      [categoryKey]: [...(europeanData[categoryKey] || []), item],
    });
    resetForm();
  };

  const deleteItem = async (id) => {
    const res = await fetch('/api/menu?menuType=european', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id }),
    });
    if (!res.ok && res.status !== 204) return;
    const next = { ...europeanData };
    for (const key of Object.keys(next)) {
      next[key] = (next[key] || []).filter((x) => x.id !== id);
    }
    setEuropeanData(next);
  };

  const startEdit = (it) => {
    setEditingId(it.id);
    setEditName(it.name || { uz: '', ru: '', en: '' });
    setEditPrice(it.price ?? '');
    setEditDescription(it.description || { uz: '', ru: '', en: '' });
    setEditImage(it.image || '');
  };

  const cancelEdit = () => {
    setEditingId('');
    setEditName({ uz: '', ru: '', en: '' });
    setEditPrice('');
    setEditDescription({ uz: '', ru: '', en: '' });
    setEditImage('');
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const updates = {
      name: editName,
      price: editPrice === '' ? null : Number(editPrice),
      description: editDescription,
      image: editImage || null,
    };
    const res = await fetch('/api/menu?menuType=european', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id: editingId, updates }),
    });
    if (!res.ok) return;
    const updated = await res.json();
    const next = { ...europeanData };
    for (const key of Object.keys(next)) {
      next[key] = (next[key] || []).map((x) => (x.id === editingId ? updated : x));
    }
    setEuropeanData(next);
    cancelEdit();
  };

  const resetForm = () => {
    setCategoryKey(categoryOptions[0]);
    setName({ uz: '', ru: '', en: '' });
    setPrice('');
    setDescription({ uz: '', ru: '', en: '' });
    setImage('');
  };

  // Helpers
  const allKeys = Object.keys(europeanData);
  const orderedKeys = allKeys.sort((a, b) => categoryOptions.indexOf(a) - categoryOptions.indexOf(b));
  const visibleKeys = orderedKeys.filter((k) => visibleCategory === 'all' || k === visibleCategory);

  return (
    <div className="min-h-screen w-full bg-base text-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold">European Menu</h1>
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
              <label className="block text-sm text-gray-300 mb-1">Name (UZ)</label>
              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3]" placeholder="O'zbekcha nom" value={name.uz} onChange={(e) => setName({...name, uz: e.target.value})} />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm text-gray-300 mb-1">Name (RU)</label>
              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3]" placeholder="Ruscha nom" value={name.ru} onChange={(e) => setName({...name, ru: e.target.value})} />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm text-gray-300 mb-1">Name (EN)</label>
              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3]" placeholder="English name" value={name.en} onChange={(e) => setName({...name, en: e.target.value})} />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm text-gray-300 mb-1">Price</label>
              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3]" placeholder="50000" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className="md:col-span-6">
              <label className="block text-sm text-gray-300 mb-1">Image URL</label>
              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3]" placeholder="/food/image.jpg" value={image} onChange={(e) => setImage(e.target.value)} />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm text-gray-300 mb-1">Description (UZ)</label>
              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3]" placeholder="Tavsif" value={description.uz} onChange={(e) => setDescription({...description, uz: e.target.value})} />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm text-gray-300 mb-1">Description (RU)</label>
              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3]" placeholder="Описание" value={description.ru} onChange={(e) => setDescription({...description, ru: e.target.value})} />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm text-gray-300 mb-1">Description (EN)</label>
              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3]" placeholder="Description" value={description.en} onChange={(e) => setDescription({...description, en: e.target.value})} />
            </div>
            <div className="md:col-span-3 flex items-end gap-2">
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
            const items = (europeanData[key] || []).filter((it) =>
              !query.trim() || 
              (String(it.name?.uz || '')).toLowerCase().includes(query.toLowerCase()) ||
              (String(it.name?.ru || '')).toLowerCase().includes(query.toLowerCase()) ||
              (String(it.name?.en || '')).toLowerCase().includes(query.toLowerCase())
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
                            <div className="md:col-span-4">
                              <label className="block text-xs text-gray-300 mb-1">Name (UZ)</label>
                              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3]" value={editName.uz} onChange={(e) => setEditName({...editName, uz: e.target.value})} />
                            </div>
                            <div className="md:col-span-4">
                              <label className="block text-xs text-gray-300 mb-1">Name (RU)</label>
                              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3]" value={editName.ru} onChange={(e) => setEditName({...editName, ru: e.target.value})} />
                            </div>
                            <div className="md:col-span-4">
                              <label className="block text-xs text-gray-300 mb-1">Name (EN)</label>
                              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3]" value={editName.en} onChange={(e) => setEditName({...editName, en: e.target.value})} />
                            </div>
                            <div className="md:col-span-3">
                              <label className="block text-xs text-gray-300 mb-1">Price</label>
                              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3]" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} placeholder="Price" />
                            </div>
                            <div className="md:col-span-6">
                              <label className="block text-xs text-gray-300 mb-1">Image URL</label>
                              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3]" value={editImage} onChange={(e) => setEditImage(e.target.value)} placeholder="Image URL" />
                            </div>
                            <div className="md:col-span-3">
                              <label className="block text-xs text-gray-300 mb-1">Description (UZ)</label>
                              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3]" value={editDescription.uz} onChange={(e) => setEditDescription({...editDescription, uz: e.target.value})} placeholder="Description" />
                            </div>
                            <div className="md:col-span-3">
                              <label className="block text-xs text-gray-300 mb-1">Description (RU)</label>
                              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3]" value={editDescription.ru} onChange={(e) => setEditDescription({...editDescription, ru: e.target.value})} placeholder="Description" />
                            </div>
                            <div className="md:col-span-3">
                              <label className="block text-xs text-gray-300 mb-1">Description (EN)</label>
                              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3]" value={editDescription.en} onChange={(e) => setEditDescription({...editDescription, en: e.target.value})} placeholder="Description" />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="bg-[#e0d3a3] text-black px-3 py-2 rounded-md hover:opacity-90" onClick={saveEdit}>Save</button>
                            <button className="px-3 py-2 rounded-md border border-white/20 hover:bg-white/10" onClick={cancelEdit}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="text-base md:text-lg font-medium">{it.name?.uz || it.name?.ru || it.name?.en || 'No name'}</div>
                            <div className="text-sm text-gray-400 mt-0.5">
                              <span className="mr-2">{it.price ?? '-'}</span>
                            </div>
                            {it.description?.uz || it.description?.ru || it.description?.en ? (
                              <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                                {it.description?.uz || it.description?.ru || it.description?.en}
                              </div>
                            ) : null}
                            {it.image && (
                              <div className="mt-2">
                                <img src={it.image} alt="Preview" className="w-16 h-16 object-cover rounded" />
                              </div>
                            )}
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
