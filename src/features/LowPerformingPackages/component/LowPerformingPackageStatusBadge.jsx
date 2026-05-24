import { TrendingDown } from 'lucide-react'

export function LowPerformingPackageStatusBadge({ label }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/25 bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-200">
      <TrendingDown size={13} />
      {label}
    </span>
  )
}
