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
  lat: number | null;
  lng: number | null;
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
  // ATV-specific fields
  atv_type: string | null;
  atv_brand: string | null;
  atv_origin_country: string | null;
  atv_year: number | null;
  atv_condition: string | null;
  atv_engine_type: string | null;
  atv_engine_volume: number | null;
  atv_power: number | null;
  atv_mileage: number | null;
  atv_max_passengers: number | null;
  // Karting-specific fields
  kart_condition: string | null;
  // Quad-specific fields
  quad_type: string | null;
  quad_brand: string | null;
  quad_origin_country: string | null;
  quad_year: number | null;
  quad_condition: string | null;
  quad_engine_type: string | null;
  quad_engine_volume: number | null;
  quad_power: number | null;
  quad_mileage: number | null;
  quad_max_passengers: number | null;
  // Moped-specific fields
  moped_type: string | null;
  moped_brand: string | null;
  moped_origin_country: string | null;
  moped_year: number | null;
  moped_condition: string | null;
  moped_engine_type: string | null;
  moped_engine_volume: number | null;
  moped_power: number | null;
  moped_mileage: number | null;
  // Motorcycle-specific fields
  moto_type: string | null;
  moto_brand: string | null;
  moto_origin_country: string | null;
  moto_year: number | null;
  moto_condition: string | null;
  moto_engine_type: string | null;
  moto_engine_volume: number | null;
  moto_power_hp: number | null;
  moto_power_watt: number | null;
  moto_fuel_delivery: string | null;
  moto_strokes: number | null;
  moto_transmission: string | null;
  moto_mileage: number | null;
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

export interface AtvQueryFilters {
  types?: string[];
  brand?: string;
  originCountries?: string[];
  yearFrom?: number;
  yearTo?: number;
  condition?: 'new' | 'used' | 'for_parts';
  engineTypes?: string[];
  engineVolumeFrom?: number;
  engineVolumeTo?: number;
  powerFrom?: number;
  powerTo?: number;
  mileageFrom?: number;
  mileageTo?: number;
  maxPassengersFrom?: number;
  maxPassengersTo?: number;
  descriptionSearch?: string;
}

export interface KartingQueryFilters {
  condition?: 'new' | 'used' | 'for_parts';
  descriptionSearch?: string;
}

export interface QuadQueryFilters {
  types?: string[];
  brand?: string;
  originCountries?: string[];
  yearFrom?: number;
  yearTo?: number;
  condition?: 'new' | 'used' | 'for_parts';
  engineTypes?: string[];
  engineVolumeFrom?: number;
  engineVolumeTo?: number;
  powerFrom?: number;
  powerTo?: number;
  mileageFrom?: number;
  mileageTo?: number;
  maxPassengersFrom?: number;
  maxPassengersTo?: number;
  descriptionSearch?: string;
}

export interface MopedQueryFilters {
  types?: string[];
  brand?: string;
  originCountries?: string[];
  yearFrom?: number;
  yearTo?: number;
  condition?: 'new' | 'used' | 'for_parts';
  engineTypes?: string[];
  engineVolumeFrom?: number;
  engineVolumeTo?: number;
  powerFrom?: number;
  powerTo?: number;
  mileageFrom?: number;
  mileageTo?: number;
  descriptionSearch?: string;
}

export interface MotoQueryFilters {
  types?: string[];
  brand?: string;
  originCountries?: string[];
  yearFrom?: number;
  yearTo?: number;
  condition?: 'new' | 'used' | 'for_parts';
  engineTypes?: string[];
  engineVolumeFrom?: number;
  engineVolumeTo?: number;
  powerHpFrom?: number;
  powerHpTo?: number;
  powerWattFrom?: number;
  powerWattTo?: number;
  fuelDelivery?: string;
  strokes?: number;
  transmissions?: string[];
  mileageFrom?: number;
  mileageTo?: number;
  descriptionSearch?: string;
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
  lat?: number;
  lng?: number;
  radius?: number; // in km
  cars?: CarsQueryFilters;
  atvs?: AtvQueryFilters;
  karting?: KartingQueryFilters;
  quads?: QuadQueryFilters;
  mopeds?: MopedQueryFilters;
  motos?: MotoQueryFilters;
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

