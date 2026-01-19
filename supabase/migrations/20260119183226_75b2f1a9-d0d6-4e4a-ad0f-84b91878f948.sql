-- Add quad-specific columns to listings table
ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS quad_type text,
ADD COLUMN IF NOT EXISTS quad_brand text,
ADD COLUMN IF NOT EXISTS quad_origin_country text,
ADD COLUMN IF NOT EXISTS quad_year integer,
ADD COLUMN IF NOT EXISTS quad_condition text,
ADD COLUMN IF NOT EXISTS quad_engine_type text,
ADD COLUMN IF NOT EXISTS quad_engine_volume numeric,
ADD COLUMN IF NOT EXISTS quad_power integer,
ADD COLUMN IF NOT EXISTS quad_mileage integer,
ADD COLUMN IF NOT EXISTS quad_max_passengers integer;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_listings_quad_type ON public.listings(quad_type);
CREATE INDEX IF NOT EXISTS idx_listings_quad_brand ON public.listings(quad_brand);
CREATE INDEX IF NOT EXISTS idx_listings_quad_origin_country ON public.listings(quad_origin_country);
CREATE INDEX IF NOT EXISTS idx_listings_quad_year ON public.listings(quad_year);
CREATE INDEX IF NOT EXISTS idx_listings_quad_condition ON public.listings(quad_condition);
CREATE INDEX IF NOT EXISTS idx_listings_quad_engine_type ON public.listings(quad_engine_type);