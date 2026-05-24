import { BarChart3, CircleDollarSign, Route, Ticket, Trophy } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { DashboardMetricCard } from '../../../components/ui/DashboardMetricCard'
import { DashboardSection } from '../../../components/ui/DashboardSection'
import { formatRouteWiseSalesCurrency } from '../utils/routeWiseSalesReportUtils'

function RouteWiseSalesTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null
  }

  const item = payload[0]?.payload

  return (
    <div className="rounded-md border border-[#332d30] bg-[#171314] px-3 py-2 text-xs font-bold text-white shadow-lg">
      <p className="mb-2">{item?.routeName}</p>
      <div className="flex min-w-[180px] justify-between gap-4">
        <span className="text-[#9fb2d0]">Revenue</span>
        <span>{formatRouteWiseSalesCurrency(item?.totalRevenue)}</span>
      </div>
      <div className="mt-1 flex justify-between gap-4">
        <span className="text-[#9fb2d0]">Bookings</span>
        <span>{item?.totalBookingsLabel}</span>
      </div>
    </div>
  )
}

export function RouteWiseSalesOverview({ isLoading, summary }) {
  const metricItems = [
    {
      icon: Ticket,
      label: 'Total Bookings',
      tone: 'blue',
      value: summary.totalBookingsLabel,
    },
    {
      icon: CircleDollarSign,
      label: 'Total Revenue',
      tone: 'emerald',
      value: summary.totalRevenueLabel,
    },
    {
      icon: Trophy,
      label: 'Top Route',
      tone: 'amber',
      value: summary.topRouteName,
    },
    {
      icon: Route,
      label: 'Routes Covered',
      tone: 'cyan',
      value: summary.totalRoutesLabel,
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
        title="Revenue by Route"
        icon={<BarChart3 size={16} className="text-blue-400" />}
        action={
          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-200">
            Top: {isLoading ? 'Loading...' : summary.topRouteLabel}
          </span>
        }
        bodyClassName="border-t border-[#2d282b] p-5"
      >
        {isLoading ? (
          <div className="flex min-h-[360px] items-center justify-center text-sm font-semibold text-[#8fa0bd]">
            Loading route wise sales analysis...
          </div>
        ) : summary.chartRows.length ? (
          <div className="w-full" style={{ height: `${Math.max(320, summary.chartRows.length * 56)}px` }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.chartRows} layout="vertical" margin={{ top: 12, right: 16, left: 12, bottom: 12 }}>
                <CartesianGrid stroke="#2d282b" strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  axisLine={false}
                  tick={{ fill: '#8fa0bd', fontSize: 12 }}
                  tickFormatter={(value) => `${Math.round(Number(value) || 0)}`}
                  tickLine={false}
                  type="number"
                />
                <YAxis
                  axisLine={false}
                  dataKey="routeName"
                  tick={{ fill: '#c5d9f7', fontSize: 12 }}
                  tickLine={false}
                  type="category"
                  width={180}
                />
                <Tooltip cursor={{ fill: 'rgb(255 255 255 / 0.03)' }} content={<RouteWiseSalesTooltip />} />
                <Bar dataKey="totalRevenue" name="Revenue" radius={[0, 6, 6, 0]} maxBarSize={30}>
                  {summary.chartRows.map((item) => (
                    <Cell key={item.id} fill={item.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex min-h-[360px] items-center justify-center text-sm font-semibold text-[#8fa0bd]">
            No route wise sales data found.
          </div>
        )}
      </DashboardSection>
    </>
  )
}
