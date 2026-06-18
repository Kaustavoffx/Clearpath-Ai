import { AIProviderCenter } from "@/components/providers/ai-provider-center"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AIProvidersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="container-wide min-h-[calc(100vh-5rem)] flex flex-col py-12 mt-8 animate-in fade-in duration-700">
      <AIProviderCenter />
    </div>
  )
}
