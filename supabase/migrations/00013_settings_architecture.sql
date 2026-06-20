-- 1. Alter profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_class TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS board TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS institution TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS graduation_year TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS social_category TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS annual_income TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS disability_status TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS minority_status TEXT;

-- 2. Create education_profiles table
CREATE TABLE IF NOT EXISTS public.education_profiles (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  stream TEXT,
  percentage TEXT,
  cgpa TEXT,
  target_exams TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.education_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own education profile" ON public.education_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own education profile" ON public.education_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own education profile" ON public.education_profiles FOR UPDATE USING (auth.uid() = user_id);

-- 3. Create document_vault table
CREATE TYPE document_status_enum AS ENUM ('Verified', 'Uploaded', 'Missing', 'Expired');

CREATE TABLE IF NOT EXISTS public.document_vault (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  document_type TEXT NOT NULL,
  status document_status_enum DEFAULT 'Missing'::document_status_enum NOT NULL,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.document_vault ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own documents" ON public.document_vault FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own documents" ON public.document_vault FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own documents" ON public.document_vault FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own documents" ON public.document_vault FOR DELETE USING (auth.uid() = user_id);

-- 4. Create user_preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  appearance TEXT DEFAULT 'Auto',
  default_ai_provider TEXT DEFAULT 'Auto',
  notification_deadline BOOLEAN DEFAULT true,
  notification_document BOOLEAN DEFAULT true,
  notification_weekly BOOLEAN DEFAULT true,
  notification_suggestions BOOLEAN DEFAULT true,
  workspace_mode TEXT DEFAULT 'Detailed Mode',
  reduce_motion BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id);

-- 5. Create user_security_settings table
CREATE TABLE IF NOT EXISTS public.user_security_settings (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  two_factor_enabled BOOLEAN DEFAULT false,
  recovery_email TEXT,
  openai_key TEXT,
  gemini_key TEXT,
  deepgram_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.user_security_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own security settings" ON public.user_security_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own security settings" ON public.user_security_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own security settings" ON public.user_security_settings FOR UPDATE USING (auth.uid() = user_id);

-- 6. Create user_usage_metrics table
CREATE TABLE IF NOT EXISTS public.user_usage_metrics (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  documents_analyzed INTEGER DEFAULT 0,
  opportunities_generated INTEGER DEFAULT 0,
  storage_used_mb NUMERIC DEFAULT 0,
  openai_calls INTEGER DEFAULT 0,
  gemini_calls INTEGER DEFAULT 0,
  deepgram_calls INTEGER DEFAULT 0,
  subscription_tier TEXT DEFAULT 'Free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.user_usage_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own usage metrics" ON public.user_usage_metrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own usage metrics" ON public.user_usage_metrics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own usage metrics" ON public.user_usage_metrics FOR UPDATE USING (auth.uid() = user_id);

-- Initialize settings for existing users
INSERT INTO public.education_profiles (user_id)
SELECT id FROM public.profiles
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.user_preferences (user_id)
SELECT id FROM public.profiles
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.user_security_settings (user_id)
SELECT id FROM public.profiles
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.user_usage_metrics (user_id)
SELECT id FROM public.profiles
ON CONFLICT (user_id) DO NOTHING;
