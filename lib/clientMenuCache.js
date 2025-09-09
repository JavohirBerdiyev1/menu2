// Simple client-side cache for menu data to reduce flicker between routes
// Not used on server; only in browser

const menuCache = new Map(); // key: menuType, value: { data, timestamp }

export function getCachedMenu(menuType) {
  if (typeof window === 'undefined') return null;
  const entry = menuCache.get(menuType);
  if (!entry) return null;
  return entry.data || null;
}

export function setCachedMenu(menuType, data) {
  if (typeof window === 'undefined') return;
  menuCache.set(menuType, { data, timestamp: Date.now() });
}


