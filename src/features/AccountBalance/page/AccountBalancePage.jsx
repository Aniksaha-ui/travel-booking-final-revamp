import { Landmark, RefreshCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import AdminDataTable, { AdminTableButton } from '../../../components/ui/AdminDataTable'
import { AccountBalanceOverview } from '../component/AccountBalanceOverview.jsx'
import { AccountHistoryDrawer } from '../component/AccountHistoryDrawer.jsx'
import { accountBalanceColumns } from '../component/column.jsx'
import { ACCOUNT_BALANCE_COPY } from '../constants/accountBalance.constants'
import useAccountBalance from '../hooks/useAccountBalance'
import { buildAccountBalanceMetrics } from '../utils/accountBalanceUtils'

export default function AccountBalancePage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const apiState = useAccountBalance()

  const typeFilters = useMemo(() => {
    const typeMap = new Map()

    apiState.items.forEach((item) => {
      if (!typeMap.has(item.typeKey)) {
        typeMap.set(item.typeKey, {
          key: item.typeKey,
          label: item.typeLabel,
        })
      }
    })

    return [
      { key: 'all', label: 'All Types' },
      ...[...typeMap.values()].sort((firstItem, secondItem) => firstItem.label.localeCompare(secondItem.label)),
    ]
  }, [apiState.items])

  const visibleRows = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return apiState.items.filter((item) => {
      const matchesType = typeFilter === 'all' || item.typeKey === typeFilter

      if (!matchesType) {
        return false
      }

      if (!normalizedSearch) {
        return true
      }

      return [item.accountName, item.accountNumber, item.typeLabel]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
    })
  }, [apiState.items, search, typeFilter])

  const metrics = useMemo(() => buildAccountBalanceMetrics(visibleRows), [visibleRows])
  const pagination = useMemo(
    () => ({
      currentPage: 1,
      from: visibleRows.length ? 1 : 0,
      lastPage: 1,
      to: visibleRows.length,
      total: visibleRows.length,
    }),
    [visibleRows.length],
  )

  const resultLabel = useMemo(() => {
    if (!visibleRows.length) {
      return 'No account balances found.'
    }

    const filterLabel =
      typeFilters.find((filter) => filter.key === typeFilter)?.label.toLowerCase() ?? 'all types'

    return `Showing ${visibleRows.length} account balances in ${filterLabel}`
  }, [typeFilter, typeFilters, visibleRows.length])

  return (
    <main className="routes-page">
      <div className="routes-page__inner">
        <header className="routes-page__header">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="routes-page__title">
                <Landmark size={20} color="#4f83ff" />
                <h1>{ACCOUNT_BALANCE_COPY.title}</h1>
              </div>
              <p className="routes-page__subtitle">{ACCOUNT_BALANCE_COPY.subtitle}</p>
            </div>

            <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#332d30] bg-[#171314] px-4 text-sm font-semibold text-[#c5d9f7]">
              <Landmark size={16} />
              <span>{apiState.items.length} tracked accounts</span>
            </div>
          </div>
        </header>

        <AccountBalanceOverview isLoading={apiState.isLoading} metrics={metrics} />
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
          columns={accountBalanceColumns}
          data={visibleRows}
          emptyMessage="No account balances found."
          filters={
            <div className="refund-filter-group">
              {typeFilters.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  className={`refund-filter-button ${typeFilter === filter.key ? 'is-active' : ''}`}
                  onClick={() => setTypeFilter(filter.key)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          }
          isLoading={apiState.isLoading}
          onPageChange={() => {}}
          onSearchChange={setSearch}
          pagination={pagination}
          renderRowActions={(account) => (
            <button type="button" className="refund-action-button" onClick={() => apiState.openHistory(account)}>
              History
            </button>
          )}
          resultLabel={resultLabel}
          rowActionsWidth="102px"
          search={search}
          searchPlaceholder={ACCOUNT_BALANCE_COPY.searchPlaceholder}
        />
      </div>

      {apiState.historyOpen ? (
        <AccountHistoryDrawer
          error={apiState.historyError}
          isLoading={apiState.historyLoading}
          onClose={apiState.closeHistory}
          rows={apiState.historyItems}
          summary={apiState.historySummary}
          typeLabel={apiState.selectedTypeLabel}
        />
      ) : null}
    </main>
  )
}
