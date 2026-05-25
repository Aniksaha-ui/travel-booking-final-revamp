import { Ban, CheckCheck, CreditCard, Layers3 } from 'lucide-react'
import { DashboardMetricCard } from '../../../components/ui/DashboardMetricCard'

export function OnlinePaymentConfigOverview({ isLoading, metrics }) {
  const items = [
    {
      icon: CreditCard,
      label: 'Configurations',
      tone: 'blue',
      value: metrics.totalCountLabel,
    },
    {
      icon: CheckCheck,
      label: 'Enabled',
      tone: 'emerald',
      value: metrics.enabledCountLabel,
    },
    {
      icon: Ban,
      label: 'Disabled',
      tone: 'amber',
      value: metrics.disabledCountLabel,
    },
    {
      icon: Layers3,
      label: 'Payment Flows',
      tone: 'cyan',
      value: metrics.paymentFlowCountLabel,
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

