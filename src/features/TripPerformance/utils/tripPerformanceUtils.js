import dayjs from 'dayjs'

const compactCountFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  notation: 'compact',
})

const currencyFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
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

const formatDateLabel = (value) => {
  const parsedDate = dayjs(value)
  return parsedDate.isValid() ? parsedDate.format('DD MMM YYYY') : '-'
}

const shortenLabel = (value, maxLength = 18) => {
  const normalizedValue = normalizeText(value, '')

  if (normalizedValue.length <= maxLength) {
    return normalizedValue
  }

  return `${normalizedValue.slice(0, maxLength - 1).trimEnd()}...`
}

export const formatCurrency = (value) => `BDT ${currencyFormatter.format(toNumber(value))}`
export const formatCompactCount = (value) => compactCountFormatter.format(toNumber(value))

const formatSignedCurrency = (value) => {
  const amount = toNumber(value)
  const prefix = amount >= 0 ? '+' : '-'
  return `${prefix}${formatCurrency(Math.abs(amount))}`
}

export const createEmptyTripPerformanceSummary = () => ({
  averageUtilization: 0,
  averageUtilizationLabel: '0%',
  bestMarginTripLabel: 'No trips available.',
  bookedSeats: 0,
  bookedSeatsLabel: formatCompactCount(0),
  highestRevenueTripLabel: 'No trips available.',
  packageContributionRatio: 0,
  packageContributionRatioLabel: '0%',
  strongestUtilizationLabel: 'No trips available.',
  totalCombinedProfit: 0,
  totalCombinedProfitLabel: formatCurrency(0),
  totalCost: 0,
  totalCostLabel: formatCurrency(0),
  totalPackageIncome: 0,
  totalPackageIncomeLabel: formatCurrency(0),
  totalRevenue: 0,
  totalRevenueLabel: formatCurrency(0),
  totalTripIncome: 0,
  totalTripIncomeLabel: formatCurrency(0),
  totalTrips: 0,
  totalTripsLabel: formatCompactCount(0),
})

export const normalizeTripPerformanceRow = (item, index = 0, pagination = {}) => {
  const bookedTripSeats = toNumber(item.total_seats_booked_trip)
  const bookedPackageSeats = toNumber(item.total_seats_booked_package)
  const availableSeats = toNumber(item.total_seats_available)
  const totalBookedSeats = bookedTripSeats + bookedPackageSeats
  const totalCapacity = totalBookedSeats + availableSeats
  const utilizationRatio = totalCapacity ? Math.round((totalBookedSeats / totalCapacity) * 100) : 0
  const tripIncome = toNumber(item.total_income_trip)
  const packageIncome = toNumber(item.total_income_package)
  const totalRevenue = tripIncome + packageIncome
  const totalCost = toNumber(item.total_cost)
  const tripProfit = toNumber(item.profit_trip)
  const packageProfit = toNumber(item.profit_package)
  const combinedProfit = totalRevenue - totalCost
  const departureDateLabel = formatDateLabel(item.departure_time)
  const arrivalDateLabel = formatDateLabel(item.arrival_time)
  const serialSeed = pagination.from || 1

  return {
    arrivalDateLabel,
    availableSeats,
    availableSeatsLabel: `${availableSeats}`,
    bookedPackageSeats,
    bookedPackageSeatsLabel: `${bookedPackageSeats}`,
    bookedTripSeats,
    bookedTripSeatsLabel: `${bookedTripSeats}`,
    combinedProfit,
    combinedProfitLabel: formatCurrency(combinedProfit),
    combinedProfitSignedLabel: formatSignedCurrency(combinedProfit),
    departureDateLabel,
    id: item.trip_id ?? `trip-performance-${index + 1}`,
    packageIncome,
    packageIncomeLabel: formatCurrency(packageIncome),
    packageProfit,
    packageProfitLabel: formatCurrency(packageProfit),
    periodLabel: `${departureDateLabel} -> ${arrivalDateLabel}`,
    serial: serialSeed + index,
    shortLabel: shortenLabel(item.trip_name, 20),
    totalBookedSeats,
    totalBookedSeatsLabel: `${totalBookedSeats}`,
    totalCapacity,
    totalCapacityLabel: `${totalCapacity}`,
    totalCost,
    totalCostLabel: formatCurrency(totalCost),
    totalRevenue,
    totalRevenueLabel: formatCurrency(totalRevenue),
    tripId: item.trip_id ?? null,
    tripIncome,
    tripIncomeLabel: formatCurrency(tripIncome),
    tripName: normalizeText(item.trip_name, `Trip ${index + 1}`),
    tripProfit,
    tripProfitLabel: formatCurrency(tripProfit),
    utilizationRatio,
    utilizationRatioLabel: `${utilizationRatio}%`,
  }
}

