-- Drop old enum and create new one with updated categories
-- First, we need to update existing listings to use valid new categories
UPDATE public.listings SET category = 'electronics' WHERE category IN ('electronics', 'furniture');

-- Create new enum type
CREATE TYPE public.listing_category_new AS ENUM (
  'transport',
  'realEstate',
  'jobs',
  'services',
  'personalItems',
  'homeAndGarden',
  'autoParts',
  'electronics',
  'hobbies',
  'animals',
  'business'
);

-- Update the column to use the new enum
ALTER TABLE public.listings 
  ALTER COLUMN category TYPE public.listing_category_new 
  USING category::text::public.listing_category_new;

-- Drop old enum and rename new one
DROP TYPE public.listing_category;
ALTER TYPE public.listing_category_new RENAME TO listing_category;