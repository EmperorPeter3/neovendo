
-- Add apartment-specific columns to listings table
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS apt_rooms text,
  ADD COLUMN IF NOT EXISTS apt_mortgage boolean,
  ADD COLUMN IF NOT EXISTS apt_price_per_sqm numeric,
  ADD COLUMN IF NOT EXISTS apt_area numeric,
  ADD COLUMN IF NOT EXISTS apt_floor integer,
  ADD COLUMN IF NOT EXISTS apt_housing_type text,
  ADD COLUMN IF NOT EXISTS apt_seller_type text,
  ADD COLUMN IF NOT EXISTS apt_bathroom text,
  ADD COLUMN IF NOT EXISTS apt_windows text[],
  ADD COLUMN IF NOT EXISTS apt_build_year integer,
  ADD COLUMN IF NOT EXISTS apt_total_floors integer,
  ADD COLUMN IF NOT EXISTS apt_building_type text,
  ADD COLUMN IF NOT EXISTS apt_elevator text[],
  ADD COLUMN IF NOT EXISTS apt_parking text[],
  ADD COLUMN IF NOT EXISTS apt_renovation text,
  ADD COLUMN IF NOT EXISTS apt_kitchen_area numeric,
  ADD COLUMN IF NOT EXISTS apt_room_type text,
  ADD COLUMN IF NOT EXISTS apt_balcony text[],
  ADD COLUMN IF NOT EXISTS apt_ceiling_height numeric,
  ADD COLUMN IF NOT EXISTS apt_photos_only boolean;
