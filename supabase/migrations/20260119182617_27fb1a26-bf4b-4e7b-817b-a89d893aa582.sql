-- Add karting-specific columns to listings table
ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS kart_condition text;

-- Create index for karting condition
CREATE INDEX IF NOT EXISTS idx_listings_kart_condition ON public.listings(kart_condition);