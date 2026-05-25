import { CreditCard, Pencil, Plus, RefreshCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminDataTable, { AdminTableButton } from '../../../components/ui/AdminDataTable'
import { APP_ROUTES } from '../../../constants/routes'
import { onlinePaymentConfigColumns } from '../component/column.jsx'
import { OnlinePaymentConfigOverview } from '../component/OnlinePaymentConfigOverview.jsx'
import { ONLINE_PAYMENT_CONFIG_PAGE_COPY } from '../constants/onlinePaymentConfig.constants'
import useOnlinePaymentConfig from '../hooks/useOnlinePaymentConfig'
import {
  buildOnlinePaymentConfigMetrics,
  buildOnlinePaymentStatusFilters,
  filterOnlinePaymentConfigByStatus,
} from '../utils/onlinePaymentConfigUtils'

export default function OnlinePaymentConfigPage() {
  const navigate = useNavigate()
  const apiState = useOnlinePaymentConfig()
  const [statusFilter, setStatusFilter] = useState('all')
  const visibleConfigurations = useMemo(
    () => filterOnlinePaymentConfigByStatus(apiState.items, statusFilter),
    [apiState.items, statusFilter],
  )
  const metrics = useMemo(() => buildOnlinePaymentConfigMetrics(apiState.items), [apiState.items])
  const statusFilters = useMemo(() => buildOnlinePaymentStatusFilters(apiState.items), [apiState.items])

  const resultLabel = useMemo(() => {
    if (!apiState.pagination.total && !apiState.items.length) {
      return 'No configurations found.'
    }

    const filterLabel =
      statusFilters.find((filter) => filter.key === statusFilter)?.label.toLowerCase() ?? 'all configs'
    const rangeLabel =
      apiState.pagination.from && apiState.pagination.to
        ? `${apiState.pagination.from}-${apiState.pagination.to}`
        : `${visibleConfigurations.length}`

    return `Showing ${visibleConfigurations.length} ${filterLabel} on this page • ${rangeLabel} of ${apiState.pagination.total || apiState.items.length} matched records`
  }, [
    apiState.items.length,
    apiState.pagination.from,
    apiState.pagination.to,
    apiState.pagination.total,
    statusFilter,
    statusFilters,
    visibleConfigurations.length,
  ])

  return (
    <main className="routes-page">
      <div className="routes-page__inner">
        <header className="routes-page__header">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="routes-page__title">
                <CreditCard size={20} color="#4f83ff" />
                <h1>{ONLINE_PAYMENT_CONFIG_PAGE_COPY.title}</h1>
              </div>
              <p className="routes-page__subtitle">{ONLINE_PAYMENT_CONFIG_PAGE_COPY.subtitle}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#332d30] bg-[#171314] px-4 text-sm font-semibold text-[#c5d9f7]">
                <CreditCard size={16} />
                <span>{apiState.pagination.total || apiState.items.length} matched configs</span>
              </div>

              <button
                type="button"
                className="routes-new-button"
                onClick={() => navigate(`${APP_ROUTES.onlinePaymentConfig}/add`)}
              >
                <Plus size={15} />
                {ONLINE_PAYMENT_CONFIG_PAGE_COPY.newButtonLabel}
              </button>
            </div>
          </div>
        </header>

        <OnlinePaymentConfigOverview isLoading={apiState.isLoading} metrics={metrics} />
        {apiState.error ? <p className="month-balance-alert">{apiState.error}</p> : null}

        <AdminDataTable
          actions={
            <>
              <AdminTableButton
                className={apiState.isLoading ? 'opacity-60' : ''}
                disabled={apiState.isLoading}
                onClick={() => apiState.refresh()}
              >
                <RefreshCcw size={14} />
                Refresh
              </AdminTableButton>
              <button
                type="button"
                className="routes-new-button"
                onClick={() => navigate(`${APP_ROUTES.onlinePaymentConfig}/add`)}
              >
                <Plus size={15} />
                {ONLINE_PAYMENT_CONFIG_PAGE_COPY.newButtonLabel}
              </button>
            </>
          }
          columns={onlinePaymentConfigColumns}
          data={visibleConfigurations}
          emptyMessage="No configurations found."
          filters={
            <div className="refund-filter-group">
              {statusFilters.map((filter) => (
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
          renderRowActions={(configuration) => (
            <button
              type="button"
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#332d30] bg-[#211d20] px-2.5 text-xs font-semibold text-[#dbe7fb] transition hover:bg-white/5"
              onClick={() => navigate(`${APP_ROUTES.onlinePaymentConfig}/update/${configuration.id}`)}
            >
              <Pencil size={13} />
              Edit
            </button>
          )}
          resultLabel={resultLabel}
          rowActionsWidth="96px"
          search={apiState.search}
          searchPlaceholder={ONLINE_PAYMENT_CONFIG_PAGE_COPY.searchPlaceholder}
        />
      </div>
    </main>
  )
}

