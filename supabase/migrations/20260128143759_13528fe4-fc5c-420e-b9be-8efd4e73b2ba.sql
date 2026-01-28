-- Add motorcycle-specific columns to listings table
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS moto_type text;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS moto_brand text;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS moto_origin_country text;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS moto_year integer;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS moto_condition text;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS moto_engine_type text;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS moto_engine_volume numeric;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS moto_power_hp integer;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS moto_power_watt integer;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS moto_fuel_delivery text;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS moto_strokes integer;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS moto_transmission text;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS moto_mileage integer;

-- Create indexes for efficient filtering
CREATE INDEX IF NOT EXISTS idx_listings_moto_type ON public.listings(moto_type);
CREATE INDEX IF NOT EXISTS idx_listings_moto_brand ON public.listings(moto_brand);
CREATE INDEX IF NOT EXISTS idx_listings_moto_origin_country ON public.listings(moto_origin_country);
CREATE INDEX IF NOT EXISTS idx_listings_moto_year ON public.listings(moto_year);
CREATE INDEX IF NOT EXISTS idx_listings_moto_condition ON public.listings(moto_condition);
CREATE INDEX IF NOT EXISTS idx_listings_moto_engine_type ON public.listings(moto_engine_type);
CREATE INDEX IF NOT EXISTS idx_listings_moto_engine_volume ON public.listings(moto_engine_volume);
CREATE INDEX IF NOT EXISTS idx_listings_moto_power_hp ON public.listings(moto_power_hp);
CREATE INDEX IF NOT EXISTS idx_listings_moto_power_watt ON public.listings(moto_power_watt);
CREATE INDEX IF NOT EXISTS idx_listings_moto_fuel_delivery ON public.listings(moto_fuel_delivery);
CREATE INDEX IF NOT EXISTS idx_listings_moto_strokes ON public.listings(moto_strokes);
CREATE INDEX IF NOT EXISTS idx_listings_moto_transmission ON public.listings(moto_transmission);
CREATE INDEX IF NOT EXISTS idx_listings_moto_mileage ON public.listings(moto_mileage);