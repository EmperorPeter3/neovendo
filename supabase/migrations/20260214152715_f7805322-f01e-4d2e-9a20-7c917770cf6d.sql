
-- Add new motorcycle specification columns
ALTER TABLE public.listings ADD COLUMN moto_drive_type text;
ALTER TABLE public.listings ADD COLUMN moto_cylinders integer;
ALTER TABLE public.listings ADD COLUMN moto_gears integer;
ALTER TABLE public.listings ADD COLUMN moto_cooling text;
