-- Create a security definer function to allow admins to reset passwords for any user
CREATE OR REPLACE FUNCTION public.admin_reset_user_password(target_user_id UUID, new_plain_password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = auth, public
AS $$
BEGIN
  -- Check if the current user executing the function is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'::public.app_role
  ) THEN
    RAISE EXCEPTION 'Access Denied: Only admins can reset user passwords';
  END IF;

  -- Update the encrypted password for the target user in auth.users
  UPDATE auth.users
  SET 
    encrypted_password = crypt(new_plain_password, gen_salt('bf')),
    updated_at = now()
  WHERE id = target_user_id;

  RETURN TRUE;
END;
$$;
