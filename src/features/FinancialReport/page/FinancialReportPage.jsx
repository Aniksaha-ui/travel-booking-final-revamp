import { CircleDollarSign } from 'lucide-react'
import AdminDataTable from '../../../components/ui/AdminDataTable'
import { ReportHubBackLink } from '../../Reports/component/ReportHubBackLink.jsx'
import { FINANCIAL_REPORT_COPY } from '../constants/financialReport.constants'
import useFinancialReport from '../hooks/useFinancialReport'
import { financialReportColumns } from '../component/column.jsx'
import { FinancialReportOverview } from '../component/FinancialReportOverview.jsx'
import { buildFinancialReportMetrics } from '../utils/financialReportUtils'

export default function FinancialReportPage() {
  const { error, isLoading, items, page, pagination, search, setPage, setSearch } = useFinancialReport()
  const summary = buildFinancialReportMetrics(items)

  return (
    <main className="routes-page">
      <div className="routes-page__inner">
        <ReportHubBackLink />
        <header className="routes-page__header">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="routes-page__title">
                <CircleDollarSign size={20} color="#4f83ff" />
                <h1>{FINANCIAL_REPORT_COPY.title}</h1>
              </div>
              <p className="routes-page__subtitle">{FINANCIAL_REPORT_COPY.subtitle}</p>
            </div>

            <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#332d30] bg-[#171314] px-4 text-sm font-semibold text-[#c5d9f7]">
              <CircleDollarSign size={16} />
              <span>{pagination.total || items.length} matched financial years</span>
            </div>
          </div>
        </header>

        <FinancialReportOverview isLoading={isLoading} rows={items} summary={summary} />

        {error ? <p className="month-balance-alert">{error}</p> : null}

        <AdminDataTable
          columns={financialReportColumns}
          data={items}
          emptyMessage="No financial report records found."
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
              ? `Showing ${pagination.from}-${pagination.to} of ${pagination.total} financial years`
              : `Showing ${items.length} financial years`
          }
          search={search}
          searchPlaceholder={FINANCIAL_REPORT_COPY.searchPlaceholder}
        />
      </div>
    </main>
  )
}
