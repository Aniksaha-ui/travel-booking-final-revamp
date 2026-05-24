import { Armchair, BarChart3, BusFront, LayoutGrid } from 'lucide-react'
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
import {
  buildVehicleWiseSeatMetrics,
  formatCompactCount,
} from '../utils/vehicleWiseSeatReportUtils'

const barColors = ['#60a5fa', '#34d399', '#f59e0b', '#a78bfa', '#f472b6', '#22d3ee', '#fb7185', '#4ade80']

function CapacityTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null
  }

  const row = payload[0]?.payload

  return (
    <div className="min-w-[180px] rounded-lg border border-[#332d30] bg-[#171314] px-4 py-3 text-xs shadow-2xl">
      <p className="mb-3 font-bold text-white">{row?.label ?? label}</p>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[#b4c5df]">Vehicle Type</span>
          <span className="font-semibold text-white">{row?.type ?? '-'}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[#b4c5df]">Seats</span>
          <span className="font-semibold text-white">{payload[0].value}</span>
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

export function VehicleWiseSeatReportOverview({ isLoading, rows }) {
  const metrics = useMemo(() => buildVehicleWiseSeatMetrics(rows), [rows])

  const summaryItems = [
    {
      icon: BusFront,
      label: 'Vehicles in View',
      tone: 'blue',
      value: metrics.totalVehiclesLabel,
    },
    {
      icon: Armchair,
      label: 'Registered Seats',
      tone: 'emerald',
      value: metrics.totalSeatsLabel,
    },
    {
      icon: BarChart3,
      label: 'Average Seats / Vehicle',
      tone: 'amber',
      value: metrics.averageSeatsPerVehicleLabel,
    },
    {
      icon: LayoutGrid,
      label: 'Vehicle Types',
      tone: 'cyan',
      value: metrics.uniqueVehicleTypesLabel,
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
          title="Seat Capacity by Vehicle"
          icon={<BarChart3 size={16} className="text-blue-400" />}
          action={
            <span className="rounded-full border border-[#332d30] bg-[#171314] px-2.5 py-1 text-[11px] font-bold text-[#9fb2d0]">
              Top {metrics.chartItems.length} by seats
            </span>
          }
          bodyClassName="border-t border-[#2d282b] p-5"
        >
          {isLoading ? (
            <EmptyState message="Loading fleet capacity..." />
          ) : metrics.chartItems.length ? (
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.chartItems} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#2d282b" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    axisLine={false}
                    dataKey="shortLabel"
                    tick={{ fill: '#8fa0bd', fontSize: 11 }}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tick={{ fill: '#8fa0bd', fontSize: 11 }}
                    tickLine={false}
                    width={36}
                  />
                  <Tooltip cursor={{ fill: 'rgb(255 255 255 / 0.03)' }} content={<CapacityTooltip />} />
                  <Bar dataKey="seatCapacity" radius={[8, 8, 0, 0]}>
                    {metrics.chartItems.map((item, index) => (
                      <Cell key={item.key} fill={barColors[index % barColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState message="No vehicle seat capacity is available yet." />
          )}
        </DashboardSection>

        <DashboardSection
          title="Fleet Snapshot"
          icon={<BusFront size={16} className="text-emerald-400" />}
          bodyClassName="border-t border-[#2d282b]"
        >
          {isLoading ? (
            <EmptyState message="Preparing the fleet snapshot..." />
          ) : (
            <div className="divide-y divide-[#2d282b]">
              <article className="px-5 py-4">
                <p className="text-[11px] font-bold uppercase text-[#7ea1ff]">Highest Capacity</p>
                <p className="mt-2 text-sm font-semibold text-white">{metrics.highestCapacityVehicleLabel}</p>
              </article>
              <article className="px-5 py-4">
                <p className="text-[11px] font-bold uppercase text-[#7ea1ff]">Vehicle Type Mix</p>
                <div className="mt-3 space-y-3">
                  {metrics.typeDistribution.length ? (
                    metrics.typeDistribution.map((item) => (
                      <div key={item.label} className="flex items-center justify-between gap-4 text-sm">
                        <span className="text-[#d5e1f4]">{item.label}</span>
                        <span className="font-semibold text-white">{formatCompactCount(item.count)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-[#8fa0bd]">No vehicle type distribution is available.</p>
                  )}
                </div>
              </article>
            </div>
          )}
        </DashboardSection>
      </section>
    </>
  )
}
