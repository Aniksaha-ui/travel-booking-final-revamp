import { Layers, UserRound, Users, UserPlus, CircleAlert } from 'lucide-react'
import { GrowthTimeline } from '../../components/charts/GrowthTimeline'
import { SourceChart } from '../../components/charts/SourceChart'
import { DashboardMetricCard } from '../../components/ui/DashboardMetricCard'
import { DashboardSection } from '../../components/ui/DashboardSection'
import { ListCard } from '../../components/ui/ListCard'
import {
  crmStats,
  growthMonths,
  inactiveAccounts,
  recentlyAdded,
  sources,
} from '../../data/crmDashboardData'

function HeaderAction({ active = false, icon: Icon, children }) {
  return (
    <button
      className={`inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium transition ${
        active
          ? 'border-blue-600 bg-blue-600 text-white hover:bg-blue-500'
          : 'border-[#332d30] bg-[#231f21] text-white hover:bg-[#2a2528]'
      }`}
    >
      <Icon size={16} />
      {children}
    </button>
  )
}

export default function Dashboard() {
  return (
    <main className="min-h-full bg-[#100d0e] px-6 py-7 text-white sm:px-8">
      <div className="mx-auto max-w-[1920px]">
        <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 className="text-2xl font-bold leading-none text-white">CRM Dashboard</h1>
            <p className="mt-3 text-sm text-[#b4c5df]">Overview of your relationships</p>
          </div>

          <div className="flex items-center gap-3">
            <HeaderAction icon={UserRound}>Accounts</HeaderAction>
            <HeaderAction icon={Users} active>
              Contacts
            </HeaderAction>
          </div>
        </header>

        <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {crmStats.slice(0, 4).map((stat) => (
            <DashboardMetricCard key={stat.label} {...stat} />
          ))}
          <DashboardMetricCard {...crmStats[4]} />
        </section>

        <section className="mb-7 grid grid-cols-1 gap-7 xl:grid-cols-[2fr_0.975fr]">
          <DashboardSection
            title="Growth (Last 12 Months)"
            className="min-h-[365px]"
            bodyClassName="h-[315px]"
          >
            <GrowthTimeline months={growthMonths} />
          </DashboardSection>

          <DashboardSection
            title="By Source"
            className="min-h-[365px]"
            bodyClassName="pt-2"
          >
            <SourceChart data={sources} />
          </DashboardSection>
        </section>

        <section className="grid grid-cols-1 gap-7 xl:grid-cols-2">
          <DashboardSection
            title="Recently Added"
            icon={<UserPlus size={16} className="text-emerald-400" />}
            action={<button className="text-xs font-medium text-blue-500 hover:text-blue-400">View all</button>}
            className="overflow-hidden"
          >
            <ListCard items={recentlyAdded} />
          </DashboardSection>

          <DashboardSection
            title="No Activity (30+ Days)"
            icon={<CircleAlert size={16} className="text-amber-400" />}
            action={<button className="text-xs font-medium text-blue-500 hover:text-blue-400">View all</button>}
            className="overflow-hidden"
          >
            <ListCard items={inactiveAccounts} />
          </DashboardSection>
        </section>
      </div>

      <button
        className="fixed bottom-20 right-7 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500"
        aria-label="Layers"
      >
        <Layers size={21} />
      </button>
    </main>
  )
}
