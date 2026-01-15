-- Add car-specific columns to listings table
ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS car_condition text,
ADD COLUMN IF NOT EXISTS car_brand text,
ADD COLUMN IF NOT EXISTS car_model text,
ADD COLUMN IF NOT EXISTS car_year integer,
ADD COLUMN IF NOT EXISTS car_mileage integer,
ADD COLUMN IF NOT EXISTS car_transmission text,
ADD COLUMN IF NOT EXISTS car_drive_type text,
ADD COLUMN IF NOT EXISTS car_engine_type text,
ADD COLUMN IF NOT EXISTS car_engine_volume numeric(3,1),
ADD COLUMN IF NOT EXISTS car_fuel_consumption numeric(4,1),
ADD COLUMN IF NOT EXISTS car_power integer,
ADD COLUMN IF NOT EXISTS car_body_condition text,
ADD COLUMN IF NOT EXISTS car_body_type text,
ADD COLUMN IF NOT EXISTS car_seats integer,
ADD COLUMN IF NOT EXISTS car_trunk_volume integer,
ADD COLUMN IF NOT EXISTS car_steering_position text;

-- Add indexes for commonly filtered columns
CREATE INDEX IF NOT EXISTS idx_listings_car_brand ON public.listings(car_brand) WHERE car_brand IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_listings_car_year ON public.listings(car_year) WHERE car_year IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_listings_car_mileage ON public.listings(car_mileage) WHERE car_mileage IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_listings_car_transmission ON public.listings(car_transmission) WHERE car_transmission IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN public.listings.car_condition IS 'new or used';
COMMENT ON COLUMN public.listings.car_brand IS 'Car brand ID (e.g., bmw, audi)';
COMMENT ON COLUMN public.listings.car_model IS 'Car model ID (e.g., 3-series)';
COMMENT ON COLUMN public.listings.car_year IS 'Year of manufacture';
COMMENT ON COLUMN public.listings.car_mileage IS 'Mileage in kilometers';
COMMENT ON COLUMN public.listings.car_transmission IS 'manual, robot, variator, or classic-automatic';
COMMENT ON COLUMN public.listings.car_drive_type IS 'rear, front, or all';
COMMENT ON COLUMN public.listings.car_engine_type IS 'petrol, gas, diesel, electric, or hybrid';
COMMENT ON COLUMN public.listings.car_engine_volume IS 'Engine volume in liters';
COMMENT ON COLUMN public.listings.car_fuel_consumption IS 'Fuel consumption in L/100km';
COMMENT ON COLUMN public.listings.car_power IS 'Engine power in horsepower';
COMMENT ON COLUMN public.listings.car_body_condition IS 'not-damaged or damaged';
COMMENT ON COLUMN public.listings.car_body_type IS 'Body type ID (sedan, suv, etc.)';
COMMENT ON COLUMN public.listings.car_seats IS 'Number of seats';
COMMENT ON COLUMN public.listings.car_trunk_volume IS 'Trunk volume in liters';
COMMENT ON COLUMN public.listings.car_steering_position IS 'left or right';