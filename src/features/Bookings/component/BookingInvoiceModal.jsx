import { ArrowLeft, Download, ReceiptText, X } from 'lucide-react'

const DEFAULT_SEAT_NOTE = 'No seat number is available for this booking.'
const ZERO_CURRENCY = 'BDT 0.00'

const formatQuantity = (value) => {
  const quantity = Number(value)

  if (!Number.isFinite(quantity) || quantity <= 0) {
    return '1.0000'
  }

  return quantity.toFixed(4)
}

const buildLineItem = (booking, invoice) => {
  const primaryTitle =
    invoice.packageName ||
    invoice.tripName ||
    invoice.hotelName ||
    invoice.bookingTypeLabel

  const noteLines = [
    invoice.tripName && invoice.tripIdLabel ? `${invoice.tripName} ${invoice.tripIdLabel}` : invoice.tripName,
    invoice.hotelName ? invoice.hotelAddressLabel : '',
    invoice.departureTimeLabel !== '-' || invoice.arrivalTimeLabel !== '-'
      ? `${invoice.departureTimeLabel}${invoice.arrivalTimeLabel !== '-' ? ` -> ${invoice.arrivalTimeLabel}` : ''}`
      : '',
    invoice.seatNumbersLabel && invoice.seatNumbersLabel !== DEFAULT_SEAT_NOTE
      ? `Seats: ${invoice.seatNumbersLabel}`
      : '',
  ].filter(Boolean)

  return {
    description: primaryTitle,
    noteLines,
    quantityLabel: formatQuantity(booking?.seatCount || 1),
    totalLabel: invoice.totalPaymentAmountLabel,
    typeLabel: invoice.bookingTypeLabel,
    unitPriceLabel: invoice.priceLabel,
  }
}

function BookingInvoiceDetailRow({ label, value }) {
  return (
    <div className="booking-invoice-details__row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

export function BookingInvoiceModal({
  booking,
  error,
  invoice,
  isLoading,
  onClose,
}) {
  const lineItem = buildLineItem(booking, invoice)
  const orderDateLabel = booking?.bookingDateLabel ?? '-'

  return (
    <div className="crud-modal" role="dialog" aria-modal="true">
      <button type="button" className="crud-modal__backdrop" aria-label="Close booking invoice" onClick={onClose} />
      <section className="crud-modal__panel booking-invoice-modal__panel">
        <div className="booking-invoice-workspace">
          <header className="booking-invoice-workspace__topbar">
            <div className="booking-invoice-workspace__heading">
              <button type="button" className="booking-invoice-icon-button" aria-label="Back to bookings" onClick={onClose}>
                <ArrowLeft size={16} />
              </button>

              <div className="booking-invoice-workspace__title-block">
                <div className="booking-invoice-workspace__title-row">
                  <h2>{booking?.bookingIdLabel ?? 'Invoice'}</h2>
                  <span
                    className={`inline-flex min-w-[96px] justify-center rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] ${invoice.bookingStatusToneClassName}`}
                  >
                    {invoice.bookingStatusLabel}
                  </span>
                </div>
                <p>{orderDateLabel}</p>
              </div>
            </div>

            <div className="booking-invoice-workspace__actions">
              <button type="button" className="booking-invoice-action" onClick={() => window.print()}>
                <Download size={15} />
                Download PDF
              </button>
              <button type="button" className="booking-invoice-action booking-invoice-action--danger" onClick={onClose}>
                <X size={15} />
                Cancel
              </button>
            </div>
          </header>

          <div className="booking-invoice-workspace__body">
          {isLoading ? (
            <div className="flex min-h-[280px] items-center justify-center text-sm font-semibold text-[#8fa0bd]">
              Loading booking invoice...
            </div>
          ) : error ? (
            <div className="month-balance-alert !mb-0">{error}</div>
          ) : (
            <div className="booking-invoice-document">
              <div className="booking-invoice-document__main">
                <section className="booking-invoice-card">
                  <header className="booking-invoice-card__header">
                    <div className="flex items-center gap-2">
                      <ReceiptText size={16} className="text-blue-400" />
                      <h3>Line Items</h3>
                    </div>
                  </header>

                  <div className="booking-invoice-table-wrap">
                    <table className="booking-invoice-table">
                      <thead>
                        <tr>
                          <th>Description</th>
                          <th>Qty</th>
                          <th>Unit Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <div className="booking-invoice-line-item">
                              <strong>{lineItem.description}</strong>
                              <span>{lineItem.typeLabel}</span>
                              {lineItem.noteLines.map((noteLine) => (
                                <small key={noteLine}>{noteLine}</small>
                              ))}
                            </div>
                          </td>
                          <td>{lineItem.quantityLabel}</td>
                          <td>{lineItem.unitPriceLabel}</td>
                          <td className="booking-invoice-table__total-cell">{lineItem.totalLabel}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="booking-invoice-totals">
                    <div>
                      <span>Subtotal</span>
                      <strong>{invoice.totalPaymentAmountLabel}</strong>
                    </div>
                    <div>
                      <span>Tax</span>
                      <strong>{ZERO_CURRENCY}</strong>
                    </div>
                    <div className="is-total">
                      <span>Total</span>
                      <strong>{invoice.totalPaymentAmountLabel}</strong>
                    </div>
                  </div>
                </section>

                <section className="booking-invoice-card booking-invoice-card--compact">
                  <header className="booking-invoice-card__header booking-invoice-card__header--compact">
                    <h3>Booking Ledger</h3>
                  </header>

                  <div className="booking-invoice-ledger">
                    <div className="booking-invoice-ledger__header">
                      <span>Reference</span>
                      <span>Seats</span>
                      <span>Payment</span>
                      <span>Amount</span>
                    </div>
                    <div className="booking-invoice-ledger__row">
                      <strong>{invoice.transactionReference}</strong>
                      <span>{invoice.seatNumbersLabel}</span>
                      <span>{invoice.paymentMethodLabel}</span>
                      <strong>{invoice.totalPaymentAmountLabel}</strong>
                    </div>
                  </div>
                </section>
              </div>

              <aside className="booking-invoice-document__aside">
                <section className="booking-invoice-card booking-invoice-card--sticky">
                  <header className="booking-invoice-card__header">
                    <h3>Details</h3>
                  </header>

                  <div className="booking-invoice-details">
                    <BookingInvoiceDetailRow label="Passenger" value={invoice.userName} />
                    <BookingInvoiceDetailRow label="Order Date" value={orderDateLabel} />
                    <BookingInvoiceDetailRow label="Booking Type" value={invoice.bookingTypeLabel} />
                    <BookingInvoiceDetailRow label="Payment Method" value={invoice.paymentMethodLabel} />
                    <BookingInvoiceDetailRow label="Status" value={invoice.bookingStatusLabel} />
                    <BookingInvoiceDetailRow label="Email" value={invoice.userEmail} />
                    {invoice.tripName ? (
                      <BookingInvoiceDetailRow
                        label="Trip"
                        value={`${invoice.tripName}${invoice.tripIdLabel ? ` ${invoice.tripIdLabel}` : ''}`}
                      />
                    ) : null}
                    {invoice.packageName ? (
                      <BookingInvoiceDetailRow label="Package" value={invoice.packageName} />
                    ) : null}
                    {invoice.hotelName ? (
                      <BookingInvoiceDetailRow label="Hotel" value={invoice.hotelAddressLabel} />
                    ) : null}
                  </div>
                </section>
              </aside>
            </div>
          )}
          </div>
        </div>
      </section>
    </div>
  )
}
