import dayjs from 'dayjs'
import { ReceiptText, RefreshCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import AdminDataTable, { AdminTableButton } from '../../../components/ui/AdminDataTable'
import { BookingInvoiceModal } from '../component/BookingInvoiceModal.jsx'
import { BookingsFilters } from '../component/BookingsFilters.jsx'
import { BookingsOverview } from '../component/BookingsOverview.jsx'
import { bookingsColumns } from '../component/column.jsx'
import { BOOKING_TYPE_FILTERS, BOOKINGS_PAGE_COPY } from '../constants/bookings.constants'
import useBookings from '../hooks/useBookings'
import { buildBookingsMetrics, filterBookingsByType } from '../utils/bookingsUtils'

const formatHeaderDate = (value) => {
  const parsedDate = dayjs(value)
  return parsedDate.isValid() ? parsedDate.format('DD MMM YYYY') : value
}

export default function BookingsPage() {
  const toast = useToast()
  const [typeFilter, setTypeFilter] = useState('all')
  const apiState = useBookings()
  const [draftStartDate, setDraftStartDate] = useState(apiState.dateRange.startDate)
  const [draftEndDate, setDraftEndDate] = useState(apiState.dateRange.endDate)
  const visibleBookings = useMemo(
    () => filterBookingsByType(apiState.items, typeFilter),
    [apiState.items, typeFilter],
  )
  const summary = useMemo(() => buildBookingsMetrics(visibleBookings), [visibleBookings])
  const hasActiveRange = Boolean(apiState.dateRange.startDate || apiState.dateRange.endDate)
  const headerLabel = hasActiveRange
    ? apiState.dateRange.startDate && apiState.dateRange.endDate
      ? `${formatHeaderDate(apiState.dateRange.startDate)} - ${formatHeaderDate(apiState.dateRange.endDate)}`
      : apiState.dateRange.startDate
        ? `From ${formatHeaderDate(apiState.dateRange.startDate)}`
        : `Until ${formatHeaderDate(apiState.dateRange.endDate)}`
    : `${apiState.pagination.total || apiState.items.length} matched bookings`

  const handleApplyFilters = () => {
    if (
      draftStartDate &&
      draftEndDate &&
      dayjs(draftEndDate).isValid() &&
      dayjs(draftStartDate).isValid() &&
      draftEndDate < draftStartDate
    ) {
      toast.error('To date cannot be earlier than from date.')
      return
    }

    apiState.setPage(1)
    apiState.setDateRange({
      endDate: draftEndDate,
      startDate: draftStartDate,
    })
  }

  const handleClearFilters = () => {
    setDraftStartDate('')
    setDraftEndDate('')
    apiState.setPage(1)
    apiState.setDateRange({
      endDate: '',
      startDate: '',
    })
  }

  const resultLabel = useMemo(() => {
    if (!apiState.pagination.total && !apiState.items.length) {
      return 'No bookings found.'
    }

    const typeLabel =
      BOOKING_TYPE_FILTERS.find((filter) => filter.key === typeFilter)?.label.toLowerCase() ?? 'all bookings'
    const rangeLabel =
      apiState.pagination.from && apiState.pagination.to
        ? `${apiState.pagination.from}-${apiState.pagination.to}`
        : '0'

    return `Showing ${visibleBookings.length} ${typeLabel} on this page • ${rangeLabel} of ${apiState.pagination.total} matched bookings`
  }, [apiState.items.length, apiState.pagination.from, apiState.pagination.to, apiState.pagination.total, typeFilter, visibleBookings.length])

  return (
    <main className="routes-page">
      <div className="routes-page__inner">
        <header className="routes-page__header">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="routes-page__title">
                <ReceiptText size={20} color="#4f83ff" />
                <h1>{BOOKINGS_PAGE_COPY.title}</h1>
              </div>
              <p className="routes-page__subtitle">{BOOKINGS_PAGE_COPY.subtitle}</p>
            </div>

            <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#332d30] bg-[#171314] px-4 text-sm font-semibold text-[#c5d9f7]">
              <ReceiptText size={16} />
              <span>{headerLabel}</span>
            </div>
          </div>
        </header>

        <BookingsOverview isLoading={apiState.isLoading} summary={summary} />
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
          columns={bookingsColumns}
          data={visibleBookings}
          emptyMessage={
            typeFilter === 'all'
              ? 'No bookings found.'
              : `No ${BOOKING_TYPE_FILTERS.find((filter) => filter.key === typeFilter)?.label.toLowerCase()} on this page.`
          }
          filters={
            <div className="flex flex-wrap items-center gap-3">
              <div className="refund-filter-group">
                {BOOKING_TYPE_FILTERS.map((filter) => (
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
              <BookingsFilters
                draftEndDate={draftEndDate}
                draftStartDate={draftStartDate}
                hasActiveRange={hasActiveRange}
                isLoading={apiState.isLoading}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
                onEndDateChange={setDraftEndDate}
                onStartDateChange={setDraftStartDate}
              />
            </div>
          }
          isLoading={apiState.isLoading}
          onPageChange={apiState.setPage}
          onSearchChange={(value) => {
            apiState.setPage(1)
            apiState.setSearch(value)
          }}
          pagination={apiState.pagination}
          renderRowActions={(booking) => (
            <button
              type="button"
              className="refund-action-button"
              disabled={apiState.invoiceLoading && apiState.loadingInvoiceBookingId === booking.id}
              onClick={() => apiState.openInvoice(booking)}
            >
              {apiState.invoiceLoading && apiState.loadingInvoiceBookingId === booking.id ? 'Loading...' : 'Invoice'}
            </button>
          )}
          resultLabel={resultLabel}
          rowActionsWidth="110px"
          search={apiState.search}
          searchPlaceholder={BOOKINGS_PAGE_COPY.searchPlaceholder}
        />
      </div>

      {apiState.invoiceOpen ? (
        <BookingInvoiceModal
          booking={apiState.selectedBooking}
          error={apiState.invoiceError}
          invoice={apiState.invoice}
          isLoading={apiState.invoiceLoading}
          onClose={apiState.closeInvoice}
        />
      ) : null}
    </main>
  )
}
