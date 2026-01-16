-- Fix types to match existing profiles_public view signature
CREATE TABLE IF NOT EXISTS public.profiles_public_cache (
  user_id uuid PRIMARY KEY,
  name text,
  avatar_url text,
  rating numeric(3,2),
  rating_count integer,
  created_at timestamptz,
  updated_at timestamptz
);

-- If table already existed with different type, align it
DO $$
BEGIN
  -- rating
  BEGIN
    ALTER TABLE public.profiles_public_cache
      ALTER COLUMN rating TYPE numeric(3,2)
      USING rating::numeric(3,2);
  EXCEPTION WHEN undefined_table OR undefined_column THEN
    NULL;
  END;
END $$;

-- Backfill / upsert
INSERT INTO public.profiles_public_cache (user_id, name, avatar_url, rating, rating_count, created_at, updated_at)
SELECT user_id, name, avatar_url, rating::numeric(3,2), rating_count, created_at, updated_at
FROM public.profiles
ON CONFLICT (user_id) DO UPDATE SET
  name = EXCLUDED.name,
  avatar_url = EXCLUDED.avatar_url,
  rating = EXCLUDED.rating,
  rating_count = EXCLUDED.rating_count,
  created_at = EXCLUDED.created_at,
  updated_at = EXCLUDED.updated_at;

ALTER TABLE public.profiles_public_cache ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view profiles_public_cache" ON public.profiles_public_cache;
CREATE POLICY "Public can view profiles_public_cache"
ON public.profiles_public_cache
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can update their own profiles_public_cache" ON public.profiles_public_cache;
CREATE POLICY "Users can update their own profiles_public_cache"
ON public.profiles_public_cache
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.sync_profiles_public_cache()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles_public_cache (user_id, name, avatar_url, rating, rating_count, created_at, updated_at)
  VALUES (
    NEW.user_id,
    NEW.name,
    NEW.avatar_url,
    NEW.rating::numeric(3,2),
    NEW.rating_count,
    NEW.created_at,
    NEW.updated_at
  )
  ON CONFLICT (user_id) DO UPDATE SET
    name = EXCLUDED.name,
    avatar_url = EXCLUDED.avatar_url,
    rating = EXCLUDED.rating,
    rating_count = EXCLUDED.rating_count,
    created_at = EXCLUDED.created_at,
    updated_at = EXCLUDED.updated_at;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sync_profiles_public_cache_trigger ON public.profiles;
CREATE TRIGGER sync_profiles_public_cache_trigger
AFTER INSERT OR UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.sync_profiles_public_cache();

-- Recreate view with SECURITY INVOKER over the cache table (no email)
CREATE OR REPLACE VIEW public.profiles_public
WITH (security_invoker=on)
AS
  SELECT
    NULL::uuid AS id,
    user_id,
    name,
    avatar_url,
    rating::numeric(3,2) AS rating,
    rating_count,
    created_at,
    updated_at
  FROM public.profiles_public_cache;

GRANT SELECT ON public.profiles_public TO anon;
GRANT SELECT ON public.profiles_public TO authenticated;