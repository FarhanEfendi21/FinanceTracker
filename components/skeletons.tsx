import { cn } from '@/lib/utils'

// Base shimmer element
function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800/60',
        'before:absolute before:inset-0 before:-translate-x-full',
        'before:bg-gradient-to-r before:from-transparent before:via-white/40 dark:before:via-white/[0.06] before:to-transparent',
        'before:animate-[shimmer_1.6s_infinite]',
        className
      )}
    />
  )
}

// CSS keyframe — inject once via globals or inline style
// We use Tailwind arbitrary animation via style tag approach

// ── Stats Cards ──────────────────────────────────────────────

export function StatCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-black/5 dark:border-white/5 bg-white dark:bg-card p-8 shadow-sm">
      {/* Icon placeholder */}
      <Shimmer className="mb-4 h-12 w-12 rounded-2xl" />
      {/* Label */}
      <Shimmer className="h-3 w-28 rounded-full mb-3" />
      {/* Amount */}
      <Shimmer className="h-8 w-44 rounded-full mb-2" />
      {/* Sub text */}
      <Shimmer className="h-2.5 w-32 rounded-full opacity-70" />
      {/* Background circle decoration */}
      <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-zinc-100/50 dark:bg-zinc-800/20" />
    </div>
  )
}

export function StatCardSkeletonGroup() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>
  )
}

// ── Chart Skeletons ───────────────────────────────────────────

export function ChartSkeleton() {
  return (
    <div className="rounded-[2.5rem] border border-black/5 dark:border-white/5 bg-white dark:bg-card p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <Shimmer className="h-5 w-36 rounded-full" />
        <Shimmer className="h-4 w-24 rounded-full" />
      </div>
      {/* Chart area */}
      <div className="h-[300px] w-full flex items-end gap-3 px-4">
        {[60, 85, 45, 70, 55, 90].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 justify-end h-full">
            <Shimmer className="w-full rounded-t-lg" style={{ height: `${h}%` } as any} />
          </div>
        ))}
      </div>
      {/* X axis */}
      <div className="mt-4 flex gap-3 px-4">
        {[...Array(6)].map((_, i) => (
          <Shimmer key={i} className="flex-1 h-3 rounded-full" />
        ))}
      </div>
    </div>
  )
}

export function PieChartSkeleton() {
  return (
    <div className="rounded-[2.5rem] border border-black/5 dark:border-white/5 bg-white dark:bg-card p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <Shimmer className="h-5 w-40 rounded-full" />
        <Shimmer className="h-3 w-20 rounded-full" />
      </div>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr),minmax(0,1.2fr)] items-center">
        {/* Donut */}
        <div className="flex items-center justify-center h-[280px]">
          <div className="relative h-[220px] w-[220px]">
            <Shimmer className="absolute inset-0 rounded-full" />
            {/* Inner hole */}
            <div className="absolute inset-[30px] rounded-full bg-white dark:bg-card" />
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <Shimmer className="h-2.5 w-8 rounded-full" />
              <Shimmer className="h-5 w-24 rounded-full" />
            </div>
          </div>
        </div>
        {/* Legend */}
        <div className="space-y-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Shimmer className="h-3 w-3 rounded-full shrink-0" />
                <div className="space-y-1.5">
                  <Shimmer className="h-3 w-20 rounded-full" />
                  <Shimmer className="h-2 w-14 rounded-full opacity-70" />
                </div>
              </div>
              <Shimmer className="h-3.5 w-24 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Transaction Item Skeletons ────────────────────────────────

export function TransactionItemSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-[1.5rem] border border-black/5 dark:border-white/5 bg-white dark:bg-card p-5">
      <div className="flex items-center gap-4">
        {/* Icon */}
        <Shimmer className="h-12 w-12 rounded-2xl shrink-0" />
        <div className="space-y-2">
          {/* Category */}
          <Shimmer className="h-3.5 w-24 rounded-full" />
          {/* Date */}
          <Shimmer className="h-2.5 w-16 rounded-full opacity-70" />
        </div>
      </div>
      {/* Amount */}
      <Shimmer className="h-4 w-28 rounded-full" />
    </div>
  )
}

export function TransactionSectionSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center justify-between px-2">
        <Shimmer className="h-3 w-16 rounded-full" />
        <Shimmer className="h-5 w-14 rounded-full" />
      </div>
      {/* Items */}
      <div className="space-y-3">
        {[...Array(count)].map((_, i) => (
          <TransactionItemSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export function TransactionListSkeleton() {
  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <TransactionSectionSkeleton count={4} />
      <TransactionSectionSkeleton count={3} />
    </div>
  )
}

// ── Dashboard Full Skeleton ───────────────────────────────────

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <StatCardSkeletonGroup />
      <div className="grid gap-8 lg:grid-cols-2">
        <ChartSkeleton />
        <PieChartSkeleton />
      </div>
    </div>
  )
}
