const compactCountFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  notation: 'compact',
})

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
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

const formatCompactCount = (value) => compactCountFormatter.format(toNumber(value))

const formatDate = (value) => {
  if (!value) {
    return 'No bookings'
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'No bookings' : dateFormatter.format(date)
}

const buildCustomerInitials = (name) => {
  const parts = normalizeText(name, 'Customer')
    .split(/\s+/)
    .filter(Boolean)

  if (!parts.length) {
    return 'CU'
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase()
}

export const normalizeBookingFrequencyRow = (item = {}, index = 0, pagination = {}) => {
  const customerName = normalizeText(item.name, `Customer ${index + 1}`)
  const bookingCount = toNumber(item.booking_count)
  const activeDays = toNumber(item.active_days)
  const serialSeed = pagination.from || 1

  return {
    activeDays,
    activeDaysLabel: `${formatCompactCount(activeDays)} days`,
    bookingCount,
    bookingCountLabel: formatCompactCount(bookingCount),
    customerEmail: normalizeText(item.email),
    customerInitials: buildCustomerInitials(customerName),
    customerName,
    firstBooking: item.first_booking,
    firstBookingLabel: formatDate(item.first_booking),
    id: item.id ?? `${customerName}-${index}`,
    lastBooking: item.last_booking,
    lastBookingLabel: formatDate(item.last_booking),
    serial: serialSeed + index,
  }
}

export const buildBookingFrequencySummary = (rows = []) => {
  const totalCustomers = rows.length
  const totalBookings = rows.reduce((sum, row) => sum + row.bookingCount, 0)
  const totalActiveDays = rows.reduce((sum, row) => sum + row.activeDays, 0)
  const topCustomer = [...rows].sort((firstRow, secondRow) => secondRow.bookingCount - firstRow.bookingCount)[0]
  const longestActiveCustomer = [...rows].sort((firstRow, secondRow) => secondRow.activeDays - firstRow.activeDays)[0]
  const averageBookings = totalCustomers ? totalBookings / totalCustomers : 0

  const chartItems = [...rows]
    .sort((firstRow, secondRow) => secondRow.bookingCount - firstRow.bookingCount)
    .slice(0, 8)
    .map((row) => ({
      bookingCount: row.bookingCount,
      bookingCountLabel: row.bookingCountLabel,
      customerName: row.customerName,
      shortName: row.customerName.length > 14 ? `${row.customerName.slice(0, 14)}...` : row.customerName,
    }))
    .reverse()

  return {
    averageBookingsLabel: averageBookings.toFixed(1),
    chartItems,
    longestActiveCustomerLabel: longestActiveCustomer
      ? `${longestActiveCustomer.customerName} - ${longestActiveCustomer.activeDaysLabel}`
      : 'No active span',
    topCustomerLabel: topCustomer ? `${topCustomer.customerName} - ${topCustomer.bookingCountLabel}` : 'No customer data',
    totalActiveDaysLabel: formatCompactCount(totalActiveDays),
    totalBookingsLabel: formatCompactCount(totalBookings),
    totalCustomersLabel: formatCompactCount(totalCustomers),
  }
}
