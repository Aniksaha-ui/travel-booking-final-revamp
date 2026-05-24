import { CheckCheck, Clock3, RefreshCcw, Wallet } from 'lucide-react'
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
import { buildRefundMetrics } from '../utils/refundUtils'

const snapshotToneClassNames = {
  negative: 'text-amber-300',
  neutral: 'text-white',
  positive: 'text-emerald-300',
}

function renderStatusTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null
  }

  const entry = payload[0]?.payload

  return (
    <div className="min-w-[180px] rounded-lg border border-[#332d30] bg-[#171314] px-4 py-3 text-xs shadow-2xl">
      <p className="mb-3 font-bold text-white">{label}</p>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[#b4c5df]">Requests</span>
          <span className="font-semibold text-white">{entry?.total ?? 0}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[#b4c5df]">Amount</span>
          <span className="font-semibold text-white">{entry?.amountLabel ?? 'BDT 0'}</span>
        </div>
      </div>
    </div>
  )
}

function renderEmptyState(message) {
  return (
    <div className="flex min-h-[220px] items-center justify-center px-5 py-8 text-center text-sm font-medium text-[#8fa0bd]">
      {message}
    </div>
  )
}

export function RefundManagementOverview({ isLoading, pagination, refunds }) {
  const metrics = useMemo(() => buildRefundMetrics(refunds), [refunds])

  const summaryItems = [
    {
      icon: RefreshCcw,
      label: 'Refunds in View',
      tone: 'blue',
      value: metrics.totalRefundsLabel,
    },
    {
      icon: Clock3,
      label: 'Pending Payouts',
      tone: 'amber',
      value: metrics.pendingCountLabel,
    },
    {
      icon: CheckCheck,
      label: 'Disbursed',
      tone: 'emerald',
      value: metrics.disbursedCountLabel,
    },
    {
      icon: Wallet,
      label: 'Amount in View',
      tone: 'cyan',
      value: metrics.totalAmountLabel,
    },
  ]

  const snapshotItems = [
    {
      eyebrow: 'Average Refund',
      tone: 'neutral',
      value: metrics.averageAmountLabel,
    },
    {
      eyebrow: 'Largest Refund',
      tone: 'positive',
      value: metrics.largestRefundLabel,
    },
    {
      eyebrow: 'Top Refund Reason',
      tone: 'neutral',
      value: metrics.topReasonLabel,
    },
    {
      eyebrow: 'Pending Exposure',
      tone: metrics.pendingAmount > 0 ? 'negative' : 'neutral',
      value: metrics.pendingAmountLabel,
    },
    {
      eyebrow: 'Cleared Amount',
      tone: 'positive',
      value: metrics.disbursedAmountLabel,
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
          title="Disbursement Distribution"
          icon={<RefreshCcw size={16} className="text-blue-400" />}
          action={
            <span className="rounded-full border border-[#332d30] bg-[#171314] px-2.5 py-1 text-[11px] font-bold text-[#9fb2d0]">
              Page {pagination?.currentPage ?? 1} of {pagination?.lastPage ?? 1}
            </span>
          }
          bodyClassName="border-t border-[#2d282b] p-5"
        >
          {isLoading ? (
            renderEmptyState('Loading refund summary...')
          ) : metrics.totalRefunds ? (
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.chartItems} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#2d282b" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    axisLine={false}
                    dataKey="key"
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
                  <Tooltip cursor={{ fill: 'rgb(255 255 255 / 0.03)' }} content={renderStatusTooltip} />
                  <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                    {metrics.chartItems.map((item) => (
                      <Cell key={item.key} fill={item.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            renderEmptyState('No refund requests are available for this page.')
          )}
        </DashboardSection>

        <DashboardSection
          title="Finance Snapshot"
          icon={<Wallet size={16} className="text-emerald-400" />}
          action={
            <span className="rounded-full border border-[#332d30] bg-[#171314] px-2.5 py-1 text-[11px] font-bold text-[#9fb2d0]">
              {pagination?.total ?? 0} matched
            </span>
          }
          bodyClassName="border-t border-[#2d282b]"
        >
          {isLoading ? (
            renderEmptyState('Preparing the latest payout snapshot...')
          ) : (
            <div className="divide-y divide-[#2d282b]">
              {snapshotItems.map((item) => (
                <article key={item.eyebrow} className="px-5 py-4">
                  <p className="text-[11px] font-bold uppercase text-[#7ea1ff]">{item.eyebrow}</p>
                  <p className={`mt-2 text-sm font-semibold ${snapshotToneClassNames[item.tone]}`}>
                    {item.value}
                  </p>
                </article>
              ))}
            </div>
          )}
        </DashboardSection>
      </section>
    </>
  )
}
