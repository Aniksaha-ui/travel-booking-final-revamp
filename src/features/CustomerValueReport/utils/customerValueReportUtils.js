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

const formatCompactCount = (value) => compactCountFormatter.format(toNumber(value))
export const formatCurrency = (value) => `BDT ${currencyFormatter.format(toNumber(value))}`

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

export const normalizeCustomerValueRow = (item = {}, index = 0, pagination = {}) => {
  const totalTripBookings = toNumber(item.total_trip_bookings)
  const totalPackageBookings = toNumber(item.total_package_bookings)
  const totalPaid = toNumber(item.total_paid)
  const totalRefunded = toNumber(item.total_refunded)
  const netSpent = toNumber(item.net_spent)
  const customerName = normalizeText(item.name, `Customer ${index + 1}`)
  const serialSeed = pagination.from || 1

  return {
    customerInitials: buildCustomerInitials(customerName),
    customerName,
    id: item.id ?? `${customerName}-${index}`,
    netSpent,
    netSpentLabel: formatCurrency(netSpent),
    paymentRetentionRatio: totalPaid > 0 ? netSpent / totalPaid : 0,
    serial: serialSeed + index,
    totalBookings: totalTripBookings + totalPackageBookings,
    totalBookingsLabel: formatCompactCount(totalTripBookings + totalPackageBookings),
    totalPackageBookings,
    totalPackageBookingsLabel: formatCompactCount(totalPackageBookings),
    totalPaid,
    totalPaidLabel: formatCurrency(totalPaid),
    totalRefunded,
    totalRefundedLabel: formatCurrency(totalRefunded),
    totalTripBookings,
    totalTripBookingsLabel: formatCompactCount(totalTripBookings),
  }
}

export const buildCustomerValueSummary = (rows = []) => {
  const totalCustomers = rows.length
  const totalTripBookings = rows.reduce((sum, row) => sum + row.totalTripBookings, 0)
  const totalPackageBookings = rows.reduce((sum, row) => sum + row.totalPackageBookings, 0)
  const totalPaid = rows.reduce((sum, row) => sum + row.totalPaid, 0)
  const totalRefunded = rows.reduce((sum, row) => sum + row.totalRefunded, 0)
  const totalNetSpent = rows.reduce((sum, row) => sum + row.netSpent, 0)
  const topCustomer = [...rows].sort((firstRow, secondRow) => secondRow.netSpent - firstRow.netSpent)[0]
  const topTripCustomer = [...rows].sort((firstRow, secondRow) => secondRow.totalTripBookings - firstRow.totalTripBookings)[0]
  const topPackageCustomer = [...rows].sort((firstRow, secondRow) => secondRow.totalPackageBookings - firstRow.totalPackageBookings)[0]
  const avgNetSpent = totalCustomers ? totalNetSpent / totalCustomers : 0

  const chartItems = [...rows]
    .sort((firstRow, secondRow) => secondRow.netSpent - firstRow.netSpent)
    .slice(0, 8)
    .map((row) => ({
      customerName: row.customerName,
      netSpent: row.netSpent,
      netSpentLabel: row.netSpentLabel,
      refundRate: row.totalPaid > 0 ? row.totalRefunded / row.totalPaid : 0,
      shortName: row.customerName.length > 12 ? `${row.customerName.slice(0, 12)}…` : row.customerName,
      totalPaid: row.totalPaid,
      totalRefunded: row.totalRefunded,
    }))
    .reverse()

  return {
    averageNetSpentLabel: formatCurrency(avgNetSpent),
    chartItems,
    refundRatioLabel: totalPaid > 0 ? `${((totalRefunded / totalPaid) * 100).toFixed(1)}%` : '0.0%',
    topCustomerLabel: topCustomer ? `${topCustomer.customerName} · ${topCustomer.netSpentLabel}` : 'No customer data',
    topPackageCustomerLabel: topPackageCustomer
      ? `${topPackageCustomer.customerName} · ${topPackageCustomer.totalPackageBookingsLabel} packages`
      : 'No package bookings',
    topTripCustomerLabel: topTripCustomer
      ? `${topTripCustomer.customerName} · ${topTripCustomer.totalTripBookingsLabel} trips`
      : 'No trip bookings',
    totalCustomers,
    totalCustomersLabel: formatCompactCount(totalCustomers),
    totalNetSpent,
    totalNetSpentLabel: formatCurrency(totalNetSpent),
    totalPackageBookings,
    totalPackageBookingsLabel: formatCompactCount(totalPackageBookings),
    totalPaid,
    totalPaidLabel: formatCurrency(totalPaid),
    totalRefunded,
    totalRefundedLabel: formatCurrency(totalRefunded),
    totalTripBookings,
    totalTripBookingsLabel: formatCompactCount(totalTripBookings),
  }
}

