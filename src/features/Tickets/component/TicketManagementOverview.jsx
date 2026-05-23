import { CheckCheck, ClipboardList, KanbanSquare, ShieldAlert } from 'lucide-react'
import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { DashboardMetricCard } from '../../../components/ui/DashboardMetricCard'
import { DashboardSection } from '../../../components/ui/DashboardSection'
import { buildTicketMetrics, formatCompactCount } from '../utils/ticketUtils'

function TicketStatusTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="min-w-[160px] rounded-lg border border-[#332d30] bg-[#171314] px-4 py-3 text-xs shadow-2xl">
      <p className="mb-2 font-bold text-white">{label}</p>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[#b4c5df]">Tickets</span>
        <span className="font-semibold text-white">{payload[0].value}</span>
      </div>
    </div>
  )
}

function SnapshotRow({ eyebrow, value, tone = 'neutral' }) {
  const toneClassName =
    tone === 'positive'
      ? 'text-emerald-300'
      : tone === 'negative'
        ? 'text-rose-300'
        : 'text-white'

  return (
    <article className="border-b border-[#2d282b] px-5 py-4 last:border-b-0">
      <p className="text-[11px] font-bold uppercase text-[#7ea1ff]">{eyebrow}</p>
      <p className={`mt-2 text-sm font-semibold ${toneClassName}`}>{value}</p>
    </article>
  )
}

function EmptyState({ message }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center px-5 py-8 text-center text-sm font-medium text-[#8fa0bd]">
      {message}
    </div>
  )
}

export function TicketManagementOverview({ isLoading, tickets }) {
  const metrics = useMemo(() => buildTicketMetrics(tickets), [tickets])

  const summaryItems = [
    {
      label: 'Pending Issues',
      value: formatCompactCount(metrics.pendingCount),
      icon: ShieldAlert,
      tone: 'amber',
    },
    {
      label: 'Active Board',
      value: formatCompactCount(metrics.boardVolume),
      icon: KanbanSquare,
      tone: 'blue',
    },
    {
      label: 'Closed Tickets',
      value: formatCompactCount(metrics.closedCount),
      icon: CheckCheck,
      tone: 'emerald',
    },
    {
      label: 'Acceptance Rate',
      value: metrics.acceptedRatioLabel,
      icon: ClipboardList,
      tone: 'cyan',
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
            value={item.value}
          />
        ))}
      </section>

      <section className="mb-6 grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.95fr)]">
        <DashboardSection
          title="Ticket Status Distribution"
          icon={<KanbanSquare size={16} className="text-blue-400" />}
          action={
            <span className="rounded-full border border-[#332d30] bg-[#171314] px-2.5 py-1 text-[11px] font-bold text-[#9fb2d0]">
              {metrics.totalTickets} total
            </span>
          }
          bodyClassName="border-t border-[#2d282b] p-5"
        >
          {isLoading ? (
            <EmptyState message="Loading ticket summary..." />
          ) : metrics.totalTickets ? (
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.chartItems} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#2d282b" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    axisLine={false}
                    dataKey="key"
                    tick={{ fill: '#8fa0bd', fontSize: 11 }}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tick={{ fill: '#8fa0bd', fontSize: 11 }}
                    tickLine={false}
                    width={36}
                  />
                  <Tooltip cursor={{ fill: 'rgb(255 255 255 / 0.03)' }} content={<TicketStatusTooltip />} />
                  <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                    {metrics.chartItems.map((item) => (
                      <Cell key={item.key} fill={item.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState message="No ticket distribution is available yet." />
          )}
        </DashboardSection>

        <DashboardSection
          title="Operations Snapshot"
          icon={<ClipboardList size={16} className="text-cyan-400" />}
          bodyClassName="border-t border-[#2d282b]"
        >
          {isLoading ? (
            <EmptyState message="Preparing the latest queue snapshot..." />
          ) : (
            <div>
              <SnapshotRow eyebrow="Oldest Pending Issue" value={metrics.oldestPendingLabel} tone="negative" />
              <SnapshotRow eyebrow="Oldest Active Ticket" value={metrics.oldestProcessingLabel} />
              <SnapshotRow eyebrow="Accepted From Queue" value={metrics.acceptedRatioLabel} tone="positive" />
              <SnapshotRow eyebrow="Closed From Accepted" value={metrics.closureRatioLabel} tone="positive" />
            </div>
          )}
        </DashboardSection>
      </section>
    </>
  )
}
