-- Add document_hash to opportunities and processing_jobs
ALTER TABLE public.opportunities ADD COLUMN document_hash TEXT;
ALTER TABLE public.processing_jobs ADD COLUMN document_hash TEXT;

-- Create unique index to prevent duplicates at the DB level
CREATE UNIQUE INDEX opportunities_user_id_document_hash_idx ON public.opportunities(user_id, document_hash) WHERE document_hash IS NOT NULL;
