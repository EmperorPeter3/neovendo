import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ListingWithOwner {
  id: string;
  title: string;
  description: string | null;
  category: 'electronics' | 'furniture' | 'jobs' | 'services' | 'realEstate';
  price: number;
  city: string;
  country: string;
  images: string[];
  owner_id: string;
  status: 'active' | 'deleted';
  created_at: string;
  updated_at: string;
  owner: {
    id: string;
    name: string;
    avatar_url: string | null;
    rating: number;
    rating_count: number | null;
    user_id: string;
  } | null;
}

export const useListings = (filters?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  country?: string;
  search?: string;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['listings', filters],
    queryFn: async () => {
      let query = supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (filters?.category) {
        query = query.eq('category', filters.category as 'electronics' | 'furniture' | 'jobs' | 'services' | 'realEstate');
      }
      if (filters?.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters?.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
      }
      if (filters?.city) {
        query = query.ilike('city', `%${filters.city}%`);
      }
      if (filters?.country) {
        query = query.ilike('country', `%${filters.country}%`);
      }
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data: listings, error } = await query;

      if (error) throw error;

      // Fetch owners separately
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
  });
};

export const useListing = (id: string) => {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      const { data: listing, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!listing) return null;

      // Fetch owner
      const { data: owner } = await supabase
        .from('profiles')
        .select('id, name, avatar_url, rating, rating_count, user_id')
        .eq('user_id', listing.owner_id)
        .maybeSingle();

      return {
        ...listing,
        owner,
      } as ListingWithOwner;
    },
    enabled: !!id,
  });
};

export const useCreateListing = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (listing: {
      title: string;
      description: string;
      category: 'electronics' | 'furniture' | 'jobs' | 'services' | 'realEstate';
      price: number;
      city: string;
      country: string;
      images: string[];
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('listings')
        .insert({
          ...listing,
          owner_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
};

export const useUpdateListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: {
      id: string;
      title?: string;
      description?: string;
      category?: 'electronics' | 'furniture' | 'jobs' | 'services' | 'realEstate';
      price?: number;
      city?: string;
      country?: string;
      images?: string[];
      status?: 'active' | 'deleted';
    }) => {
      const { data, error } = await supabase
        .from('listings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['listing', variables.id] });
    },
  });
};

export const useDeleteListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Soft delete
      const { error } = await supabase
        .from('listings')
        .update({ status: 'deleted' as const })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
    },
  });
};

export const useMyListings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['myListings', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useUploadListingImage = () => {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('listings')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('listings')
        .getPublicUrl(fileName);

      return data.publicUrl;
    },
  });
};
