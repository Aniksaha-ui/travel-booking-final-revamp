import { History, ReceiptText, X } from 'lucide-react'
import { MobileDisclosureCards } from '../../../components/ui/MobileDisclosureCards.jsx'

function SummaryCard({ label, value }) {
  return (
    <article className="rounded-lg border border-[#332d30] bg-[#231f21] p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8fa0bd]">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </article>
  )
}

export function AccountHistoryDrawer({
  error,
  isLoading,
  onClose,
  rows,
  summary,
  typeLabel,
}) {
  const mobileItems = rows.map((row) => ({
    id: row.id,
    rows: [
      { label: 'Gateway', value: row.gatewayLabel },
      { label: 'Amount', value: row.amountLabel },
      { label: 'Reference', value: row.transactionReference },
      { label: 'Purpose', value: row.purposeLabel },
      { label: 'Transaction Date', value: row.transactionDateLabel },
    ],
    secondaryValue: `${row.amountLabel} • ${row.transactionDateLabel}`,
    summaryLabel: 'User Account No',
    summaryValue: row.userAccountNumber,
  }))

  return (
    <div className="report-drawer" role="dialog" aria-modal="true">
      <button type="button" className="report-drawer__backdrop" aria-label="Close account history drawer" onClick={onClose} />

      <aside className="report-drawer__panel">
        <header className="report-drawer__header">
          <div className="min-w-0">
            <span className="report-drawer__eyebrow">Account history</span>
            <h2>{typeLabel || 'Account Type'}</h2>
            <p className="report-drawer__subtitle">
              Transaction history for the selected balance type, including customer account numbers, references, and purpose labels.
            </p>
          </div>

          <button type="button" className="report-drawer__close" onClick={onClose}>
            <X size={16} />
            Close
          </button>
        </header>

        <div className="report-drawer__body">
          {isLoading ? (
            <div className="flex min-h-[260px] items-center justify-center rounded-lg border border-[#332d30] bg-[#231f21] text-sm font-medium text-[#8fa0bd]">
              Loading account history...
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-900/60 bg-red-950/20 px-4 py-5 text-sm font-medium text-red-200">
              {error}
            </div>
          ) : (
            <>
              <div className="mb-5 grid gap-3 md:grid-cols-3">
                <SummaryCard label="Transactions" value={summary.totalTransactionsLabel} />
                <SummaryCard label="Captured Amount" value={summary.totalAmountLabel} />
                <SummaryCard label="Unique Accounts" value={summary.uniqueAccountsLabel} />
              </div>

              <div className="mb-5 rounded-lg border border-[#332d30] bg-[#231f21] p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8fa0bd]">Latest transaction</p>
                <p className="mt-2 text-sm font-semibold text-white">{summary.latestTransactionLabel}</p>
              </div>

              <section className="report-drawer__table-card">
                <div className="report-drawer__table-header">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <History size={16} className="text-blue-400" />
                    <span>Account Ledger</span>
                  </div>
                  <span className="text-xs font-semibold text-[#8fa0bd]">{rows.length} rows</span>
                </div>

                <MobileDisclosureCards emptyMessage="No account history found for this type." items={mobileItems} />

                <table className="trip-summary-table hidden md:table">
                  <thead>
                    <tr>
                      <th>User Account No</th>
                      <th>Gateway</th>
                      <th>Amount</th>
                      <th>Reference</th>
                      <th>Purpose</th>
                      <th>Transaction Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length ? (
                      rows.map((row) => (
                        <tr key={row.id}>
                          <td>{row.userAccountNumber}</td>
                          <td>
                            <span className="inline-flex items-center gap-2">
                              <ReceiptText size={14} className="text-[#7ea1ff]" />
                              {row.gatewayLabel}
                            </span>
                          </td>
                          <td>{row.amountLabel}</td>
                          <td>{row.transactionReference}</td>
                          <td>{row.purposeLabel}</td>
                          <td>{row.transactionDateLabel}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6}>No account history found for this type.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </section>
            </>
          )}
        </div>
      </aside>
    </div>
  )
}
