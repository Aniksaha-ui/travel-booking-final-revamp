import { useRef, useState } from 'react'
import { ArrowLeft, Download, Printer, ReceiptText, X } from 'lucide-react'
import { useToast } from '../../../components/common/Toaster'

const DEFAULT_SEAT_NOTE = 'No seat number is available for this booking.'
const EMPTY_VALUE = '-'
const ZERO_CURRENCY = 'BDT 0.00'
const INVOICE_ACCENT_COLOR = '#60a5fa'
const PDF_EXPORT_COLOR_PROPERTIES = [
  'background-color',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'color',
  'fill',
  'outline-color',
  'stroke',
  'text-decoration-color',
]

const INVOICE_STATUS_STYLES = {
  cancelled: {
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    borderColor: 'rgba(244, 63, 94, 0.24)',
    color: '#fecdd3',
  },
  confirmed: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.24)',
    color: '#bbf7d0',
  },
  default: {
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    borderColor: 'rgba(59, 130, 246, 0.24)',
    color: '#bfdbfe',
  },
  pending: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.24)',
    color: '#fde68a',
  },
}

let pdfColorContext = null

const getPdfColorContext = () => {
  if (typeof document === 'undefined') {
    return null
  }

  if (!pdfColorContext) {
    const canvas = document.createElement('canvas')
    pdfColorContext = canvas.getContext('2d')
  }

  return pdfColorContext
}

const normalizePdfColorValue = (value, fallbackColor = '') => {
  const normalizedValue = String(value ?? '').trim()

  if (
    !normalizedValue ||
    normalizedValue === 'inherit' ||
    normalizedValue === 'initial' ||
    normalizedValue === 'none' ||
    normalizedValue === 'transparent' ||
    normalizedValue === 'unset'
  ) {
    return normalizedValue
  }

  if (normalizedValue === 'currentcolor') {
    return fallbackColor || normalizedValue
  }

  const context = getPdfColorContext()

  if (!context) {
    return normalizedValue
  }

  const previousFillStyle = context.fillStyle

  try {
    context.fillStyle = '#000000'
    context.fillStyle = normalizedValue
    const safeColor = context.fillStyle
    context.fillStyle = previousFillStyle
    return safeColor || normalizedValue
  } catch {
    context.fillStyle = previousFillStyle
    return fallbackColor || normalizedValue
  }
}

const sanitizeElementColorsForPdf = (rootElement) => {
  if (!rootElement || typeof window === 'undefined') {
    return () => {}
  }

  const nodes = [rootElement, ...rootElement.querySelectorAll('*')]
  const mutations = []

  nodes.forEach((node) => {
    const computedStyle = window.getComputedStyle(node)
    const fallbackColor = normalizePdfColorValue(computedStyle.color)
    const updatedStyles = []

    PDF_EXPORT_COLOR_PROPERTIES.forEach((propertyName) => {
      const currentValue = computedStyle.getPropertyValue(propertyName).trim()
      const normalizedColor = normalizePdfColorValue(currentValue, fallbackColor)

      if (normalizedColor && normalizedColor !== currentValue) {
        updatedStyles.push([propertyName, normalizedColor])
      }
    })

    if (!updatedStyles.length) {
      return
    }

    mutations.push({
      node,
      previousStyle: node.getAttribute('style'),
    })

    updatedStyles.forEach(([propertyName, normalizedColor]) => {
      node.style.setProperty(propertyName, normalizedColor)
    })
  })

  return () => {
    mutations.reverse().forEach(({ node, previousStyle }) => {
      if (previousStyle === null) {
        node.removeAttribute('style')
        return
      }

      node.setAttribute('style', previousStyle)
    })
  }
}

