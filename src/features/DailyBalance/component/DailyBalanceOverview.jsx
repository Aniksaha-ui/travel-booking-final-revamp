import { BarChart3, CalendarClock, LineChart, TrendingDown, TrendingUp } from 'lucide-react'
import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { DashboardSection } from '../../../components/ui/DashboardSection'
import { formatCurrency } from '../service/dailyBalanceService'

const compactNumberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  notation: 'compact',
})

const formatCompactValue = (value) => compactNumberFormatter.format(Number(value) || 0)

function TooltipCard({ active, payload }) {
  if (!active || !payload?.length) {
    return null
  }

  const item = payload[0]?.payload

  return (
    <div className="min-w-[220px] rounded-lg border border-[#332d30] bg-[#171314] px-4 py-3 text-xs shadow-2xl">
      <p className="mb-3 font-bold text-white">{item?.dateLabel}</p>
      <div className="space-y-2">
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[#b4c5df]">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: entry.color }} />
              <span>{entry.name}</span>
            </div>
            <span className="font-semibold text-white">
              {entry.dataKey === 'txCount' ? entry.value : formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function InsightCard({ icon: Icon, label, tone, value }) {
  const toneClasses = {
    amber: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
    blue: 'border-blue-500/20 bg-blue-500/10 text-blue-300',
    emerald: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
    purple: 'border-purple-500/20 bg-purple-500/10 text-purple-300',
  }

  return (
    <article className="rounded-lg border border-[#332d30] bg-[#231f21] p-4">
      <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border ${toneClasses[tone]}`}>
        <Icon size={18} />
      </span>
      <p className="mt-4 text-xs font-semibold text-[#8fa0bd]">{label}</p>
      <p className="mt-2 text-lg font-bold text-white">{value}</p>
    </article>
  )
}

export function DailyBalanceOverview({ isLoading, rows, summary }) {
  const insights = useMemo(() => {
    if (!rows.length) {
      return []
    }

    const peakBalanceDay = rows.reduce((best, row) => (row.balance > best.balance ? row : best))
    const strongestInflowDay = rows.reduce((best, row) =>
      row.totalCredit > best.totalCredit ? row : best,
    )
    const heaviestOutflowDay = rows.reduce((best, row) =>
      row.totalDebit > best.totalDebit ? row : best,
    )

    return [
      {
        icon: LineChart,
        label: 'Peak balance day',
        tone: 'blue',
        value: `${peakBalanceDay.dateLabel} · ${peakBalanceDay.balanceLabel}`,
      },
      {
        icon: TrendingUp,
        label: 'Strongest inflow day',
        tone: 'emerald',
        value:
          strongestInflowDay.totalCredit > 0
            ? `${strongestInflowDay.dateLabel} · ${strongestInflowDay.totalCreditLabel}`
            : 'No inflow recorded',
      },
      {
        icon: TrendingDown,
        label: 'Heaviest outflow day',
        tone: 'amber',
        value:
          heaviestOutflowDay.totalDebit > 0
            ? `${heaviestOutflowDay.dateLabel} · ${heaviestOutflowDay.totalDebitLabel}`
            : 'No outflow recorded',
      },
      {
        icon: CalendarClock,
        label: 'Active days',
        tone: 'purple',
        value: `${summary.activeDays} / ${rows.length} days`,
      },
    ]
  }, [rows, summary.activeDays])

  return (
    <section className="mb-6 space-y-4">
      <div className="grid gap-4 xl:grid-cols-2">
        <DashboardSection
          title="Running Balance"
          icon={<LineChart size={16} className="text-cyan-400" />}
          className="min-w-0"
          bodyClassName="border-t border-[#2d282b] p-5"
        >
          {isLoading ? (
            <div className="flex h-[320px] items-center justify-center text-sm font-medium text-[#8fa0bd]">
              Loading balance trend...
            </div>
          ) : (
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="daily-balance-area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#2d282b" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="shortDayLabel"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#8fa0bd', fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#8fa0bd', fontSize: 11 }}
                    tickFormatter={formatCompactValue}
                    width={72}
                  />
                  <Tooltip
                    cursor={{ stroke: '#60a5fa', strokeDasharray: '4 4' }}
                    content={<TooltipCard />}
                  />
                  <Area
                    dataKey="balance"
                    name="Balance"
                    stroke="#60a5fa"
                    fill="url(#daily-balance-area)"
                    strokeWidth={3}
                    dot={{ r: 2.5, fill: '#60a5fa', stroke: '#100d0e', strokeWidth: 2 }}
                    activeDot={{ r: 5, fill: '#60a5fa', stroke: '#100d0e', strokeWidth: 2 }}
                    type="monotone"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </DashboardSection>

        <DashboardSection
          title="Cash Flow"
          icon={<BarChart3 size={16} className="text-emerald-400" />}
          className="min-w-0"
          bodyClassName="border-t border-[#2d282b] p-5"
        >
          {isLoading ? (
            <div className="flex h-[320px] items-center justify-center text-sm font-medium text-[#8fa0bd]">
              Loading cash flow...
            </div>
          ) : (
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={8}>
                  <CartesianGrid stroke="#2d282b" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="shortDayLabel"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#8fa0bd', fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#8fa0bd', fontSize: 11 }}
                    tickFormatter={formatCompactValue}
                    width={72}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgb(255 255 255 / 0.03)' }}
                    content={<TooltipCard />}
                  />
                  <Bar dataKey="totalCredit" name="Credit" fill="#10b981" radius={[5, 5, 0, 0]} maxBarSize={18} />
                  <Bar dataKey="totalDebit" name="Debit" fill="#f59e0b" radius={[5, 5, 0, 0]} maxBarSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </DashboardSection>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {insights.map((item) => (
          <InsightCard key={item.label} {...item} />
        ))}
      </div>
    </section>
  )
}
