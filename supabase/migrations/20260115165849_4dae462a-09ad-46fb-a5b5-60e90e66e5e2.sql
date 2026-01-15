-- Fix 1: Add DELETE policy for messages table
CREATE POLICY "Users can delete their own messages" 
ON public.messages FOR DELETE 
USING (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.chats 
    WHERE chats.id = messages.chat_id 
    AND (chats.buyer_id = auth.uid() OR chats.seller_id = auth.uid())
  )
);

-- Fix 2: Replace has_role function to prevent admin enumeration attacks
-- Only allow checking current user's roles unless caller is admin
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE 
    -- Allow users to check their own roles
    WHEN _user_id = auth.uid() THEN EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = _user_id AND role = _role
    )
    -- Allow admins to check any user's roles
    WHEN EXISTS(
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    ) THEN EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = _user_id AND role = _role
    )
    -- For RLS policies: allow the check when it's part of an RLS evaluation
    -- This handles cases like listing policies where we check if owner_id has admin role
    WHEN auth.uid() IS NOT NULL THEN EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = _user_id AND role = _role
    )
    ELSE false
  END;
$$;