const resolveInvoiceStatusStyle = (toneClassName = '') => {
  const normalizedTone = String(toneClassName).toLowerCase()

  if (normalizedTone.includes('rose')) {
    return INVOICE_STATUS_STYLES.cancelled
  }

  if (normalizedTone.includes('amber')) {
    return INVOICE_STATUS_STYLES.pending
  }

  if (normalizedTone.includes('emerald')) {
    return INVOICE_STATUS_STYLES.confirmed
  }

  return INVOICE_STATUS_STYLES.default
}

const isMeaningfulValue = (value) => {
  if (value === undefined || value === null) {
    return false
  }

  const normalizedValue = String(value).trim()

  return Boolean(
    normalizedValue &&
      normalizedValue !== EMPTY_VALUE &&
      normalizedValue !== DEFAULT_SEAT_NOTE &&
      normalizedValue !== ZERO_CURRENCY,
  )
}

const buildItems = (entries = []) =>
  entries
    .filter(([, value]) => isMeaningfulValue(value))
    .map(([label, value]) => ({ label, value }))

const countInvoiceSeats = (seatLabel) => {
  if (!isMeaningfulValue(seatLabel)) {
    return 0
  }

  return String(seatLabel)
    .split(',')
    .map((seat) => seat.trim())
    .filter(Boolean).length
}

const resolveInvoiceTypeKey = (booking, invoice) => {
  if (invoice?.bookingTypeKey && invoice.bookingTypeKey !== 'other') {
    return invoice.bookingTypeKey
  }

  if (booking?.bookingTypeKey && booking.bookingTypeKey !== 'other') {
    return booking.bookingTypeKey
  }

  if (isMeaningfulValue(invoice?.hotelName)) {
    return 'hotel'
  }

  if (isMeaningfulValue(invoice?.packageName)) {
    return 'package'
  }

  if (
    isMeaningfulValue(invoice?.visaName) ||
    isMeaningfulValue(invoice?.applicationNoLabel) ||
    isMeaningfulValue(invoice?.countryName)
  ) {
    return 'visa'
  }

  if (isMeaningfulValue(invoice?.tripName)) {
    return 'trip'
  }

  return 'other'
}

const formatQuantity = (value) => {
  const quantity = Number(value)

  if (!Number.isFinite(quantity) || quantity <= 0) {
    return '1.0000'
  }

  return quantity.toFixed(4)
}

const resolveUnitPriceLabel = (invoice, typeKey) => {
  if (Number(invoice?.priceAmount) > 0) {
    return invoice.priceLabel
  }

  if (typeKey === 'hotel' || typeKey === 'visa') {
    return invoice.totalPaymentAmountLabel
  }

  return invoice.priceLabel
}

