import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardGroupLoading() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar skeleton */}
      <div className="hidden md:flex flex-col w-[260px] border-r border-glass-border p-6 gap-6">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="h-5 w-28" />
        </div>
        <div className="flex flex-col gap-3 mt-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-full rounded-xl" />
          ))}
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 p-8 md:p-12 animate-fadeInUp">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96 mb-10" />
        
        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="liquid-glass-card p-6">
              <Skeleton className="h-3 w-16 mb-4" />
              <Skeleton className="h-10 w-12 mb-2" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>

        {/* Content area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="liquid-glass-card p-8">
              <Skeleton className="h-5 w-40 mb-6" />
              <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
          </div>
          <div className="space-y-6">
            <div className="liquid-glass-card p-6">
              <Skeleton className="h-4 w-28 mb-4" />
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full mb-3" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
