-- PostgreSQL function to auto-clean processing_jobs
-- Note: Requires an external cron or pg_cron to be executed periodically.

CREATE OR REPLACE FUNCTION public.cleanup_old_jobs()
RETURNS void AS $$
BEGIN
  -- Delete failed jobs older than 24 hours
  DELETE FROM public.processing_jobs 
  WHERE status = 'failed' 
  AND updated_at < NOW() - INTERVAL '1 day';

  -- Delete completed jobs older than 7 days
  DELETE FROM public.processing_jobs 
  WHERE status = 'completed' 
  AND updated_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;
