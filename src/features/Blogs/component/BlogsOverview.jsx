import { Archive, CheckCheck, FileText, UsersRound } from 'lucide-react'
import { DashboardMetricCard } from '../../../components/ui/DashboardMetricCard'

export function BlogsOverview({ isLoading, metrics }) {
  const items = [
    {
      icon: FileText,
      label: 'Total Posts',
      tone: 'blue',
      value: metrics.totalCountLabel,
    },
    {
      icon: CheckCheck,
      label: 'Published',
      tone: 'emerald',
      value: metrics.publishedCountLabel,
    },
    {
      icon: Archive,
      label: 'Archived',
      tone: 'amber',
      value: metrics.archivedCountLabel,
    },
    {
      icon: UsersRound,
      label: 'Authors',
      tone: 'cyan',
      value: metrics.authorCountLabel,
    },
  ]

  return (
    <section className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
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

