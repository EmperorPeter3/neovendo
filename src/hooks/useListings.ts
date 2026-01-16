import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Category } from '@/types/listing';

export interface ListingWithOwner {
  id: string;
  title: string;
  description: string | null;
  category: Category;
  subcategory: string | null;
  price: number;
  city: string;
  country: string;
  images: string[];
  owner_id: string;
  status: 'active' | 'deleted';
  created_at: string;
  updated_at: string;
  // Car-specific fields
  car_condition: string | null;
  car_brand: string | null;
  car_model: string | null;
  car_year: number | null;
  car_mileage: number | null;
  car_transmission: string | null;
  car_drive_type: string | null;
  car_engine_type: string | null;
  car_engine_volume: number | null;
  car_fuel_consumption: number | null;
  car_power: number | null;
  car_body_condition: string | null;
  car_body_type: string | null;
  car_seats: number | null;
  car_trunk_volume: number | null;
  car_steering_position: string | null;
  owner: {
    id: string;
    name: string;
    avatar_url: string | null;
    rating: number;
    rating_count: number | null;
    user_id: string;
  } | null;
}

export interface CarsQueryFilters {
  condition?: 'new' | 'used';
  brands?: string[];
  models?: string[];
  yearFrom?: number;
  yearTo?: number;
  mileageFrom?: number;
  mileageTo?: number;
  transmissions?: string[];
  driveTypes?: string[];
  engineTypes?: string[];
  engineVolumeFrom?: number;
  engineVolumeTo?: number;
  fuelConsumptionFrom?: number;
  fuelConsumptionTo?: number;
  powerFrom?: number;
  powerTo?: number;
  bodyCondition?: 'not-damaged' | 'damaged';
  bodyTypes?: string[];
  seatsFrom?: number;
  seatsTo?: number;
  trunkVolumeFrom?: number;
  trunkVolumeTo?: number;
  steeringPosition?: 'left' | 'right';
}

export const useListings = (filters?: {
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  country?: string;
  search?: string;
  limit?: number;
  cars?: CarsQueryFilters;
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
        query = query.eq('category', filters.category as Category);
      }
      if (filters?.subcategory) {
        query = query.eq('subcategory', filters.subcategory);
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

      // Car-specific filters
      const cars = filters?.cars;
      if (cars) {
        if (cars.condition) {
          query = query.eq('car_condition', cars.condition);
        }
        if (cars.brands && cars.brands.length > 0) {
          query = query.in('car_brand', cars.brands);
        }
        if (cars.models && cars.models.length > 0) {
          query = query.in('car_model', cars.models);
        }
        if (cars.yearFrom !== undefined) {
          query = query.gte('car_year', cars.yearFrom);
        }
        if (cars.yearTo !== undefined) {
          query = query.lte('car_year', cars.yearTo);
        }
        if (cars.mileageFrom !== undefined) {
          query = query.gte('car_mileage', cars.mileageFrom);
        }
        if (cars.mileageTo !== undefined) {
          query = query.lte('car_mileage', cars.mileageTo);
        }
        if (cars.transmissions && cars.transmissions.length > 0) {
          query = query.in('car_transmission', cars.transmissions);
        }
        if (cars.driveTypes && cars.driveTypes.length > 0) {
          query = query.in('car_drive_type', cars.driveTypes);
        }
        if (cars.engineTypes && cars.engineTypes.length > 0) {
          query = query.in('car_engine_type', cars.engineTypes);
        }
        if (cars.engineVolumeFrom !== undefined) {
          query = query.gte('car_engine_volume', cars.engineVolumeFrom);
        }
        if (cars.engineVolumeTo !== undefined) {
          query = query.lte('car_engine_volume', cars.engineVolumeTo);
        }
        if (cars.fuelConsumptionFrom !== undefined) {
          query = query.gte('car_fuel_consumption', cars.fuelConsumptionFrom);
        }
        if (cars.fuelConsumptionTo !== undefined) {
          query = query.lte('car_fuel_consumption', cars.fuelConsumptionTo);
        }
        if (cars.powerFrom !== undefined) {
          query = query.gte('car_power', cars.powerFrom);
        }
        if (cars.powerTo !== undefined) {
          query = query.lte('car_power', cars.powerTo);
        }
        if (cars.bodyCondition) {
          query = query.eq('car_body_condition', cars.bodyCondition);
        }
        if (cars.bodyTypes && cars.bodyTypes.length > 0) {
          query = query.in('car_body_type', cars.bodyTypes);
        }
        if (cars.seatsFrom !== undefined) {
          query = query.gte('car_seats', cars.seatsFrom);
        }
        if (cars.seatsTo !== undefined) {
          query = query.lte('car_seats', cars.seatsTo);
        }
        if (cars.trunkVolumeFrom !== undefined) {
          query = query.gte('car_trunk_volume', cars.trunkVolumeFrom);
        }
        if (cars.trunkVolumeTo !== undefined) {
          query = query.lte('car_trunk_volume', cars.trunkVolumeTo);
        }
        if (cars.steeringPosition) {
          query = query.eq('car_steering_position', cars.steeringPosition);
        }
      }

      const { data: listings, error } = await query;

      if (error) throw error;

      // Fetch owners separately from public view
      const ownerIds = [...new Set(listings?.map(l => l.owner_id) || [])];
      const { data: owners } = await supabase
        .from('profiles_public')
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

      // Fetch owner from public view
      const { data: owner } = await supabase
        .from('profiles_public')
        .select('id, name, avatar_url, rating, rating_count, user_id')
        .eq('user_id', listing.owner_id)
        .maybeSingle();

      return {
        ...listing,
        owner,
      } as ListingWithOwner;
    },
    enabled: !!id,
    staleTime: 0, // Always refetch
  });
};

export interface CarListingData {
  car_condition?: string;
  car_brand?: string;
  car_model?: string;
  car_year?: number;
  car_mileage?: number;
  car_transmission?: string;
  car_drive_type?: string;
  car_engine_type?: string;
  car_engine_volume?: number;
  car_fuel_consumption?: number;
  car_power?: number;
  car_body_condition?: string;
  car_body_type?: string;
  car_seats?: number;
  car_trunk_volume?: number;
  car_steering_position?: string;
}

export const useCreateListing = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (listing: {
      title: string;
      description: string;
      category: Category;
      subcategory?: string;
      price: number;
      city: string;
      country: string;
      images: string[];
    } & CarListingData) => {
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
      category?: Category;
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
