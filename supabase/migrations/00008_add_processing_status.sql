-- Add columns to track real-time processing status and chunking metadata
ALTER TABLE public.opportunities 
ADD COLUMN IF NOT EXISTS processing_message TEXT DEFAULT 'Initializing...',
ADD COLUMN IF NOT EXISTS processing_metadata JSONB DEFAULT '{}'::jsonb;
