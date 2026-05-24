import { AVG_BOOKING_VALUE_COLORS } from '../constants/avgBookingValueReport.constants'

const compactFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  notation: 'compact',
})

const currencyFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  minimumFractionDigits: 2,
  style: 'currency',
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

export const formatAverageBookingValue = (value) => currencyFormatter.format(toNumber(value))
const formatCompact = (value) => compactFormatter.format(toNumber(value))

export const createEmptyAvgBookingValueSummary = () => ({
  averageValue: 0,
  averageValueLabel: formatAverageBookingValue(0),
  chartRows: [],
  highestTypeLabel: 'No booking value data found.',
  totalTypes: 0,
  totalTypesLabel: formatCompact(0),
})

export const normalizeAvgBookingValueRows = (items = []) =>
  items.map((item = {}, index) => {
    const averageValue = toNumber(item.average_value ?? item.averageValue)
    const bookingType = normalizeText(item.booking_type ?? item.bookingType, `Type ${index + 1}`)

    return {
      averageValue,
      averageValueLabel: formatAverageBookingValue(averageValue),
      bookingType,
      bookingTypeLabel: toTitleCase(bookingType),
      color: AVG_BOOKING_VALUE_COLORS[index % AVG_BOOKING_VALUE_COLORS.length],
      id: `${bookingType}-${index + 1}`,
    }
  })

export const buildAvgBookingValueSummary = (rows = []) => {
  if (!rows.length) {
    return createEmptyAvgBookingValueSummary()
  }

  const totalAverageValue = rows.reduce((sum, row) => sum + row.averageValue, 0)
  const averageValue = totalAverageValue / rows.length
  const highestType = [...rows].sort((firstRow, secondRow) => secondRow.averageValue - firstRow.averageValue)[0]

  return {
    averageValue,
    averageValueLabel: formatAverageBookingValue(averageValue),
    chartRows: rows.map((row) => ({
      ...row,
      label: row.bookingTypeLabel,
      value: row.averageValue,
    })),
    highestTypeLabel: `${highestType.bookingTypeLabel} • ${highestType.averageValueLabel}`,
    totalTypes: rows.length,
    totalTypesLabel: formatCompact(rows.length),
  }
}

export const filterAvgBookingValueRows = (rows = [], search = '') => {
  const normalizedSearch = search.trim().toLowerCase()

  if (!normalizedSearch) {
    return rows
  }

  return rows.filter((row) =>
    [row.bookingType, row.bookingTypeLabel, row.averageValueLabel].some((value) =>
      String(value).toLowerCase().includes(normalizedSearch),
    ),
  )
}
