-- 00014_production_readiness.sql

-- 1. Create user_sessions table for active sessions tracking
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  device_name TEXT,
  browser TEXT,
  os TEXT,
  ip_hash TEXT,
  country TEXT,
  city TEXT,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own sessions" ON public.user_sessions FOR ALL USING (auth.uid() = user_id);

-- 2. Refactor document_vault table to match production requirements
-- Drop the existing table and recreate it to ensure perfect alignment with requirements
DROP TABLE IF EXISTS public.opportunity_documents CASCADE;
DROP TABLE IF EXISTS public.document_vault CASCADE;
DROP TYPE IF EXISTS document_status_enum CASCADE;

CREATE TABLE public.document_vault (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  document_type TEXT NOT NULL,
  file_name TEXT,
  file_url TEXT,
  thumbnail_url TEXT,
  mime_type TEXT,
  file_size BIGINT,
  verified BOOLEAN DEFAULT false,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  expiry_date TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.document_vault ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own documents" ON public.document_vault FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own documents" ON public.document_vault FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own documents" ON public.document_vault FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own documents" ON public.document_vault FOR DELETE USING (auth.uid() = user_id);

-- Recreate opportunity_documents (from 00012) pointing to the new document_vault
CREATE TABLE public.opportunity_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'missing',
  vault_file_id UUID REFERENCES public.document_vault(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.opportunity_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own opportunity documents" ON public.opportunity_documents 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.opportunities o 
      WHERE o.id = public.opportunity_documents.opportunity_id 
      AND o.user_id = auth.uid()
    )
  );

-- 3. Create Storage Bucket for document-vault
INSERT INTO storage.buckets (id, name, public) VALUES ('document-vault', 'document-vault', false) ON CONFLICT (id) DO NOTHING;

-- Storage Policies for document-vault
CREATE POLICY "Users can upload their own documents" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'document-vault' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can view their own documents" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'document-vault' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can update their own documents" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'document-vault' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can delete their own documents" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'document-vault' AND (storage.foldername(name))[1] = auth.uid()::text);
