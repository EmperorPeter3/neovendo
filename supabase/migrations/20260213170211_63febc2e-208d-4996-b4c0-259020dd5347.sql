
-- Add model columns for transport subcategories that have brand but no model
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS atv_model text;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS quad_model text;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS moped_model text;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS moto_model text;
