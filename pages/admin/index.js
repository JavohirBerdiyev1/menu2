import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminCategories() {
  const router = useRouter();
  const [newMenuName, setNewMenuName] = useState('');
  const [newMenuType, setNewMenuType] = useState('');
  const [menuTypes, setMenuTypes] = useState([]);
  const [adminMenus, setAdminMenus] = useState([]);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    fetch('/api/menuTypes', {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
      .then((r) => r.json())
      .then((resp) => {
        const types = Array.isArray(resp?.types) ? resp.types : (Array.isArray(resp) ? resp : []);
        setMenuTypes(types);
        if (resp && Array.isArray(resp.admin)) setAdminMenus(resp.admin);
      })
      .catch(() => setMenuTypes([]));
  }, []);

  const knownLabels = {
    uzbek: { uz: 'Milliy taomlar', ru: 'Узбекская', en: 'Uzbek' },
    european: { uz: 'Yevropa taomlar', ru: 'Европейская', en: 'European' },
    businessLunch: { uz: 'Biznes-lanch', ru: 'Бизнес-ланч', en: 'Business Lunch' },
    shashlik: { uz: 'Shashlik', ru: 'Шашлык', en: 'Shashlik' },
    garnish: { uz: 'Garnirlar', ru: 'Гарниры', en: 'Garnishes' },
    bread: { uz: 'Non', ru: 'Хлеб', en: 'Bread' },
    bar: { uz: 'Bar', ru: 'Бар', en: 'Bar' },
    hookah: { uz: "Kal'yan", ru: 'Кальян', en: 'Hookah' },
  };

  function fallbackLabel(id) {
    const readable = String(id).replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ');
    const titled = readable.replace(/\b\w/g, (c) => c.toUpperCase());
    return { uz: titled, ru: titled, en: titled };
  }

  return (
    <div className="p-4 text-white bg-base min-h-screen">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>
      
      {/* Menu Management Links */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Menu Management</h2>
        
        {/* Add New Menu Section */}
      

        {/* Existing Menus (dynamic) */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {(menuTypes.length ? menuTypes : Object.keys(knownLabels)).map((id) => {
            const label = knownLabels[id]?.en || fallbackLabel(id).en;
            return (
              <button
                key={id}
                className="p-3 bg-[#e0d3a3] text-black rounded-lg hover:opacity-90"
                onClick={() => router.push(`/admin/${id}`)}
              >
                {label} Menu
              </button>
            );
          })}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl shadow-lg backdrop-blur p-4 md:p-6 mb-6">
          <h3 className="text-lg font-medium mb-4 text-white">Add New Menu</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Menu Name</label>
              <input
                className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3] text-white"
                value={newMenuName}
                onChange={(e) => setNewMenuName(e.target.value)}
                placeholder="Enter menu name"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Menu Type (URL)</label>
              <input
                className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3] text-white"
                value={newMenuType}
                onChange={(e) => setNewMenuType(e.target.value)}
                placeholder="e.g., desserts, drinks"
              />
            </div>
          </div>
          <button className="bg-[#e0d3a3] text-black px-4 py-2 rounded-md hover:opacity-90 mt-4" onClick={async () => {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
            if (!newMenuType.trim()) {
              alert('Menu Type (URL) is required');
              return;
            }
            try {
              const res = await fetch('/api/menuTypes', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ id: newMenuType.trim(), name: newMenuName ? { en: newMenuName } : null }),
              });
              if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                alert(err.message || 'Failed to create menu');
                return;
              }
              setNewMenuName('');
              const id = newMenuType.trim();
              setNewMenuType('');
              // Refresh list so it appears immediately for admin
              fetch('/api/menuTypes', { headers: { Authorization: `Bearer ${token}` } })
                .then((r) => r.json())
                .then((resp) => setMenuTypes(Array.isArray(resp?.types) ? resp.types : []))
                .catch(() => {});
              // Navigate to the new admin page
              router.push(`/admin/${id}`);
            } catch (e) {
              alert('Network error');
            }
          }}>
            Create New Menu
          </button>
        </div>

        {/* Publish controls with toggles */}
        <div className="bg-white/5 border border-white/10 rounded-xl shadow-lg backdrop-blur p-4 md:p-6 mb-6">
          <h3 className="text-lg font-medium mb-4 text-white">Publish Menus</h3>
          {adminMenus.length === 0 ? (
            <p className="text-gray-300">No custom menus yet. Create one above.</p>
          ) : (
            <ul className="space-y-2">
              {adminMenus.map((m) => (
                <li key={m.id} className="flex items-center justify-between border border-white/10 rounded-md px-3 py-2 bg-white/5">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{m.id}</span>
                    <span className="text-xs text-gray-400">{m.show ? 'Published' : 'Hidden'}</span>
                  </div>
                  <button
                    onClick={async () => {
                      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
                      const next = !m.show;
                      // optimistic update
                      setAdminMenus((prev) => prev.map((x) => x.id === m.id ? { ...x, show: next } : x));
                      try {
                        const res = await fetch('/api/menuTypes', {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                          body: JSON.stringify({ id: m.id, show: next }),
                        });
                        if (!res.ok) throw new Error('failed');
                        const updated = await res.json();
                        setAdminMenus((prev) => prev.map((x) => x.id === m.id ? { ...x, show: updated.show } : x));
                      } catch (e) {
                        // revert on failure
                        setAdminMenus((prev) => prev.map((x) => x.id === m.id ? { ...x, show: !next } : x));
                      }
                    }}
                    className={`w-10 h-5 rounded-full transition-colors ${m.show ? 'bg-[#e0d3a3]' : 'bg-gray-600'}`}
                    title="Toggle visibility in header"
                  >
                    <span className={`block w-4 h-4 bg-white rounded-full transform transition-transform ${m.show ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}