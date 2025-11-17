import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

const categoryOptions = [
  'soft_drinks','coffee','teas','lemonades','smoothies_detox','alcohol_drinks','beer','tequila','rum','liqueurs','brandy','vodka','whisky','infusions','gin','imported_wine','sparkling_wine'
];

const defaultCategoryNames = {
  soft_drinks:     { uz: 'Sovuq ichimliklar',       ru: 'Безалкогольные напитки', en: 'Soft Drinks' },
  coffee:          { uz: 'Kofe',                    ru: 'Кофе',                   en: 'Coffee' },
  teas:            { uz: 'Choylar',                 ru: 'Чаи',                    en: 'Teas' },
  lemonades:       { uz: 'Limonadlar',              ru: 'Лимонады',               en: 'Lemonades' },
  smoothies_detox: { uz: 'Smuzi / Detoks',          ru: 'Смузи / Детокс',         en: 'Smoothies / Detox' },
  alcohol_drinks:  { uz: 'Alkogolli kokteyllar',    ru: 'Алкогольные коктейли',   en: 'Alcoholic Cocktails' },
  beer:            { uz: 'Pivo / Sidr',             ru: 'Пиво / Сидр',            en: 'Beer / Cider' },
  tequila:         { uz: 'Tekila',                  ru: 'Текила',                 en: 'Tequila' },
  rum:             { uz: 'Rom',                     ru: 'Ром',                    en: 'Rum' },
  liqueurs:        { uz: 'Likyorlar',               ru: 'Ликёры',                 en: 'Liqueurs' },
  brandy:          { uz: 'Konyak / Brendi',         ru: 'Бренди / Коньяк',        en: 'Brandy / Cognac' },
  vodka:           { uz: 'Vodka',                   ru: 'Водка',                  en: 'Vodka' },
  whisky:          { uz: 'Viski',                   ru: 'Виски',                  en: 'Whisky' },
  infusions:       { uz: 'Nastoykalar',             ru: 'Настойки',               en: 'Infusions' },
  gin:             { uz: 'Jin',                     ru: 'Джин',                   en: 'Gin' },
  imported_wine:   { uz: 'Import vinolar',          ru: 'Импортное вино',         en: 'Imported Wine' },
  sparkling_wine:  { uz: 'Pushti / Gazli vino',     ru: 'Игристое вино',          en: 'Sparkling Wine' },
};

const baseCategoryOrder = categoryOptions.reduce((acc, key, idx) => {
  acc[key] = idx;
  return acc;
}, {});

