-- Split full_name into first_name and last_name
ALTER TABLE public.profiles ADD COLUMN first_name TEXT;
ALTER TABLE public.profiles ADD COLUMN last_name TEXT;

-- Update existing records
UPDATE public.profiles
SET 
  first_name = split_part(full_name, ' ', 1),
  last_name = CASE 
    WHEN position(' ' in full_name) > 0 
    THEN substr(full_name, position(' ' in full_name) + 1)
    ELSE ''
  END;

-- Drop full_name
ALTER TABLE public.profiles DROP COLUMN full_name;

-- Update handle_new_user trigger
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
  extracted_full_name TEXT;
  parsed_first_name TEXT;
  parsed_last_name TEXT;
BEGIN
  extracted_full_name := new.raw_user_meta_data->>'full_name';
  
  IF extracted_full_name IS NOT NULL THEN
    parsed_first_name := split_part(extracted_full_name, ' ', 1);
    IF position(' ' in extracted_full_name) > 0 THEN
      parsed_last_name := substr(extracted_full_name, position(' ' in extracted_full_name) + 1);
    ELSE
      parsed_last_name := '';
    END IF;
  ELSE
    parsed_first_name := 'Student';
    parsed_last_name := '';
  END IF;

  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (new.id, parsed_first_name, parsed_last_name);
  
  INSERT INTO public.user_usage (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
