import { CircleDollarSign, Layers3, PieChart as PieChartIcon, Sigma, Trophy } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { DashboardMetricCard } from '../../../components/ui/DashboardMetricCard'
import { DashboardSection } from '../../../components/ui/DashboardSection'
import { formatOverallSalesCurrency } from '../utils/overallSalesReportUtils'

function OverallSalesTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null
  }

  const item = payload[0]?.payload

  return (
    <div className="rounded-md border border-[#332d30] bg-[#171314] px-3 py-2 text-xs font-bold text-white shadow-lg">
      <p className="mb-2">{item?.source}</p>
      <div className="flex min-w-[180px] justify-between gap-4">
        <span className="text-[#9fb2d0]">Sales</span>
        <span>{formatOverallSalesCurrency(item?.totalAmount)}</span>
      </div>
      <div className="mt-1 flex justify-between gap-4">
        <span className="text-[#9fb2d0]">Share</span>
        <span>{item?.shareLabel}</span>
      </div>
    </div>
  )
}

export function OverallSalesOverview({ isLoading, summary }) {
  const metricItems = [
    {
      icon: CircleDollarSign,
      label: 'Total Sales',
      tone: 'blue',
      value: summary.totalSalesLabel,
    },
    {
      icon: Layers3,
      label: 'Sales Sources',
      tone: 'emerald',
      value: summary.totalSourcesLabel,
    },
    {
      icon: Trophy,
      label: 'Top Source',
      tone: 'amber',
      value: summary.topSourceName,
    },
    {
      icon: Sigma,
      label: 'Average per Source',
      tone: 'cyan',
      value: summary.averageSourceSalesLabel,
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
        title="Sales Distribution by Source"
        icon={<PieChartIcon size={16} className="text-blue-400" />}
        action={
          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-200">
            Top: {isLoading ? 'Loading...' : summary.topSourceLabel}
          </span>
        }
        bodyClassName="border-t border-[#2d282b] p-5"
      >
        {isLoading ? (
          <div className="flex min-h-[340px] items-center justify-center text-sm font-semibold text-[#8fa0bd]">
            Loading overall sales analysis...
          </div>
        ) : summary.chartRows.length ? (
          <div className="grid items-center gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            <div className="relative mx-auto h-[280px] w-full max-w-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={summary.chartRows}
                    dataKey="value"
                    innerRadius={72}
                    outerRadius={108}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {summary.chartRows.map((item) => (
                      <Cell key={item.id} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<OverallSalesTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#8fa0bd]">Collected</span>
                <span className="mt-2 px-5 text-center text-xl font-bold text-white">
                  {summary.totalSalesLabel}
                </span>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {summary.chartRows.map((item) => (
                <article key={item.id} className="rounded-lg border border-[#332d30] bg-[#171314] p-4">
                  <div className="flex items-start gap-3">
                    <span
                      className="mt-1 h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">{item.source}</p>
                      <p className="mt-1 text-xs font-medium text-[#8fa0bd]">{item.shareLabel} of total sales</p>
                    </div>
                    <span className="text-sm font-bold text-blue-200">{item.totalAmountLabel}</span>
                  </div>

                  <div className="mt-3 h-2 rounded-full bg-[#231f21]">
                    <div
                      className="h-2 rounded-full"
                      style={{ backgroundColor: item.color, width: item.progressWidth }}
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex min-h-[340px] items-center justify-center text-sm font-semibold text-[#8fa0bd]">
            No overall sales data found.
          </div>
        )}
      </DashboardSection>
    </>
  )
}
