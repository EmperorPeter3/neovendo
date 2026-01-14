-- Add subcategory column to listings table
ALTER TABLE public.listings
ADD COLUMN subcategory text;

-- Create index for faster filtering
CREATE INDEX idx_listings_subcategory ON public.listings(subcategory);