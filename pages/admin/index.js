import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminCategories() {
  const router = useRouter();
  const [newMenuName, setNewMenuName] = useState('');
  const [newMenuType, setNewMenuType] = useState('');

  return (
    <div className="p-4 text-white bg-base min-h-screen">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>
      
      {/* Menu Management Links */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Menu Management</h2>
        
        {/* Add New Menu Section */}
      

        {/* Existing Menus */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
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
          <button className="bg-[#e0d3a3] text-black px-4 py-2 rounded-md hover:opacity-90 mt-4">
            Create New Menu
          </button>
        </div>
      </div>
    </div>
  );
}