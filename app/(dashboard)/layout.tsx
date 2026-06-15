import { ThemeToggle } from "@/components/theme-toggle"
import { GlassPanel } from "@/components/ui/glass/glass-panel"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      {/* Absolute Header for essentials */}
      <header className="absolute top-0 w-full z-50 p-6 flex justify-between items-center bg-transparent">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(var(--primary),0.5)]">
            <span className="text-primary-foreground font-bold text-sm">C</span>
          </div>
          <span className="font-bold tracking-tight text-lg">ClearPath OS</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </header>
      
      {/* Immersive Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center relative w-full h-screen">
        {children}
      </main>
    </div>
  )
}