const buildOverview = (booking, invoice, typeKey) => {
  const seatCount = booking?.seatCount || countInvoiceSeats(invoice.seatNumbersLabel)

  switch (typeKey) {
    case 'trip':
      return {
        eyebrow: 'Trip Invoice',
        highlights: buildItems([
          ['Booked Seats', seatCount ? `${seatCount} seat${seatCount === 1 ? '' : 's'}` : invoice.seatNumbersLabel],
          ['Payment Method', invoice.paymentMethodLabel],
          ['Status', invoice.bookingStatusLabel],
          ['Total', invoice.totalPaymentAmountLabel],
        ]),
        subtitle:
          [invoice.departureTimeLabel, invoice.arrivalTimeLabel].filter(isMeaningfulValue).join(' -> ') ||
          'Seat-based travel booking',
        title: `${invoice.tripName || 'Trip Reservation'}${invoice.tripIdLabel ? ` ${invoice.tripIdLabel}` : ''}`,
      }
    case 'package':
      return {
        eyebrow: 'Package Invoice',
        highlights: buildItems([
          ['Booked Seats', seatCount ? `${seatCount} seat${seatCount === 1 ? '' : 's'}` : invoice.seatNumbersLabel],
          ['Linked Trip', `${invoice.tripName}${invoice.tripIdLabel ? ` ${invoice.tripIdLabel}` : ''}`],
          ['Payment Method', invoice.paymentMethodLabel],
          ['Total', invoice.totalPaymentAmountLabel],
        ]),
        subtitle:
          [invoice.departureTimeLabel, invoice.arrivalTimeLabel].filter(isMeaningfulValue).join(' -> ') ||
          'Bundled travel package reservation',
        title: invoice.packageName || 'Package Reservation',
      }
    case 'hotel':
      return {
        eyebrow: 'Hotel Invoice',
        highlights: buildItems([
          ['Destination', invoice.hotelAddressLabel],
          ['Payment Method', invoice.paymentMethodLabel],
          ['Status', invoice.bookingStatusLabel],
          ['Total', invoice.totalPaymentAmountLabel],
        ]),
        subtitle: invoice.hotelAddressLabel || 'Stay booking confirmation',
        title: invoice.hotelName || 'Hotel Reservation',
      }
    case 'visa':
      return {
        eyebrow: 'Visa Invoice',
        highlights: buildItems([
          ['Country', invoice.countryName],
          ['Application No', invoice.applicationNoLabel],
          ['Payment Method', invoice.paymentMethodLabel],
          ['Total', invoice.totalPaymentAmountLabel],
        ]),
        subtitle:
          [invoice.countryName, invoice.visaTypeLabel].filter(isMeaningfulValue).join(' • ') ||
          'Visa application processing',
        title: invoice.visaName || invoice.packageName || 'Visa Processing',
      }
    default:
      return {
        eyebrow: 'Booking Invoice',
        highlights: buildItems([
          ['Booking Type', invoice.bookingTypeLabel],
          ['Payment Method', invoice.paymentMethodLabel],
          ['Status', invoice.bookingStatusLabel],
          ['Total', invoice.totalPaymentAmountLabel],
        ]),
        subtitle: 'Booking confirmation and payment summary',
        title: invoice.bookingIdLabel,
      }
  }
}

const buildTypeSections = (booking, invoice, typeKey) => {
  const seatCount = booking?.seatCount || countInvoiceSeats(invoice.seatNumbersLabel)
  const unitPriceLabel = resolveUnitPriceLabel(invoice, typeKey)

  switch (typeKey) {
    case 'trip':
      return [
        {
          items: buildItems([
            ['Trip', `${invoice.tripName}${invoice.tripIdLabel ? ` ${invoice.tripIdLabel}` : ''}`],
            ['Departure', invoice.departureTimeLabel],
            ['Arrival', invoice.arrivalTimeLabel],
            ['Booked Seats', invoice.seatNumbersLabel],
            ['Passenger Count', seatCount ? `${seatCount}` : EMPTY_VALUE],
            ['Price per Seat', unitPriceLabel],
            ['Total Amount', invoice.totalPaymentAmountLabel],
          ]),
          title: 'Trip Itinerary',
        },
      ]
    case 'package':
      return [
        {
          items: buildItems([
            ['Package', invoice.packageName],
            ['Linked Trip', `${invoice.tripName}${invoice.tripIdLabel ? ` ${invoice.tripIdLabel}` : ''}`],
            ['Departure', invoice.departureTimeLabel],
            ['Arrival', invoice.arrivalTimeLabel],
            ['Booked Seats', invoice.seatNumbersLabel],
            ['Passenger Count', seatCount ? `${seatCount}` : EMPTY_VALUE],
            ['Price per Seat', unitPriceLabel],
            ['Total Amount', invoice.totalPaymentAmountLabel],
          ]),
          title: 'Package Coverage',
        },
      ]
    case 'hotel':
      return [
        {
          items: buildItems([
            ['Hotel', invoice.hotelName],
            ['Destination', invoice.hotelAddressLabel],
            ['Booking Type', invoice.bookingTypeLabel],
            ['Stay Charge', unitPriceLabel],
            ['Total Amount', invoice.totalPaymentAmountLabel],
          ]),
          title: 'Stay Summary',
        },
      ]
    case 'visa':
      return [
        {
          items: buildItems([
            ['Visa', invoice.visaName || invoice.packageName],
            ['Country', invoice.countryName],
            ['Visa Type', invoice.visaTypeLabel],
            ['Application No', invoice.applicationNoLabel],
            ['Processing Time', invoice.processingDaysLabel],
            ['Travel Date', invoice.travelDateLabel],
            ['Travel Purpose', invoice.travelPurpose],
            ['Fee Snapshot', invoice.feeSnapshotLabel],
            ['Total Amount', invoice.totalPaymentAmountLabel],
          ]),
          title: 'Visa Case Summary',
        },
        {
          items: buildItems([
            ['Applicant', invoice.userName],
            ['Email', invoice.userEmail],
            ['Phone', invoice.userPhone],
            ['Passport No', invoice.passportNoLabel],
          ]),
          title: 'Applicant Profile',
        },
      ]
    default:
      return [
        {
          items: buildItems([
            ['Booking Type', invoice.bookingTypeLabel],
            ['Reference', invoice.transactionReference],
            ['Payment Method', invoice.paymentMethodLabel],
            ['Total Amount', invoice.totalPaymentAmountLabel],
          ]),
          title: 'Booking Summary',
        },
      ]
  }
}

