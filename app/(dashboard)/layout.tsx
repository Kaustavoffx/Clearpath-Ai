import { AppNavigation } from "@/components/navigation/app-navigation"
import { AdvisorFloatingButton } from "@/components/advisor/advisor-floating-button"
import { Suspense } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <Suspense fallback={<div className="w-[260px] hidden md:block" />}>
        <AppNavigation />
      </Suspense>
      
      {/* Immersive Main Content */}
      <main className="flex-1 flex flex-col relative w-full min-h-screen md:pl-[260px] pb-20 md:pb-0 transition-all duration-500">
        {children}
      </main>

      {/* Global Advisor Component */}
      <AdvisorFloatingButton />
    </div>
  )
}
