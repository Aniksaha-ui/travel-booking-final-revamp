import { AlertTriangle, BarChart3, Package, RefreshCcw, XCircle } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { DashboardMetricCard } from '../../../components/ui/DashboardMetricCard'
import { DashboardSection } from '../../../components/ui/DashboardSection'

function CancellationTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-md border border-[#332d30] bg-[#171314] px-3 py-2 text-xs font-bold text-white shadow-lg">
      <p className="mb-2">{label}</p>
      {payload.map((item) => (
        <div key={item.dataKey} className="flex min-w-[180px] justify-between gap-4">
          <span className="text-[#9fb2d0]">{item.name}</span>
          <span>{item.value}</span>
        </div>
      ))}
    </div>
  )
}

export function HighCancellationPackagesOverview({ isLoading, rows, summary }) {
  const metricItems = [
    {
      icon: Package,
      label: 'Packages',
      tone: 'blue',
      value: summary.totalPackagesLabel,
    },
    {
      icon: BarChart3,
      label: 'Total Bookings',
      tone: 'emerald',
      value: summary.totalBookingsLabel,
    },
    {
      icon: XCircle,
      label: 'Cancellations',
      tone: 'amber',
      value: summary.totalCancellationsLabel,
    },
    {
      icon: RefreshCcw,
      label: 'Average Rate',
      tone: 'cyan',
      value: summary.averageCancellationRateLabel,
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
        title="Bookings vs Cancellations by Package"
        icon={<AlertTriangle size={16} className="text-amber-300" />}
        action={
          <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-[11px] font-bold text-rose-200">
            Highest: {isLoading ? 'Loading...' : summary.highestRiskLabel}
          </span>
        }
        bodyClassName="border-t border-[#2d282b] p-5"
      >
        {isLoading ? (
          <div className="flex min-h-[360px] items-center justify-center text-sm font-semibold text-[#8fa0bd]">
            Loading cancellation analysis...
          </div>
        ) : rows.length ? (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rows} margin={{ top: 20, right: 24, left: 12, bottom: 8 }}>
                <CartesianGrid stroke="#2d282b" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  axisLine={false}
                  dataKey="packageName"
                  hide={rows.length > 5}
                  tick={{ fill: '#8fa0bd', fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis axisLine={false} tick={{ fill: '#8fa0bd', fontSize: 12 }} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgb(255 255 255 / 0.03)' }} content={<CancellationTooltip />} />
                <Bar dataKey="totalBookings" name="Total Bookings" fill="#60a5fa" radius={[6, 6, 0, 0]} />
                <Bar dataKey="cancelledCount" name="Cancelled" fill="#fb7185" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex min-h-[360px] items-center justify-center text-sm font-semibold text-[#8fa0bd]">
            No high cancellation data found.
          </div>
        )}
      </DashboardSection>
    </>
  )
}
