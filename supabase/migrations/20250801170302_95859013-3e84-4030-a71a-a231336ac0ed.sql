-- Update the default theme for new users to be 'ocean'
ALTER TABLE public.user_preferences 
ALTER COLUMN theme SET DEFAULT 'ocean';

-- Update existing users who have the old 'default' theme to use 'ocean'
UPDATE public.user_preferences 
SET theme = 'ocean' 
WHERE theme = 'default';

-- Update the function to create new users with 'ocean' theme
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name'
  );
  
  -- Create default preferences for new user with ocean theme
  INSERT INTO public.user_preferences (user_id, theme)
  VALUES (NEW.id, 'ocean');
  
  RETURN NEW;
END;
$$;