const getFallbackName = (key) =>
  defaultCategoryNames[key] || { uz: key, ru: key, en: key };

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
  const [newCategoryKey, setNewCategoryKey] = useState('');
  const [newCategoryName, setNewCategoryName] = useState({ uz: '', ru: '', en: '' });
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [categoryOverrides, setCategoryOverrides] = useState({});
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [editingCategoryKey, setEditingCategoryKey] = useState('');
  const [categoryEditName, setCategoryEditName] = useState({ uz: '', ru: '', en: '' });
  const [savingCategoryEdit, setSavingCategoryEdit] = useState(false);

  const extraOrderMap = useMemo(() => {
    const extras = Object.keys(barData || {}).filter(
      (key) => baseCategoryOrder[key] === undefined
    );
    extras.sort();
    const map = {};
    extras.forEach((key, idx) => {
      map[key] = 1000 + idx;
    });
    return map;
  }, [barData]);

  const getOrderValue = (key, overridesMap = categoryOverrides) => {
    const stored = overridesMap[key]?.order;
    if (typeof stored === 'number') return stored;
    if (baseCategoryOrder[key] !== undefined) return baseCategoryOrder[key];
    if (extraOrderMap[key] !== undefined) return extraOrderMap[key];
    return 2000;
  };

  const getCategoryMeta = (key) => {
    const meta = categoryOverrides[key];
    if (meta) return meta;
    return {
      name: getFallbackName(key),
      show: true,
      order: getOrderValue(key),
    };
  };

  const applyCategoryMeta = (key, updater) => {
    setCategoryOverrides((prev) => {
      const current =
        prev[key] ||
        {
          name: getFallbackName(key),
          show: true,
          order: getOrderValue(key, prev),
        };
      const nextMeta =
        typeof updater === 'function' ? updater(current) : { ...current, ...updater };
      return {
        ...prev,
        [key]: nextMeta,
      };
    });
  };

  const getAllCategoryKeys = () => {
    const overrideKeys = Object.keys(categoryOverrides);
    const dataKeys = Object.keys(barData);
    return [...new Set([...categoryOptions, ...overrideKeys, ...dataKeys])];
  };

  const computeNextOrderValue = () => {
    const keys = getAllCategoryKeys();
    let max = -Infinity;
    keys.forEach((key) => {
      const value = getOrderValue(key);
      if (value > max) max = value;
    });
    return max === -Infinity ? 0 : max + 1;
  };

  const orderedKeys = useMemo(() => {
    const keys = getAllCategoryKeys();
    return [...keys].sort((a, b) => {
      const diff = getOrderValue(a) - getOrderValue(b);
      if (diff !== 0) return diff;
      return a.localeCompare(b);
    });
  }, [categoryOverrides, barData, extraOrderMap]);

  const persistCategoryMeta = async (key, overrides = {}, method = 'PUT') => {
    if (!token) {
      alert('Authentication required');
      return null;
    }
    const current = getCategoryMeta(key);
    const payload = {
      id: key,
      menuType: 'bar',
      name: overrides.name || current.name,
      show:
        overrides.show !== undefined
          ? overrides.show
          : current.show,
    };
    if (overrides.order !== undefined) {
      payload.order = overrides.order;
    } else if (typeof current.order === 'number') {
      payload.order = current.order;
    }
    const res = await fetch('/api/categories?menuType=bar', {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to save category meta');
    const saved = await res.json();
    applyCategoryMeta(saved.id, {
      name: saved.name,
      show: saved.show !== false,
      order: typeof saved.order === 'number' ? saved.order : null,
    });
    return saved;
  };

  const refreshCategories = () => {
    setCategoryLoading(true);
    fetch('/api/categories?menuType=bar')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          const map = {};
          data.forEach((c) => {
            if (c?.id)
              map[c.id] = {
                name: c.name,
                show: c.show !== false,
                order: typeof c.order === 'number' ? c.order : null,
              };
          });
          setCategoryOverrides(map);
        } else {
          setCategoryOverrides({});
        }
      })
      .catch(() => setCategoryOverrides({}))
      .finally(() => setCategoryLoading(false));
  };

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (!t) {
      router.push('/login');
      return;
    }
    setToken(t);
    fetch('/api/bar', { headers: { Authorization: `Bearer ${t}` } })
      .then((r) => r.json())
      .then(setBarData);
  }, [router]);

  useEffect(() => {
    refreshCategories();
  }, []);

  const addItem = async () => {
    const id = `${categoryKey}_${Date.now()}`;
    // Parse price: if contains '/', keep as string, otherwise try to convert to number
    let parsedPrice = null;
    if (price && price.trim()) {
      if (price.includes('/')) {
        parsedPrice = price.trim();
      } else {
        const num = Number(price);
        parsedPrice = isNaN(num) ? price.trim() : num;
      }
    }
    // Parse volume: if contains '/', keep as string, otherwise try to convert to number
    let parsedVolume = null;
    if (volume && volume.trim()) {
      if (volume.includes('/')) {
        parsedVolume = volume.trim();
      } else {
        const num = Number(volume);
        parsedVolume = isNaN(num) ? volume.trim() : num;
      }
    }
    const item = {
      id,
      name,
      price: parsedPrice,
      volume: parsedVolume,
      unit: unit || null,
      description: description || null,
      show: true,
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

  const toggleItemShow = async (id, currentShow) => {
    const nextShow = !currentShow;
    const optimistic = { ...barData };
    for (const k of Object.keys(optimistic)) {
      optimistic[k] = (optimistic[k] || []).map((x) => (x.id === id ? { ...x, show: nextShow } : x));
    }
    setBarData(optimistic);
    try {
      const res = await fetch('/api/bar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id, updates: { show: nextShow } }),
      });
      if (!res.ok) throw new Error('Failed');
      const updated = await res.json();
      const synced = { ...optimistic };
      for (const k of Object.keys(synced)) {
        synced[k] = (synced[k] || []).map((x) => (x.id === id ? updated : x));
      }
      setBarData(synced);
    } catch (e) {
      setBarData({ ...barData });
    }
  };

  const resetForm = () => {
    setCategoryKey(orderedKeys[0] || categoryOptions[0]);
    setName('');
    setPrice('');
    setVolume('');
    setUnit('');
    setDescription('');
  };

  const deleteItem = async (id) => {
    if (typeof window !== 'undefined' && !confirm('Are you sure?')) return;
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
    setEditPrice(it.price != null ? String(it.price) : '');
    setEditVolume(it.volume != null ? String(it.volume) : '');
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
    // Parse price: if contains '/', keep as string, otherwise try to convert to number
    let parsedPrice = null;
    if (editPrice && editPrice.trim()) {
      if (editPrice.includes('/')) {
        parsedPrice = editPrice.trim();
      } else {
        const num = Number(editPrice);
        parsedPrice = isNaN(num) ? editPrice.trim() : num;
      }
    }
    // Parse volume: if contains '/', keep as string, otherwise try to convert to number
    let parsedVolume = null;
    if (editVolume && editVolume.trim()) {
      if (editVolume.includes('/')) {
        parsedVolume = editVolume.trim();
      } else {
        const num = Number(editVolume);
        parsedVolume = isNaN(num) ? editVolume.trim() : num;
      }
    }
    const updates = {
      name: editName,
      price: parsedPrice,
      volume: parsedVolume,
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

  const normalizeCategoryName = (key, values = {}) => {
    const source =
      typeof values === 'object' && values !== null ? values : typeof values === 'string' ? { uz: values, ru: values, en: values } : {};
    const fallback = defaultCategoryNames[key] || { uz: key, ru: key, en: key };
    return {
      uz: source.uz?.trim() || fallback.uz || key,
      ru: source.ru?.trim() || fallback.ru || key,
      en: source.en?.trim() || fallback.en || key,
    };
  };

  const createCategory = async () => {
    if (!newCategoryKey.trim()) {
      alert('Category key is required');
      return;
    }
    if (!token) {
      alert('Authentication required');
      return;
    }
    const categoryKeyValue = newCategoryKey.trim().toLowerCase().replace(/\s+/g, '_');
    const namePayload = normalizeCategoryName(categoryKeyValue, newCategoryName);
    const orderValue = computeNextOrderValue();
    try {
      const created = await persistCategoryMeta(
        categoryKeyValue,
        { name: namePayload, order: orderValue },
        'POST'
      );
      if (created) {
        setCategoryKey(created.id);
        setNewCategoryKey('');
        setNewCategoryName({ uz: '', ru: '', en: '' });
        setShowNewCategoryForm(false);
      }
    } catch (e) {
      alert("Kategoriyani yaratib bo'lmadi");
    }
  };

  const isCategoryVisible = (key) => {
    return getCategoryMeta(key).show !== false;
  };

  const toggleCategoryVisibility = async (key) => {
    if (!token) {
      alert('Authentication required');
      return;
    }
    const nextShow = !isCategoryVisible(key);
    try {
      await persistCategoryMeta(key, { show: nextShow });
    } catch (e) {
      alert("Ko'rinishni o'zgartirib bo'lmadi");
    }
  };

  const startCategoryEdit = (key) => {
    if (editingCategoryKey === key) {
      cancelCategoryEdit();
      return;
    }
    const current = normalizeCategoryName(key, getCategoryMeta(key).name);
    setEditingCategoryKey(key);
    setCategoryEditName(current);
  };

  const cancelCategoryEdit = () => {
    setEditingCategoryKey('');
    setCategoryEditName({ uz: '', ru: '', en: '' });
  };

  const saveCategoryEdit = async () => {
    if (!editingCategoryKey) return;
    if (!token) {
      alert('Authentication required');
      return;
    }
    setSavingCategoryEdit(true);
    const payload = normalizeCategoryName(editingCategoryKey, categoryEditName);
    try {
      await persistCategoryMeta(editingCategoryKey, { name: payload });
      cancelCategoryEdit();
    } catch (e) {
      alert("Kategoriyani saqlab bo'lmadi");
    } finally {
      setSavingCategoryEdit(false);
    }
  };

  const moveCategory = async (key, direction) => {
    const currentIndex = orderedKeys.indexOf(key);
    if (currentIndex === -1) return;
    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= orderedKeys.length) return;
    const targetKey = orderedKeys[targetIndex];
    const currentOrder = getOrderValue(key);
    const targetOrder = getOrderValue(targetKey);

    applyCategoryMeta(key, (meta) => ({ ...meta, order: targetOrder }));
    applyCategoryMeta(targetKey, (meta) => ({ ...meta, order: currentOrder }));

    try {
      await Promise.all([
        persistCategoryMeta(key, { order: targetOrder }),
        persistCategoryMeta(targetKey, { order: currentOrder }),
      ]);
    } catch (e) {
      alert("Kategoriya tartibini o'zgartirib bo'lmadi");
      refreshCategories();
    }
  };

  // Helpers
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
              <div className="flex gap-2">
                <select className="flex-1 p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3]" value={categoryKey} onChange={(e) => setCategoryKey(e.target.value)}>
                  {orderedKeys.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
                <button 
                  type="button"
                  className="px-3 py-2 rounded-md bg-green-600/80 hover:bg-green-600 text-white text-sm"
                  onClick={() => setShowNewCategoryForm(!showNewCategoryForm)}
                  title="Create new category"
                >
                  {showNewCategoryForm ? '✕' : '+'}
                </button>
              </div>
              {categoryLoading && (
                <p className="mt-1 text-[12px] text-gray-400">Loading categories…</p>
              )}
              {showNewCategoryForm && (
                <div className="mt-2 p-3 bg-black/30 rounded-md border border-white/10">
                  <div className="mb-2">
                    <label className="block text-xs text-gray-300 mb-1">Category Key (e.g., new_drinks)</label>
                    <input 
                      className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3] text-white text-sm" 
                      placeholder="new_drinks" 
                      value={newCategoryKey} 
                      onChange={(e) => setNewCategoryKey(e.target.value)} 
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs text-gray-300 mb-1">Name (UZ)</label>
                    <input 
                      className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3] text-white text-sm" 
                      placeholder="Yangi ichimliklar" 
                      value={newCategoryName.uz} 
                      onChange={(e) => setNewCategoryName({ ...newCategoryName, uz: e.target.value })} 
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs text-gray-300 mb-1">Name (RU)</label>
                    <input 
                      className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3] text-white text-sm" 
                      placeholder="Новые напитки" 
                      value={newCategoryName.ru} 
                      onChange={(e) => setNewCategoryName({ ...newCategoryName, ru: e.target.value })} 
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs text-gray-300 mb-1">Name (EN)</label>
                    <input 
                      className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3] text-white text-sm" 
                      placeholder="New Drinks" 
                      value={newCategoryName.en} 
                      onChange={(e) => setNewCategoryName({ ...newCategoryName, en: e.target.value })} 
                    />
                  </div>
                  <button 
                    className="w-full bg-[#e0d3a3] text-black px-3 py-2 rounded-md hover:opacity-90 text-sm"
                    onClick={createCategory}
                  >
                    Create Category
                  </button>
                </div>
              )}
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm text-gray-300 mb-1">Name</label>
              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3]" placeholder="E.g. Mojito" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-300 mb-1">Price</label>
              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3]" placeholder="50000 yoki 5000/1000" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-300 mb-1">Volume</label>
              <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3]" placeholder="400 yoki 400/1000" value={volume} onChange={(e) => setVolume(e.target.value)} />
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
            <select className="p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3] text-white" value={visibleCategory} onChange={(e) => setVisibleCategory(e.target.value)}>
              <option value="all">All</option>
              {orderedKeys.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <input className="w-64 p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3] text-white" placeholder="Search by name" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>

        {/* List */}
        {visibleKeys.length === 0 ? (
          <p className="text-gray-300">No data yet. Add your first item.</p>
        ) : (
          visibleKeys.map((key) => {
            const items = (barData[key] || []).filter((it) => {
              if (!query.trim()) return true;
              const nameStr = typeof it.name === 'object' ? 
                (it.name?.uz || it.name?.ru || it.name?.en || '') : 
                (it.name || '');
              return nameStr.toLowerCase().includes(query.toLowerCase());
            });
            const isVisible = isCategoryVisible(key);
            const currentIndex = orderedKeys.indexOf(key);
            const canMoveUp = currentIndex > 0;
            const canMoveDown = currentIndex !== -1 && currentIndex < orderedKeys.length - 1;
            return (
              <div key={key} className="mb-8">
                <div className="sticky top-0 z-10 -mx-4 px-4 py-2 bg-base/80 backdrop-blur border-b border-white/10">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg md:text-xl font-medium flex items-center gap-2">
                      <span className="opacity-80">{key}</span>
                      <span className="text-xs text-gray-400">({items.length})</span>
                      {isVisible ? null : (
                        <span className="text-[10px] uppercase tracking-wide text-red-400 ml-2">
                          hidden
                        </span>
                      )}
                    </h2>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className="px-2 py-1 rounded border border-white/20 text-xs disabled:opacity-40"
                          onClick={() => moveCategory(key, -1)}
                          disabled={!canMoveUp}
                          title="Move up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className="px-2 py-1 rounded border border-white/20 text-xs disabled:opacity-40"
                          onClick={() => moveCategory(key, 1)}
                          disabled={!canMoveDown}
                          title="Move down"
                        >
                          ↓
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => startCategoryEdit(key)}
                        className="text-xs text-[#e0d3a3] underline decoration-dotted underline-offset-4"
                      >
                        {editingCategoryKey === key ? 'Cancel edit' : 'Edit'}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleCategoryVisibility(key)}
                        className={`w-10 h-5 rounded-full transition-colors ${
                          isVisible ? 'bg-[#e0d3a3]' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`block w-4 h-4 m-0.5 bg-white rounded-full transition-transform ${
                            isVisible ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
                {editingCategoryKey === key && (
                  <div className="mt-3 bg-black/30 border border-white/10 rounded-lg p-3 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-gray-300 mb-1">Name (UZ)</label>
                        <input
                          className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3] text-white text-sm"
                          value={categoryEditName.uz}
                          onChange={(e) => setCategoryEditName((prev) => ({ ...prev, uz: e.target.value }))}
                          placeholder="Kategoriya nomi (UZ)"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-300 mb-1">Name (RU)</label>
                        <input
                          className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3] text-white text-sm"
                          value={categoryEditName.ru}
                          onChange={(e) => setCategoryEditName((prev) => ({ ...prev, ru: e.target.value }))}
                          placeholder="Название категории (RU)"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-300 mb-1">Name (EN)</label>
                        <input
                          className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3] text-white text-sm"
                          value={categoryEditName.en}
                          onChange={(e) => setCategoryEditName((prev) => ({ ...prev, en: e.target.value }))}
                          placeholder="Category name (EN)"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="bg-[#e0d3a3] text-black px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                        onClick={saveCategoryEdit}
                        disabled={savingCategoryEdit}
                      >
                        {savingCategoryEdit ? 'Saving...' : 'Save category'}
                      </button>
                      <button
                        className="px-4 py-2 rounded-md border border-white/20 hover:bg-white/10"
                        onClick={cancelCategoryEdit}
                        type="button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                {isVisible && (
                  <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {items.map((it) => (
                      <li key={it.id} className="rounded-lg border border-white/10 bg-white/5 p-3 md:p-4">
                        {editingId === it.id ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                              <div className="md:col-span-5">
                                <label className="block text-xs text-gray-300 mb-1">Name</label>
                                <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3] text-white" value={editName} onChange={(e) => setEditName(e.target.value)} />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-xs text-gray-300 mb-1">Price</label>
                                <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3] text-white" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} placeholder="50000 yoki 5000/1000" />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-xs text-gray-300 mb-1">Volume</label>
                                <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3] text-white" value={editVolume} onChange={(e) => setEditVolume(e.target.value)} placeholder="400 yoki 400/1000" />
                              </div>
                              <div className="md:col-span-3">
                                <label className="block text-xs text-gray-300 mb-1">Unit</label>
                                <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3] text-white" value={editUnit} onChange={(e) => setEditUnit(e.target.value)} placeholder="Unit" />
                              </div>
                              <div className="md:col-span-12">
                                <label className="block text-xs text-gray-300 mb-1">Description</label>
                                <input className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3] text-white" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="Description" />
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
                              <div className="text-base md:text-lg font-medium text-white">
                                {typeof it.name === 'object' ? (it.name?.uz || it.name?.ru || it.name?.en || 'No name') : it.name}
                              </div>
                              <div className="text-sm text-gray-400 mt-0.5">
                                <span className="mr-2">
                                  {it.price != null 
                                    ? (typeof it.price === 'number' ? it.price.toLocaleString() : it.price)
                                    : '-'}
                                </span>
                                {it.unit ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-gray-200 text-xs">
                                    {it.volume != null 
                                      ? (typeof it.volume === 'number' ? it.volume : it.volume)
                                      : ''}
                                    {it.unit}
                                  </span>
                                ) : null}
                              </div>
                              {it.description ? (
                                <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                                  {typeof it.description === 'object' ? (it.description?.uz || it.description?.ru || it.description?.en || '') : it.description}
                                </div>
                              ) : null}
                            </div>
                            <div className="shrink-0 flex items-center gap-2">
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
                              <button className="bg-blue-600/80 hover:bg-blue-600 px-3 py-1.5 rounded-md" onClick={() => startEdit(it)}>Edit</button>
                              <button className="bg-red-600/80 hover:bg-red-600 px-3 py-1.5 rounded-md" onClick={() => deleteItem(it.id)}>Delete</button>
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}