      // ATV-specific filters
      const atvs = filters?.atvs;
      if (atvs) {
        if (atvs.types && atvs.types.length > 0) {
          query = query.in('atv_type', atvs.types);
        }
        if (atvs.brand) {
          query = query.ilike('atv_brand', `%${atvs.brand}%`);
        }
        if (atvs.originCountries && atvs.originCountries.length > 0) {
          query = query.in('atv_origin_country', atvs.originCountries);
        }
        if (atvs.yearFrom !== undefined) {
          query = query.gte('atv_year', atvs.yearFrom);
        }
        if (atvs.yearTo !== undefined) {
          query = query.lte('atv_year', atvs.yearTo);
        }
        if (atvs.condition) {
          query = query.eq('atv_condition', atvs.condition);
        }
        if (atvs.engineTypes && atvs.engineTypes.length > 0) {
          query = query.in('atv_engine_type', atvs.engineTypes);
        }
        if (atvs.engineVolumeFrom !== undefined) {
          query = query.gte('atv_engine_volume', atvs.engineVolumeFrom);
        }
        if (atvs.engineVolumeTo !== undefined) {
          query = query.lte('atv_engine_volume', atvs.engineVolumeTo);
        }
        if (atvs.powerFrom !== undefined) {
          query = query.gte('atv_power', atvs.powerFrom);
        }
        if (atvs.powerTo !== undefined) {
          query = query.lte('atv_power', atvs.powerTo);
        }
        if (atvs.mileageFrom !== undefined) {
          query = query.gte('atv_mileage', atvs.mileageFrom);
        }
        if (atvs.mileageTo !== undefined) {
          query = query.lte('atv_mileage', atvs.mileageTo);
        }
        if (atvs.maxPassengersFrom !== undefined) {
          query = query.gte('atv_max_passengers', atvs.maxPassengersFrom);
        }
        if (atvs.maxPassengersTo !== undefined) {
          query = query.lte('atv_max_passengers', atvs.maxPassengersTo);
        }
        if (atvs.descriptionSearch) {
          query = query.ilike('description', `%${atvs.descriptionSearch}%`);
        }
      }

      // Karting-specific filters
      const karting = filters?.karting;
      if (karting) {
        if (karting.condition) {
          query = query.eq('kart_condition', karting.condition);
        }
        if (karting.descriptionSearch) {
          query = query.ilike('description', `%${karting.descriptionSearch}%`);
        }
      }

      // Quad-specific filters
      const quads = filters?.quads;
      if (quads) {
        if (quads.types && quads.types.length > 0) {
          query = query.in('quad_type', quads.types);
        }
        if (quads.brand) {
          query = query.ilike('quad_brand', `%${quads.brand}%`);
        }
        if (quads.originCountries && quads.originCountries.length > 0) {
          query = query.in('quad_origin_country', quads.originCountries);
        }
        if (quads.yearFrom !== undefined) {
          query = query.gte('quad_year', quads.yearFrom);
        }
        if (quads.yearTo !== undefined) {
          query = query.lte('quad_year', quads.yearTo);
        }
        if (quads.condition) {
          query = query.eq('quad_condition', quads.condition);
        }
        if (quads.engineTypes && quads.engineTypes.length > 0) {
          query = query.in('quad_engine_type', quads.engineTypes);
        }
        if (quads.engineVolumeFrom !== undefined) {
          query = query.gte('quad_engine_volume', quads.engineVolumeFrom);
        }
        if (quads.engineVolumeTo !== undefined) {
          query = query.lte('quad_engine_volume', quads.engineVolumeTo);
        }
        if (quads.powerFrom !== undefined) {
          query = query.gte('quad_power', quads.powerFrom);
        }
        if (quads.powerTo !== undefined) {
          query = query.lte('quad_power', quads.powerTo);
        }
        if (quads.mileageFrom !== undefined) {
          query = query.gte('quad_mileage', quads.mileageFrom);
        }
        if (quads.mileageTo !== undefined) {
          query = query.lte('quad_mileage', quads.mileageTo);
        }
        if (quads.maxPassengersFrom !== undefined) {
          query = query.gte('quad_max_passengers', quads.maxPassengersFrom);
        }
        if (quads.maxPassengersTo !== undefined) {
          query = query.lte('quad_max_passengers', quads.maxPassengersTo);
        }
        if (quads.descriptionSearch) {
          query = query.ilike('description', `%${quads.descriptionSearch}%`);
        }
      }

