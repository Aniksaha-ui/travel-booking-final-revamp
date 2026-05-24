import { ArrowDownCircle, ArrowUpCircle, History, Wallet } from 'lucide-react'
import { DashboardMetricCard } from '../../../components/ui/DashboardMetricCard'
import { DashboardSection } from '../../../components/ui/DashboardSection'

function SnapshotRow({ label, tone = 'text-white', value }) {
  return (
    <article className="px-5 py-4">
      <p className="text-[11px] font-bold uppercase text-[#7ea1ff]">{label}</p>
      <p className={`mt-2 text-sm font-semibold ${tone}`}>{value}</p>
    </article>
  )
}

function renderEmptyState(message) {
  return (
    <div className="flex min-h-[220px] items-center justify-center px-5 py-8 text-center text-sm font-medium text-[#8fa0bd]">
      {message}
    </div>
  )
}

export function AccountHistoryOverview({ isLoading, summary }) {
  const metricItems = [
    {
      icon: Wallet,
      label: 'Credited Amount',
      tone: 'blue',
      value: summary.creditedAmountLabel,
    },
    {
      icon: History,
      label: 'Transactions in View',
      tone: 'cyan',
      value: summary.transactionCountLabel,
    },
    {
      icon: ArrowUpCircle,
      label: 'Credits on Page',
      tone: 'emerald',
      value: summary.creditCountLabel,
    },
    {
      icon: ArrowDownCircle,
      label: 'Debits on Page',
      tone: 'amber',
      value: summary.debitCountLabel,
    },
  ]

  return (
    <>
      <section className="month-balance-summary-grid" aria-label="Account history summary">
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
          title="Gateway Volume on Current Page"
          icon={<Wallet size={16} className="text-blue-400" />}
          action={
            <span className="rounded-full border border-[#332d30] bg-[#171314] px-2.5 py-1 text-[11px] font-bold text-[#9fb2d0]">
              Top Gateway: {isLoading ? 'Loading...' : summary.topGatewayLabel}
            </span>
          }
          bodyClassName="border-t border-[#2d282b] p-5"
        >
          {isLoading ? (
            renderEmptyState('Loading gateway volume...')
          ) : summary.gatewayBreakdown.length ? (
            <div className="grid gap-4">
              {summary.gatewayBreakdown.map((item) => (
                <article key={item.label} className="rounded-lg border border-[#332d30] bg-[#171314] p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-semibold text-white">{item.label}</span>
                    </div>
                    <span className="text-sm font-bold text-[#c5d9f7]">{item.amountLabel}</span>
                  </div>
                  <div className="mb-2 h-2 rounded-full bg-[#231f21]">
                    <div className="h-2 rounded-full" style={{ backgroundColor: item.color, width: item.width }} />
                  </div>
                  <p className="text-xs font-medium text-[#8fa0bd]">{item.countLabel} transactions</p>
                </article>
              ))}
            </div>
          ) : (
            renderEmptyState('No gateway breakdown is available for this date range.')
          )}
        </DashboardSection>

        <DashboardSection
          title="Transfer Snapshot"
          icon={<History size={16} className="text-emerald-400" />}
          bodyClassName="border-t border-[#2d282b]"
        >
          {isLoading ? (
            renderEmptyState('Preparing the latest transfer snapshot...')
          ) : (
            <div className="divide-y divide-[#2d282b]">
              <SnapshotRow label="Page Movement" value={summary.pageTotalAmountLabel} />
              <SnapshotRow label="Unique Accounts" value={summary.uniqueAccountsLabel} />
              <SnapshotRow label="Largest Transfer" tone="text-emerald-300" value={summary.largestTransferLabel} />
              <SnapshotRow label="Latest Transaction" value={summary.latestTransactionLabel} />
            </div>
          )}
        </DashboardSection>
      </section>
    </>
  )
}

