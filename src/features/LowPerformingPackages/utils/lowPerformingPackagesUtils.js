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

const formatCount = (value) => compactFormatter.format(toNumber(value))

export const createEmptyLowPerformingPackagesSummary = () => ({
  averageBookings: 0,
  averageBookingsLabel: '0',
  lowestPackageLabel: 'No low-performing packages identified.',
  totalPackages: 0,
  totalPackagesLabel: formatCount(0),
  totalRecentBookings: 0,
  totalRecentBookingsLabel: formatCount(0),
  zeroBookingPackages: 0,
  zeroBookingPackagesLabel: formatCount(0),
})

export const normalizeLowPerformingPackage = (item = {}, index = 0) => {
  const id = item.id ?? item.package_id ?? index + 1
  const recentBookingCount = toNumber(item.recent_booking_count ?? item.recentBookings ?? item.booking_count)

  return {
    id,
    idLabel: `#${id}`,
    packageName: normalizeText(item.package_name ?? item.name, `Package ${index + 1}`),
    recentBookingCount,
    recentBookingCountLabel: `${recentBookingCount}`,
    serial: index + 1,
    statusLabel: 'Low Performance',
  }
}

export const buildLowPerformingPackagesSummary = (rows = []) => {
  if (!rows.length) {
    return createEmptyLowPerformingPackagesSummary()
  }

  const totalPackages = rows.length
  const totalRecentBookings = rows.reduce((sum, row) => sum + row.recentBookingCount, 0)
  const zeroBookingPackages = rows.filter((row) => row.recentBookingCount <= 0).length
  const averageBookings = Math.round(totalRecentBookings / totalPackages)
  const lowestPackage = [...rows].sort(
    (firstRow, secondRow) => firstRow.recentBookingCount - secondRow.recentBookingCount,
  )[0]

  return {
    averageBookings,
    averageBookingsLabel: `${averageBookings}`,
    lowestPackageLabel: `${lowestPackage.packageName} • ${lowestPackage.recentBookingCountLabel} bookings`,
    totalPackages,
    totalPackagesLabel: formatCount(totalPackages),
    totalRecentBookings,
    totalRecentBookingsLabel: formatCount(totalRecentBookings),
    zeroBookingPackages,
    zeroBookingPackagesLabel: formatCount(zeroBookingPackages),
  }
}

export const filterLowPerformingPackages = (rows = [], search = '') => {
  const normalizedSearch = search.trim().toLowerCase()

  if (!normalizedSearch) {
    return rows
  }

  return rows.filter((row) =>
    [row.idLabel, row.packageName, row.recentBookingCountLabel, row.statusLabel].some((value) =>
      String(value).toLowerCase().includes(normalizedSearch),
    ),
  )
}
