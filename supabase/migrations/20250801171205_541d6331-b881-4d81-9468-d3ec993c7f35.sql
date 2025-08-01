-- Add an admin role to the user_preferences table to identify who can edit posts
ALTER TABLE public.user_preferences 
ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;

-- Set the first user (you) as admin
-- This will make the user with the earliest created_at an admin
UPDATE public.user_preferences 
SET is_admin = TRUE 
WHERE user_id = (
  SELECT user_id 
  FROM public.user_preferences 
  ORDER BY created_at ASC 
  LIMIT 1
);

-- Update the handle_new_user function to check if this is the first user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  user_count INTEGER;
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name'
  );
  
  -- Count existing users
  SELECT COUNT(*) INTO user_count FROM public.user_preferences;
  
  -- Create default preferences for new user with ocean theme
  -- Make the first user an admin
  INSERT INTO public.user_preferences (user_id, theme, is_admin)
  VALUES (NEW.id, 'ocean', user_count = 0);
  
  RETURN NEW;
END;
$$;