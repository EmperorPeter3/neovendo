-- Create a public view that excludes the email column
CREATE VIEW public.profiles_public
WITH (security_invoker=on) AS
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

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create a new policy that only allows users to view their own profile directly
-- Other users must use the profiles_public view
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

-- Grant SELECT on the view to authenticated and anonymous users
GRANT SELECT ON public.profiles_public TO anon, authenticated;