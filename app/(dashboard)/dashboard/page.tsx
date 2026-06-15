import { createClient } from "@/lib/supabase/server"
import { VoiceInterface } from "@/components/voice-interface"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth')
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      {/* Background ambient meshes handled by global CSS tokens */}
      <VoiceInterface />
    </div>
  )
}
