-- Add new strict analysis fields to opportunities table
ALTER TABLE public.opportunities
ADD COLUMN opportunity_value TEXT DEFAULT 'Not Found In Document',
ADD COLUMN risk_score INTEGER DEFAULT 0,
ADD COLUMN confidence_score INTEGER DEFAULT 0,
ADD COLUMN evidence_references JSONB DEFAULT '[]'::jsonb;
