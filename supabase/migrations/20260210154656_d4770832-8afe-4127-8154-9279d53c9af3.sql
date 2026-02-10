
-- Widen car_engine_volume to support cm³ values up to 99999
ALTER TABLE public.listings ALTER COLUMN car_engine_volume TYPE numeric;