const buildLineItem = (booking, invoice, typeKey) => {
  const seatCount = booking?.seatCount || countInvoiceSeats(invoice.seatNumbersLabel)
  const quantityValue = typeKey === 'trip' || typeKey === 'package' ? seatCount || 1 : 1
  const unitPriceLabel = resolveUnitPriceLabel(invoice, typeKey)

  switch (typeKey) {
    case 'trip':
      return {
        description: invoice.tripName || 'Trip Reservation',
        noteLines: buildItems([
          ['Trip ID', invoice.tripIdLabel],
          ['Seats', invoice.seatNumbersLabel],
          ['Timing', [invoice.departureTimeLabel, invoice.arrivalTimeLabel].filter(isMeaningfulValue).join(' -> ')],
        ]).map((item) => `${item.label}: ${item.value}`),
        quantityLabel: formatQuantity(quantityValue),
        totalLabel: invoice.totalPaymentAmountLabel,
        typeLabel: invoice.bookingTypeLabel,
        unitPriceLabel,
      }
    case 'package':
      return {
        description: invoice.packageName || 'Package Reservation',
        noteLines: buildItems([
          ['Linked Trip', `${invoice.tripName}${invoice.tripIdLabel ? ` ${invoice.tripIdLabel}` : ''}`],
          ['Seats', invoice.seatNumbersLabel],
          ['Schedule', [invoice.departureTimeLabel, invoice.arrivalTimeLabel].filter(isMeaningfulValue).join(' -> ')],
        ]).map((item) => `${item.label}: ${item.value}`),
        quantityLabel: formatQuantity(quantityValue),
        totalLabel: invoice.totalPaymentAmountLabel,
        typeLabel: invoice.bookingTypeLabel,
        unitPriceLabel,
      }
    case 'hotel':
      return {
        description: invoice.hotelName || 'Hotel Reservation',
        noteLines: buildItems([
          ['Destination', invoice.hotelAddressLabel],
          ['Reference', invoice.transactionReference],
        ]).map((item) => `${item.label}: ${item.value}`),
        quantityLabel: formatQuantity(1),
        totalLabel: invoice.totalPaymentAmountLabel,
        typeLabel: invoice.bookingTypeLabel,
        unitPriceLabel,
      }
    case 'visa':
      return {
        description: invoice.visaName || invoice.packageName || 'Visa Processing',
        noteLines: buildItems([
          ['Country', invoice.countryName],
          ['Visa Type', invoice.visaTypeLabel],
          ['Application', invoice.applicationNoLabel],
          ['Passport', invoice.passportNoLabel],
        ]).map((item) => `${item.label}: ${item.value}`),
        quantityLabel: formatQuantity(1),
        totalLabel: invoice.totalPaymentAmountLabel,
        typeLabel: invoice.bookingTypeLabel,
        unitPriceLabel,
      }
    default:
      return {
        description: invoice.bookingTypeLabel,
        noteLines: buildItems([
          ['Reference', invoice.transactionReference],
          ['Payment', invoice.paymentMethodLabel],
        ]).map((item) => `${item.label}: ${item.value}`),
        quantityLabel: formatQuantity(1),
        totalLabel: invoice.totalPaymentAmountLabel,
        typeLabel: invoice.bookingTypeLabel,
        unitPriceLabel,
      }
  }
}

