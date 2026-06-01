import { BookOpenCheck, Printer, RefreshCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import AdminDataTable, { AdminTableButton } from '../../../components/ui/AdminDataTable'
import { ReportHubBackLink } from '../../Reports/component/ReportHubBackLink.jsx'
import { bookingSummaryColumns } from '../component/column.jsx'
import { BookingSummaryOverview } from '../component/BookingSummaryOverview.jsx'
import { BOOKING_SUMMARY_COPY } from '../constants/bookingSummary.constants'
import useBookingSummary from '../hooks/useBookingSummary'
import { filterBookingSummaryRows } from '../utils/bookingSummaryUtils'

export default function BookingSummaryPage() {
  const { data, error, isLoading, refresh } = useBookingSummary()
  const { rows, summary } = data
  const [search, setSearch] = useState('')
  const filteredRows = useMemo(() => filterBookingSummaryRows(rows, search), [rows, search])

  return (
    <main className="routes-page">
      <div className="routes-page__inner">
        <ReportHubBackLink />
        <header className="routes-page__header">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="routes-page__title">
                <BookOpenCheck size={20} color="#4f83ff" />
                <h1>{BOOKING_SUMMARY_COPY.title}</h1>
              </div>
              <p className="routes-page__subtitle">{BOOKING_SUMMARY_COPY.subtitle}</p>
            </div>

            <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#332d30] bg-[#171314] px-4 text-sm font-semibold text-[#c5d9f7]">
              <BookOpenCheck size={16} />
              <span>{summary.totalBookingsLabel} total bookings</span>
            </div>
          </div>
        </header>

        <BookingSummaryOverview isLoading={isLoading} summary={summary} />
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
                Export Data
              </AdminTableButton>
            </>
          }
          columns={bookingSummaryColumns}
          data={filteredRows}
          emptyMessage="No booking summary data found."
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
          searchPlaceholder={BOOKING_SUMMARY_COPY.searchPlaceholder}
          onSearchChange={setSearch}
        />
      </div>
    </main>
  )
}
