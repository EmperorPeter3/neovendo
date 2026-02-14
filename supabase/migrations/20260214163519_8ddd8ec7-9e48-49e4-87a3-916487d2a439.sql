
ALTER TABLE public.listings
ADD COLUMN snow_type text,
ADD COLUMN snow_brand text,
ADD COLUMN snow_model text,
ADD COLUMN snow_origin_country text,
ADD COLUMN snow_year integer,
ADD COLUMN snow_condition text,
ADD COLUMN snow_engine_type text,
ADD COLUMN snow_engine_volume numeric,
ADD COLUMN snow_power integer,
ADD COLUMN snow_power_watt numeric,
ADD COLUMN snow_mileage integer,
ADD COLUMN snow_max_passengers integer,
ADD COLUMN snow_track_width integer;
