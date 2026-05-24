import { CircleDollarSign, Printer, RefreshCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import AdminDataTable, { AdminTableButton } from '../../../components/ui/AdminDataTable'
import { SalesReportTabs } from '../../SalesReports/component/SalesReportTabs.jsx'
import { overallSalesColumns } from '../component/column.jsx'
import { OverallSalesOverview } from '../component/OverallSalesOverview.jsx'
import { OVERALL_SALES_REPORT_COPY } from '../constants/overallSalesReport.constants'
import useOverallSalesReport from '../hooks/useOverallSalesReport'
import { filterOverallSalesRows } from '../utils/overallSalesReportUtils'

export default function OverallSalesReportPage() {
  const { data, error, isLoading, refresh } = useOverallSalesReport()
  const { rows, summary } = data
  const [search, setSearch] = useState('')
  const filteredRows = useMemo(() => filterOverallSalesRows(rows, search), [rows, search])

  return (
    <main className="routes-page">
      <div className="routes-page__inner">
        <header className="routes-page__header">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="routes-page__title">
                <CircleDollarSign size={20} color="#4f83ff" />
                <h1>{OVERALL_SALES_REPORT_COPY.title}</h1>
              </div>
              <p className="routes-page__subtitle">{OVERALL_SALES_REPORT_COPY.subtitle}</p>
            </div>

            <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#332d30] bg-[#171314] px-4 text-sm font-semibold text-[#c5d9f7]">
              <CircleDollarSign size={16} />
              <span>{summary.totalSalesLabel} collected</span>
            </div>
          </div>
        </header>

        <SalesReportTabs />
        <OverallSalesOverview isLoading={isLoading} summary={summary} />
        {error ? <p className="month-balance-alert">{error}</p> : null}

        <AdminDataTable
          actions={
            <>
              <AdminTableButton className={isLoading ? 'opacity-60' : ''} disabled={isLoading} onClick={refresh}>
                <RefreshCcw size={14} />
                Refresh
              </AdminTableButton>
              <AdminTableButton onClick={() => window.print()}>
                <Printer size={14} />
                Print Report
              </AdminTableButton>
            </>
          }
          columns={overallSalesColumns}
          data={filteredRows}
          emptyMessage="No overall sales data found."
          isLoading={isLoading}
          pagination={{
            currentPage: 1,
            from: filteredRows.length ? 1 : 0,
            lastPage: 1,
            to: filteredRows.length,
            total: filteredRows.length,
          }}
          resultLabel={
            search
              ? `Showing ${filteredRows.length} filtered sources from ${rows.length} total sources`
              : `Showing ${filteredRows.length} sales sources`
          }
          search={search}
          searchPlaceholder={OVERALL_SALES_REPORT_COPY.searchPlaceholder}
          onSearchChange={setSearch}
        />
      </div>
    </main>
  )
}