export const buildTripPerformanceSummary = (rows = []) => {
  const totalTrips = rows.length
  const bookedSeats = rows.reduce((sum, row) => sum + row.totalBookedSeats, 0)
  const totalCapacity = rows.reduce((sum, row) => sum + row.totalCapacity, 0)
  const totalTripIncome = rows.reduce((sum, row) => sum + row.tripIncome, 0)
  const totalPackageIncome = rows.reduce((sum, row) => sum + row.packageIncome, 0)
  const totalRevenue = totalTripIncome + totalPackageIncome
  const totalCost = rows.reduce((sum, row) => sum + row.totalCost, 0)
  const totalCombinedProfit = totalRevenue - totalCost
  const averageUtilization = totalCapacity ? Math.round((bookedSeats / totalCapacity) * 100) : 0
  const packageContributionRatio = totalRevenue ? Math.round((totalPackageIncome / totalRevenue) * 100) : 0

  const highestRevenueTrip = rows.reduce(
    (bestRow, row) => (row.totalRevenue > bestRow.totalRevenue ? row : bestRow),
    rows[0] ?? null,
  )
  const bestMarginTrip = rows.reduce(
    (bestRow, row) => (row.combinedProfit > bestRow.combinedProfit ? row : bestRow),
    rows[0] ?? null,
  )
  const strongestUtilizationTrip = rows.reduce(
    (bestRow, row) => (row.utilizationRatio > bestRow.utilizationRatio ? row : bestRow),
    rows[0] ?? null,
  )

  return {
    averageUtilization,
    averageUtilizationLabel: `${averageUtilization}%`,
    bestMarginTripLabel: bestMarginTrip
      ? `${bestMarginTrip.tripName} • ${bestMarginTrip.combinedProfitSignedLabel}`
      : 'No trips available.',
    bookedSeats,
    bookedSeatsLabel: formatCompactCount(bookedSeats),
    highestRevenueTripLabel: highestRevenueTrip
      ? `${highestRevenueTrip.tripName} • ${highestRevenueTrip.totalRevenueLabel}`
      : 'No trips available.',
    packageContributionRatio,
    packageContributionRatioLabel: `${packageContributionRatio}%`,
    strongestUtilizationLabel: strongestUtilizationTrip
      ? `${strongestUtilizationTrip.tripName} • ${strongestUtilizationTrip.utilizationRatioLabel}`
      : 'No trips available.',
    totalCombinedProfit,
    totalCombinedProfitLabel: formatCurrency(totalCombinedProfit),
    totalCost,
    totalCostLabel: formatCurrency(totalCost),
    totalPackageIncome,
    totalPackageIncomeLabel: formatCurrency(totalPackageIncome),
    totalRevenue,
    totalRevenueLabel: formatCurrency(totalRevenue),
    totalTripIncome,
    totalTripIncomeLabel: formatCurrency(totalTripIncome),
    totalTrips,
    totalTripsLabel: formatCompactCount(totalTrips),
  }
}

export const buildTripPerformanceMetrics = (rows = []) => {
  const summary = buildTripPerformanceSummary(rows)
  const chartItems = [...rows]
    .sort((firstRow, secondRow) => secondRow.totalRevenue - firstRow.totalRevenue)
    .slice(0, 8)

  return {
    ...summary,
    chartItems,
  }
}
