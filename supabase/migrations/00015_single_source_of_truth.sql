-- 00015_single_source_of_truth.sql

-- 1. Create global_opportunities table for the Matching Engine
CREATE TABLE IF NOT EXISTS public.global_opportunities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  target_state TEXT,
  target_income_max NUMERIC,
  target_exams TEXT[] DEFAULT '{}',
  opportunity_value TEXT,
  deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: We don't need RLS restrictions on viewing global_opportunities, anyone can read
ALTER TABLE public.global_opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view global opportunities" ON public.global_opportunities FOR SELECT USING (true);

-- 2. Create usage_logs table to track API calls
CREATE TABLE IF NOT EXISTS public.usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  service TEXT NOT NULL, -- e.g., 'OpenAI', 'Gemini', 'Deepgram'
  operation TEXT NOT NULL, -- e.g., 'PDF Analysis', 'Action Plan Generation'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own usage logs" ON public.usage_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own usage logs" ON public.usage_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Seed some global opportunities to ensure the Matching Engine isn't just showing 0
INSERT INTO public.global_opportunities (title, category, target_state, target_income_max, target_exams, opportunity_value, deadline) VALUES
('National Scholarship Scheme', 'SCHOLARSHIP', NULL, 250000, '{}', '₹20,000', NOW() + INTERVAL '30 days'),
('West Bengal Post Matric', 'SCHEME', 'West Bengal', 250000, '{}', '₹15,000', NOW() + INTERVAL '45 days'),
('JEE Advanced Merit Grant', 'SCHOLARSHIP', NULL, 800000, '{JEE}', 'Tuition Waiver', NOW() + INTERVAL '15 days'),
('NEET Preparation Fund', 'SCHOLARSHIP', NULL, 500000, '{NEET}', '₹50,000', NOW() + INTERVAL '60 days'),
('Tech Innovation Challenge', 'COMPETITION', NULL, NULL, '{}', '₹1,00,000', NOW() + INTERVAL '90 days');
