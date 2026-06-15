-- Add new columns for advanced AI analysis
ALTER TABLE public.opportunities
ADD COLUMN eligibility_analysis JSONB DEFAULT '{}'::jsonb,
ADD COLUMN required_documents JSONB DEFAULT '[]'::jsonb,
ADD COLUMN opportunity_loss_prediction TEXT,
ADD COLUMN readiness_score INTEGER CHECK (readiness_score >= 0 AND readiness_score <= 100),
ADD COLUMN risk_analysis JSONB DEFAULT '{}'::jsonb;
