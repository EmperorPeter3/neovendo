const STORAGE_KEY = 'recently_viewed_listings';
const MAX_ITEMS = 50;

export const addRecentlyViewed = (listingId: string) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    let ids: string[] = stored ? JSON.parse(stored) : [];
    ids = ids.filter(id => id !== listingId);
    ids.unshift(listingId);
    if (ids.length > MAX_ITEMS) ids = ids.slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {}
};

export const getRecentlyViewedIds = (): string[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};
