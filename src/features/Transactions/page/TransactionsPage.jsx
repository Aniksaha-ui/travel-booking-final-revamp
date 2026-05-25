import dayjs from 'dayjs'
import { ReceiptText, RefreshCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import AdminDataTable, { AdminTableButton } from '../../../components/ui/AdminDataTable'
import { TransactionDetailsModal } from '../component/TransactionDetailsModal.jsx'
import { TransactionsFilters } from '../component/TransactionsFilters.jsx'
import { TransactionsOverview } from '../component/TransactionsOverview.jsx'
import { transactionsColumns } from '../component/column.jsx'
import { TRANSACTIONS_PAGE_COPY } from '../constants/transactions.constants'
import useTransactions from '../hooks/useTransactions'
import { buildTransactionMetrics } from '../utils/transactionsUtils'

const formatHeaderDate = (value) => {
  const parsedDate = dayjs(value)
  return parsedDate.isValid() ? parsedDate.format('DD MMM YYYY') : value
}

export default function TransactionsPage() {
  const toast = useToast()
  const apiState = useTransactions()
  const [draftStartDate, setDraftStartDate] = useState(apiState.dateRange.startDate)
  const [draftEndDate, setDraftEndDate] = useState(apiState.dateRange.endDate)
  const metrics = useMemo(() => buildTransactionMetrics(apiState.items), [apiState.items])
  const hasActiveRange = Boolean(apiState.dateRange.startDate || apiState.dateRange.endDate)
  const headerLabel = hasActiveRange
    ? apiState.dateRange.startDate && apiState.dateRange.endDate
      ? `${formatHeaderDate(apiState.dateRange.startDate)} - ${formatHeaderDate(apiState.dateRange.endDate)}`
      : apiState.dateRange.startDate
        ? `From ${formatHeaderDate(apiState.dateRange.startDate)}`
        : `Until ${formatHeaderDate(apiState.dateRange.endDate)}`
    : `${apiState.pagination.total || apiState.items.length} matched transactions`

  const handleApplyFilters = () => {
    if (
      draftStartDate &&
      draftEndDate &&
      dayjs(draftEndDate).isValid() &&
      dayjs(draftStartDate).isValid() &&
      draftEndDate < draftStartDate
    ) {
      toast.error('To date cannot be earlier than from date.')
      return
    }

    apiState.setPage(1)
    apiState.setDateRange({
      endDate: draftEndDate,
      startDate: draftStartDate,
    })
  }

  const handleClearFilters = () => {
    setDraftStartDate('')
    setDraftEndDate('')
    apiState.setPage(1)
    apiState.setDateRange({
      endDate: '',
      startDate: '',
    })
  }

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
              <span>{headerLabel}</span>
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
          filters={
            <TransactionsFilters
              draftEndDate={draftEndDate}
              draftStartDate={draftStartDate}
              hasActiveRange={hasActiveRange}
              isLoading={apiState.isLoading}
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
              onEndDateChange={setDraftEndDate}
              onStartDateChange={setDraftStartDate}
            />
          }
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
