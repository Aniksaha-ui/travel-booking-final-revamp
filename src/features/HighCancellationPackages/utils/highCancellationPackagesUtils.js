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

const formatCompact = (value) => compactFormatter.format(toNumber(value))

const resolveSeverity = (rate) => {
  if (rate > 30) {
    return 'danger'
  }

  if (rate > 15) {
    return 'warning'
  }

  return 'success'
}

const resolveSeverityLabel = (severity) => {
  if (severity === 'danger') {
    return 'High Risk'
  }

  if (severity === 'warning') {
    return 'Watch'
  }

  return 'Stable'
}

export const createEmptyHighCancellationSummary = () => ({
  averageCancellationRate: 0,
  averageCancellationRateLabel: '0.0%',
  highestRiskLabel: 'No high cancellation data found.',
  totalBookings: 0,
  totalBookingsLabel: formatCompact(0),
  totalCancellations: 0,
  totalCancellationsLabel: formatCompact(0),
  totalPackages: 0,
  totalPackagesLabel: formatCompact(0),
})

export const normalizeHighCancellationRows = (items = []) =>
  items.map((item = {}, index) => {
    const cancellationRate = toNumber(item.cancellation_rate ?? item.cancellationRate)
    const severity = resolveSeverity(cancellationRate)
    const totalBookings = toNumber(item.total_bookings ?? item.totalBookings)
    const cancelledCount = toNumber(item.cancelled_count ?? item.cancelledCount)

    return {
      cancelledCount,
      cancelledCountLabel: formatCompact(cancelledCount),
      cancellationRate,
      cancellationRateLabel: `${cancellationRate.toFixed(1)}%`,
      id: item.id ?? item.package_id ?? `${item.package_name ?? 'package'}-${index + 1}`,
      packageName: normalizeText(item.package_name ?? item.name, `Package ${index + 1}`),
      progressWidth: `${Math.min(Math.max(cancellationRate, 0), 100)}%`,
      severity,
      severityLabel: resolveSeverityLabel(severity),
      totalBookings,
      totalBookingsLabel: formatCompact(totalBookings),
    }
  })

export const buildHighCancellationSummary = (rows = []) => {
  if (!rows.length) {
    return createEmptyHighCancellationSummary()
  }

  const totalBookings = rows.reduce((sum, row) => sum + row.totalBookings, 0)
  const totalCancellations = rows.reduce((sum, row) => sum + row.cancelledCount, 0)
  const averageCancellationRate =
    rows.reduce((sum, row) => sum + row.cancellationRate, 0) / rows.length
  const highestRisk = [...rows].sort(
    (firstRow, secondRow) => secondRow.cancellationRate - firstRow.cancellationRate,
  )[0]

  return {
    averageCancellationRate,
    averageCancellationRateLabel: `${averageCancellationRate.toFixed(1)}%`,
    highestRiskLabel: `${highestRisk.packageName} • ${highestRisk.cancellationRateLabel}`,
    totalBookings,
    totalBookingsLabel: formatCompact(totalBookings),
    totalCancellations,
    totalCancellationsLabel: formatCompact(totalCancellations),
    totalPackages: rows.length,
    totalPackagesLabel: formatCompact(rows.length),
  }
}

export const filterHighCancellationRows = (rows = [], search = '') => {
  const normalizedSearch = search.trim().toLowerCase()

  if (!normalizedSearch) {
    return rows
  }

  return rows.filter((row) =>
    [row.packageName, row.totalBookingsLabel, row.cancelledCountLabel, row.cancellationRateLabel, row.severityLabel].some(
      (value) => String(value).toLowerCase().includes(normalizedSearch),
    ),
  )
}
