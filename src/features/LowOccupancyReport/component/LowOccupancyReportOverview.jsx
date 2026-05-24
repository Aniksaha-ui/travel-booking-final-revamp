import { AlertTriangle, BarChart3, CalendarRange, Users } from 'lucide-react'
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
import { buildLowOccupancyMetrics } from '../utils/lowOccupancyReportUtils'

function OccupancyTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null
  }

  const row = payload[0]?.payload

  return (
    <div className="min-w-[180px] rounded-lg border border-[#332d30] bg-[#171314] px-4 py-3 text-xs shadow-2xl">
      <p className="mb-3 font-bold text-white">{row?.tripName ?? label}</p>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[#b4c5df]">Occupancy</span>
          <span className="font-semibold text-white">{row?.occupancyRateLabel ?? '0%'}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[#b4c5df]">Open Seats</span>
          <span className="font-semibold text-white">{row?.openSeatsLabel ?? '0'}</span>
        </div>
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

export function LowOccupancyReportOverview({ isLoading, rows }) {
  const metrics = useMemo(() => buildLowOccupancyMetrics(rows), [rows])

  const summaryItems = [
    {
      icon: AlertTriangle,
      label: 'Flagged Trips',
      tone: 'amber',
      value: metrics.flaggedTripsLabel,
    },
    {
      icon: Users,
      label: 'Open Seats',
      tone: 'blue',
      value: metrics.openSeatVolumeLabel,
    },
    {
      icon: BarChart3,
      label: 'Average Occupancy',
      tone: 'emerald',
      value: metrics.averageOccupancyLabel,
    },
    {
      icon: CalendarRange,
      label: 'Booked Seats',
      tone: 'cyan',
      value: metrics.totalBookedSeatsLabel,
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
          title="Occupancy Rate by Trip"
          icon={<BarChart3 size={16} className="text-blue-400" />}
          action={
            <span className="rounded-full border border-[#332d30] bg-[#171314] px-2.5 py-1 text-[11px] font-bold text-[#9fb2d0]">
              {metrics.chartItems.length} upcoming trips
            </span>
          }
          bodyClassName="border-t border-[#2d282b] p-5"
        >
          {isLoading ? (
            <EmptyState message="Loading low occupancy analysis..." />
          ) : metrics.chartItems.length ? (
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metrics.chartItems}
                  layout="vertical"
                  margin={{ top: 8, right: 18, left: 12, bottom: 0 }}
                >
                  <CartesianGrid stroke="#2d282b" strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis
                    axisLine={false}
                    tick={{ fill: '#8fa0bd', fontSize: 11 }}
                    tickFormatter={(value) => `${value}%`}
                    tickLine={false}
                    type="number"
                  />
                  <YAxis
                    axisLine={false}
                    dataKey="shortLabel"
                    tick={{ fill: '#8fa0bd', fontSize: 11 }}
                    tickLine={false}
                    type="category"
                    width={110}
                  />
                  <Tooltip cursor={{ fill: 'rgb(255 255 255 / 0.03)' }} content={<OccupancyTooltip />} />
                  <Bar dataKey="occupancyRate" radius={[0, 8, 8, 0]} maxBarSize={22}>
                    {metrics.chartItems.map((item) => (
                      <Cell
                        key={item.id}
                        fill={
                          item.severity === 'critical'
                            ? '#ef4444'
                            : item.severity === 'warning'
                              ? '#f59e0b'
                              : '#60a5fa'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState message="No low occupancy trips are currently identified." />
          )}
        </DashboardSection>

        <DashboardSection
          title="Action Snapshot"
          icon={<AlertTriangle size={16} className="text-amber-300" />}
          bodyClassName="border-t border-[#2d282b]"
        >
          {isLoading ? (
            <EmptyState message="Preparing occupancy watchlist..." />
          ) : (
            <div className="divide-y divide-[#2d282b]">
              <article className="px-5 py-4">
                <p className="text-[11px] font-bold uppercase text-[#7ea1ff]">Worst Occupancy</p>
                <p className="mt-2 text-sm font-semibold text-rose-300">{metrics.worstTripLabel}</p>
              </article>
              <article className="px-5 py-4">
                <p className="text-[11px] font-bold uppercase text-[#7ea1ff]">Nearest Departure</p>
                <p className="mt-2 text-sm font-semibold text-white">{metrics.nearestDepartureLabel}</p>
              </article>
              <article className="px-5 py-4">
                <p className="text-[11px] font-bold uppercase text-[#7ea1ff]">Open Seat Volume</p>
                <p className="mt-2 text-sm font-semibold text-white">{metrics.openSeatVolumeLabel}</p>
              </article>
              <article className="px-5 py-4">
                <p className="text-[11px] font-bold uppercase text-[#7ea1ff]">Tracked Capacity</p>
                <p className="mt-2 text-sm font-semibold text-white">{metrics.totalCapacityLabel}</p>
              </article>
            </div>
          )}
        </DashboardSection>
      </section>
    </>
  )
}
