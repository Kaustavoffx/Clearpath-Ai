import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPageLoading() {
  return (
    <div className="container-wide min-h-[calc(100vh-5rem)] flex flex-col py-12 mt-8 animate-fadeInUp">
      {/* Header */}
      <div className="mb-8 border-b border-glass-border pb-8">
        <Skeleton className="h-10 w-72 mb-3" />
        <Skeleton className="h-4 w-[500px]" />
      </div>

      {/* Briefing */}
      <div className="mb-12">
        <div className="liquid-glass-card p-6">
          <Skeleton className="h-8 w-80 mb-2" />
          <Skeleton className="h-4 w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="liquid-glass-card p-6">
            <Skeleton className="h-3 w-16 mb-4" />
            <Skeleton className="h-10 w-14 mb-2" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="liquid-glass-card p-8">
            <Skeleton className="h-5 w-44 mb-6" />
            <Skeleton className="h-52 w-full rounded-2xl" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="liquid-glass-card p-6">
            <Skeleton className="h-4 w-32 mb-5" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
