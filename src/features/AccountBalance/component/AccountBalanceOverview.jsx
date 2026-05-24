import { BarChart3, Landmark, PieChart as PieChartIcon, Wallet } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { DashboardMetricCard } from '../../../components/ui/DashboardMetricCard'
import { DashboardSection } from '../../../components/ui/DashboardSection'

function TooltipCard({ active, label, payload }) {
  if (!active || !payload?.length) {
    return null
  }

  const item = payload[0]?.payload

  return (
    <div className="min-w-[200px] rounded-lg border border-[#332d30] bg-[#171314] px-4 py-3 text-xs shadow-2xl">
      <p className="mb-3 font-bold text-white">{item?.accountName ?? label ?? item?.label}</p>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[#b4c5df]">Amount</span>
          <span className="font-semibold text-white">{item?.amountLabel ?? 'BDT 0.00'}</span>
        </div>
        {item?.countLabel ? (
          <div className="flex items-center justify-between gap-3">
            <span className="text-[#b4c5df]">Accounts</span>
            <span className="font-semibold text-white">{item.countLabel}</span>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function renderEmptyState(message) {
  return (
    <div className="flex min-h-[280px] items-center justify-center px-5 py-8 text-center text-sm font-medium text-[#8fa0bd]">
      {message}
    </div>
  )
}

export function AccountBalanceOverview({ isLoading, metrics }) {
  const metricItems = [
    {
      icon: Landmark,
      label: 'Accounts in View',
      tone: 'blue',
      value: metrics.totalAccountsLabel,
    },
    {
      icon: Wallet,
      label: 'Tracked Balance',
      tone: 'cyan',
      value: metrics.totalAmountLabel,
    },
    {
      icon: PieChartIcon,
      label: 'Account Types',
      tone: 'amber',
      value: metrics.totalTypesLabel,
    },
    {
      icon: BarChart3,
      label: 'Largest Balance',
      tone: 'emerald',
      value: metrics.largestAccountAmountLabel,
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

      <section className="mb-6 grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)]">
        <DashboardSection
          title="Balance by Account"
          icon={<BarChart3 size={16} className="text-blue-400" />}
          action={
            <span className="rounded-full border border-[#332d30] bg-[#171314] px-2.5 py-1 text-[11px] font-bold text-[#9fb2d0]">
              Largest: {isLoading ? 'Loading...' : metrics.largestAccountNameLabel}
            </span>
          }
          bodyClassName="border-t border-[#2d282b] p-5"
        >
          {isLoading ? (
            renderEmptyState('Loading account balance distribution...')
          ) : metrics.accountChartItems.length ? (
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metrics.accountChartItems}
                  layout="vertical"
                  margin={{ top: 8, right: 12, left: 24, bottom: 0 }}
                >
                  <CartesianGrid stroke="#2d282b" strokeDasharray="3 3" horizontal={false} />
                  <XAxis axisLine={false} tick={{ fill: '#8fa0bd', fontSize: 11 }} tickLine={false} type="number" />
                  <YAxis
                    axisLine={false}
                    dataKey="accountName"
                    tick={{ fill: '#8fa0bd', fontSize: 11 }}
                    tickLine={false}
                    type="category"
                    width={140}
                  />
                  <Tooltip cursor={{ fill: 'rgb(255 255 255 / 0.03)' }} content={<TooltipCard />} />
                  <Bar dataKey="amount" fill="#4f83ff" radius={[0, 8, 8, 0]} maxBarSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            renderEmptyState('No account balances are available for this view.')
          )}
        </DashboardSection>

        <DashboardSection
          title="Type Mix"
          icon={<PieChartIcon size={16} className="text-emerald-400" />}
          action={
            <span className="rounded-full border border-[#332d30] bg-[#171314] px-2.5 py-1 text-[11px] font-bold text-[#9fb2d0]">
              Dominant: {isLoading ? 'Loading...' : metrics.dominantTypeLabel}
            </span>
          }
          bodyClassName="border-t border-[#2d282b] p-5"
        >
          {isLoading ? (
            renderEmptyState('Loading account type mix...')
          ) : metrics.typeChartItems.length ? (
            <div className="grid gap-5">
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={metrics.typeChartItems}
                      cx="50%"
                      cy="50%"
                      dataKey="amount"
                      innerRadius={56}
                      outerRadius={92}
                      paddingAngle={3}
                    >
                      {metrics.typeChartItems.map((item) => (
                        <Cell key={item.key} fill={item.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<TooltipCard />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid gap-3">
                {metrics.typeChartItems.map((item) => (
                  <article key={item.key} className="rounded-lg border border-[#332d30] bg-[#171314] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm font-semibold text-white">{item.label}</span>
                      </div>
                      <span className="text-sm font-bold text-[#c5d9f7]">{item.amountLabel}</span>
                    </div>
                    <p className="mt-2 text-xs font-medium text-[#8fa0bd]">{item.countLabel} linked accounts</p>
                  </article>
                ))}
              </div>
            </div>
          ) : (
            renderEmptyState('No account type breakdown is available for this view.')
          )}
        </DashboardSection>
      </section>
    </>
  )
}
