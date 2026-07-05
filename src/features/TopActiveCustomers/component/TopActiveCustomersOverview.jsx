import { Activity, Building2, PackageCheck, PlaneTakeoff, Trophy, Users } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { DashboardMetricCard } from '../../../components/ui/DashboardMetricCard'
import { DashboardSection } from '../../../components/ui/DashboardSection'

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null
  }

  const item = payload[0]?.payload

  return (
    <div className="min-w-[200px] rounded-lg border border-[#332d30] bg-[#171314] px-4 py-3 text-xs shadow-2xl">
      <p className="mb-2 font-bold text-white">{item?.customerName}</p>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[#b4c5df]">Activity Score</span>
        <span className="font-semibold text-white">{item?.activityScoreLabel ?? '0'}</span>
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

export function TopActiveCustomersOverview({ isLoading, summary }) {
  const metricItems = [
    {
      icon: Activity,
      label: 'Total Activity',
      tone: 'emerald',
      value: summary.totalActivityLabel,
    },
    {
      icon: Trophy,
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
      icon: PlaneTakeoff,
      label: 'Visa Applications',
      tone: 'cyan',
      value: summary.totalVisaApplicationsLabel,
    },
  ]

  return (
    <>
      <section className="month-balance-summary-grid" aria-label="Top active customers summary">
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
          title="Activity Ranking"
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
            <EmptyState message="Loading customer activity..." />
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
                  <Tooltip cursor={{ fill: 'rgb(255 255 255 / 0.03)' }} content={<ChartTooltip />} />
                  <Bar dataKey="activityScore" name="Activity Score" fill="#34d399" radius={[0, 8, 8, 0]} maxBarSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState message="No customer activity data is available." />
          )}
        </DashboardSection>

        <DashboardSection
          title="Activity Mix"
          icon={<PackageCheck size={16} className="text-cyan-400" />}
          bodyClassName="border-t border-[#2d282b]"
        >
          {isLoading ? (
            <EmptyState message="Preparing activity mix..." />
          ) : (
            <div className="divide-y divide-[#2d282b]">
              <div className="flex items-center justify-between gap-3 px-5 py-4">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#b4c5df]">
                  <Activity size={15} /> Bookings
                </span>
                <span className="text-lg font-bold text-white">{summary.totalBookingsLabel}</span>
              </div>
              <div className="flex items-center justify-between gap-3 px-5 py-4">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#b4c5df]">
                  <Building2 size={15} /> Hotel Bookings
                </span>
                <span className="text-lg font-bold text-white">{summary.totalHotelBookingsLabel}</span>
              </div>
              <div className="flex items-center justify-between gap-3 px-5 py-4">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#b4c5df]">
                  <PackageCheck size={15} /> Package Bookings
                </span>
                <span className="text-lg font-bold text-white">{summary.totalPackageBookingsLabel}</span>
              </div>
              <div className="flex items-center justify-between gap-3 px-5 py-4">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#b4c5df]">
                  <PlaneTakeoff size={15} /> Visa Applications
                </span>
                <span className="text-lg font-bold text-white">{summary.totalVisaApplicationsLabel}</span>
              </div>
            </div>
          )}
        </DashboardSection>
      </section>
    </>
  )
}
