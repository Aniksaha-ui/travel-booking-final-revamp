import { ArrowUpRight } from 'lucide-react'
import { DashboardSection } from '../../../components/ui/DashboardSection'
import { DailyBalancePagination } from '../../DailyBalance/component/DailyBalancePagination'

function MobileHistoryCard({ row }) {
  return (
    <article className="rounded-lg border border-[#332d30] bg-[#231f21] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-white">{row.purposeLabel}</p>
          <p className="mt-1 text-xs font-medium text-[#8fa0bd]">{row.dateLabel}</p>
        </div>
        <span
          className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${row.transactionTypeToneClassName}`}
        >
          {row.transactionTypeLabel}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8fa0bd]">Gateway</p>
          <p className="mt-1 text-sm text-white">{row.gatewayLabel}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8fa0bd]">Amount</p>
          <p className="mt-1 text-sm font-semibold text-white">{row.amountLabel}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8fa0bd]">User Account</p>
          <p className="mt-1 break-all text-sm text-white">{row.userAccountNumber}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8fa0bd]">Transfer To</p>
          <p className="mt-1 break-all text-sm text-white">{row.companyAccountNumber}</p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-[#332d30] bg-[#171314] p-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8fa0bd]">Reference</p>
        <p className="mt-1 break-all text-sm text-white">{row.transactionReference}</p>
      </div>
    </article>
  )
}

export function AccountHistoryLedger({
  isLoading,
  onPageChange,
  page,
  pagination,
  rows,
}) {
  return (
    <DashboardSection
      title="Account History Ledger"
      icon={<ArrowUpRight size={16} className="text-blue-400" />}
      className="min-w-0"
      bodyClassName="border-t border-[#2d282b]"
    >
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="routes-table">
            <thead>
              <tr>
                <th style={{ width: '150px' }}>Date</th>
                <th style={{ width: '220px' }}>Purpose</th>
                <th style={{ width: '140px' }}>Gateway</th>
                <th style={{ width: '220px' }}>Account No</th>
                <th>Transaction Ref</th>
                <th style={{ width: '150px', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="routes-table__empty">
                    Loading account history entries...
                  </td>
                </tr>
              ) : rows.length ? (
                rows.map((row) => (
                  <tr key={row.id}>
                    <td className="routes-table__muted">{row.dateLabel}</td>
                    <td>
                      <div className="flex flex-col gap-1 py-3">
                        <span className="font-semibold text-white">{row.purposeLabel}</span>
                        <span
                          className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${row.transactionTypeToneClassName}`}
                        >
                          {row.transactionTypeLabel}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: row.gatewayColor }} />
                        <span className="font-semibold text-white">{row.gatewayLabel}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1 py-3">
                        <span className="text-sm font-semibold text-white">User: {row.userAccountNumber}</span>
                        <span className="text-xs text-[#8fa0bd]">Transferred to: {row.companyAccountNumber}</span>
                      </div>
                    </td>
                    <td className="routes-table__code">{row.transactionReference}</td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="font-semibold text-white">{row.amountLabel}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="routes-table__empty">
                    No records found for the selected date range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 p-4 md:hidden">
        {isLoading ? (
          <div className="rounded-lg border border-[#332d30] bg-[#231f21] px-4 py-5 text-center text-sm font-medium text-[#8fa0bd]">
            Loading account history entries...
          </div>
        ) : rows.length ? (
          rows.map((row) => <MobileHistoryCard key={row.id} row={row} />)
        ) : (
          <div className="rounded-lg border border-[#332d30] bg-[#231f21] px-4 py-5 text-center text-sm font-medium text-[#8fa0bd]">
            No records found for the selected date range.
          </div>
        )}
      </div>

      <div className="routes-table-footer">
        <p>
          Showing {pagination.from || 0}-{pagination.to || rows.length} of {pagination.total || rows.length} ledger rows
        </p>
        <DailyBalancePagination isLoading={isLoading} page={page} pagination={pagination} setPage={onPageChange} />
      </div>
    </DashboardSection>
  )
}
