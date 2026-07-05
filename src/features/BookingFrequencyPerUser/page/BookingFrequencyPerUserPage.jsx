import { RefreshCcw, Repeat2 } from 'lucide-react'
import AdminDataTable, { AdminTableButton } from '../../../components/ui/AdminDataTable'
import { ReportHubBackLink } from '../../Reports/component/ReportHubBackLink.jsx'
import { BookingFrequencyOverview } from '../component/BookingFrequencyOverview.jsx'
import { bookingFrequencyColumns } from '../component/column.jsx'
import { BOOKING_FREQUENCY_PER_USER_COPY } from '../constants/bookingFrequencyPerUser.constants'
import useBookingFrequencyPerUser from '../hooks/useBookingFrequencyPerUser'
import { buildBookingFrequencySummary } from '../utils/bookingFrequencyPerUserUtils'

export default function BookingFrequencyPerUserPage() {
  const { error, isLoading, items, page, pagination, refresh, search, setPage, setSearch } = useBookingFrequencyPerUser()
  const summary = buildBookingFrequencySummary(items)

  return (
    <main className="routes-page">
      <div className="routes-page__inner">
        <ReportHubBackLink />
        <header className="routes-page__header">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="routes-page__title">
                <Repeat2 size={20} color="#4f83ff" />
                <h1>{BOOKING_FREQUENCY_PER_USER_COPY.title}</h1>
              </div>
              <p className="routes-page__subtitle">{BOOKING_FREQUENCY_PER_USER_COPY.subtitle}</p>
            </div>

            <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#332d30] bg-[#171314] px-4 text-sm font-semibold text-[#c5d9f7]">
              <Repeat2 size={16} />
              <span>{summary.topCustomerLabel}</span>
            </div>
          </div>
        </header>

        <BookingFrequencyOverview isLoading={isLoading} summary={summary} />

        {error ? <p className="month-balance-alert">{error}</p> : null}

        <AdminDataTable
          actions={
            <AdminTableButton className={isLoading ? 'opacity-60' : ''} disabled={isLoading} onClick={() => refresh()}>
              <RefreshCcw size={14} />
              Refresh
            </AdminTableButton>
          }
          columns={bookingFrequencyColumns}
          data={items}
          emptyMessage="No booking frequency records found."
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
          searchPlaceholder={BOOKING_FREQUENCY_PER_USER_COPY.searchPlaceholder}
        />
      </div>
    </main>
  )
}
