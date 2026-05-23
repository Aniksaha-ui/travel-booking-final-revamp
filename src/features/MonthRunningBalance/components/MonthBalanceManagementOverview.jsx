import { LineChart, TrendingUp } from 'lucide-react'
import { useMemo } from 'react'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { DashboardSection } from '../../../components/ui/DashboardSection'

const compactNumberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  notation: 'compact',
})

const currencyFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})

const formatCurrency = (value) => `BDT ${currencyFormatter.format(Number(value) || 0)}`

const formatCompactCurrency = (value) => {
  const amount = Number(value) || 0
  return compactNumberFormatter.format(amount)
}

const formatSignedCompactCurrency = (value) => {
  const amount = Number(value) || 0
  const prefix = amount >= 0 ? '+' : '-'
  return `${prefix}BDT ${compactNumberFormatter.format(Math.abs(amount))}`
}

const getShortMonthLabel = (label) => {
  if (!label) {
    return ''
  }

  const [first, second] = String(label).split(' ')

  if (!second) {
    return first.slice(0, 3)
  }

  return `${first.slice(0, 3)} ${second.slice(-2)}`
}

function MonthBalanceTooltip({ active, label, payload }) {
  if (!active || !payload?.length) {
    return null
  }

  const monthLabel = payload[0]?.payload?.month ?? label

  return (
    <div className="min-w-[220px] rounded-lg border border-[#332d30] bg-[#171314] px-4 py-3 text-xs shadow-2xl">
      <p className="mb-3 font-bold text-white">{monthLabel}</p>
      <div className="space-y-2">
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[#b4c5df]">
              <span
                className={entry.dataKey === 'openingBalance' || entry.dataKey === 'closingBalance' ? 'h-[2px] w-3 rounded-full' : 'h-2.5 w-2.5 rounded-sm'}
                style={{ backgroundColor: entry.color }}
              />
              <span>{entry.name}</span>
            </div>
            <span className="font-semibold text-white">{formatCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function LegendItem({ color, label, type = 'bar' }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#332d30] bg-[#171314] px-3 py-1.5 text-xs font-semibold text-[#c5d9f7]">
      <span
        className={type === 'line' ? 'h-[2px] w-3 rounded-full' : 'h-2.5 w-2.5 rounded-sm'}
        style={{ backgroundColor: color }}
      />
      <span>{label}</span>
    </div>
  )
}

function SnapshotRow({ eyebrow, title, value, tone = 'neutral' }) {
  const valueClassName =
    tone === 'positive'
      ? 'text-emerald-300'
      : tone === 'negative'
        ? 'text-amber-300'
        : 'text-white'

  return (
    <article className="px-5 py-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#7ea1ff]">{eyebrow}</p>
      <div className="mt-2 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-white">{title}</h4>
          <p className={`mt-2 text-lg font-bold ${valueClassName}`}>{value}</p>
        </div>
      </div>
    </article>
  )
}

function EmptyState({ message }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center px-5 py-8 text-center text-sm font-medium text-[#8fa0bd]">
      {message}
    </div>
  )
}

export function MonthBalanceManagementOverview({ rows, summary, isLoading }) {
  const chartData = useMemo(
    () =>
      rows.map((row) => ({
        ...row,
        delta: row.totalCredit - row.totalDebit,
        shortMonth: getShortMonthLabel(row.month),
      })),
    [rows],
  )

  const insights = useMemo(() => {
    if (!rows.length) {
      return []
    }

    const strongestClosing = rows.reduce((bestRow, row) =>
      row.closingBalance > bestRow.closingBalance ? row : bestRow,
    )
    const highestExpense = rows.reduce((bestRow, row) =>
      row.totalDebit > bestRow.totalDebit ? row : bestRow,
    )
    const bestSpread = rows.reduce((bestRow, row) =>
      row.totalCredit - row.totalDebit > bestRow.totalCredit - bestRow.totalDebit ? row : bestRow,
    )
    const creditDebitRatio =
      summary.totalDebit > 0 ? `${(summary.totalCredit / summary.totalDebit).toFixed(2)}x` : 'N/A'

    return [
      {
        eyebrow: 'Net Movement',
        title: 'Credit minus debit across the visible months',
        tone: summary.netChange >= 0 ? 'positive' : 'negative',
        value: formatSignedCompactCurrency(summary.netChange),
      },
      {
        eyebrow: 'Peak Closing Balance',
        title: strongestClosing.month,
        value: strongestClosing.closingBalanceLabel,
      },
      {
        eyebrow: 'Highest Outflow',
        title: highestExpense.month,
        tone: 'negative',
        value: highestExpense.totalDebitLabel,
      },
      {
        eyebrow: 'Best Monthly Spread',
        title: bestSpread.month,
        tone: bestSpread.totalCredit - bestSpread.totalDebit >= 0 ? 'positive' : 'negative',
        value: formatSignedCompactCurrency(bestSpread.totalCredit - bestSpread.totalDebit),
      },
      {
        eyebrow: 'Credit / Debit Ratio',
        title: 'Overall balance efficiency in this view',
        value: creditDebitRatio,
      },
    ]
  }, [rows, summary.netChange, summary.totalCredit, summary.totalDebit])

  return (
    <section className="mb-6 grid gap-4 xl:grid-cols-[minmax(0,1.75fr)_minmax(320px,0.95fr)] mt-4">
      <DashboardSection
        title="Balance Trend"
        icon={<LineChart size={16} className="text-cyan-400" />}
        action={
          <span className="rounded-full border border-[#332d30] bg-[#171314] px-2.5 py-1 text-[11px] font-bold text-[#9fb2d0]">
            {summary.visibleMonths || rows.length} months
          </span>
        }
        className="min-w-0"
        bodyClassName="border-t border-[#2d282b] p-5"
      >
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <p className="mr-2 text-xs font-semibold text-[#8fa0bd]">Values shown in BDT</p>
          <LegendItem color="#10b981" label="Total Credit" />
          <LegendItem color="#f59e0b" label="Total Debit" />
          <LegendItem color="#60a5fa" label="Opening Balance" type="line" />
          <LegendItem color="#a78bfa" label="Closing Balance" type="line" />
          <span
            className={`ml-auto rounded-full border px-3 py-1.5 text-xs font-semibold ${
              summary.netChange >= 0
                ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300'
                : 'border-amber-500/25 bg-amber-500/10 text-amber-300'
            }`}
          >
            Net movement {summary.netChange >= 0 ? 'up' : 'down'}: {summary.netChangeLabel}
          </span>
        </div>

        {isLoading ? (
          <EmptyState message="Loading trend data..." />
        ) : chartData.length ? (
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#2d282b" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="shortMonth"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#8fa0bd', fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#8fa0bd', fontSize: 11 }}
                  tickFormatter={formatCompactCurrency}
                  width={78}
                />
                <Tooltip
                  cursor={{ fill: 'rgb(255 255 255 / 0.03)' }}
                  content={<MonthBalanceTooltip />}
                />
                <Bar dataKey="totalCredit" name="Total Credit" fill="#10b981" radius={[6, 6, 0, 0]} barSize={18} />
                <Bar dataKey="totalDebit" name="Total Debit" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={18} />
                <Line
                  type="monotone"
                  dataKey="openingBalance"
                  name="Opening Balance"
                  stroke="#60a5fa"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: '#60a5fa', stroke: '#100d0e', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="closingBalance"
                  name="Closing Balance"
                  stroke="#a78bfa"
                  strokeWidth={3}
                  dot={{ r: 3, fill: '#a78bfa', stroke: '#100d0e', strokeWidth: 2 }}
                  activeDot={{ r: 5, fill: '#a78bfa', stroke: '#100d0e', strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState message="No monthly balance trend is available for this filter." />
        )}
      </DashboardSection>

      <DashboardSection
        title="Management Snapshot"
        icon={<TrendingUp size={16} className="text-emerald-400" />}
        className="min-w-0"
        bodyClassName="border-t border-[#2d282b]"
      >
        {isLoading ? (
          <EmptyState message="Preparing management summary..." />
        ) : insights.length ? (
          <div className="divide-y divide-[#2d282b]">
            {insights.map((item) => (
              <SnapshotRow
                key={item.eyebrow}
                eyebrow={item.eyebrow}
                title={item.title}
                tone={item.tone}
                value={item.value}
              />
            ))}
          </div>
        ) : (
          <EmptyState message="No management summary is available for this filter." />
        )}
      </DashboardSection>
    </section>
  )
}
