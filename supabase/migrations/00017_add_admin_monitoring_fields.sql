-- 00017_add_admin_monitoring_fields.sql

ALTER TABLE public.usage_logs
ADD COLUMN token_estimate INTEGER DEFAULT 0,
ADD COLUMN request_count INTEGER DEFAULT 1,
ADD COLUMN latency INTEGER DEFAULT 0,
ADD COLUMN fallback_triggered BOOLEAN DEFAULT false;
