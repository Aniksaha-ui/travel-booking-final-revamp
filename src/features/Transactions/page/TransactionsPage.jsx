import { ReceiptText, RefreshCcw } from 'lucide-react'
import { useMemo } from 'react'
import AdminDataTable, { AdminTableButton } from '../../../components/ui/AdminDataTable'
import { TransactionDetailsModal } from '../component/TransactionDetailsModal.jsx'
import { TransactionsOverview } from '../component/TransactionsOverview.jsx'
import { transactionsColumns } from '../component/column.jsx'
import { TRANSACTIONS_PAGE_COPY } from '../constants/transactions.constants'
import useTransactions from '../hooks/useTransactions'
import { buildTransactionMetrics } from '../utils/transactionsUtils'

export default function TransactionsPage() {
  const apiState = useTransactions()
  const metrics = useMemo(() => buildTransactionMetrics(apiState.items), [apiState.items])

  const resultLabel = useMemo(() => {
    if (!apiState.pagination.total && !apiState.items.length) {
      return 'No transactions found.'
    }

    const rangeLabel =
      apiState.pagination.from && apiState.pagination.to
        ? `${apiState.pagination.from}-${apiState.pagination.to}`
        : '0'

    return `Showing ${apiState.items.length} transactions on this page • ${rangeLabel} of ${apiState.pagination.total} matched transactions`
  }, [apiState.items.length, apiState.pagination.from, apiState.pagination.to, apiState.pagination.total])

  return (
    <main className="routes-page">
      <div className="routes-page__inner">
        <header className="routes-page__header">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="routes-page__title">
                <ReceiptText size={20} color="#4f83ff" />
                <h1>{TRANSACTIONS_PAGE_COPY.title}</h1>
              </div>
              <p className="routes-page__subtitle">{TRANSACTIONS_PAGE_COPY.subtitle}</p>
            </div>

            <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#332d30] bg-[#171314] px-4 text-sm font-semibold text-[#c5d9f7]">
              <ReceiptText size={16} />
              <span>{apiState.pagination.total || apiState.items.length} matched transactions</span>
            </div>
          </div>
        </header>

        <TransactionsOverview isLoading={apiState.isLoading} metrics={metrics} pagination={apiState.pagination} />
        {apiState.error ? <p className="month-balance-alert">{apiState.error}</p> : null}

        <AdminDataTable
          actions={
            <AdminTableButton
              className={apiState.isLoading ? 'opacity-60' : ''}
              disabled={apiState.isLoading}
              onClick={() => apiState.refresh()}
            >
              <RefreshCcw size={14} />
              Refresh
            </AdminTableButton>
          }
          columns={transactionsColumns}
          data={apiState.items}
          emptyMessage="No transactions found."
          isLoading={apiState.isLoading}
          onPageChange={apiState.setPage}
          onSearchChange={(value) => {
            apiState.setPage(1)
            apiState.setSearch(value)
          }}
          pagination={apiState.pagination}
          renderRowActions={(transaction) => (
            <button type="button" className="refund-action-button" onClick={() => apiState.openDetails(transaction)}>
              View
            </button>
          )}
          resultLabel={resultLabel}
          rowActionsWidth="92px"
          search={apiState.search}
          searchPlaceholder={TRANSACTIONS_PAGE_COPY.searchPlaceholder}
        />
      </div>

      {apiState.detailsOpen ? (
        <TransactionDetailsModal onClose={apiState.closeDetails} transaction={apiState.selectedTransaction} />
      ) : null}
    </main>
  )
}
