import { CalendarCheck, RefreshCcw, X } from 'lucide-react'
import { MobileDisclosureCards } from '../../../components/ui/MobileDisclosureCards.jsx'

function SummaryCard({ label, value }) {
  return (
    <article className="rounded-lg border border-[#332d30] bg-[#231f21] p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8fa0bd]">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </article>
  )
}

export function CurrentMonthBookingsDrawer({
  error,
  isLoading,
  monthLabel,
  onClose,
  onRefresh,
  rows,
  summary,
}) {
  const mobileItems = rows.map((row) => ({
    id: row.id,
    rows: [
      { label: 'Customer', value: row.userName },
      { label: 'Trip', value: row.tripNameLabel },
      { label: 'Type', value: row.bookingTypeLabel },
      { label: 'Product', value: row.productNameLabel },
      { label: 'Status', value: row.paymentStatusLabel },
      { label: 'Seats', value: row.seatCountLabel },
      { label: 'Date', value: row.bookingDateLabel },
    ],
    secondaryValue: `${row.userName} • ${row.bookingDateLabel}`,
    summaryLabel: 'Booking ID',
    summaryValue: row.bookingIdLabel,
  }))

  return (
    <div className="report-drawer" role="dialog" aria-modal="true">
      <button
        type="button"
        className="report-drawer__backdrop"
        aria-label="Close current month bookings drawer"
        onClick={onClose}
      />

      <aside className="report-drawer__panel">
        <header className="report-drawer__header">
          <div className="min-w-0">
            <span className="report-drawer__eyebrow">Current month bookings</span>
            <h2>{monthLabel}</h2>
            <p className="report-drawer__subtitle">
              Live booking records for the current month, including customer, trip, type, payment status, and booking date.
            </p>
          </div>

          <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center">
            <button type="button" className="report-drawer__close" onClick={onRefresh}>
              <RefreshCcw size={16} />
              Refresh
            </button>
            <button type="button" className="report-drawer__close" onClick={onClose}>
              <X size={16} />
              Close
            </button>
          </div>
        </header>

        <div className="report-drawer__body">
          {isLoading ? (
            <div className="flex min-h-[260px] items-center justify-center rounded-lg border border-[#332d30] bg-[#231f21] text-sm font-medium text-[#8fa0bd]">
              Loading current month bookings...
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-900/60 bg-red-950/20 px-4 py-5 text-sm font-medium text-red-200">
              {error}
            </div>
          ) : (
            <>
              <div className="mb-5 grid gap-3 md:grid-cols-4">
                <SummaryCard label="Bookings" value={summary.totalBookingsLabel} />
                <SummaryCard label="Confirmed" value={summary.confirmedBookingsLabel} />
                <SummaryCard label="Customers" value={summary.totalCustomersLabel} />
                <SummaryCard label="Seats" value={summary.totalSeatsLabel} />
              </div>

              <div className="mb-5 rounded-lg border border-[#332d30] bg-[#231f21] p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8fa0bd]">Latest booking</p>
                <p className="mt-2 text-sm font-semibold text-white">{summary.latestBookingLabel}</p>
              </div>

              <section className="report-drawer__table-card">
                <div className="report-drawer__table-header">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <CalendarCheck size={16} className="text-blue-400" />
                    <span>Monthly Booking Ledger</span>
                  </div>
                  <span className="text-xs font-semibold text-[#8fa0bd]">{rows.length} rows</span>
                </div>

                <MobileDisclosureCards emptyMessage="No bookings found for this month." items={mobileItems} />

                <table className="trip-summary-table hidden md:table">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Customer</th>
                      <th>Trip</th>
                      <th>Type</th>
                      <th>Product</th>
                      <th>Status</th>
                      <th>Seats</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length ? (
                      rows.map((row) => (
                        <tr key={row.id}>
                          <td>{row.bookingIdLabel}</td>
                          <td>{row.userName}</td>
                          <td>{row.tripNameLabel}</td>
                          <td>
                            <span className="inline-flex items-center gap-2">
                              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: row.typeColor }} />
                              {row.bookingTypeLabel}
                            </span>
                          </td>
                          <td>{row.productNameLabel}</td>
                          <td>
                            <span
                              className={`inline-flex min-w-[86px] justify-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${row.paymentStatusToneClassName}`}
                            >
                              {row.paymentStatusLabel}
                            </span>
                          </td>
                          <td>{row.seatCountLabel}</td>
                          <td>{row.bookingDateLabel}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8}>No bookings found for this month.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </section>
            </>
          )}
        </div>
      </aside>
    </div>
  )
}
