import { Activity, AlertTriangle, Clock3, Route } from 'lucide-react'
import { DashboardMetricCard } from '../../../components/ui/DashboardMetricCard'

export function MonitoringOverview({ isLoading, summary }) {
  const summaryItems = [
    {
      icon: Activity,
      label: 'Total Requests Today',
      tone: 'blue',
      value: summary.totalRequestsTodayLabel,
    },
    {
      icon: Clock3,
      label: 'Total Execution Time',
      tone: 'amber',
      value: summary.totalExecutionTimeLabel,
    },
    {
      icon: Route,
      label: 'Active Routes',
      tone: 'emerald',
      value: summary.activeRoutesLabel,
    },
    {
      icon: AlertTriangle,
      label: 'Slow Queries',
      tone: 'amber',
      value: summary.slowQueriesLabel,
    },
  ]

  return (
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
  )
}
