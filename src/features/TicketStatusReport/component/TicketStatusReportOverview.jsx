import { AlertTriangle, CheckCircle2, PieChart as PieChartIcon, Ticket, Trophy } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { DashboardMetricCard } from '../../../components/ui/DashboardMetricCard'
import { DashboardSection } from '../../../components/ui/DashboardSection'

function TicketStatusTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null
  }

  const item = payload[0]?.payload

  return (
    <div className="rounded-md border border-[#332d30] bg-[#171314] px-3 py-2 text-xs font-bold text-white shadow-lg">
      <p className="mb-2">{item?.statusLabel}</p>
      <div className="flex min-w-[180px] justify-between gap-4">
        <span className="text-[#9fb2d0]">Tickets</span>
        <span>{item?.totalTicketsLabel}</span>
      </div>
      <div className="mt-1 flex justify-between gap-4">
        <span className="text-[#9fb2d0]">Share</span>
        <span>{item?.shareLabel}</span>
      </div>
    </div>
  )
}

export function TicketStatusReportOverview({ isLoading, summary }) {
  const metricItems = [
    {
      icon: Ticket,
      label: 'Total Tickets',
      tone: 'blue',
      value: summary.totalTicketsLabel,
    },
    {
      icon: AlertTriangle,
      label: 'Tracked Statuses',
      tone: 'amber',
      value: summary.totalStatusesLabel,
    },
    {
      icon: Trophy,
      label: 'Top Status',
      tone: 'emerald',
      value: summary.topStatusName,
    },
    {
      icon: CheckCircle2,
      label: 'Resolution Rate',
      tone: 'cyan',
      value: summary.resolutionRateLabel,
    },
  ]

  return (
    <>
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

      <DashboardSection
        className="mb-6"
        title="Ticket Status Distribution"
        icon={<PieChartIcon size={16} className="text-blue-400" />}
        action={
          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-200">
            Top: {isLoading ? 'Loading...' : summary.topStatusLabel}
          </span>
        }
        bodyClassName="border-t border-[#2d282b] p-5"
      >
        {isLoading ? (
          <div className="flex min-h-[320px] items-center justify-center text-sm font-semibold text-[#8fa0bd]">
            Loading ticket status analysis...
          </div>
        ) : summary.chartRows.length ? (
          <div className="grid items-center gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            <div className="relative mx-auto h-[280px] w-full max-w-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={summary.chartRows}
                    dataKey="totalTickets"
                    innerRadius={72}
                    outerRadius={108}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {summary.chartRows.map((item) => (
                      <Cell key={item.id} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<TicketStatusTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#8fa0bd]">Tickets</span>
                <span className="mt-2 text-3xl font-bold text-white">{summary.totalTicketsLabel}</span>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {summary.chartRows.map((item) => (
                <article key={item.id} className="rounded-lg border border-[#332d30] bg-[#171314] p-4">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">{item.statusLabel}</p>
                      <p className="mt-1 text-xs font-medium text-[#8fa0bd]">{item.shareLabel} of total tickets</p>
                    </div>
                    <span className="text-sm font-bold text-blue-200">{item.totalTicketsLabel}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex min-h-[320px] items-center justify-center text-sm font-semibold text-[#8fa0bd]">
            No ticket status data found.
          </div>
        )}
      </DashboardSection>
    </>
  )
}
