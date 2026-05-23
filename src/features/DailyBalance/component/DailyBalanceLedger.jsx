import { CalendarDays } from 'lucide-react'
import { DashboardSection } from '../../../components/ui/DashboardSection'
import { LedgerColumns } from './column.jsx'

function LedgerMobileCard({ row }) {
  return (
    <article className="rounded-lg border border-[#332d30] bg-[#231f21] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-white">{row.dateLabel}</p>
          <p className="mt-1 text-xs text-[#8fa0bd]">{row.txCount} transactions</p>
        </div>
        <span className="rounded-full border border-[#332d30] bg-[#171314] px-2.5 py-1 text-xs font-semibold text-[#c5d9f7]">
          Balance {row.balanceLabel}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-md bg-[#171314] p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8fa0bd]">Credit</p>
          <p className="mt-2 text-sm font-bold text-emerald-300">{row.totalCreditLabel}</p>
        </div>
        <div className="rounded-md bg-[#171314] p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8fa0bd]">Debit</p>
          <p className="mt-2 text-sm font-bold text-amber-300">{row.totalDebitLabel}</p>
        </div>
      </div>
    </article>
  )
}

function LedgerSummaryCard({ summary }) {
  return (
    <div className="rounded-lg border border-[#332d30] bg-[#1d181a] p-4 md:hidden">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-white">Total Summary</p>
        <span className="text-sm font-semibold text-[#c5d9f7]">{summary.txCount} transactions</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-md bg-[#171314] p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8fa0bd]">Credit</p>
          <p className="mt-2 text-sm font-bold text-emerald-300">{summary.totalCreditLabel}</p>
        </div>
        <div className="rounded-md bg-[#171314] p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8fa0bd]">Debit</p>
          <p className="mt-2 text-sm font-bold text-amber-300">{summary.totalDebitLabel}</p>
        </div>
        <div className="rounded-md bg-[#171314] p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8fa0bd]">Balance</p>
          <p className="mt-2 text-sm font-bold text-white">{summary.currentBalanceLabel}</p>
        </div>
      </div>
    </div>
  )
}

export function DailyBalanceLedger({ error, isLoading, rows, summary }) {
  return (
    <DashboardSection
      title="Daily Ledger"
      icon={<CalendarDays size={16} className="text-blue-400" />}
      className="min-w-0"
      bodyClassName="border-t border-[#2d282b]"
    >
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="routes-table">
            <thead>
              <LedgerColumns />
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="routes-table__empty">
                    Loading daily balance entries...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="routes-table__empty">
                    {error}
                  </td>
                </tr>
              ) : rows.length ? (
                rows.map((row) => (
                  <tr key={row.id}>
                    <td className="routes-table__muted">{row.dateLabel}</td>
                    <td style={{ textAlign: 'center' }}>{row.txCount || '-'}</td>
                    <td style={{ textAlign: 'right' }} className="text-emerald-300">
                      {row.totalCredit > 0 ? row.totalCreditLabel : '-'}
                    </td>
                    <td style={{ textAlign: 'right' }} className="text-amber-300">
                      {row.totalDebit > 0 ? row.totalDebitLabel : '-'}
                    </td>
                    <td style={{ textAlign: 'right' }} className="font-bold">
                      {row.balanceLabel}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="routes-table__empty">
                    No daily balance records found.
                  </td>
                </tr>
              )}
            </tbody>
            {rows.length ? (
              <tfoot>
                <tr className="routes-table__summary-row">
                  <td className="routes-table__summary-label">Total Summary</td>
                  <td className="routes-table__summary-cell" style={{ textAlign: 'center' }}>
                    {summary.txCount}
                  </td>
                  <td className="routes-table__summary-cell routes-table__summary-cell--credit" style={{ textAlign: 'right' }}>
                    {summary.totalCreditLabel}
                  </td>
                  <td className="routes-table__summary-cell routes-table__summary-cell--debit" style={{ textAlign: 'right' }}>
                    {summary.totalDebitLabel}
                  </td>
                  <td className="routes-table__summary-cell" style={{ textAlign: 'right' }}>
                    {summary.currentBalanceLabel}
                  </td>
                </tr>
              </tfoot>
            ) : null}
          </table>
        </div>
      </div>

      <div className="space-y-3 p-4 md:hidden">
        {isLoading ? (
          <div className="rounded-lg border border-[#332d30] bg-[#231f21] px-4 py-5 text-center text-sm font-medium text-[#8fa0bd]">
            Loading daily balance entries...
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-900/60 bg-red-950/20 px-4 py-5 text-center text-sm font-medium text-red-200">
            {error}
          </div>
        ) : rows.length ? (
          <>
            {rows.map((row) => <LedgerMobileCard key={row.id} row={row} />)}
            <LedgerSummaryCard summary={summary} />
          </>
        ) : (
          <div className="rounded-lg border border-[#332d30] bg-[#231f21] px-4 py-5 text-center text-sm font-medium text-[#8fa0bd]">
            No daily balance records found.
          </div>
        )}
      </div>
    </DashboardSection>
  )
}
