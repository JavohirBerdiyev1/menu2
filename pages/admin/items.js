import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminItems() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (!t) {
      router.push('/login');
      return;
    }
    setToken(t);
    fetch('/api/items', { headers: { Authorization: `Bearer ${t}` } })
      .then((r) => r.json())
      .then(setItems);
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => {
        setCategories(data);
        if (data[0]) setCategoryId(data[0].id);
      });
  }, [router]);

  const addItem = async () => {
    const id = Date.now().toString();
    await fetch('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, name, categoryId }),
    });
    setItems([...items, { id, name, categoryId }]);
    setName('');
  };

  const delItem = async (id) => {
    await fetch('/api/items', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
    setItems(items.filter((i) => i.id !== id));
  };

  return (
    <div className="p-4 text-white bg-base min-h-screen">
      <h1 className="text-2xl mb-4">Items</h1>
      <div className="space-x-2 mb-4">
        <input
          className="p-2 text-black"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Item name"
        />
        <select
          className="p-2 text-black"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button className="bg-green-600 px-2 py-1" onClick={addItem}>Add</button>
      </div>
      <ul>
        {items.map((i) => (
          <li key={i.id} className="flex items-center gap-2 mb-2">
            <span>
              {i.name} ({i.categoryId})
            </span>
            <button className="bg-red-600 px-2" onClick={() => delItem(i.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <button className="mt-8 underline" onClick={() => router.push('/admin')}>Back to categories</button>
    </div>
  );
}