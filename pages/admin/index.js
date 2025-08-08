import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminCategories() {
  const router = useRouter();
  const [cats, setCats] = useState([]);
  const [name, setName] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (!t) {
      router.push('/login');
      return;
    }
    setToken(t);
    fetch('/api/categories', { headers: { Authorization: `Bearer ${t}` } })
      .then((r) => r.json())
      .then(setCats);
  }, [router]);

  const addCat = async () => {
    const id = Date.now().toString();
    await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, name }),
    });
    setCats([...cats, { id, name }]);
    setName('');
  };

  const delCat = async (id) => {
    await fetch('/api/categories', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
    setCats(cats.filter((c) => c.id !== id));
  };

  return (
    <div className="p-4 text-white bg-base min-h-screen">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>
      
      {/* Menu Management Links */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Menu Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <button 
            className="p-3 bg-[#e0d3a3] text-black rounded-lg hover:opacity-90" 
            onClick={() => router.push('/admin/bar')}
          >
            Bar Menu
          </button>
          <button 
            className="p-3 bg-[#e0d3a3] text-black rounded-lg hover:opacity-90" 
            onClick={() => router.push('/admin/european')}
          >
            European Menu
          </button>
          <button 
            className="p-3 bg-[#e0d3a3] text-black rounded-lg hover:opacity-90" 
            onClick={() => router.push('/admin/uzbek')}
          >
            Uzbek Menu
          </button>
          <button 
            className="p-3 bg-[#e0d3a3] text-black rounded-lg hover:opacity-90" 
            onClick={() => router.push('/admin/shashlik')}
          >
            Shashlik Menu
          </button>
          <button 
            className="p-3 bg-[#e0d3a3] text-black rounded-lg hover:opacity-90" 
            onClick={() => router.push('/admin/bread')}
          >
            Bread Menu
          </button>
          <button 
            className="p-3 bg-[#e0d3a3] text-black rounded-lg hover:opacity-90" 
            onClick={() => router.push('/admin/garnish')}
          >
            Garnish Menu
          </button>
          <button 
            className="p-3 bg-[#e0d3a3] text-black rounded-lg hover:opacity-90" 
            onClick={() => router.push('/admin/hookah')}
          >
            Hookah Menu
          </button>
          <button 
            className="p-3 bg-[#e0d3a3] text-black rounded-lg hover:opacity-90" 
            onClick={() => router.push('/admin/businessLunch')}
          >
            Business Lunch
          </button>
        </div>
      </div>

      {/* Categories Management */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Categories Management</h2>
        <div className="space-x-2 mb-4">
          <input
            className="p-2 text-black"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New category"
          />
          <button className="bg-green-600 px-2 py-1" onClick={addCat}>Add</button>
        </div>
        <ul>
          {cats.map((c) => (
            <li key={c.id} className="flex items-center gap-2 mb-2">
              <span>{c.name}</span>
              <button className="bg-red-600 px-2" onClick={() => delCat(c.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button className="mt-8 underline" onClick={() => router.push('/admin/items')}>
        Manage Items
      </button>
    </div>
  );
}