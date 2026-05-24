import { BarChart3, CircleDollarSign, Route, Users } from 'lucide-react'
import { useMemo } from 'react'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { DashboardMetricCard } from '../../../components/ui/DashboardMetricCard'
import { DashboardSection } from '../../../components/ui/DashboardSection'
import { buildTripPerformanceMetrics, formatCurrency } from '../utils/tripPerformanceUtils'

const compactNumberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  notation: 'compact',
})

const formatCompactCurrency = (value) => compactNumberFormatter.format(Number(value) || 0)

function ProfitabilityTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null
  }

  const row = payload[0]?.payload

  return (
    <div className="min-w-[220px] rounded-lg border border-[#332d30] bg-[#171314] px-4 py-3 text-xs shadow-2xl">
      <p className="mb-3 font-bold text-white">{row?.tripName ?? label}</p>
      <div className="space-y-2">
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[#b4c5df]">
              <span
                className={entry.dataKey === 'combinedProfit' ? 'h-[2px] w-3 rounded-full' : 'h-2.5 w-2.5 rounded-sm'}
                style={{ backgroundColor: entry.color }}
              />
              <span>{entry.name}</span>
            </div>
            <span className="font-semibold text-white">{formatCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function EmptyState({ message }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center px-5 py-8 text-center text-sm font-medium text-[#8fa0bd]">
      {message}
    </div>
  )
}

export function TripPerformanceOverview({ isLoading, rows }) {
  const metrics = useMemo(() => buildTripPerformanceMetrics(rows), [rows])

  const summaryItems = [
    {
      icon: Route,
      label: 'Trips in View',
      tone: 'blue',
      value: metrics.totalTripsLabel,
    },
    {
      icon: Users,
      label: 'Booked Seats',
      tone: 'emerald',
      value: metrics.bookedSeatsLabel,
    },
    {
      icon: CircleDollarSign,
      label: 'Total Revenue',
      tone: 'amber',
      value: metrics.totalRevenueLabel,
    },
    {
      icon: BarChart3,
      label: 'Combined Margin',
      tone: 'cyan',
      value: metrics.totalCombinedProfitLabel,
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

      <section className="mb-6 grid gap-4 xl:grid-cols-[minmax(0,1.75fr)_minmax(320px,0.95fr)]">
        <DashboardSection
          title="Revenue, Cost, and Margin by Trip"
          icon={<BarChart3 size={16} className="text-blue-400" />}
          action={
            <span className="rounded-full border border-[#332d30] bg-[#171314] px-2.5 py-1 text-[11px] font-bold text-[#9fb2d0]">
              Top {metrics.chartItems.length} by revenue
            </span>
          }
          className="min-w-0"
          bodyClassName="border-t border-[#2d282b] p-5"
        >
          {isLoading ? (
            <EmptyState message="Loading trip performance summary..." />
          ) : metrics.chartItems.length ? (
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={metrics.chartItems} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#2d282b" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="shortLabel"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#8fa0bd', fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#8fa0bd', fontSize: 11 }}
                    tickFormatter={formatCompactCurrency}
                    width={70}
                  />
                  <Tooltip cursor={{ fill: 'rgb(255 255 255 / 0.03)' }} content={<ProfitabilityTooltip />} />
                  <Bar dataKey="tripIncome" name="Trip Income" fill="#10b981" radius={[6, 6, 0, 0]} barSize={18} />
                  <Bar dataKey="packageIncome" name="Package Income" fill="#60a5fa" radius={[6, 6, 0, 0]} barSize={18} />
                  <Line
                    type="monotone"
                    dataKey="totalCost"
                    name="Total Cost"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, fill: '#f59e0b', stroke: '#100d0e', strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="combinedProfit"
                    name="Combined Margin"
                    stroke="#a78bfa"
                    strokeWidth={2.8}
                    dot={{ r: 3, fill: '#a78bfa', stroke: '#100d0e', strokeWidth: 2 }}
                    activeDot={{ r: 5, fill: '#a78bfa', stroke: '#100d0e', strokeWidth: 2 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState message="No trip performance data is available for this filter." />
          )}
        </DashboardSection>

        <DashboardSection
          title="Performance Snapshot"
          icon={<CircleDollarSign size={16} className="text-emerald-400" />}
          bodyClassName="border-t border-[#2d282b]"
        >
          {isLoading ? (
            <EmptyState message="Preparing trip performance insights..." />
          ) : (
            <div className="divide-y divide-[#2d282b]">
              <article className="px-5 py-4">
                <p className="text-[11px] font-bold uppercase text-[#7ea1ff]">Highest Revenue Trip</p>
                <p className="mt-2 text-sm font-semibold text-white">{metrics.highestRevenueTripLabel}</p>
              </article>
              <article className="px-5 py-4">
                <p className="text-[11px] font-bold uppercase text-[#7ea1ff]">Best Combined Margin</p>
                <p className="mt-2 text-sm font-semibold text-emerald-300">{metrics.bestMarginTripLabel}</p>
              </article>
              <article className="px-5 py-4">
                <p className="text-[11px] font-bold uppercase text-[#7ea1ff]">Average Utilization</p>
                <p className="mt-2 text-sm font-semibold text-white">{metrics.averageUtilizationLabel}</p>
              </article>
              <article className="px-5 py-4">
                <p className="text-[11px] font-bold uppercase text-[#7ea1ff]">Package Revenue Share</p>
                <p className="mt-2 text-sm font-semibold text-white">{metrics.packageContributionRatioLabel}</p>
              </article>
            </div>
          )}
        </DashboardSection>
      </section>
    </>
  )
}
