import { AppNavigation } from "@/components/navigation/app-navigation"
import { Suspense } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      <Suspense fallback={<div className="w-[84px] hidden md:block" />}>
        <AppNavigation />
      </Suspense>
      
      {/* Immersive Main Content */}
      <main className="flex-1 flex flex-col relative w-full min-h-screen md:pl-[116px] pb-28 md:pb-0 transition-all duration-500">
        {children}
      </main>
    </div>
  )
}
