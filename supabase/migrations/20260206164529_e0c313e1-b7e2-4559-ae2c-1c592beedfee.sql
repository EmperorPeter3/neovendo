-- Add latitude and longitude columns to listings for geolocation search
ALTER TABLE public.listings
ADD COLUMN lat numeric NULL,
ADD COLUMN lng numeric NULL;

-- Create index for efficient geo queries
CREATE INDEX idx_listings_location ON public.listings(lat, lng) WHERE lat IS NOT NULL AND lng IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.listings.lat IS 'Latitude coordinate of listing location';
COMMENT ON COLUMN public.listings.lng IS 'Longitude coordinate of listing location';