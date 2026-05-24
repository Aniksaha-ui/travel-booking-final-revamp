import { BarChart3, ReceiptText, Ticket, Trophy, Wallet } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { DashboardMetricCard } from '../../../components/ui/DashboardMetricCard'
import { DashboardSection } from '../../../components/ui/DashboardSection'
import { formatCurrency } from '../utils/customerValueReportUtils'

const compactNumberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  notation: 'compact',
})

const formatCompactValue = (value) => compactNumberFormatter.format(Number(value) || 0)

function TopCustomerTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null
  }

  const item = payload[0]?.payload

  return (
    <div className="min-w-[220px] rounded-lg border border-[#332d30] bg-[#171314] px-4 py-3 text-xs shadow-2xl">
      <p className="mb-3 font-bold text-white">{item?.customerName}</p>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[#b4c5df]">Net Spent</span>
          <span className="font-semibold text-white">{item?.netSpentLabel ?? 'BDT 0.00'}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[#b4c5df]">Paid</span>
          <span className="font-semibold text-white">{formatCurrency(item?.totalPaid)}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[#b4c5df]">Refunded</span>
          <span className="font-semibold text-white">{formatCurrency(item?.totalRefunded)}</span>
        </div>
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

export function CustomerValueOverview({ isLoading, summary }) {
  const metricItems = [
    {
      icon: Wallet,
      label: 'Total Paid',
      tone: 'blue',
      value: summary.totalPaidLabel,
    },
    {
      icon: ReceiptText,
      label: 'Net Spent',
      tone: 'emerald',
      value: summary.totalNetSpentLabel,
    },
    {
      icon: Trophy,
      label: 'Top Customer',
      tone: 'amber',
      value: summary.topCustomerLabel,
    },
    {
      icon: Ticket,
      label: 'Customers in View',
      tone: 'cyan',
      value: summary.totalCustomersLabel,
    },
  ]

  return (
    <>
      <section className="month-balance-summary-grid" aria-label="Customer value summary">
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
          title="Top Customers by Net Spend"
          icon={<BarChart3 size={16} className="text-cyan-400" />}
          action={
            <span className="rounded-full border border-[#332d30] bg-[#171314] px-2.5 py-1 text-[11px] font-bold text-[#9fb2d0]">
              Top {summary.chartItems.length || 0} customers
            </span>
          }
          className="min-w-0"
          bodyClassName="border-t border-[#2d282b] p-5"
        >
          {isLoading ? (
            <EmptyState message="Loading top customer value..." />
          ) : summary.chartItems.length ? (
            <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.chartItems} layout="vertical" margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#2d282b" strokeDasharray="3 3" horizontal={false} />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#8fa0bd', fontSize: 11 }}
                    tickFormatter={formatCompactValue}
                  />
                  <YAxis
                    type="category"
                    dataKey="shortName"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#8fa0bd', fontSize: 11 }}
                    width={120}
                  />
                  <Tooltip cursor={{ fill: 'rgb(255 255 255 / 0.03)' }} content={<TopCustomerTooltip />} />
                  <Bar dataKey="netSpent" name="Net Spent" fill="#34d399" radius={[0, 8, 8, 0]} maxBarSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState message="No customer value data is available for this view." />
          )}
        </DashboardSection>

        <DashboardSection
          title="Customer Snapshot"
          icon={<Trophy size={16} className="text-amber-400" />}
          bodyClassName="border-t border-[#2d282b]"
        >
          {isLoading ? (
            <EmptyState message="Preparing the latest customer snapshot..." />
          ) : (
            <div className="divide-y divide-[#2d282b]">
              <SnapshotRow
                eyebrow="Top Trip Customer"
                title="Most trip bookings in this view"
                value={summary.topTripCustomerLabel}
              />
              <SnapshotRow
                eyebrow="Top Package Customer"
                title="Most package bookings in this view"
                value={summary.topPackageCustomerLabel}
              />
              <SnapshotRow
                eyebrow="Refund Exposure"
                title="Refund share of total paid"
                tone="text-amber-300"
                value={summary.refundRatioLabel}
              />
              <SnapshotRow
                eyebrow="Average Net Spend"
                title="Average retained spend per customer"
                tone="text-emerald-300"
                value={summary.averageNetSpentLabel}
              />
              <SnapshotRow
                eyebrow="Booking Volume"
                title="Trip and package bookings on this page"
                value={`${summary.totalTripBookingsLabel} trips • ${summary.totalPackageBookingsLabel} packages`}
              />
            </div>
          )}
        </DashboardSection>
      </section>
    </>
  )
}

