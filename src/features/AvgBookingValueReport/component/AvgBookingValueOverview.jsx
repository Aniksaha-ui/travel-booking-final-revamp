import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BarChart3, Layers3, Sigma, Trophy } from 'lucide-react'
import { DashboardMetricCard } from '../../../components/ui/DashboardMetricCard'
import { DashboardSection } from '../../../components/ui/DashboardSection'
import { formatAverageBookingValue } from '../utils/avgBookingValueReportUtils'

function AverageValueTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null
  }

  const item = payload[0]?.payload

  return (
    <div className="rounded-md border border-[#332d30] bg-[#171314] px-3 py-2 text-xs font-bold text-white shadow-lg">
      {item?.bookingTypeLabel}: {formatAverageBookingValue(item?.averageValue)}
    </div>
  )
}

export function AvgBookingValueOverview({ isLoading, summary }) {
  const metricItems = [
    {
      icon: Sigma,
      label: 'Average Value',
      tone: 'blue',
      value: summary.averageValueLabel,
    },
    {
      icon: Trophy,
      label: 'Highest Type',
      tone: 'amber',
      value: summary.highestTypeLabel,
    },
    {
      icon: Layers3,
      label: 'Booking Types',
      tone: 'emerald',
      value: summary.totalTypesLabel,
    },
  ]

  return (
    <>
      <section className="mb-5 grid gap-3 md:grid-cols-3">
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
        title="Average Booking Value by Type"
        icon={<BarChart3 size={16} className="text-blue-400" />}
        bodyClassName="border-t border-[#2d282b] p-5"
      >
        {isLoading ? (
          <div className="flex min-h-[360px] items-center justify-center text-sm font-semibold text-[#8fa0bd]">
            Loading average booking values...
          </div>
        ) : summary.chartRows.length ? (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.chartRows} margin={{ top: 20, right: 24, left: 12, bottom: 8 }}>
                <CartesianGrid stroke="#2d282b" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  axisLine={false}
                  dataKey="bookingTypeLabel"
                  tick={{ fill: '#8fa0bd', fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis
                  axisLine={false}
                  tick={{ fill: '#8fa0bd', fontSize: 12 }}
                  tickFormatter={(value) => Number(value).toLocaleString('en-US')}
                  tickLine={false}
                />
                <Tooltip cursor={{ fill: 'rgb(255 255 255 / 0.03)' }} content={<AverageValueTooltip />} />
                <Bar dataKey="averageValue" name="Average Booking Value" radius={[6, 6, 0, 0]} maxBarSize={70}>
                  {summary.chartRows.map((item) => (
                    <Cell key={item.id} fill={item.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex min-h-[360px] items-center justify-center text-sm font-semibold text-[#8fa0bd]">
            No average booking value data found.
          </div>
        )}
      </DashboardSection>
    </>
  )
}
