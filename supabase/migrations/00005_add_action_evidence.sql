-- Add evidence columns to action_steps table
ALTER TABLE public.action_steps
ADD COLUMN source_quote TEXT,
ADD COLUMN page_number TEXT,
ADD COLUMN confidence_score INTEGER;
