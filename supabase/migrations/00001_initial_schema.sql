-- Create custom types
CREATE TYPE category_enum AS ENUM ('SCHOLARSHIP', 'CIRCULAR', 'SCHEME', 'INTERNSHIP', 'COMPETITION');
CREATE TYPE status_enum AS ENUM ('PENDING', 'PROCESSED', 'ERROR');
CREATE TYPE step_status_enum AS ENUM ('PENDING', 'COMPLETED');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  grade_level TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create opportunities table
CREATE TABLE public.opportunities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  category category_enum NOT NULL,
  storage_path TEXT NOT NULL,
  simplified_summary TEXT,
  deadline TIMESTAMP WITH TIME ZONE,
  status status_enum DEFAULT 'PENDING'::status_enum NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for opportunities
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own opportunities" ON public.opportunities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own opportunities" ON public.opportunities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own opportunities" ON public.opportunities
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own opportunities" ON public.opportunities
  FOR DELETE USING (auth.uid() = user_id);

-- Create action_steps table
CREATE TABLE public.action_steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE NOT NULL,
  step_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status step_status_enum DEFAULT 'PENDING'::step_status_enum NOT NULL
);

-- Enable RLS for action_steps
ALTER TABLE public.action_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own action steps" ON public.action_steps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.opportunities o 
      WHERE o.id = public.action_steps.opportunity_id 
      AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own action steps" ON public.action_steps
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.opportunities o 
      WHERE o.id = public.action_steps.opportunity_id 
      AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own action steps" ON public.action_steps
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.opportunities o 
      WHERE o.id = public.action_steps.opportunity_id 
      AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own action steps" ON public.action_steps
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.opportunities o 
      WHERE o.id = public.action_steps.opportunity_id 
      AND o.user_id = auth.uid()
    )
  );

-- Create storage bucket for opportunity documents
-- Note: You may need to create the storage bucket via the Supabase dashboard manually, 
-- but we can insert the record here for completeness if required.
INSERT INTO storage.buckets (id, name, public) VALUES ('opportunities', 'opportunities', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS
CREATE POLICY "Users can upload their own documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'opportunities' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'opportunities' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Function to handle new user profile creation automatically
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on sign up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
