import dayjs from 'dayjs'
import {
  BOOKING_TYPE_COLORS,
  BOOKING_TYPE_FILTERS,
  BOOKING_TYPE_LABELS,
} from '../constants/bookings.constants'

const compactCountFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  notation: 'compact',
})

const currencyFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})

const normalizeText = (value, fallback = '-') => {
  if (value === undefined || value === null) {
    return fallback
  }

  const normalizedValue = String(value).trim()
  return normalizedValue || fallback
}

const toNumber = (value) => {
  const parsedValue = Number(value)
  return Number.isNaN(parsedValue) ? 0 : parsedValue
}

const toTitleCase = (value) =>
  normalizeText(value, '')
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`)
    .join(' ')

const formatCompactCount = (value) => compactCountFormatter.format(toNumber(value))
const formatCurrency = (value, currency = 'BDT') => {
  const normalizedCurrency = normalizeText(currency, 'BDT')
  return `${normalizedCurrency} ${currencyFormatter.format(toNumber(value))}`
}

const formatDateLabel = (value) => {
  const parsedDate = dayjs(value)
  return parsedDate.isValid() ? parsedDate.format('DD MMM YYYY') : normalizeText(value)
}

const formatDateTimeLabel = (value) => {
  const parsedDate = dayjs(value)
  return parsedDate.isValid() ? parsedDate.format('DD MMM YYYY, hh:mm A') : normalizeText(value)
}

const getSeatList = (value) =>
  normalizeText(value, '')
    .split(',')
    .map((seat) => seat.trim())
    .filter(Boolean)

export const resolveBookingTypeKey = (value) => {
  const normalizedValue = String(value ?? '').trim().toLowerCase()

  if (normalizedValue.includes('trip')) {
    return 'trip'
  }

  if (normalizedValue.includes('package')) {
    return 'package'
  }

  if (normalizedValue.includes('hotel')) {
    return 'hotel'
  }

  if (normalizedValue.includes('visa')) {
    return 'visa'
  }

  return 'other'
}

const resolveInvoiceTypeKey = (item = {}) => {
  const typeKey = resolveBookingTypeKey(item.booking_type)

  if (typeKey !== 'other') {
    return typeKey
  }

  if (item.hotel_name || item.hotel_city || item.hotel_country) {
    return 'hotel'
  }

  if (item.package_name || item.package_title) {
    return 'package'
  }

  if (item.visa_name || item.country_name || item.application_no || item.passport_no) {
    return 'visa'
  }

  if (item.trip_name || item.trip_id || item.departure_time || item.arrival_time) {
    return 'trip'
  }

  return 'other'
}

const resolveBookingTypeLabel = (value) => {
  const typeKey = resolveBookingTypeKey(value)

  if (BOOKING_TYPE_LABELS[typeKey]) {
    return BOOKING_TYPE_LABELS[typeKey]
  }

  return toTitleCase(value) || BOOKING_TYPE_LABELS.other
}

const resolvePaymentStatus = (value) => {
  const rawValue = String(value ?? 'unknown').trim()
  const normalizedValue = rawValue.toLowerCase()

  if (normalizedValue.includes('cancel')) {
    return {
      key: 'cancelled',
      label: 'Cancelled',
      toneClassName: 'border-rose-500/20 bg-rose-500/10 text-rose-200',
    }
  }

  if (normalizedValue.includes('pending') || normalizedValue.includes('hold') || normalizedValue.includes('processing')) {
    return {
      key: 'pending',
      label: 'Pending',
      toneClassName: 'border-amber-500/20 bg-amber-500/10 text-amber-200',
    }
  }

  if (
    normalizedValue.includes('paid') ||
    normalizedValue.includes('success') ||
    normalizedValue.includes('complete') ||
    normalizedValue.includes('confirm')
  ) {
    return {
      key: 'confirmed',
      label: 'Confirmed',
      toneClassName: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200',
    }
  }

  return {
    key: normalizedValue || 'unknown',
    label: toTitleCase(rawValue) || 'Unknown',
    toneClassName: 'border-blue-500/20 bg-blue-500/10 text-blue-200',
  }
}

export const normalizeBooking = (item = {}, index = 0, pagination = {}) => {
  const bookingId = item.id ?? item.booking_id ?? `booking-${index + 1}`
  const seatList = getSeatList(item.seat_ids ?? item.seat_numbers)
  const seatCount = seatList.length
  const typeKey = resolveBookingTypeKey(item.booking_type)
  const paymentStatus = resolvePaymentStatus(item.status ?? item.booking_status)
  const serialSeed = pagination.from || 1
  const productName =
    typeKey === 'hotel'
      ? normalizeText(item.hotel_name, '-')
      : typeKey === 'package'
        ? normalizeText(item.package_name ?? item.package_title, '-')
        : typeKey === 'visa'
          ? normalizeText(item.package_title ?? item.visa_name, '-')
          : normalizeText(item.package_name ?? item.package_title ?? item.hotel_name ?? item.visa_name, '-')

  return {
    bookingDateLabel: formatDateLabel(item.created_at ?? item.booking_date),
    bookingId,
    bookingIdLabel: `#${bookingId}`,
    bookingTypeKey: typeKey,
    bookingTypeLabel: resolveBookingTypeLabel(item.booking_type),
    createdAt: item.created_at ?? item.booking_date ?? '',
    id: bookingId,
    paymentStatusKey: paymentStatus.key,
    paymentStatusLabel: paymentStatus.label,
    paymentStatusToneClassName: paymentStatus.toneClassName,
    productName,
    productNameLabel:
      productName !== '-'
        ? productName
        : typeKey === 'hotel'
          ? 'No hotel linked'
        : typeKey === 'package'
          ? 'No package linked'
          : typeKey === 'visa'
            ? 'No visa case linked'
            : 'No package linked',
    seatCount,
    seatCountLabel: seatCount ? `${seatCount} seat${seatCount === 1 ? '' : 's'}` : 'No seats',
    seatIds: seatList.length ? seatList.join(', ') : '-',
    serial: serialSeed + index,
    tripName: normalizeText(item.trip_name, '-'),
    tripNameLabel: normalizeText(item.trip_name, 'No linked trip'),
    typeColor: BOOKING_TYPE_COLORS[typeKey] ?? BOOKING_TYPE_COLORS.other,
    userName: normalizeText(item.username ?? item.user_name ?? item.name, 'Guest User'),
  }
}

