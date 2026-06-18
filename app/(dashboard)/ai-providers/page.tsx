import { AIProviderCenter } from "@/components/providers/ai-provider-center"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AIProvidersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // We can just use the user's normal token here since they are allowed to select their own usage
  const { data: usage } = await supabase
    .from('user_usage')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="container-wide min-h-[calc(100vh-5rem)] flex flex-col py-12 mt-8 animate-in fade-in duration-700">
      <AIProviderCenter initialUsage={usage || null} />
    </div>
  )
}
