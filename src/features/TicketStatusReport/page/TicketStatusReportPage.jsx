import { Printer, RefreshCcw, Ticket } from 'lucide-react'
import { useMemo, useState } from 'react'
import AdminDataTable, { AdminTableButton } from '../../../components/ui/AdminDataTable'
import { ReportHubBackLink } from '../../Reports/component/ReportHubBackLink.jsx'
import { SalesReportTabs } from '../../SalesReports/component/SalesReportTabs.jsx'
import { ticketStatusReportColumns } from '../component/column.jsx'
import { TicketStatusReportOverview } from '../component/TicketStatusReportOverview.jsx'
import { TICKET_STATUS_REPORT_COPY } from '../constants/ticketStatusReport.constants'
import useTicketStatusReport from '../hooks/useTicketStatusReport'
import { filterTicketStatusRows } from '../utils/ticketStatusReportUtils'

export default function TicketStatusReportPage() {
  const { data, error, isLoading, refresh } = useTicketStatusReport()
  const { rows, summary } = data
  const [search, setSearch] = useState('')
  const filteredRows = useMemo(() => filterTicketStatusRows(rows, search), [rows, search])

  return (
    <main className="routes-page">
      <div className="routes-page__inner">
        <ReportHubBackLink />
        <header className="routes-page__header">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="routes-page__title">
                <Ticket size={20} color="#4f83ff" />
                <h1>{TICKET_STATUS_REPORT_COPY.title}</h1>
              </div>
              <p className="routes-page__subtitle">{TICKET_STATUS_REPORT_COPY.subtitle}</p>
            </div>

            <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#332d30] bg-[#171314] px-4 text-sm font-semibold text-[#c5d9f7]">
              <Ticket size={16} />
              <span>{summary.totalTicketsLabel} total tickets</span>
            </div>
          </div>
        </header>

        <SalesReportTabs />
        <TicketStatusReportOverview isLoading={isLoading} summary={summary} />
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
          columns={ticketStatusReportColumns}
          data={filteredRows}
          emptyMessage="No ticket status data found."
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
              ? `Showing ${filteredRows.length} filtered statuses from ${rows.length} total statuses`
              : `Showing ${filteredRows.length} ticket statuses`
          }
          search={search}
          searchPlaceholder={TICKET_STATUS_REPORT_COPY.searchPlaceholder}
          onSearchChange={setSearch}
        />
      </div>
    </main>
  )
}
