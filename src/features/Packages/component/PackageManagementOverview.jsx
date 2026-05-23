import { BusFront, Hotel, MapPinned, Package, UtensilsCrossed } from 'lucide-react'
import { useMemo } from 'react'
import { DashboardMetricCard } from '../../../components/ui/DashboardMetricCard'
import { DashboardSection } from '../../../components/ui/DashboardSection'
import { buildPackageMetrics } from '../utils/packageUtils'

export function PackageManagementOverview({ packages }) {
  const metrics = useMemo(() => buildPackageMetrics(packages), [packages])

  const summaryItems = [
    {
      icon: Package,
      label: 'Packages in View',
      tone: 'blue',
      value: metrics.totalPackagesLabel,
    },
    {
      icon: MapPinned,
      label: 'Linked Trips',
      tone: 'cyan',
      value: metrics.uniqueTripsLabel,
    },
    {
      icon: UtensilsCrossed,
      label: 'Meal Included',
      tone: 'amber',
      value: metrics.withMealLabel,
    },
    {
      icon: Hotel,
      label: 'Hotel Included',
      tone: 'emerald',
      value: metrics.withHotelLabel,
    },
  ]

  return (
    <>
      <section className="month-balance-summary-grid">
        {summaryItems.map((item) => (
          <DashboardMetricCard
            key={item.label}
            icon={item.icon}
            label={item.label}
            tone={item.tone}
            value={item.value}
          />
        ))}
      </section>

      <section className="mb-6 grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)]">
        <DashboardSection
          title="Service Coverage"
          icon={<BusFront size={16} className="text-blue-400" />}
          bodyClassName="border-t border-[#2d282b] p-5"
        >
          <div className="space-y-4">
            {metrics.serviceMix.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-white">{item.label}</span>
                  <span className="text-xs font-bold text-[#9fb2d0]">
                    {item.count} / {metrics.totalPackages}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#171314]">
                  <div
                    className={`h-2 rounded-full ${item.accentClassName}`}
                    style={{ width: `${item.ratio}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection
          title="Portfolio Snapshot"
          icon={<Package size={16} className="text-emerald-400" />}
          bodyClassName="border-t border-[#2d282b]"
        >
          <div className="divide-y divide-[#2d282b]">
            <div className="px-5 py-4">
              <p className="text-[11px] font-bold uppercase text-[#7ea1ff]">Guided Packages</p>
              <p className="mt-2 text-lg font-semibold text-white">{metrics.guidedPackagesLabel}</p>
            </div>
            <div className="px-5 py-4">
              <p className="text-[11px] font-bold uppercase text-[#7ea1ff]">Vehicle Included</p>
              <p className="mt-2 text-lg font-semibold text-white">{metrics.withVehicleLabel}</p>
            </div>
            <div className="px-5 py-4">
              <p className="text-[11px] font-bold uppercase text-[#7ea1ff]">Trip Coverage</p>
              <p className="mt-2 text-sm font-semibold text-[#c5d9f7]">
                {metrics.uniqueTrips} unique trips represented in the current result set.
              </p>
            </div>
          </div>
        </DashboardSection>
      </section>
    </>
  )
}

