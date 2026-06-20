import { AppNavigation } from "@/components/navigation/app-navigation"
import { AdvisorFloatingButton } from "@/components/advisor/advisor-floating-button"
import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { CommandBar } from "@/components/navigation/command-bar"

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
      {/* Background is handled globally by RootLayout */}

      <Suspense fallback={<div className="w-[80px] lg:w-[280px] hidden md:block" />}>
        <AppNavigation profile={profile} />
      </Suspense>
      
      {/* Immersive Main Content */}
      <main className="flex-1 flex flex-col relative w-full min-h-screen pt-safe pt-4 md:pt-6 px-4 md:pl-[104px] md:pr-6 pb-safe pb-24 md:pb-6">
        {children}
      </main>

      {/* Global Advisor Component */}
      <AdvisorFloatingButton />

      {/* Global Command Search */}
      <CommandBar />
    </div>
  )
}