export const createEmptyBookingInvoice = () => ({
  applicationNoLabel: '-',
  arrivalTimeLabel: '-',
  bkash: '',
  bookingId: '',
  bookingIdLabel: '-',
  bookingStatusLabel: 'Unknown',
  bookingStatusToneClassName: 'border-blue-500/20 bg-blue-500/10 text-blue-200',
  bookingTypeKey: 'other',
  bookingTypeLabel: BOOKING_TYPE_LABELS.other,
  card: '',
  countryName: '',
  createdAtLabel: '-',
  departureTimeLabel: '-',
  feeSnapshotLabel: '-',
  hotelAddressLabel: '-',
  hotelName: '',
  nagad: '',
  packageName: '',
  paymentMethodLabel: '-',
  passportNoLabel: '-',
  priceAmount: 0,
  priceLabel: formatCurrency(0),
  processingDaysLabel: '-',
  seatNumbersLabel: 'No seat number is available for this booking.',
  totalPaymentAmount: 0,
  totalPaymentAmountLabel: formatCurrency(0),
  transactionReference: '-',
  travelDateLabel: '-',
  travelPurpose: '-',
  tripIdLabel: '',
  tripName: '',
  userEmail: '-',
  userName: 'Guest User',
  userPhone: '-',
  visaName: '',
  visaTypeLabel: '-',
})

