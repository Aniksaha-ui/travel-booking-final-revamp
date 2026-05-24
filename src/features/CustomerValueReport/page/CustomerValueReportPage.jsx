import { RefreshCcw, Trophy } from 'lucide-react'
import AdminDataTable, { AdminTableButton } from '../../../components/ui/AdminDataTable'
import { customerValueColumns } from '../component/column.jsx'
import { CustomerValueOverview } from '../component/CustomerValueOverview.jsx'
import { CUSTOMER_VALUE_REPORT_COPY } from '../constants/customerValueReport.constants'
import useCustomerValueReport from '../hooks/useCustomerValueReport'
import { buildCustomerValueSummary } from '../utils/customerValueReportUtils'

export default function CustomerValueReportPage() {
  const { error, isLoading, items, page, pagination, refresh, search, setPage, setSearch } = useCustomerValueReport()
  const summary = buildCustomerValueSummary(items)

  return (
    <main className="routes-page">
      <div className="routes-page__inner">
        <header className="routes-page__header">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="routes-page__title">
                <Trophy size={20} color="#4f83ff" />
                <h1>{CUSTOMER_VALUE_REPORT_COPY.title}</h1>
              </div>
              <p className="routes-page__subtitle">{CUSTOMER_VALUE_REPORT_COPY.subtitle}</p>
            </div>

            <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#332d30] bg-[#171314] px-4 text-sm font-semibold text-[#c5d9f7]">
              <Trophy size={16} />
              <span>{summary.topCustomerLabel}</span>
            </div>
          </div>
        </header>

        <CustomerValueOverview isLoading={isLoading} summary={summary} />

        {error ? <p className="month-balance-alert">{error}</p> : null}

        <AdminDataTable
          actions={
            <AdminTableButton className={isLoading ? 'opacity-60' : ''} disabled={isLoading} onClick={() => refresh()}>
              <RefreshCcw size={14} />
              Refresh
            </AdminTableButton>
          }
          columns={customerValueColumns}
          data={items}
          emptyMessage="No customer value records found."
          isLoading={isLoading}
          onPageChange={setPage}
          onSearchChange={(value) => {
            if (page !== 1) {
              setPage(1)
            }

            setSearch(value)
          }}
          pagination={pagination}
          resultLabel={
            pagination
              ? `Showing ${pagination.from}-${pagination.to} of ${pagination.total} customers`
              : `Showing ${items.length} customers`
          }
          search={search}
          searchPlaceholder={CUSTOMER_VALUE_REPORT_COPY.searchPlaceholder}
        />
      </div>
    </main>
  )
}
