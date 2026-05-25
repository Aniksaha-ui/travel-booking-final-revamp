import { BedDouble, Hotel, MapPinned, Star } from 'lucide-react'
import { DashboardMetricCard } from '../../../components/ui/DashboardMetricCard'

export function HotelsOverview({ isLoading, metrics }) {
  const metricItems = [
    {
      icon: Hotel,
      label: 'Hotels on Page',
      tone: 'blue',
      value: metrics.totalCountLabel,
    },
    {
      icon: MapPinned,
      label: 'Countries Covered',
      tone: 'cyan',
      value: metrics.countryCountLabel,
    },
    {
      icon: BedDouble,
      label: 'Rooms Mapped',
      tone: 'emerald',
      value: metrics.totalRoomsLabel,
    },
    {
      icon: Star,
      label: 'Average Rating',
      tone: 'amber',
      value: metrics.averageStarLabel,
    },
  ]

  return (
    <section className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {metricItems.map((item) => (
        <DashboardMetricCard
          key={item.label}
          icon={item.icon}
          label={item.label}
          tone={item.tone}
          value={isLoading ? '...' : item.value}
        />
      ))}
    </section>
  )
}