export const normalizeBookingInvoice = (item = {}) => {
  const bookingTypeKey = resolveInvoiceTypeKey(item)
  const bookingStatus = resolvePaymentStatus(item.booking_status ?? item.status)
  const hotelAddressLabel = [item.hotel_name, item.hotel_city, item.hotel_country]
    .map((value) => String(value ?? '').trim())
    .filter(Boolean)
    .join(', ')
  const seatNumbers = normalizeText(item.seat_numbers ?? item.seat_ids, '')
  const currency = item.currency_snapshot ?? item.currency ?? 'BDT'
  const visaTypeLabel = normalizeText(item.visa_type, '')
  const applicationNo = normalizeText(item.application_no, '')

  return {
    applicationNoLabel: applicationNo || '-',
    arrivalTimeLabel: formatDateTimeLabel(item.arrival_time),
    bkash: normalizeText(item.bkash, ''),
    bookingId: String(item.booking_id ?? item.id ?? ''),
    bookingIdLabel: `#${item.booking_id ?? item.id ?? '-'}`,
    bookingStatusLabel: bookingStatus.label,
    bookingStatusToneClassName: bookingStatus.toneClassName,
    bookingTypeKey,
    bookingTypeLabel:
      bookingTypeKey === 'visa' && !item.booking_type
        ? BOOKING_TYPE_LABELS.visa
        : resolveBookingTypeLabel(item.booking_type || bookingTypeKey),
    card: normalizeText(item.card, ''),
    countryName: normalizeText(item.country_name, ''),
    createdAtLabel: formatDateTimeLabel(item.created_at ?? item.booking_date ?? item.applied_at),
    departureTimeLabel: formatDateTimeLabel(item.departure_time),
    feeSnapshotLabel:
      item.fee_snapshot !== undefined && item.fee_snapshot !== null && item.fee_snapshot !== ''
        ? formatCurrency(item.fee_snapshot, item.currency_snapshot ?? currency)
        : '-',
    hotelAddressLabel: hotelAddressLabel || '-',
    hotelName: normalizeText(item.hotel_name, ''),
    nagad: normalizeText(item.nagad, ''),
    packageName: normalizeText(item.package_name ?? item.package_title, ''),
    paymentMethodLabel: toTitleCase(item.payment_method) || '-',
    passportNoLabel: normalizeText(item.passport_no, '-'),
    priceAmount: toNumber(item.price),
    priceLabel: formatCurrency(item.price, currency),
    processingDaysLabel: normalizeText(item.processing_days_snapshot ?? item.processing_days, '-'),
    seatNumbersLabel: seatNumbers || 'No seat number is available for this booking.',
    totalPaymentAmount: toNumber(item.total_payment_amount),
    totalPaymentAmountLabel: formatCurrency(item.total_payment_amount, currency),
    transactionReference: normalizeText(item.transaction_reference, '-'),
    travelDateLabel: formatDateLabel(item.travel_date),
    travelPurpose: normalizeText(item.travel_purpose, '-'),
    tripIdLabel: item.trip_id ? `#${item.trip_id}` : '',
    tripName: normalizeText(item.trip_name, ''),
    userEmail: normalizeText(item.user_email ?? item.email, '-'),
    userName: normalizeText(item.user_name ?? item.username ?? item.name, 'Guest User'),
    userPhone: normalizeText(item.user_phone ?? item.phone, '-'),
    visaName: normalizeText(item.visa_name, ''),
    visaTypeLabel: visaTypeLabel || '-',
  }
}

export const buildBookingsMetrics = (rows = []) => {
  const totalBookings = rows.length
  const totalSeats = rows.reduce((sum, row) => sum + row.seatCount, 0)
  const uniqueCustomers = new Set(rows.map((row) => row.userName.toLowerCase()))
  const confirmedBookings = rows.filter((row) => row.paymentStatusKey === 'confirmed').length
  const latestBooking = [...rows]
    .filter((row) => dayjs(row.createdAt).isValid())
    .sort((firstRow, secondRow) => dayjs(secondRow.createdAt).valueOf() - dayjs(firstRow.createdAt).valueOf())[0]

  const typeBreakdown = BOOKING_TYPE_FILTERS.filter((filter) => filter.key !== 'all')
    .map((filter) => {
      const total = rows.filter((row) => row.bookingTypeKey === filter.key).length
      const ratio = totalBookings ? (total / totalBookings) * 100 : 0

      return {
        color: BOOKING_TYPE_COLORS[filter.key] ?? BOOKING_TYPE_COLORS.other,
        key: filter.key,
        label: filter.label,
        total,
        totalLabel: formatCompactCount(total),
        width: `${Math.min(Math.max(ratio, 0), 100)}%`,
      }
    })
    .filter((item) => item.total > 0)

  const topType = [...typeBreakdown].sort((firstItem, secondItem) => secondItem.total - firstItem.total)[0]

  const statusCounts = rows.reduce((counts, row) => {
    counts[row.paymentStatusLabel] = (counts[row.paymentStatusLabel] ?? 0) + 1
    return counts
  }, {})

  const statusBreakdown = Object.entries(statusCounts)
    .map(([label, total]) => ({
      label,
      total,
      totalLabel: formatCompactCount(total),
    }))
    .sort((firstItem, secondItem) => secondItem.total - firstItem.total)

  return {
    confirmedBookings,
    confirmedBookingsLabel: formatCompactCount(confirmedBookings),
    latestBookingLabel: latestBooking ? latestBooking.bookingDateLabel : 'No bookings found.',
    totalBookings,
    totalBookingsLabel: formatCompactCount(totalBookings),
    totalCustomers: uniqueCustomers.size,
    totalCustomersLabel: formatCompactCount(uniqueCustomers.size),
    totalSeats,
    totalSeatsLabel: formatCompactCount(totalSeats),
    topTypeLabel: topType ? `${topType.label} • ${topType.totalLabel}` : 'No bookings found.',
    typeBreakdown,
    statusBreakdown,
  }
}

export const filterBookingsByType = (rows = [], typeFilter = 'all') => {
  if (typeFilter === 'all') {
    return rows
  }

  return rows.filter((row) => row.bookingTypeKey === typeFilter)
}
