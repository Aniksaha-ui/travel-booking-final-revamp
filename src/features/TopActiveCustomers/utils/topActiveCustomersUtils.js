const compactCountFormatter = new Intl.NumberFormat('en-US', {
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

const formatCompactCount = (value) => compactCountFormatter.format(toNumber(value))

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

export const normalizeTopActiveCustomerRow = (item = {}, index = 0) => {
  const customerName = normalizeText(item.name, `Customer ${index + 1}`)
  const bookingsCount = toNumber(item.bookings_count)
  const hotelBookingsCount = toNumber(item.hotel_bookings_count)
  const packageBookingsCount = toNumber(item.package_bookings_count)
  const visaApplicationsCount = toNumber(item.visa_applications_count)
  const activityScore = toNumber(item.activity_score)

  return {
    activityScore,
    activityScoreLabel: formatCompactCount(activityScore),
    bookingsCount,
    bookingsCountLabel: formatCompactCount(bookingsCount),
    customerEmail: normalizeText(item.email),
    customerInitials: buildCustomerInitials(customerName),
    customerName,
    hotelBookingsCount,
    hotelBookingsCountLabel: formatCompactCount(hotelBookingsCount),
    id: item.id ?? `${customerName}-${index}`,
    packageBookingsCount,
    packageBookingsCountLabel: formatCompactCount(packageBookingsCount),
    serial: index + 1,
    visaApplicationsCount,
    visaApplicationsCountLabel: formatCompactCount(visaApplicationsCount),
  }
}

export const buildTopActiveCustomersSummary = (rows = []) => {
  const totalCustomers = rows.length
  const totalActivity = rows.reduce((sum, row) => sum + row.activityScore, 0)
  const topCustomer = rows[0]
  const totalBookings = rows.reduce((sum, row) => sum + row.bookingsCount, 0)
  const totalHotelBookings = rows.reduce((sum, row) => sum + row.hotelBookingsCount, 0)
  const totalPackageBookings = rows.reduce((sum, row) => sum + row.packageBookingsCount, 0)
  const totalVisaApplications = rows.reduce((sum, row) => sum + row.visaApplicationsCount, 0)

  const chartItems = rows
    .slice(0, 10)
    .map((row) => ({
      activityScore: row.activityScore,
      activityScoreLabel: row.activityScoreLabel,
      customerName: row.customerName,
      shortName: row.customerName.length > 14 ? `${row.customerName.slice(0, 14)}...` : row.customerName,
    }))
    .reverse()

  return {
    chartItems,
    topCustomerLabel: topCustomer ? `${topCustomer.customerName} - ${topCustomer.activityScoreLabel}` : 'No customer data',
    totalActivityLabel: formatCompactCount(totalActivity),
    totalBookingsLabel: formatCompactCount(totalBookings),
    totalCustomersLabel: formatCompactCount(totalCustomers),
    totalHotelBookingsLabel: formatCompactCount(totalHotelBookings),
    totalPackageBookingsLabel: formatCompactCount(totalPackageBookings),
    totalVisaApplicationsLabel: formatCompactCount(totalVisaApplications),
  }
}
