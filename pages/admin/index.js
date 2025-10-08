import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminCategories() {
  const router = useRouter();
  const [newMenuNameUz, setNewMenuNameUz] = useState('');
  const [newMenuNameRu, setNewMenuNameRu] = useState('');
  const [newMenuNameEn, setNewMenuNameEn] = useState('');
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
              <label className="block text-sm text-gray-300 mb-1">Name (UZ)</label>
              <input
                className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3] text-white"
                value={newMenuNameUz}
                onChange={(e) => setNewMenuNameUz(e.target.value)}
                placeholder="O'zbekcha nom"
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
            <div>
              <label className="block text-sm text-gray-300 mb-1">Name (RU)</label>
              <input
                className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3] text-white"
                value={newMenuNameRu}
                onChange={(e) => setNewMenuNameRu(e.target.value)}
                placeholder="Русское название"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Name (EN)</label>
              <input
                className="w-full p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3] text-white"
                value={newMenuNameEn}
                onChange={(e) => setNewMenuNameEn(e.target.value)}
                placeholder="English name"
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
                body: JSON.stringify({ id: newMenuType.trim(), name: (newMenuNameUz || newMenuNameRu || newMenuNameEn) ? { uz: newMenuNameUz || '', ru: newMenuNameRu || '', en: newMenuNameEn || '' } : null }),
              });
              if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                alert(err.message || 'Failed to create menu');
                return;
              }
              setNewMenuNameUz('');
              setNewMenuNameRu('');
              setNewMenuNameEn('');
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
            <ul className="space-y-3">
              {adminMenus.map((m, idx) => (
                <li key={m.id} className="border border-white/10 rounded-xl px-3 py-4 bg-white/5">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{m.id}</span>
                      <span className="text-xs text-gray-400">{m.show ? 'Published' : 'Hidden'}</span>
                    </div>
                    <button
                      onClick={async () => {
                        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
                        const next = !m.show;
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
                          setAdminMenus((prev) => prev.map((x) => x.id === m.id ? { ...x, show: !next } : x));
                        }
                      }}
                      className={`w-10 h-5 rounded-full transition-colors ${m.show ? 'bg-[#e0d3a3]' : 'bg-gray-600'}`}
                      title="Toggle visibility in header"
                    >
                      <span className={`block w-4 h-4 bg-white rounded-full transform transition-transform ${m.show ? 'translate-x-5' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  {/* Localized names editor with Save/Reset */}
                  <LocalizedNameEditor
                    key={`editor-${m.id}`}
                    value={typeof m.name === 'object' && m.name ? m.name : {}}
                    onSave={async (nextName) => {
                      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
                      try {
                        const res = await fetch('/api/menuTypes', {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                          body: JSON.stringify({ id: m.id, name: nextName }),
                        });
                        if (!res.ok) throw new Error('failed');
                        const updated = await res.json();
                        setAdminMenus((prev) => prev.map((x) => x.id === m.id ? { ...x, name: updated.name } : x));
                        return true;
                      } catch (e) {
                        return false;
                      }
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function LocalizedNameEditor({ value, onSave }) {
  const [draft, setDraft] = React.useState({ uz: value.uz || '', ru: value.ru || '', en: value.en || '' });
  const [saving, setSaving] = React.useState(false);
  const [dirty, setDirty] = React.useState(false);
  const [savedOk, setSavedOk] = React.useState(null);

  const onChange = (lng, v) => {
    setDraft((d) => ({ ...d, [lng]: v }));
    setDirty(true);
    setSavedOk(null);
  };

  const doReset = () => {
    setDraft({ uz: value.uz || '', ru: value.ru || '', en: value.en || '' });
    setDirty(false);
    setSavedOk(null);
  };

  const doSave = async () => {
    setSaving(true);
    const ok = await onSave({ uz: draft.uz || '', ru: draft.ru || '', en: draft.en || '' });
    setSaving(false);
    setSavedOk(Boolean(ok));
    if (ok) setDirty(false);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {['uz','ru','en'].map((lng) => (
          <div key={lng} className="flex items-center gap-2">
            <label className="text-xs text-gray-300 w-10 uppercase">{lng}</label>
            <input
              className="flex-1 p-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#e0d3a3] text-white"
              value={draft[lng]}
              onChange={(e) => onChange(lng, e.target.value)}
              placeholder={`${lng.toUpperCase()} name`}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={doSave}
          disabled={!dirty || saving}
          className={`px-3 py-2 rounded-md text-black ${dirty ? 'bg-[#e0d3a3] hover:opacity-90' : 'bg-gray-400 cursor-not-allowed'}`}
        >
          {saving ? 'Saving...' : 'Save names'}
        </button>
        <button
          onClick={doReset}
          disabled={!dirty || saving}
          className={`px-3 py-2 rounded-md ${dirty ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white/5 text-gray-400 cursor-not-allowed'}`}
        >
          Reset
        </button>
        {savedOk === true && <span className="text-xs text-green-400">Saved</span>}
        {savedOk === false && <span className="text-xs text-red-400">Failed to save</span>}
      </div>
    </div>
  );
}