const buildLedgerMeta = (invoice, typeKey) => {
  switch (typeKey) {
    case 'trip':
    case 'package':
      return {
        label: 'Seats',
        value: invoice.seatNumbersLabel,
      }
    case 'hotel':
      return {
        label: 'Destination',
        value: invoice.hotelAddressLabel,
      }
    case 'visa':
      return {
        label: 'Application',
        value: isMeaningfulValue(invoice.applicationNoLabel) ? invoice.applicationNoLabel : invoice.passportNoLabel,
      }
    default:
      return {
        label: 'Context',
        value: invoice.bookingTypeLabel,
      }
  }
}

const buildAsideDetails = (booking, invoice, orderDateLabel, typeKey) => {
  const baseItems = buildItems([
    ['Customer', invoice.userName],
    ['Order Date', orderDateLabel],
    ['Booking ID', invoice.bookingIdLabel],
    ['Booking Type', invoice.bookingTypeLabel],
    ['Status', invoice.bookingStatusLabel],
    ['Payment Method', invoice.paymentMethodLabel],
    ['Email', invoice.userEmail],
    ['Phone', invoice.userPhone],
    ['Reference', invoice.transactionReference],
  ])

  switch (typeKey) {
    case 'trip':
      return [
        ...baseItems,
        ...buildItems([
          ['Trip', `${invoice.tripName}${invoice.tripIdLabel ? ` ${invoice.tripIdLabel}` : ''}`],
        ]),
      ]
    case 'package':
      return [
        ...baseItems,
        ...buildItems([
          ['Package', invoice.packageName],
          ['Linked Trip', `${invoice.tripName}${invoice.tripIdLabel ? ` ${invoice.tripIdLabel}` : ''}`],
        ]),
      ]
    case 'hotel':
      return [
        ...baseItems,
        ...buildItems([
          ['Hotel', invoice.hotelName],
          ['Destination', invoice.hotelAddressLabel],
        ]),
      ]
    case 'visa':
      return [
        ...baseItems,
        ...buildItems([
          ['Visa', invoice.visaName || invoice.packageName],
          ['Country', invoice.countryName],
          ['Application No', invoice.applicationNoLabel],
          ['Passport No', invoice.passportNoLabel],
        ]),
      ]
    default:
      return baseItems
  }
}

const buildPaymentChannels = (invoice) =>
  buildItems([
    ['bKash', invoice.bkash],
    ['Nagad', invoice.nagad],
    ['Card', invoice.card],
  ])

const buildCsvRows = ({
  asideDetails,
  invoice,
  ledgerMeta,
  lineItem,
  overview,
  paymentChannels,
  sections,
}) => {
  const rows = [['Section', 'Label', 'Value']]

  rows.push(['Overview', 'Title', overview.title])
  rows.push(['Overview', 'Subtitle', overview.subtitle || EMPTY_VALUE])

  overview.highlights.forEach((item) => {
    rows.push(['Overview', item.label, item.value])
  })

  rows.push(['Charge Breakdown', 'Description', lineItem.description])
  rows.push(['Charge Breakdown', 'Booking Type', lineItem.typeLabel])
  rows.push(['Charge Breakdown', 'Quantity', lineItem.quantityLabel])
  rows.push(['Charge Breakdown', 'Unit Price', lineItem.unitPriceLabel])
  rows.push(['Charge Breakdown', 'Total', lineItem.totalLabel])

  if (lineItem.noteLines.length) {
    rows.push(['Charge Breakdown', 'Notes', lineItem.noteLines.join(' | ')])
  }

  sections.forEach((section) => {
    section.items.forEach((item) => {
      rows.push([section.title, item.label, item.value])
    })
  })

  asideDetails.forEach((item) => {
    rows.push(['Invoice Details', item.label, item.value])
  })

  rows.push(['Payment Ledger', 'Reference', invoice.transactionReference])
  rows.push(['Payment Ledger', ledgerMeta.label, ledgerMeta.value])
  rows.push(['Payment Ledger', 'Payment Method', invoice.paymentMethodLabel])
  rows.push(['Payment Ledger', 'Amount', invoice.totalPaymentAmountLabel])

  paymentChannels.forEach((item) => {
    rows.push(['Payment Channels', item.label, item.value])
  })

  return rows
}

