import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ListingWithOwner } from './useListings';

export const useFavorites = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('favorites')
        .select('listing_id')
        .eq('user_id', user.id);

      if (error) throw error;
      return data.map(f => f.listing_id);
    },
    enabled: !!user,
  });
};

export const useFavoriteListings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['favoriteListings', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get favorite listing IDs
      const { data: favorites, error: favError } = await supabase
        .from('favorites')
        .select('listing_id')
        .eq('user_id', user.id);

      if (favError) throw favError;
      if (!favorites.length) return [];

      const listingIds = favorites.map(f => f.listing_id);

      // Fetch listings
      const { data: listings, error } = await supabase
        .from('listings')
        .select('*')
        .in('id', listingIds)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch owners
      const ownerIds = [...new Set(listings?.map(l => l.owner_id) || [])];
      const { data: owners } = await supabase
        .from('profiles')
        .select('id, name, avatar_url, rating, rating_count, user_id')
        .in('user_id', ownerIds);

      const ownersMap = new Map(owners?.map(o => [o.user_id, o]) || []);

      return (listings || []).map(listing => ({
        ...listing,
        owner: ownersMap.get(listing.owner_id) || null,
      })) as ListingWithOwner[];
    },
    enabled: !!user,
  });
};

export const useIsFavorite = (listingId: string) => {
  const { data: favorites = [] } = useFavorites();
  return favorites.includes(listingId);
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ listingId, isFavorite }: { listingId: string; isFavorite: boolean }) => {
      if (!user) throw new Error('Not authenticated');

      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', listingId);

        if (error) throw error;
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, listing_id: listingId });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['favoriteListings'] });
    },
  });
};
