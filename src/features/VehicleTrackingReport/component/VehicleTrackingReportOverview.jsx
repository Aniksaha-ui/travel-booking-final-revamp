import { Activity, BusFront, CalendarRange, Route } from 'lucide-react'
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
import { buildVehicleTrackingMetrics } from '../utils/vehicleTrackingReportUtils'

const barColors = ['#60a5fa', '#34d399', '#f59e0b', '#a78bfa', '#22d3ee', '#fb7185', '#4ade80', '#f97316']

function TrackingLoadTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null
  }

  const item = payload[0]?.payload

  return (
    <div className="min-w-[180px] rounded-lg border border-[#332d30] bg-[#171314] px-4 py-3 text-xs shadow-2xl">
      <p className="mb-3 font-bold text-white">{item?.label ?? label}</p>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[#b4c5df]">Assignments</span>
          <span className="font-semibold text-white">{item?.assignments ?? 0}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[#b4c5df]">Tracked Days</span>
          <span className="font-semibold text-white">{item?.totalDaysLabel ?? '0 days'}</span>
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

export function VehicleTrackingReportOverview({ isLoading, rows }) {
  const metrics = useMemo(() => buildVehicleTrackingMetrics(rows), [rows])

  const summaryItems = [
    {
      icon: Activity,
      label: 'Assignments in View',
      tone: 'blue',
      value: metrics.totalAssignmentsLabel,
    },
    {
      icon: BusFront,
      label: 'Vehicles Scheduled',
      tone: 'emerald',
      value: metrics.uniqueVehiclesLabel,
    },
    {
      icon: Route,
      label: 'Trips Covered',
      tone: 'amber',
      value: metrics.uniqueTripsLabel,
    },
    {
      icon: CalendarRange,
      label: 'Active Today',
      tone: 'cyan',
      value: metrics.activeCountLabel,
    },
  ]

  const snapshotItems = [
    {
      eyebrow: 'Coverage Window',
      tone: 'neutral',
      value: metrics.coverageWindowLabel,
    },
    {
      eyebrow: 'Busiest Vehicle',
      tone: 'positive',
      value: metrics.busiestVehicleLabel,
    },
    {
      eyebrow: 'Longest Assignment',
      tone: 'neutral',
      value: metrics.longestAssignmentLabel,
    },
    {
      eyebrow: 'Schedule Mix',
      tone: 'neutral',
      value: `${metrics.scheduledCountLabel} scheduled • ${metrics.activeCountLabel} active • ${metrics.completedCountLabel} completed`,
    },
  ]

  const snapshotToneClasses = {
    neutral: 'text-white',
    positive: 'text-emerald-300',
  }

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
          title="Assignment Load by Vehicle"
          icon={<BusFront size={16} className="text-blue-400" />}
          action={
            <span className="rounded-full border border-[#332d30] bg-[#171314] px-2.5 py-1 text-[11px] font-bold text-[#9fb2d0]">
              Top {metrics.chartItems.length} vehicles
            </span>
          }
          bodyClassName="border-t border-[#2d282b] p-5"
        >
          {isLoading ? (
            <EmptyState message="Loading tracking load..." />
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
                  <Tooltip cursor={{ fill: 'rgb(255 255 255 / 0.03)' }} content={<TrackingLoadTooltip />} />
                  <Bar dataKey="assignments" radius={[8, 8, 0, 0]}>
                    {metrics.chartItems.map((item, index) => (
                      <Cell key={item.key} fill={barColors[index % barColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState message="No vehicle assignments are available for this range." />
          )}
        </DashboardSection>

        <DashboardSection
          title="Operations Snapshot"
          icon={<CalendarRange size={16} className="text-emerald-400" />}
          bodyClassName="border-t border-[#2d282b]"
        >
          {isLoading ? (
            <EmptyState message="Preparing the latest assignment snapshot..." />
          ) : (
            <div className="divide-y divide-[#2d282b]">
              {snapshotItems.map((item) => (
                <article key={item.eyebrow} className="px-5 py-4">
                  <p className="text-[11px] font-bold uppercase text-[#7ea1ff]">{item.eyebrow}</p>
                  <p className={`mt-2 text-sm font-semibold ${snapshotToneClasses[item.tone]}`}>{item.value}</p>
                </article>
              ))}
            </div>
          )}
        </DashboardSection>
      </section>
    </>
  )
}
