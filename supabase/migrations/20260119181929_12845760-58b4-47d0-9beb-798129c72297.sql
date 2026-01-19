-- Add ATV (All-Terrain Vehicle) specific columns to listings table
ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS atv_type text, -- гусеничный/колесный/самодельный
ADD COLUMN IF NOT EXISTS atv_brand text, -- текстовое поле марки
ADD COLUMN IF NOT EXISTS atv_origin_country text, -- страна происхождения бренда
ADD COLUMN IF NOT EXISTS atv_year integer, -- год выпуска
ADD COLUMN IF NOT EXISTS atv_condition text, -- Новое/БУ/На запчасти
ADD COLUMN IF NOT EXISTS atv_engine_type text, -- Бензин/Дизель/Электро
ADD COLUMN IF NOT EXISTS atv_engine_volume numeric, -- объем двигателя
ADD COLUMN IF NOT EXISTS atv_power integer, -- мощность в лс
ADD COLUMN IF NOT EXISTS atv_mileage integer, -- пробег
ADD COLUMN IF NOT EXISTS atv_max_passengers integer; -- максимально пассажиров

-- Create indexes for efficient filtering
CREATE INDEX IF NOT EXISTS idx_listings_atv_type ON public.listings(atv_type);
CREATE INDEX IF NOT EXISTS idx_listings_atv_origin_country ON public.listings(atv_origin_country);
CREATE INDEX IF NOT EXISTS idx_listings_atv_year ON public.listings(atv_year);
CREATE INDEX IF NOT EXISTS idx_listings_atv_condition ON public.listings(atv_condition);
CREATE INDEX IF NOT EXISTS idx_listings_atv_engine_type ON public.listings(atv_engine_type);
CREATE INDEX IF NOT EXISTS idx_listings_atv_engine_volume ON public.listings(atv_engine_volume);
CREATE INDEX IF NOT EXISTS idx_listings_atv_power ON public.listings(atv_power);
CREATE INDEX IF NOT EXISTS idx_listings_atv_mileage ON public.listings(atv_mileage);
CREATE INDEX IF NOT EXISTS idx_listings_atv_max_passengers ON public.listings(atv_max_passengers);