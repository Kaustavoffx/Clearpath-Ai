-- Create user_usage table
CREATE TABLE public.user_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  document_analysis_count INTEGER DEFAULT 0 NOT NULL,
  advisor_session_count INTEGER DEFAULT 0 NOT NULL,
  voice_session_count INTEGER DEFAULT 0 NOT NULL,
  openai_connected BOOLEAN DEFAULT FALSE NOT NULL,
  gemini_connected BOOLEAN DEFAULT FALSE NOT NULL,
  deepgram_connected BOOLEAN DEFAULT FALSE NOT NULL,
  last_reset TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for user_usage
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage" ON public.user_usage
  FOR SELECT USING (auth.uid() = user_id);

-- We don't allow users to update their own usage via API directly (must be done server side via service_role)
-- So we won't add an UPDATE policy for regular users on usage fields.

-- Create user_api_keys table
CREATE TABLE public.user_api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  provider TEXT NOT NULL, -- 'openai', 'gemini', 'deepgram'
  encrypted_key TEXT NOT NULL,
  initialization_vector TEXT NOT NULL,
  authentication_tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, provider)
);

-- Enable RLS for user_api_keys
ALTER TABLE public.user_api_keys ENABLE ROW LEVEL SECURITY;

-- Note: user_api_keys should strictly be accessed ONLY by server-side code using service_role key.
-- We do NOT expose them to the client via RLS. Therefore no RLS policies for SELECT/UPDATE by auth.uid().

-- Update the handle_new_user function to also create a user_usage record
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.user_usage (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create missing usage records for existing users
INSERT INTO public.user_usage (user_id)
SELECT id FROM public.profiles
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_usage WHERE user_usage.user_id = profiles.id
);