const escapeCsvCell = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`

const downloadCsvFile = (rows, fileName) => {
  const csvContent = rows.map((row) => row.map(escapeCsvCell).join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

function BookingInvoiceDetailRow({ label, value }) {
  return (
    <div className="booking-invoice-details__row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function BookingInvoiceInfoCard({ items, title }) {
  return (
    <section className="booking-invoice-card">
      <header className="booking-invoice-card__header">
        <h3>{title}</h3>
      </header>

      <div className="grid gap-4 p-5 md:grid-cols-2">
        {items.map((item) => (
          <article
            key={`${title}-${item.label}`}
            className="rounded-2xl border border-[#332d30] bg-[#211d20] px-4 py-3"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#7ea1ff]">{item.label}</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-white">{item.value}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export function BookingInvoiceModal({
  booking,
  error,
  invoice,
  isLoading,
  onClose,
}) {
  const toast = useToast()
  const documentRef = useRef(null)
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false)
  const orderDateLabel = booking?.bookingDateLabel ?? invoice.createdAtLabel ?? '-'
  const typeKey = resolveInvoiceTypeKey(booking, invoice)
  const statusPillStyle = resolveInvoiceStatusStyle(invoice.bookingStatusToneClassName)
  const overview = buildOverview(booking, invoice, typeKey)
  const sections = buildTypeSections(booking, invoice, typeKey)
  const lineItem = buildLineItem(booking, invoice, typeKey)
  const ledgerMeta = buildLedgerMeta(invoice, typeKey)
  const asideDetails = buildAsideDetails(booking, invoice, orderDateLabel, typeKey)
  const paymentChannels = buildPaymentChannels(invoice)

  const handlePdfDownload = async () => {
    if (isLoading || error || isDownloadingPdf) {
      return
    }

    const element = documentRef.current

    if (!element) {
      toast.error('Invoice document is not ready for PDF export.')
      return
    }

    let restoreExportStyles = () => {}

    try {
      setIsDownloadingPdf(true)
      restoreExportStyles = sanitizeElementColorsForPdf(element)

      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ])

      const canvas = await html2canvas(element, {
        backgroundColor: '#100d0e',
        scale: 2,
        useCORS: true,
        windowWidth: element.scrollWidth,
      })

      const imageData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imageHeight = (canvas.height * pageWidth) / canvas.width
      let heightLeft = imageHeight
      let position = 0

      pdf.addImage(imageData, 'PNG', 0, position, pageWidth, imageHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position -= pageHeight
        pdf.addPage()
        pdf.addImage(imageData, 'PNG', 0, position, pageWidth, imageHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`invoice_${invoice.bookingId || booking?.id || 'booking'}_${typeKey}.pdf`)
    } catch (downloadError) {
      toast.error(downloadError.message || 'Unable to download booking invoice PDF.')
    } finally {
      restoreExportStyles()
      setIsDownloadingPdf(false)
    }
  }

  const handleCsvDownload = () => {
    if (isLoading || error || isDownloadingPdf) {
      return
    }

    const rows = buildCsvRows({
      asideDetails,
      invoice,
      ledgerMeta,
      lineItem,
      overview,
      paymentChannels,
      sections,
    })

    downloadCsvFile(rows, `invoice_${invoice.bookingId || booking?.id || 'booking'}_${typeKey}.csv`)
  }

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
                  <h2>{invoice.bookingIdLabel || booking?.bookingIdLabel || 'Invoice'}</h2>
                  <span
                    className="inline-flex min-w-[96px] justify-center rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em]"
                    style={statusPillStyle}
                  >
                    {invoice.bookingStatusLabel}
                  </span>
                </div>
                <p>{orderDateLabel}</p>
              </div>
            </div>

            <div className="booking-invoice-workspace__actions">
              <button
                type="button"
                className="booking-invoice-action"
                disabled={isLoading || Boolean(error) || isDownloadingPdf}
                onClick={handlePdfDownload}
              >
                <Download size={15} />
                {isDownloadingPdf ? 'Preparing PDF...' : 'Download PDF'}
              </button>
              <button
                type="button"
                className="booking-invoice-action"
                disabled={isLoading || Boolean(error) || isDownloadingPdf}
                onClick={() => window.print()}
              >
                <Printer size={15} />
                Print
              </button>
              <button
                type="button"
                className="booking-invoice-action"
                disabled={isLoading || Boolean(error) || isDownloadingPdf}
                onClick={handleCsvDownload}
              >
                <Download size={15} />
                Download CSV
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
              <div ref={documentRef} className="booking-invoice-document">
                <div className="booking-invoice-document__main">
                  <section className="booking-invoice-card">
                    <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(260px,0.75fr)]">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#7ea1ff]">
                          {overview.eyebrow}
                        </p>
                        <h3 className="mt-3 text-[28px] font-black tracking-[-0.03em] text-white">
                          {overview.title}
                        </h3>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#8fa0bd]">{overview.subtitle}</p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                        {overview.highlights.map((item) => (
                          <article
                            key={`overview-${item.label}`}
                            className="rounded-2xl border border-[#332d30] bg-[#211d20] px-4 py-3"
                          >
                            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8fa0bd]">
                              {item.label}
                            </p>
                            <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
                          </article>
                        ))}
                      </div>
                    </div>
                  </section>

                  {sections.map((section) => (
                    <BookingInvoiceInfoCard key={section.title} items={section.items} title={section.title} />
                  ))}

                  <section className="booking-invoice-card">
                    <header className="booking-invoice-card__header">
                      <div className="flex items-center gap-2">
                        <ReceiptText size={16} style={{ color: INVOICE_ACCENT_COLOR }} />
                        <h3>Charge Breakdown</h3>
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
                      <h3>Payment Ledger</h3>
                    </header>

                    <div className="booking-invoice-ledger">
                      <div className="booking-invoice-ledger__header">
                        <span>Reference</span>
                        <span>{ledgerMeta.label}</span>
                        <span>Payment</span>
                        <span>Amount</span>
                      </div>
                      <div className="booking-invoice-ledger__row">
                        <strong>{invoice.transactionReference}</strong>
                        <span>{ledgerMeta.value}</span>
                        <span>{invoice.paymentMethodLabel}</span>
                        <strong>{invoice.totalPaymentAmountLabel}</strong>
                      </div>
                    </div>
                  </section>

                  {paymentChannels.length ? (
                    <BookingInvoiceInfoCard items={paymentChannels} title="Payment Channels" />
                  ) : null}
                </div>

                <aside className="booking-invoice-document__aside">
                  <section className="booking-invoice-card booking-invoice-card--sticky">
                    <header className="booking-invoice-card__header">
                      <h3>Invoice Details</h3>
                    </header>

                    <div className="booking-invoice-details">
                      {asideDetails.map((item) => (
                        <BookingInvoiceDetailRow key={`aside-${item.label}`} label={item.label} value={item.value} />
                      ))}
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
