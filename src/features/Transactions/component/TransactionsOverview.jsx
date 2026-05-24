import { CheckCircle2, CreditCard, ReceiptText, Wallet } from 'lucide-react'
import { DashboardMetricCard } from '../../../components/ui/DashboardMetricCard'
import { DashboardSection } from '../../../components/ui/DashboardSection'

function renderEmptyState(message) {
  return (
    <div className="flex min-h-[220px] items-center justify-center px-5 py-8 text-center text-sm font-medium text-[#8fa0bd]">
      {message}
    </div>
  )
}

export function TransactionsOverview({ isLoading, metrics, pagination }) {
  const metricItems = [
    {
      icon: ReceiptText,
      label: 'Transactions in View',
      tone: 'blue',
      value: metrics.totalTransactionsLabel,
    },
    {
      icon: Wallet,
      label: 'Gross Amount',
      tone: 'cyan',
      value: metrics.totalAmountLabel,
    },
    {
      icon: CheckCircle2,
      label: 'Settled Amount',
      tone: 'emerald',
      value: metrics.settledAmountLabel,
    },
    {
      icon: CreditCard,
      label: 'Linked Bookings',
      tone: 'amber',
      value: metrics.linkedBookingsLabel,
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

      <section className="mb-6 grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
        <DashboardSection
          title="Payment Method Mix"
          icon={<CreditCard size={16} className="text-blue-400" />}
          action={
            <span className="rounded-full border border-[#332d30] bg-[#171314] px-2.5 py-1 text-[11px] font-bold text-[#9fb2d0]">
              Top Method: {isLoading ? 'Loading...' : metrics.topPaymentMethodLabel}
            </span>
          }
          bodyClassName="border-t border-[#2d282b] p-5"
        >
          {isLoading ? (
            renderEmptyState('Loading transaction payment mix...')
          ) : metrics.paymentMethodBreakdown.length ? (
            <div className="grid gap-4">
              {metrics.paymentMethodBreakdown.map((item) => (
                <article key={item.key} className="rounded-lg border border-[#332d30] bg-[#171314] p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${item.toneClassName}`}>
                        {item.label}
                      </span>
                      <span className="text-xs font-medium text-[#8fa0bd]">{item.countLabel} transactions</span>
                    </div>
                    <span className="text-sm font-bold text-[#c5d9f7]">{item.amountLabel}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#231f21]">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-[#4f83ff] via-[#4dc7ff] to-[#65f2c5]"
                      style={{ width: item.width }}
                    />
                  </div>
                </article>
              ))}
            </div>
          ) : (
            renderEmptyState('No transactions are available for this page.')
          )}
        </DashboardSection>

        <DashboardSection
          title="Settlement Snapshot"
          icon={<Wallet size={16} className="text-emerald-400" />}
          action={
            <span className="rounded-full border border-[#332d30] bg-[#171314] px-2.5 py-1 text-[11px] font-bold text-[#9fb2d0]">
              Page {pagination?.currentPage ?? 1} of {pagination?.lastPage ?? 1}
            </span>
          }
          bodyClassName="border-t border-[#2d282b]"
        >
          {isLoading ? (
            renderEmptyState('Preparing the latest settlement snapshot...')
          ) : (
            <div className="divide-y divide-[#2d282b]">
              <article className="px-5 py-4">
                <p className="text-[11px] font-bold uppercase text-[#7ea1ff]">Pending Settlement</p>
                <p className="mt-2 text-sm font-semibold text-amber-200">{metrics.pendingSettlementAmountLabel}</p>
              </article>
              <article className="px-5 py-4">
                <p className="text-[11px] font-bold uppercase text-[#7ea1ff]">Distinct Purposes</p>
                <p className="mt-2 text-sm font-semibold text-white">{metrics.distinctPurposesLabel}</p>
              </article>
              <article className="px-5 py-4">
                <p className="text-[11px] font-bold uppercase text-[#7ea1ff]">Latest Transaction</p>
                <p className="mt-2 text-sm font-semibold text-white">{metrics.latestTransactionLabel}</p>
              </article>
              <article className="px-5 py-4">
                <p className="text-[11px] font-bold uppercase text-[#7ea1ff]">Settlement Statuses</p>
                <div className="mt-3 grid gap-2.5">
                  {metrics.settlementBreakdown.length ? (
                    metrics.settlementBreakdown.map((item) => (
                      <div key={item.key} className="flex items-center justify-between gap-3 rounded-lg bg-[#171314] px-3 py-2.5">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${item.toneClassName}`}
                        >
                          {item.label}
                        </span>
                        <span className="text-sm font-bold text-[#c5d9f7]">{item.countLabel}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm font-medium text-[#8fa0bd]">No settlement data on this page.</p>
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

