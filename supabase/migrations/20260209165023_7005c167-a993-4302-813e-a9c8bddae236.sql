
-- Add power_watt columns for vehicle types that currently only have power in HP
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS car_power_watt numeric;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS atv_power_watt numeric;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS quad_power_watt numeric;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS moped_power_watt numeric;

-- Create indexes for efficient filtering
CREATE INDEX IF NOT EXISTS idx_listings_car_power_watt ON public.listings (car_power_watt);
CREATE INDEX IF NOT EXISTS idx_listings_atv_power_watt ON public.listings (atv_power_watt);
CREATE INDEX IF NOT EXISTS idx_listings_quad_power_watt ON public.listings (quad_power_watt);
CREATE INDEX IF NOT EXISTS idx_listings_moped_power_watt ON public.listings (moped_power_watt);
