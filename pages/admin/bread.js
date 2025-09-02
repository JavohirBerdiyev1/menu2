import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const categoryOptions = ['bread'];

export default function AdminBread() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [breadData, setBreadData] = useState({});

  // Form states
  const [categoryKey, setCategoryKey] = useState(categoryOptions[0]);
  const [name, setName] = useState({ uz: '', ru: '', en: '' });
  const [price, setPrice] = useState('');
  const [weight, setWeight] = useState('');
  const [description, setDescription] = useState({ uz: '', ru: '', en: '' });
  const [showDescription, setShowDescription] = useState(false);
  const [show, setShow] = useState(true);

  // Editing states
  const [editingId, setEditingId] = useState('');
  const [editName, setEditName] = useState({ uz: '', ru: '', en: '' });
  const [editPrice, setEditPrice] = useState('');
  const [editWeight, setEditWeight] = useState('');
  const [editDescription, setEditDescription] = useState({ uz: '', ru: '', en: '' });
  const [editShowDescription, setEditShowDescription] = useState(false);
  // const [editShow, setEditShow] = useState(true); // BU ENDI KERAK EMAS

  // Filtering and search states
  const [visibleCategory, setVisibleCategory] = useState('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (!t) {
      router.push('/login');
      return;
    }
    setToken(t);
    fetch('/api/menu?menuType=bread', { headers: { Authorization: `Bearer ${t}` } })
      .then((r) => r.json())
      .then(setBreadData);
  }, [router]);

  // YANGI FUNKSIYA: Har bir elementning "show" holatini o'zgartiradi
  const toggleItemShow = async (id, currentShow) => {
    const nextShow = !currentShow;

    // Optimistic update: UI darhol yangilanadi
    const optimisticData = { ...breadData };
    for (const key of Object.keys(optimisticData)) {
      optimisticData[key] = (optimisticData[key] || []).map((item) =>
        item.id === id ? { ...item, show: nextShow } : item
      );
    }
    setBreadData(optimisticData);

    // API so'rovi: O'zgarishni serverda saqlaymiz
    try {
      const res = await fetch('/api/menu?menuType=bread', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id, updates: { show: nextShow } }),
      });
      if (!res.ok) throw new Error('Request failed');
      const updated = await res.json();
      const synced = { ...optimisticData };
      for (const key of Object.keys(synced)) {
        synced[key] = (synced[key] || []).map((item) => (
          item.id === id ? updated : item
        ));
      }
      setBreadData(synced);
    } catch (e) {
      // Xatolik yuz bersa, eski holatga qaytaramiz
      setBreadData({ ...breadData });
      console.error("Failed to update 'show' status:", e);
    }
  };


  const addItem = async () => {
    const id = Date.now();
    const item = {
      id,
      name,
      price: price ? Number(price) : null,
      weight: weight || null,
      description: description,
      showDescription: showDescription,
      show: show, // show state'idan olinadi
    };

    const res = await fetch('/api/menu?menuType=bread', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ categoryKey, item }),
    });
    if (!res.ok) return;
    const newItem = await res.json();
    setBreadData({
      ...breadData,
      [categoryKey]: [...(breadData[categoryKey] || []), newItem],
    });
    resetForm();
  };

  const deleteItem = async (id) => {
    if (typeof window !== 'undefined' && !confirm('Are you sure?')) return;
    const res = await fetch('/api/menu?menuType=bread', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id }),
    });
    if (!res.ok && res.status !== 204) return;
    const next = { ...breadData };
    for (const key of Object.keys(next)) {
      next[key] = (next[key] || []).filter((x) => x.id !== id);
    }
    setBreadData(next);
  };

  const startEdit = (it) => {
    setEditingId(it.id);
    setEditName(it.name || { uz: '', ru: '', en: '' });
    setEditPrice(it.price ?? '');
    setEditWeight(it.weight || '');
    setEditDescription(it.description || { uz: '', ru: '', en: '' });
    setEditShowDescription(it.showDescription || false);
    // setEditShow(it.show !== false); // BU QATOR OLIB TASHLANADI
  };

  const cancelEdit = () => {
    setEditingId('');
    setEditName({ uz: '', ru: '', en: '' });
    setEditPrice('');
    setEditWeight('');
    setEditDescription({ uz: '', ru: '', en: '' });
    setEditShowDescription(false);
    // setEditShow(true); // BU QATOR OLIB TASHLANADI
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const updates = {
      name: editName,
      price: editPrice === '' ? null : Number(editPrice),
      weight: editWeight || null,
      description: editDescription,
      showDescription: editShowDescription,
      // "show" bu yerda yangilanmaydi, chunki u alohida funksiya orqali boshqariladi
      // show: editShow !== false, // BU QATOR OLIB TASHLANADI
    };
    const res = await fetch('/api/menu?menuType=bread', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id: editingId, updates }),
    });
    if (!res.ok) return;
    const updated = await res.json();
    const next = { ...breadData };
    for (const key of Object.keys(next)) {
      next[key] = (next[key] || []).map((x) => (x.id === editingId ? updated : x));
    }
    setBreadData(next);
    cancelEdit();
  };

  const resetForm = () => {
    setCategoryKey(categoryOptions[0]);
    setName({ uz: '', ru: '', en: '' });
    setPrice('');
    setWeight('');
    setDescription({ uz: '', ru: '', en: '' });
    setShowDescription(false);
    setShow(true);
  };

  const allKeys = Object.keys(breadData);
  const orderedKeys = allKeys.sort((a, b) => categoryOptions.indexOf(a) - categoryOptions.indexOf(b));
  const visibleKeys = orderedKeys.filter((k) => visibleCategory === 'all' || k === visibleCategory);

  return (
    <div className="min-h-screen w-full bg-base text-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-white">Bread Menu</h1>
          <button className="text-[#e0d3a3] hover:opacity-80 underline" onClick={() => router.push('/admin')}>Back to Admin</button>
        </div>

        {/* Create form */}
        <div className="bg-white/5 border border-white/10 rounded-xl shadow-lg backdrop-blur p-4 md:p-6 mb-8">
          <h2 className="text-lg font-medium mb-4 text-white">Add New Item</h2>
          {/* ... form content as before ... */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
            <div className="md:col-span-3">
              <label className="block text-sm text-gray-300 mb-1">Category</label>
              <select className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3] text-white" value={categoryKey} onChange={(e) => setCategoryKey(e.target.value)}>
                {categoryOptions.map((k) => (<option key={k} value={k}>{k}</option>))}
              </select>
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm text-gray-300 mb-1">Name (UZ)</label>
              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3] text-white" placeholder="O'zbekcha nom" value={name.uz} onChange={(e) => setName({ ...name, uz: e.target.value })} />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm text-gray-300 mb-1">Name (RU)</label>
              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3] text-white" placeholder="Ruscha nom" value={name.ru} onChange={(e) => setName({ ...name, ru: e.target.value })} />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm text-gray-300 mb-1">Name (EN)</label>
              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3] text-white" placeholder="English name" value={name.en} onChange={(e) => setName({ ...name, en: e.target.value })} />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm text-gray-300 mb-1">Price</label>
              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3] text-white" placeholder="50000" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm text-gray-300 mb-1">Weight/Volume</label>
              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3] text-white" placeholder="300g, 1kg, 500ml" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>
            <div className="md:col-span-3">
              <div className="flex items-center gap-2 mb-1">
                <label className="block text-sm text-gray-300">Show Description on Page</label>
                <button type="button" onClick={() => setShowDescription(!showDescription)} className={`w-8 h-4 rounded-full transition-colors ${showDescription ? 'bg-[#e0d3a3]' : 'bg-gray-600'}`} >
                  <div className={`w-3 h-3 bg-white rounded-full transition-transform ${showDescription ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>
            <div className="md:col-span-4">
              <label className="block text-sm text-gray-300 mb-1">Description (UZ)</label>
              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3] text-white" placeholder="Tavsif" value={description.uz} onChange={(e) => setDescription({ ...description, uz: e.target.value })} />
            </div>
            <div className="md:col-span-4">
              <label className="block text-sm text-gray-300 mb-1">Description (RU)</label>
              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3] text-white" placeholder="Описание" value={description.ru} onChange={(e) => setDescription({ ...description, ru: e.target.value })} />
            </div>
            <div className="md:col-span-4">
              <label className="block text-sm text-gray-300 mb-1">Description (EN)</label>
              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3] text-white" placeholder="Description" value={description.en} onChange={(e) => setDescription({ ...description, en: e.target.value })} />
            </div>
            <div className="md:col-span-3 flex items-end gap-2">
              <button className="bg-[#e0d3a3] text-black px-4 py-2 rounded-md hover:opacity-90 w-full md:w-auto" onClick={addItem}>Add Item</button>
              <button className="px-4 py-2 rounded-md border border-white/20 hover:bg-white/10 w-full md:w-auto" onClick={resetForm}>Reset</button>
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-gray-300">Show item</span>
                <button type="button" onClick={() => setShow(!show)} className={`w-8 h-4 rounded-full transition-colors ${show ? 'bg-[#e0d3a3]' : 'bg-gray-600'}`} >
                  <div className={`w-3 h-3 bg-white rounded-full transition-transform ${show ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>


        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-300">View</label>
            <select className="p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3] text-white" value={visibleCategory} onChange={(e) => setVisibleCategory(e.target.value)}>
              <option value="all">All</option>
              {categoryOptions.map((k) => (<option key={k} value={k}>{k}</option>))}
            </select>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <input className="w-64 p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3] text-white" placeholder="Search by name" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>

        {/* List */}
        {visibleKeys.length === 0 ? (<p className="text-gray-300">No data yet. Add your first item.</p>) : (
          visibleKeys.map((key) => {
            const items = (breadData[key] || []).filter((it) =>
              !query.trim() ||
              (String(it.name?.uz || '')).toLowerCase().includes(query.toLowerCase()) ||
              (String(it.name?.ru || '')).toLowerCase().includes(query.toLowerCase()) ||
              (String(it.name?.en || '')).toLowerCase().includes(query.toLowerCase())
            );
            return (
              <div key={key} className="mb-8">
                <div className="sticky top-0 z-10 -mx-4 px-4 py-2 bg-base/80 backdrop-blur border-b border-white/10">
                  <h2 className="text-lg md:text-xl font-medium flex items-center gap-2 text-white">
                    <span className="opacity-80">{key}</span>
                    <span className="text-xs text-gray-400">({items.length})</span>
                  </h2>
                </div>
                <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {items.map((it) => (
                    <li key={it.id} className="rounded-lg border border-white/10 bg-white/5 p-3 md:p-4">
                      {editingId === it.id ? (
                        <div className="space-y-2">
                           {/* ... editing form inputs ... */}
                           <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                             <div className="md:col-span-4">
                               <label className="block text-xs text-gray-300 mb-1">Name (UZ)</label>
                               <input className="w-full p-2 rounded-md bg-black/20 border border-white/10" value={editName.uz} onChange={(e) => setEditName({ ...editName, uz: e.target.value })} />
                             </div>
                             <div className="md:col-span-4">
                               <label className="block text-xs text-gray-300 mb-1">Name (RU)</label>
                               <input className="w-full p-2 rounded-md bg-black/20 border border-white/10" value={editName.ru} onChange={(e) => setEditName({ ...editName, ru: e.target.value })} />
                             </div>
                             <div className="md:col-span-4">
                               <label className="block text-xs text-gray-300 mb-1">Name (EN)</label>
                               <input className="w-full p-2 rounded-md bg-black/20 border border-white/10" value={editName.en} onChange={(e) => setEditName({ ...editName, en: e.target.value })} />
                             </div>
                             <div className="md:col-span-3">
                               <label className="block text-xs text-gray-300 mb-1">Price</label>
                               <input className="w-full p-2 rounded-md bg-black/20 border border-white/10" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} placeholder="Price" />
                             </div>
                             <div className="md:col-span-3">
                               <label className="block text-xs text-gray-300 mb-1">Weight/Volume</label>
                               <input className="w-full p-2 rounded-md bg-black/20 border border-white/10" value={editWeight} onChange={(e) => setEditWeight(e.target.value)} placeholder="300g" />
                             </div>
                             <div className="md:col-span-3">
                               <div className="flex items-center gap-2 mb-1">
                                 <label className="block text-xs text-gray-300">Show Description</label>
                                 <button type="button" onClick={() => setEditShowDescription(!editShowDescription)} className={`w-6 h-3 rounded-full ${editShowDescription ? 'bg-[#e0d3a3]' : 'bg-gray-600'}`}>
                                   <div className={`w-2 h-2 bg-white rounded-full transition-transform ${editShowDescription ? 'translate-x-3' : 'translate-x-0.5'}`} />
                                 </button>
                               </div>
                             </div>
                             <div className="md:col-span-4">
                               <label className="block text-xs text-gray-300 mb-1">Description (UZ)</label>
                               <input className="w-full p-2 rounded-md bg-black/20 border border-white/10" value={editDescription.uz} onChange={(e) => setEditDescription({ ...editDescription, uz: e.target.value })} />
                             </div>
                             <div className="md:col-span-4">
                               <label className="block text-xs text-gray-300 mb-1">Description (RU)</label>
                               <input className="w-full p-2 rounded-md bg-black/20 border border-white/10" value={editDescription.ru} onChange={(e) => setEditDescription({ ...editDescription, ru: e.target.value })} />
                             </div>
                             <div className="md:col-span-4">
                               <label className="block text-xs text-gray-300 mb-1">Description (EN)</label>
                               <input className="w-full p-2 rounded-md bg-black/20 border border-white/10" value={editDescription.en} onChange={(e) => setEditDescription({ ...editDescription, en: e.target.value })} />
                             </div>
                           </div>
                          <div className="flex items-center gap-2">
                             {/* EDIT REJIMIDAN TOGGLE OLIB TASHLANDI */}
                            <button className="bg-[#e0d3a3] text-black px-3 py-2 rounded-md hover:opacity-90" onClick={saveEdit}>Save</button>
                            <button className="px-3 py-2 rounded-md border border-white/20 hover:bg-white/10" onClick={cancelEdit}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="text-base md:text-lg font-medium text-white">{it.name?.uz || it.name?.ru || it.name?.en || 'No name'}</div>
                            <div className="text-sm text-gray-400 mt-0.5">
                              <span className="mr-2">{it.price ?? '-'}</span>
                              {it.weight && <span className="text-gray-500">• {it.weight}</span>}
                            </div>
                            {it.description?.uz || it.description?.ru || it.description?.en ? (
                              <div className="text-xs text-gray-400 mt-1 line-clamp-2">{it.description?.uz || it.description?.ru || it.description?.en}</div>
                            ) : null}
                            <div className="text-xs text-gray-500 mt-1">
                              Description: {it.showDescription ? 'Shown' : 'Hidden'} on page
                            </div>
                          </div>
                          
                          {/* O'ZGARTIRILGAN QISM: TOGGLE SHU YERGA QO'SHILDI */}
                          <div className="shrink-0 flex items-center gap-3">
                             <button
                                type="button"
                                onClick={() => toggleItemShow(it.id, it.show !== false)}
                                className={`w-10 h-5 rounded-full transition-colors ${
                                  it.show !== false ? 'bg-[#e0d3a3]' : 'bg-gray-600'
                                }`}
                              >
                                <span className={`block w-4 h-4 m-0.5 bg-white rounded-full transition-transform ${
                                  it.show !== false ? 'translate-x-5' : 'translate-x-0'
                                }`} />
                              </button>
                            <button className="bg-blue-600/80 hover:bg-blue-600 px-3 py-1.5 rounded-md text-sm" onClick={() => startEdit(it)}>Edit</button>
                            <button className="bg-red-600/80 hover:bg-red-600 px-3 py-1.5 rounded-md text-sm" onClick={() => deleteItem(it.id)}>Delete</button>
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