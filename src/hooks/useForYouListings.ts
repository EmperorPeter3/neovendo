import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { getRecentlyViewedIds } from './useRecentlyViewed';
import { ListingWithOwner } from './useListings';

export const useForYouListings = (limit = 8) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['forYouListings', user?.id],
    queryFn: async () => {
      // Gather signals: favorites + recently viewed
      const viewedIds = getRecentlyViewedIds();

      let favoriteIds: string[] = [];
      if (user) {
        const { data } = await supabase
          .from('favorites')
          .select('listing_id')
          .eq('user_id', user.id);
        favoriteIds = data?.map(f => f.listing_id) || [];
      }

      const signalIds = [...new Set([...favoriteIds, ...viewedIds])];
      if (signalIds.length === 0) return [];

      // Fetch signal listings to extract categories/subcategories
      const { data: signalListings } = await supabase
        .from('listings')
        .select('category, subcategory')
        .in('id', signalIds.slice(0, 20));

      if (!signalListings || signalListings.length === 0) return [];

      // Count category/subcategory frequency
      const catCount: Record<string, number> = {};
      const subCount: Record<string, number> = {};
      for (const l of signalListings) {
        catCount[l.category] = (catCount[l.category] || 0) + 1;
        if (l.subcategory) {
          subCount[l.subcategory] = (subCount[l.subcategory] || 0) + 1;
        }
      }

      // Top categories
      const topCats = Object.entries(catCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([cat]) => cat);

      // Fetch recommendations: same categories, exclude already-seen
      let query = supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .in('category', topCats as any)
        .order('created_at', { ascending: false })
        .limit(limit + signalIds.length);

      const { data: listings } = await query;
      if (!listings) return [];

      // Filter out already viewed/favorited and limit
      const excludeSet = new Set(signalIds);
      const filtered = listings.filter(l => !excludeSet.has(l.id)).slice(0, limit);

      if (filtered.length === 0) return [];

      // Fetch owners
      const ownerIds = [...new Set(filtered.map(l => l.owner_id))];
      const { data: owners } = await supabase
        .from('profiles_public_cache')
        .select('*')
        .in('user_id', ownerIds);

      const ownersMap = new Map(owners?.map(o => [o.user_id, o]) || []);

      return filtered.map(listing => ({
        ...listing,
        owner: ownersMap.get(listing.owner_id) ? {
          id: listing.owner_id,
          name: ownersMap.get(listing.owner_id)!.name || '',
          avatar_url: ownersMap.get(listing.owner_id)!.avatar_url,
          rating: Number(ownersMap.get(listing.owner_id)!.rating) || 0,
          rating_count: ownersMap.get(listing.owner_id)!.rating_count,
          user_id: listing.owner_id,
        } : null,
      })) as ListingWithOwner[];
    },
    staleTime: 5 * 60 * 1000,
  });
};
