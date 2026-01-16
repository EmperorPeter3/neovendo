-- Recreate public profile view to be readable for everyone while excluding PII
-- This view intentionally omits email.
CREATE OR REPLACE VIEW public.profiles_public
WITH (security_invoker=off)
AS
  SELECT
    id,
    user_id,
    name,
    avatar_url,
    rating,
    rating_count,
    created_at,
    updated_at
  FROM public.profiles;

GRANT SELECT ON public.profiles_public TO anon;
GRANT SELECT ON public.profiles_public TO authenticated;