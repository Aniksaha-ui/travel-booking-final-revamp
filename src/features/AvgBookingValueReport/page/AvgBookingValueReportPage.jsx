import { BarChart3, Printer, RefreshCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import AdminDataTable, { AdminTableButton } from '../../../components/ui/AdminDataTable'
import { ReportHubBackLink } from '../../Reports/component/ReportHubBackLink.jsx'
import { avgBookingValueColumns } from '../component/column.jsx'
import { AvgBookingValueOverview } from '../component/AvgBookingValueOverview.jsx'
import { AVG_BOOKING_VALUE_REPORT_COPY } from '../constants/avgBookingValueReport.constants'
import useAvgBookingValueReport from '../hooks/useAvgBookingValueReport'
import { filterAvgBookingValueRows } from '../utils/avgBookingValueReportUtils'

export default function AvgBookingValueReportPage() {
  const { data, error, isLoading, refresh } = useAvgBookingValueReport()
  const { rows, summary } = data
  const [search, setSearch] = useState('')
  const filteredRows = useMemo(() => filterAvgBookingValueRows(rows, search), [rows, search])

  return (
    <main className="routes-page">
      <div className="routes-page__inner">
        <ReportHubBackLink />
        <header className="routes-page__header">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="routes-page__title">
                <BarChart3 size={20} color="#4f83ff" />
                <h1>{AVG_BOOKING_VALUE_REPORT_COPY.title}</h1>
              </div>
              <p className="routes-page__subtitle">{AVG_BOOKING_VALUE_REPORT_COPY.subtitle}</p>
            </div>

            <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#332d30] bg-[#171314] px-4 text-sm font-semibold text-[#c5d9f7]">
              <BarChart3 size={16} />
              <span>{summary.averageValueLabel} average value</span>
            </div>
          </div>
        </header>

        <AvgBookingValueOverview isLoading={isLoading} summary={summary} />
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
          columns={avgBookingValueColumns}
          data={filteredRows}
          emptyMessage="No average booking value data found."
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
              ? `Showing ${filteredRows.length} filtered booking types from ${rows.length} total types`
              : `Showing ${filteredRows.length} booking types`
          }
          search={search}
          searchPlaceholder={AVG_BOOKING_VALUE_REPORT_COPY.searchPlaceholder}
          onSearchChange={setSearch}
        />
      </div>
    </main>
  )
}
