import { RefreshCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import AdminDataTable, { AdminTableButton } from '../../../components/ui/AdminDataTable'
import { refundColumns } from '../component/column.jsx'
import { RefundManagementOverview } from '../component/RefundManagementOverview.jsx'
import {
  REFUND_PAGE_COPY,
  REFUND_STATUS_FILTERS,
  REFUND_STATUS_LABELS,
} from '../constants/refunds.constants'
import useRefunds from '../hooks/useRefunds'
import { buildRefundMetrics, filterRefundsByStatus } from '../utils/refundUtils'

export default function RefundsPage() {
  const [statusFilter, setStatusFilter] = useState('all')
  const apiState = useRefunds()
  const pageMetrics = useMemo(() => buildRefundMetrics(apiState.items), [apiState.items])
  const visibleRefunds = useMemo(
    () => filterRefundsByStatus(apiState.items, statusFilter),
    [apiState.items, statusFilter],
  )

  const resultLabel = useMemo(() => {
    if (!apiState.pagination.total) {
      return 'No refund requests found.'
    }

    const rangeLabel =
      apiState.pagination.from && apiState.pagination.to
        ? `${apiState.pagination.from}-${apiState.pagination.to}`
        : '0'
    const scopeLabel =
      statusFilter === 'all' ? 'all statuses' : `${REFUND_STATUS_LABELS[statusFilter].toLowerCase()} only`

    return `Showing ${visibleRefunds.length} ${scopeLabel} on this page • ${rangeLabel} of ${apiState.pagination.total} matched refunds`
  }, [apiState.pagination.from, apiState.pagination.to, apiState.pagination.total, statusFilter, visibleRefunds.length])

  return (
    <main className="routes-page">
      <div className="routes-page__inner">
        <header className="routes-page__header">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="routes-page__title">
                <RefreshCcw size={20} color="#4f83ff" />
                <h1>{REFUND_PAGE_COPY.title}</h1>
              </div>
              <p className="routes-page__subtitle">{REFUND_PAGE_COPY.subtitle}</p>
            </div>

            <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#332d30] bg-[#171314] px-4 text-sm font-semibold text-[#c5d9f7]">
              <RefreshCcw size={16} />
              <span>{pageMetrics.pendingCount} pending disbursement</span>
            </div>
          </div>
        </header>

        <RefundManagementOverview
          isLoading={apiState.isLoading}
          pagination={apiState.pagination}
          refunds={visibleRefunds}
        />

        {apiState.error ? <p className="month-balance-alert">{apiState.error}</p> : null}

        <AdminDataTable
          actions={
            <AdminTableButton
              className={apiState.isLoading ? 'opacity-60' : ''}
              onClick={() => apiState.refresh()}
              disabled={apiState.isLoading}
            >
              <RefreshCcw size={14} />
              Refresh
            </AdminTableButton>
          }
          columns={refundColumns}
          data={visibleRefunds}
          emptyMessage={
            statusFilter === 'all'
              ? 'No refund requests found.'
              : `No ${REFUND_STATUS_LABELS[statusFilter].toLowerCase()} refunds on this page.`
          }
          filters={
            <div className="refund-filter-group">
              {REFUND_STATUS_FILTERS.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  className={`refund-filter-button ${statusFilter === filter.key ? 'is-active' : ''}`}
                  onClick={() => setStatusFilter(filter.key)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          }
          isLoading={apiState.isLoading}
          onPageChange={apiState.setPage}
          onSearchChange={(value) => {
            apiState.setPage(1)
            apiState.setSearch(value)
          }}
          pagination={apiState.pagination}
          renderRowActions={(refund) =>
            refund.status === 'pending' ? (
              <button
                type="button"
                className="refund-action-button"
                disabled={apiState.isMutating}
                onClick={() => apiState.disburseItem(refund.id)}
              >
                {apiState.mutatingRefundId === refund.id ? 'Sending...' : 'Disburse'}
              </button>
            ) : (
              <span className="text-xs font-bold uppercase tracking-[0.08em] text-[#8fa0bd]">
                Settled
              </span>
            )
          }
          resultLabel={resultLabel}
          rowActionsWidth="116px"
          search={apiState.search}
          searchPlaceholder={REFUND_PAGE_COPY.searchPlaceholder}
        />
      </div>
    </main>
  )
}
