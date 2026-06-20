-- 00012_v2_core_schema.sql

-- Add new enum values to status_enum if possible, or just use string statuses
ALTER TYPE status_enum ADD VALUE IF NOT EXISTS 'DRAFT';
ALTER TYPE status_enum ADD VALUE IF NOT EXISTS 'ARCHIVED';
ALTER TYPE status_enum ADD VALUE IF NOT EXISTS 'TRASHED';

-- Add new fields to opportunities
ALTER TABLE public.opportunities ADD COLUMN priority_score INTEGER DEFAULT 0;
ALTER TABLE public.opportunities ADD COLUMN smart_deadlines JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.opportunities ADD COLUMN impact_metrics JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.opportunities ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.opportunities ADD COLUMN execution_stage VARCHAR DEFAULT 'Analyzed';

-- Upgrade action_steps
ALTER TABLE public.action_steps ADD COLUMN priority VARCHAR DEFAULT 'Medium';
ALTER TABLE public.action_steps ADD COLUMN due_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.action_steps ADD COLUMN estimated_time_minutes INTEGER DEFAULT 0;
ALTER TABLE public.action_steps ADD COLUMN completion_percent INTEGER DEFAULT 0;
ALTER TABLE public.action_steps ADD COLUMN notes TEXT;

-- Create Document Vault
CREATE TABLE public.document_vault (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.document_vault ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own document vault" ON public.document_vault FOR ALL USING (auth.uid() = user_id);

-- Create Opportunity Documents
CREATE TABLE public.opportunity_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  status VARCHAR DEFAULT 'missing', -- 'missing', 'uploaded', 'verified'
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

-- Create Activity Feed
CREATE TABLE public.activity_feed (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE NOT NULL,
  action_type VARCHAR NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own activity feed" ON public.activity_feed 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.opportunities o 
      WHERE o.id = public.activity_feed.opportunity_id 
      AND o.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can insert own activity feed" ON public.activity_feed 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.opportunities o 
      WHERE o.id = public.activity_feed.opportunity_id 
      AND o.user_id = auth.uid()
    )
  );
