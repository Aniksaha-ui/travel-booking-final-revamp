import { RefreshCcw, Trophy } from 'lucide-react'
import AdminDataTable, { AdminTableButton } from '../../../components/ui/AdminDataTable'
import { ReportHubBackLink } from '../../Reports/component/ReportHubBackLink.jsx'
import { topActiveCustomersColumns } from '../component/column.jsx'
import { TopActiveCustomersOverview } from '../component/TopActiveCustomersOverview.jsx'
import { TOP_ACTIVE_CUSTOMERS_COPY } from '../constants/topActiveCustomers.constants'
import useTopActiveCustomers from '../hooks/useTopActiveCustomers'
import { buildTopActiveCustomersSummary } from '../utils/topActiveCustomersUtils'

export default function TopActiveCustomersPage() {
  const { error, isLoading, items, refresh, search, setSearch } = useTopActiveCustomers()
  const summary = buildTopActiveCustomersSummary(items)
  const pagination = {
    currentPage: 1,
    from: items.length ? 1 : 0,
    lastPage: 1,
    to: items.length,
    total: items.length,
  }

  return (
    <main className="routes-page">
      <div className="routes-page__inner">
        <ReportHubBackLink />
        <header className="routes-page__header">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="routes-page__title">
                <Trophy size={20} color="#4f83ff" />
                <h1>{TOP_ACTIVE_CUSTOMERS_COPY.title}</h1>
              </div>
              <p className="routes-page__subtitle">{TOP_ACTIVE_CUSTOMERS_COPY.subtitle}</p>
            </div>

            <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#332d30] bg-[#171314] px-4 text-sm font-semibold text-[#c5d9f7]">
              <Trophy size={16} />
              <span>{summary.topCustomerLabel}</span>
            </div>
          </div>
        </header>

        <TopActiveCustomersOverview isLoading={isLoading} summary={summary} />

        {error ? <p className="month-balance-alert">{error}</p> : null}

        <AdminDataTable
          actions={
            <AdminTableButton className={isLoading ? 'opacity-60' : ''} disabled={isLoading} onClick={() => refresh()}>
              <RefreshCcw size={14} />
              Refresh
            </AdminTableButton>
          }
          columns={topActiveCustomersColumns}
          data={items}
          emptyMessage="No active customer records found."
          isLoading={isLoading}
          onSearchChange={setSearch}
          pagination={pagination}
          resultLabel={`Showing top ${items.length} customers`}
          search={search}
          searchPlaceholder={TOP_ACTIVE_CUSTOMERS_COPY.searchPlaceholder}
        />
      </div>
    </main>
  )
}
