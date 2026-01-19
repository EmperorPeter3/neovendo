-- Add moped/scooter specific columns to listings table
ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS moped_type text,
ADD COLUMN IF NOT EXISTS moped_brand text,
ADD COLUMN IF NOT EXISTS moped_origin_country text,
ADD COLUMN IF NOT EXISTS moped_year integer,
ADD COLUMN IF NOT EXISTS moped_condition text,
ADD COLUMN IF NOT EXISTS moped_engine_type text,
ADD COLUMN IF NOT EXISTS moped_engine_volume numeric,
ADD COLUMN IF NOT EXISTS moped_power integer,
ADD COLUMN IF NOT EXISTS moped_mileage integer;

-- Create indexes for efficient filtering
CREATE INDEX IF NOT EXISTS idx_listings_moped_type ON public.listings(moped_type);
CREATE INDEX IF NOT EXISTS idx_listings_moped_brand ON public.listings(moped_brand);
CREATE INDEX IF NOT EXISTS idx_listings_moped_origin_country ON public.listings(moped_origin_country);
CREATE INDEX IF NOT EXISTS idx_listings_moped_year ON public.listings(moped_year);
CREATE INDEX IF NOT EXISTS idx_listings_moped_condition ON public.listings(moped_condition);
CREATE INDEX IF NOT EXISTS idx_listings_moped_engine_type ON public.listings(moped_engine_type);
CREATE INDEX IF NOT EXISTS idx_listings_moped_engine_volume ON public.listings(moped_engine_volume);
CREATE INDEX IF NOT EXISTS idx_listings_moped_power ON public.listings(moped_power);
CREATE INDEX IF NOT EXISTS idx_listings_moped_mileage ON public.listings(moped_mileage);