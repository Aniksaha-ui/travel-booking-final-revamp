import { Printer, RefreshCcw, Route } from 'lucide-react'
import { useMemo, useState } from 'react'
import AdminDataTable, { AdminTableButton } from '../../../components/ui/AdminDataTable'
import { ReportHubBackLink } from '../../Reports/component/ReportHubBackLink.jsx'
import { SalesReportTabs } from '../../SalesReports/component/SalesReportTabs.jsx'
import { routeWiseSalesColumns } from '../component/column.jsx'
import { RouteWiseSalesOverview } from '../component/RouteWiseSalesOverview.jsx'
import { ROUTE_WISE_SALES_REPORT_COPY } from '../constants/routeWiseSalesReport.constants'
import useRouteWiseSalesReport from '../hooks/useRouteWiseSalesReport'
import { filterRouteWiseSalesRows } from '../utils/routeWiseSalesReportUtils'

export default function RouteWiseSalesReportPage() {
  const { data, error, isLoading, refresh } = useRouteWiseSalesReport()
  const { rows, summary } = data
  const [search, setSearch] = useState('')
  const filteredRows = useMemo(() => filterRouteWiseSalesRows(rows, search), [rows, search])

  return (
    <main className="routes-page">
      <div className="routes-page__inner">
        <ReportHubBackLink />
        <header className="routes-page__header">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="routes-page__title">
                <Route size={20} color="#4f83ff" />
                <h1>{ROUTE_WISE_SALES_REPORT_COPY.title}</h1>
              </div>
              <p className="routes-page__subtitle">{ROUTE_WISE_SALES_REPORT_COPY.subtitle}</p>
            </div>

            <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#332d30] bg-[#171314] px-4 text-sm font-semibold text-[#c5d9f7]">
              <Route size={16} />
              <span>{summary.totalRevenueLabel} routed</span>
            </div>
          </div>
        </header>

        <SalesReportTabs />
        <RouteWiseSalesOverview isLoading={isLoading} summary={summary} />
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
          columns={routeWiseSalesColumns}
          data={filteredRows}
          emptyMessage="No route wise sales data found."
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
              ? `Showing ${filteredRows.length} filtered routes from ${rows.length} total routes`
              : `Showing ${filteredRows.length} routes`
          }
          search={search}
          searchPlaceholder={ROUTE_WISE_SALES_REPORT_COPY.searchPlaceholder}
          onSearchChange={setSearch}
        />
      </div>
    </main>
  )
}
