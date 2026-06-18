import { createClient } from '@supabase/supabase-js';

// We must use the service role key to bypass RLS when incrementing usage and fetching keys
const getAdminSupabase = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  if (!supabaseServiceKey) {
    console.warn("SUPABASE_SERVICE_ROLE_KEY is missing. Usage and API Keys operations will fail.");
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
};

export type FeatureType = 'document_analysis' | 'advisor_session' | 'voice_session';

export interface UsageStatus {
  hasFreeUsage: boolean;
  hasProviderConnected: boolean;
  count: number;
  provider: 'openai' | 'gemini' | 'deepgram';
}

const FEATURE_TO_PROVIDER = {
  document_analysis: 'gemini',
  advisor_session: 'openai',
  voice_session: 'deepgram'
} as const;

export async function checkAndIncrementUsage(userId: string, feature: FeatureType): Promise<UsageStatus> {
  const supabase = getAdminSupabase();
  const countColumn = `${feature}_count`;
  const providerColumn = `${FEATURE_TO_PROVIDER[feature]}_connected`;
  const providerName = FEATURE_TO_PROVIDER[feature];

  // 1. Fetch current usage
  const { data: usage, error } = await supabase
    .from('user_usage')
    .select(`${countColumn}, ${providerColumn}`)
    .eq('user_id', userId)
    .single();

  if (error || !usage) {
    console.error("Error fetching usage:", error);
    // If table doesn't exist yet during hackathon, default to allow for testing
    return { hasFreeUsage: true, hasProviderConnected: false, count: 0, provider: providerName };
  }

  const currentCount = usage[countColumn] as number;
  const isProviderConnected = usage[providerColumn] as boolean;
  
  const hasFreeUsage = currentCount < 3;

  // 2. Increment usage if they are using free tier OR if they have provider connected
  // Even if they have provider, we might want to track total usage, but let's strictly follow the spec:
  // "IF count < 3 Allow ELSE Require Connected AI Provider"
  
  if (hasFreeUsage) {
    // Increment the free count
    await supabase
      .from('user_usage')
      .update({ [countColumn]: currentCount + 1 })
      .eq('user_id', userId);
  }

  return {
    hasFreeUsage,
    hasProviderConnected: isProviderConnected,
    count: currentCount,
    provider: providerName
  };
}

export async function getUserUsageInfo(userId: string) {
  const supabase = getAdminSupabase();
  const { data, error } = await supabase
    .from('user_usage')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  if (error) {
    return null;
  }
  
  return data;
}

export async function getProviderKey(userId: string, provider: 'openai' | 'gemini' | 'deepgram') {
  const supabase = getAdminSupabase();
  
  const { data, error } = await supabase
    .from('user_api_keys')
    .select('encrypted_key, initialization_vector, authentication_tag')
    .eq('user_id', userId)
    .eq('provider', provider)
    .single();
    
  if (error || !data) {
    return null;
  }
  
  return data;
}