      // Moped-specific filters
      const mopeds = filters?.mopeds;
      if (mopeds) {
        if (mopeds.types && mopeds.types.length > 0) {
          query = query.in('moped_type', mopeds.types);
        }
        if (mopeds.brand) {
          query = query.ilike('moped_brand', `%${mopeds.brand}%`);
        }
        if (mopeds.originCountries && mopeds.originCountries.length > 0) {
          query = query.in('moped_origin_country', mopeds.originCountries);
        }
        if (mopeds.yearFrom !== undefined) {
          query = query.gte('moped_year', mopeds.yearFrom);
        }
        if (mopeds.yearTo !== undefined) {
          query = query.lte('moped_year', mopeds.yearTo);
        }
        if (mopeds.condition) {
          query = query.eq('moped_condition', mopeds.condition);
        }
        if (mopeds.engineTypes && mopeds.engineTypes.length > 0) {
          query = query.in('moped_engine_type', mopeds.engineTypes);
        }
        if (mopeds.engineVolumeFrom !== undefined) {
          query = query.gte('moped_engine_volume', mopeds.engineVolumeFrom);
        }
        if (mopeds.engineVolumeTo !== undefined) {
          query = query.lte('moped_engine_volume', mopeds.engineVolumeTo);
        }
        if (mopeds.powerFrom !== undefined) {
          query = query.gte('moped_power', mopeds.powerFrom);
        }
        if (mopeds.powerTo !== undefined) {
          query = query.lte('moped_power', mopeds.powerTo);
        }
        if (mopeds.mileageFrom !== undefined) {
          query = query.gte('moped_mileage', mopeds.mileageFrom);
        }
        if (mopeds.mileageTo !== undefined) {
          query = query.lte('moped_mileage', mopeds.mileageTo);
        }
        if (mopeds.descriptionSearch) {
          query = query.ilike('description', `%${mopeds.descriptionSearch}%`);
        }
      }

      // Motorcycle-specific filters
      const motos = filters?.motos;
      if (motos) {
        if (motos.types && motos.types.length > 0) {
          query = query.in('moto_type', motos.types);
        }
        if (motos.brand) {
          query = query.ilike('moto_brand', `%${motos.brand}%`);
        }
        if (motos.originCountries && motos.originCountries.length > 0) {
          query = query.in('moto_origin_country', motos.originCountries);
        }
        if (motos.yearFrom !== undefined) {
          query = query.gte('moto_year', motos.yearFrom);
        }
        if (motos.yearTo !== undefined) {
          query = query.lte('moto_year', motos.yearTo);
        }
        if (motos.condition) {
          query = query.eq('moto_condition', motos.condition);
        }
        if (motos.engineTypes && motos.engineTypes.length > 0) {
          query = query.in('moto_engine_type', motos.engineTypes);
        }
        if (motos.engineVolumeFrom !== undefined) {
          query = query.gte('moto_engine_volume', motos.engineVolumeFrom);
        }
        if (motos.engineVolumeTo !== undefined) {
          query = query.lte('moto_engine_volume', motos.engineVolumeTo);
        }
        if (motos.powerHpFrom !== undefined) {
          query = query.gte('moto_power_hp', motos.powerHpFrom);
        }
        if (motos.powerHpTo !== undefined) {
          query = query.lte('moto_power_hp', motos.powerHpTo);
        }
        if (motos.powerWattFrom !== undefined) {
          query = query.gte('moto_power_watt', motos.powerWattFrom);
        }
        if (motos.powerWattTo !== undefined) {
          query = query.lte('moto_power_watt', motos.powerWattTo);
        }
        if (motos.fuelDelivery) {
          query = query.eq('moto_fuel_delivery', motos.fuelDelivery);
        }
        if (motos.strokes !== undefined) {
          query = query.eq('moto_strokes', motos.strokes);
        }
        if (motos.transmissions && motos.transmissions.length > 0) {
          query = query.in('moto_transmission', motos.transmissions);
        }
        if (motos.mileageFrom !== undefined) {
          query = query.gte('moto_mileage', motos.mileageFrom);
        }
        if (motos.mileageTo !== undefined) {
          query = query.lte('moto_mileage', motos.mileageTo);
        }
        if (motos.descriptionSearch) {
          query = query.ilike('description', `%${motos.descriptionSearch}%`);
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

      let result = (listings || []).map(listing => ({
        ...listing,
        owner: ownersMap.get(listing.owner_id) || null,
      })) as ListingWithOwner[];

      // Client-side geo filtering using Haversine formula
      if (filters?.lat !== undefined && filters?.lng !== undefined && filters?.radius !== undefined) {
        const userLat = filters.lat;
        const userLng = filters.lng;
        const radiusKm = filters.radius;

        // Haversine formula to calculate distance between two points
        const haversineDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
          const R = 6371; // Earth's radius in km
          const dLat = (lat2 - lat1) * Math.PI / 180;
          const dLng = (lng2 - lng1) * Math.PI / 180;
          const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                    Math.sin(dLng / 2) * Math.sin(dLng / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c;
        };

        result = result.filter(listing => {
          // Listings without coordinates cannot be geo-filtered - exclude them
          if (listing.lat === null || listing.lat === undefined || 
              listing.lng === null || listing.lng === undefined) {
            return false;
          }
          const distance = haversineDistance(userLat, userLng, listing.lat, listing.lng);
          return distance <= radiusKm;
        });
      }

      return result;
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
      lat?: number;
      lng?: number;
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
