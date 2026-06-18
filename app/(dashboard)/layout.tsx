import { AppNavigation } from "@/components/navigation/app-navigation"
import { AdvisorFloatingButton } from "@/components/advisor/advisor-floating-button"
import { ClearPathAmbientBackground } from "@/components/layout/clearpath-ambient-background"
import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = {
    first_name: "Student",
    last_name: "",
    plan: "Free Plan"
  }

  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', user.id)
      .single()

    if (data) {
      profile.first_name = data.first_name || "Student"
      profile.last_name = data.last_name || ""
    } else {
      // Fallback if full_name wasn't split yet or profile missing
      profile.first_name = user.user_metadata?.first_name || "Student"
      profile.last_name = user.user_metadata?.last_name || ""
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <Suspense fallback={null}>
        <ClearPathAmbientBackground variant="dashboard" />
      </Suspense>

      <Suspense fallback={<div className="w-[80px] md:w-[280px] hidden md:block" />}>
        <AppNavigation profile={profile} />
      </Suspense>
      
      {/* Immersive Main Content */}
      <main className="flex-1 flex flex-col relative w-full min-h-screen md:pl-[80px] lg:pl-[280px] pb-20 md:pb-0 transition-all duration-300">
        {children}
      </main>

      {/* Global Advisor Component */}
      <AdvisorFloatingButton />
    </div>
  )
}
