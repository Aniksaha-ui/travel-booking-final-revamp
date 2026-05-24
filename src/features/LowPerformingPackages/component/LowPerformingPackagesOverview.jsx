import { AlertTriangle, BarChart3, Package, TrendingDown } from 'lucide-react'
import { useMemo } from 'react'
import { DashboardMetricCard } from '../../../components/ui/DashboardMetricCard'
import { DashboardSection } from '../../../components/ui/DashboardSection'
import { buildLowPerformingPackagesSummary } from '../utils/lowPerformingPackagesUtils'
import { LOW_PERFORMING_PACKAGES_COPY } from '../constants/lowPerformingPackages.constants'

export function LowPerformingPackagesOverview({ isLoading, rows }) {
  const summary = useMemo(() => buildLowPerformingPackagesSummary(rows), [rows])

  const summaryItems = [
    {
      icon: Package,
      label: 'Flagged Packages',
      tone: 'amber',
      value: summary.totalPackagesLabel,
    },
    {
      icon: BarChart3,
      label: 'Recent Bookings',
      tone: 'blue',
      value: summary.totalRecentBookingsLabel,
    },
    {
      icon: TrendingDown,
      label: 'Average Bookings',
      tone: 'cyan',
      value: summary.averageBookingsLabel,
    },
    {
      icon: AlertTriangle,
      label: 'Zero Booking',
      tone: 'amber',
      value: summary.zeroBookingPackagesLabel,
    },
  ]

  return (
    <>
      <section className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {summaryItems.map((item) => (
          <DashboardMetricCard
            key={item.label}
            icon={item.icon}
            label={item.label}
            tone={item.tone}
            value={isLoading ? '...' : item.value}
          />
        ))}
      </section>

      <DashboardSection
        className="mb-6"
        title={LOW_PERFORMING_PACKAGES_COPY.attentionTitle}
        icon={<AlertTriangle size={16} className="text-amber-300" />}
        bodyClassName="border-t border-[#2d282b] px-5 py-4"
      >
        <div className="flex flex-col gap-3 text-sm text-[#c5d9f7] md:flex-row md:items-center md:justify-between">
          <p className="max-w-4xl leading-6">{LOW_PERFORMING_PACKAGES_COPY.attentionText}</p>
          <span className="shrink-0 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-200">
            Lowest: {isLoading ? 'Loading...' : summary.lowestPackageLabel}
          </span>
        </div>
      </DashboardSection>
    </>
  )
}
