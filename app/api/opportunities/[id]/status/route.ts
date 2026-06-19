import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: opp, error } = await supabase
    .from('opportunities')
    .select('status, processing_message, processing_metadata')
    .eq('id', id)
    .single();

  if (error || !opp) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({
    status: opp.status,
    processing_message: opp.processing_message,
    processing_metadata: opp.processing_metadata
  });
}
