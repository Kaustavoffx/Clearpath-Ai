import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: job, error } = await supabase
    .from('processing_jobs')
    .select('id, status, progress, stage, updated_at')
    .eq('id', id)
    .single();

  if (error || !job) {
    return NextResponse.json({ status: 'not_found' }, { status: 200 });
  }

  return NextResponse.json({
    id: job.id,
    status: job.status,
    progress: job.progress,
    stage: job.stage,
    updatedAt: job.updated_at
  });
}
