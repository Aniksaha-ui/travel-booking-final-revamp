import { Activity, CalendarClock, Clock3, RefreshCcw, Users } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { DashboardMetricCard } from '../../../components/ui/DashboardMetricCard'
import { DashboardSection } from '../../../components/ui/DashboardSection'

function FrequencyTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null
  }

  const item = payload[0]?.payload

  return (
    <div className="min-w-[200px] rounded-lg border border-[#332d30] bg-[#171314] px-4 py-3 text-xs shadow-2xl">
      <p className="mb-2 font-bold text-white">{item?.customerName}</p>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[#b4c5df]">Bookings</span>
        <span className="font-semibold text-white">{item?.bookingCountLabel ?? '0'}</span>
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

export function BookingFrequencyOverview({ isLoading, summary }) {
  const metricItems = [
    {
      icon: RefreshCcw,
      label: 'Total Bookings',
      tone: 'emerald',
      value: summary.totalBookingsLabel,
    },
    {
      icon: Activity,
      label: 'Top Customer',
      tone: 'amber',
      value: summary.topCustomerLabel,
    },
    {
      icon: Users,
      label: 'Customers in View',
      tone: 'blue',
      value: summary.totalCustomersLabel,
    },
    {
      icon: Clock3,
      label: 'Average Bookings',
      tone: 'cyan',
      value: summary.averageBookingsLabel,
    },
  ]

  return (
    <>
      <section className="month-balance-summary-grid" aria-label="Booking frequency summary">
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

      <section className="mb-6 grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)] mt-4">
        <DashboardSection
          title="Top Booking Frequency"
          icon={<Activity size={16} className="text-emerald-400" />}
          action={
            <span className="rounded-full border border-[#332d30] bg-[#171314] px-2.5 py-1 text-[11px] font-bold text-[#9fb2d0]">
              Top {summary.chartItems.length || 0}
            </span>
          }
          className="min-w-0"
          bodyClassName="border-t border-[#2d282b] p-5"
        >
          {isLoading ? (
            <EmptyState message="Loading booking frequency..." />
          ) : summary.chartItems.length ? (
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.chartItems} layout="vertical" margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#2d282b" strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#8fa0bd', fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="shortName"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#8fa0bd', fontSize: 11 }}
                    width={120}
                  />
                  <Tooltip cursor={{ fill: 'rgb(255 255 255 / 0.03)' }} content={<FrequencyTooltip />} />
                  <Bar dataKey="bookingCount" name="Bookings" fill="#34d399" radius={[0, 8, 8, 0]} maxBarSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState message="No booking frequency data is available." />
          )}
        </DashboardSection>

        <DashboardSection
          title="Activity Span"
          icon={<CalendarClock size={16} className="text-cyan-400" />}
          bodyClassName="border-t border-[#2d282b]"
        >
          {isLoading ? (
            <EmptyState message="Preparing customer activity span..." />
          ) : (
            <div className="divide-y divide-[#2d282b]">
              <div className="px-5 py-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#7ea1ff]">Longest Active Customer</p>
                <p className="mt-2 text-base font-bold text-white">{summary.longestActiveCustomerLabel}</p>
              </div>
              <div className="px-5 py-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#7ea1ff]">Total Active Days</p>
                <p className="mt-2 text-base font-bold text-white">{summary.totalActiveDaysLabel}</p>
              </div>
            </div>
          )}
        </DashboardSection>
      </section>
    </>
  )
}
