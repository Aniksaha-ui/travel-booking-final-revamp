import { BOOKING_SUMMARY_COLORS } from '../constants/bookingSummary.constants'

const compactFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  notation: 'compact',
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
    .split(/\s+/)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`)
    .join(' ')

const formatCount = (value) => compactFormatter.format(toNumber(value))

export const createEmptyBookingSummary = () => ({
  chartRows: [],
  highestBookingTypeLabel: 'No bookings found.',
  totalBookings: 0,
  totalBookingsLabel: formatCount(0),
  totalTypes: 0,
  totalTypesLabel: formatCount(0),
})

export const normalizeBookingSummaryRow = (item = {}, index = 0, totalBookings = 0) => {
  const totalBooking = toNumber(item.total_booking ?? item.totalBooking)
  const bookingType = normalizeText(item.booking_type ?? item.bookingType, `Type ${index + 1}`)
  const ratio = totalBookings ? Math.round((totalBooking / totalBookings) * 100) : 0

  return {
    bookingType,
    bookingTypeLabel: toTitleCase(bookingType),
    color: BOOKING_SUMMARY_COLORS[index % BOOKING_SUMMARY_COLORS.length],
    id: `${bookingType}-${index + 1}`,
    ratio,
    ratioLabel: `${ratio}%`,
    totalBooking,
    totalBookingLabel: formatCount(totalBooking),
  }
}

export const normalizeBookingSummaryRows = (items = []) => {
  const totalBookings = items.reduce(
    (sum, item) => sum + toNumber(item.total_booking ?? item.totalBooking),
    0,
  )

  return items.map((item, index) => normalizeBookingSummaryRow(item, index, totalBookings))
}

export const buildBookingSummary = (rows = []) => {
  if (!rows.length) {
    return createEmptyBookingSummary()
  }

  const totalBookings = rows.reduce((sum, row) => sum + row.totalBooking, 0)
  const highestBookingType = [...rows].sort(
    (firstRow, secondRow) => secondRow.totalBooking - firstRow.totalBooking,
  )[0]

  return {
    chartRows: rows.map((row) => ({
      color: row.color,
      label: row.bookingTypeLabel,
      value: row.totalBooking,
    })),
    highestBookingTypeLabel: `${highestBookingType.bookingTypeLabel} • ${highestBookingType.totalBookingLabel}`,
    totalBookings,
    totalBookingsLabel: formatCount(totalBookings),
    totalTypes: rows.length,
    totalTypesLabel: formatCount(rows.length),
  }
}

export const filterBookingSummaryRows = (rows = [], search = '') => {
  const normalizedSearch = search.trim().toLowerCase()

  if (!normalizedSearch) {
    return rows
  }

  return rows.filter((row) =>
    [row.bookingType, row.bookingTypeLabel, row.totalBookingLabel, row.ratioLabel].some((value) =>
      String(value).toLowerCase().includes(normalizedSearch),
    ),
  )
}
