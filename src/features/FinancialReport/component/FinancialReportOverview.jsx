import { BarChart3, CircleDollarSign, Landmark, TrendingUp } from 'lucide-react'
import { useMemo } from 'react'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { DashboardMetricCard } from '../../../components/ui/DashboardMetricCard'
import { DashboardSection } from '../../../components/ui/DashboardSection'
import { formatCurrency } from '../utils/financialReportUtils'

const compactNumberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  notation: 'compact',
})

const formatCompactValue = (value) => compactNumberFormatter.format(Number(value) || 0)

function FinancialTooltip({ active, label, payload }) {
  if (!active || !payload?.length) {
    return null
  }

  const item = payload[0]?.payload

  return (
    <div className="min-w-[220px] rounded-lg border border-[#332d30] bg-[#171314] px-4 py-3 text-xs shadow-2xl">
      <p className="mb-3 font-bold text-white">{item?.financialYearLabel ?? label}</p>
      <div className="space-y-2">
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[#b4c5df]">
              <span
                className={entry.dataKey === 'netAmount' ? 'h-[2px] w-3 rounded-full' : 'h-2.5 w-2.5 rounded-sm'}
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

function SnapshotRow({ eyebrow, title, tone = 'text-white', value }) {
  return (
    <article className="px-5 py-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#7ea1ff]">{eyebrow}</p>
      <div className="mt-2">
        <h4 className="text-sm font-semibold text-white">{title}</h4>
        <p className={`mt-2 text-lg font-bold ${tone}`}>{value}</p>
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

export function FinancialReportOverview({ isLoading, rows, summary }) {
  const metricItems = [
    {
      icon: CircleDollarSign,
      label: 'Payment Total',
      tone: 'blue',
      value: summary.totalPaymentAmountLabel,
    },
    {
      icon: TrendingUp,
      label: 'Net Position',
      tone: 'emerald',
      value: summary.totalNetAmountLabel,
    },
    {
      icon: Landmark,
      label: 'Refund Total',
      tone: 'amber',
      value: summary.totalRefundAmountLabel,
    },
    {
      icon: BarChart3,
      label: 'Financial Years',
      tone: 'cyan',
      value: summary.totalYearsLabel,
    },
  ]

  const netTone = summary.totalNetAmount >= 0 ? 'text-emerald-300' : 'text-amber-300'

  const chartRows = useMemo(() => summary.chartItems ?? [], [summary.chartItems])

  return (
    <>
      <section className="month-balance-summary-grid" aria-label="Financial report summary">
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

      <section className="mb-6 grid gap-4 xl:grid-cols-[minmax(0,1.75fr)_minmax(320px,0.95fr)] mt-4">
        <DashboardSection
          title="Financial Year Trend"
          icon={<BarChart3 size={16} className="text-cyan-400" />}
          action={
            <span className="rounded-full border border-[#332d30] bg-[#171314] px-2.5 py-1 text-[11px] font-bold text-[#9fb2d0]">
              {summary.totalYears || rows.length} years
            </span>
          }
          className="min-w-0"
          bodyClassName="border-t border-[#2d282b] p-5"
        >
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <p className="mr-2 text-xs font-semibold text-[#8fa0bd]">Values shown in BDT</p>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#332d30] bg-[#171314] px-3 py-1.5 text-xs font-semibold text-[#c5d9f7]">
              <span className="h-2.5 w-2.5 rounded-sm bg-[#4f83ff]" />
              Payment
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#332d30] bg-[#171314] px-3 py-1.5 text-xs font-semibold text-[#c5d9f7]">
              <span className="h-2.5 w-2.5 rounded-sm bg-[#f59e0b]" />
              Refund
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#332d30] bg-[#171314] px-3 py-1.5 text-xs font-semibold text-[#c5d9f7]">
              <span className="h-2.5 w-2.5 rounded-sm bg-[#8b5cf6]" />
              Costing
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#332d30] bg-[#171314] px-3 py-1.5 text-xs font-semibold text-[#c5d9f7]">
              <span className="h-[2px] w-3 rounded-full bg-[#34d399]" />
              Net
            </span>
          </div>

          {isLoading ? (
            <EmptyState message="Loading financial year trend..." />
          ) : chartRows.length ? (
            <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartRows} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#2d282b" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="shortLabel"
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
                  <Tooltip cursor={{ stroke: '#60a5fa', strokeDasharray: '4 4' }} content={<FinancialTooltip />} />
                  <Legend wrapperStyle={{ display: 'none' }} />
                  <Bar dataKey="paymentAmount" name="Payment" fill="#4f83ff" radius={[5, 5, 0, 0]} maxBarSize={24} />
                  <Bar dataKey="refundAmount" name="Refund" fill="#f59e0b" radius={[5, 5, 0, 0]} maxBarSize={24} />
                  <Bar dataKey="costingAmount" name="Costing" fill="#8b5cf6" radius={[5, 5, 0, 0]} maxBarSize={24} />
                  <Line
                    type="monotone"
                    dataKey="netAmount"
                    name="Net"
                    stroke="#34d399"
                    strokeWidth={3}
                    dot={{ r: 2.5, fill: '#34d399', stroke: '#100d0e', strokeWidth: 2 }}
                    activeDot={{ r: 5, fill: '#34d399', stroke: '#100d0e', strokeWidth: 2 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState message="No financial years are available for this view." />
          )}
        </DashboardSection>

        <DashboardSection
          title="Finance Snapshot"
          icon={<TrendingUp size={16} className="text-emerald-400" />}
          bodyClassName="border-t border-[#2d282b]"
        >
          {isLoading ? (
            <EmptyState message="Preparing the latest finance snapshot..." />
          ) : (
            <div className="divide-y divide-[#2d282b]">
              <SnapshotRow
                eyebrow="Net Position"
                title="Payments minus refunds and costing"
                tone={netTone}
                value={summary.totalNetAmountLabel}
              />
              <SnapshotRow
                eyebrow="Highest Payment Year"
                title="Peak payment performance in this view"
                value={summary.highestPaymentYearLabel}
              />
              <SnapshotRow
                eyebrow="Highest Refund Year"
                title="Largest refund exposure in this view"
                tone="text-amber-300"
                value={summary.highestRefundYearLabel}
              />
              <SnapshotRow
                eyebrow="Highest Costing Year"
                title="Most expensive operating year in this view"
                tone="text-purple-300"
                value={summary.highestCostingYearLabel}
              />
              <SnapshotRow
                eyebrow="Average Net"
                title="Average retained amount per financial year"
                value={summary.averageNetAmountLabel}
              />
            </div>
          )}
        </DashboardSection>
      </section>
    </>
  )
}

