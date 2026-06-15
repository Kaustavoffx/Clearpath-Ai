-- Add performance indexes for faster querying on heavily accessed columns
CREATE INDEX IF NOT EXISTS idx_opportunities_user_id ON public.opportunities(user_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_created_at ON public.opportunities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_action_steps_opportunity_id ON public.action_steps(opportunity_id);
