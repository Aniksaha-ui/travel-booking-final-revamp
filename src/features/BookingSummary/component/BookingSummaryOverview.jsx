import { BarChart3, BookOpenCheck, Layers3, Trophy } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { DashboardMetricCard } from '../../../components/ui/DashboardMetricCard'
import { DashboardSection } from '../../../components/ui/DashboardSection'

function BookingSummaryTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null
  }

  const item = payload[0]?.payload

  return (
    <div className="rounded-md border border-[#332d30] bg-[#171314] px-3 py-2 text-xs font-bold text-white shadow-lg">
      {item?.label}: {item?.value}
    </div>
  )
}

export function BookingSummaryOverview({ isLoading, summary }) {
  const metricItems = [
    {
      icon: BookOpenCheck,
      label: 'Total Bookings',
      tone: 'blue',
      value: summary.totalBookingsLabel,
    },
    {
      icon: Layers3,
      label: 'Booking Types',
      tone: 'emerald',
      value: summary.totalTypesLabel,
    },
    {
      icon: Trophy,
      label: 'Highest Booking Type',
      tone: 'amber',
      value: summary.highestBookingTypeLabel,
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
        title="Booking Mix"
        icon={<BarChart3 size={16} className="text-blue-400" />}
        bodyClassName="border-t border-[#2d282b] p-5"
      >
        {isLoading ? (
          <div className="flex min-h-[260px] items-center justify-center text-sm font-semibold text-[#8fa0bd]">
            Loading booking summary...
          </div>
        ) : summary.chartRows.length ? (
          <div className="grid items-center gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
            <div className="relative mx-auto h-[240px] w-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={summary.chartRows}
                    dataKey="value"
                    innerRadius={70}
                    outerRadius={108}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {summary.chartRows.map((item) => (
                      <Cell key={item.label} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<BookingSummaryTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-semibold text-[#8fa0bd]">Total</span>
                <span className="text-3xl font-bold text-white">{summary.totalBookingsLabel}</span>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {summary.chartRows.map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-lg border border-[#332d30] bg-[#171314] px-4 py-3">
                  <span className="h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: item.color }} />
                  <span className="truncate text-sm font-semibold text-[#c5d9f7]">{item.label}</span>
                  <span className="ml-auto text-sm font-bold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex min-h-[260px] items-center justify-center text-sm font-semibold text-[#8fa0bd]">
            No booking summary data found.
          </div>
        )}
      </DashboardSection>
    </>
  )
}
