import dayjs from 'dayjs'

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

export const formatCompactCount = (value) => compactCountFormatter.format(toNumber(value))

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

const resolveSeverity = (occupancyRate) => {
  if (occupancyRate < 20) {
    return 'critical'
  }

  if (occupancyRate < 35) {
    return 'warning'
  }

  return 'watch'
}

const resolveSeverityLabel = (severity) => {
  if (severity === 'critical') {
    return 'Critical'
  }

  if (severity === 'warning') {
    return 'Warning'
  }

  return 'Watch'
}

export const createEmptyLowOccupancySummary = () => ({
  averageOccupancy: 0,
  averageOccupancyLabel: '0%',
  flaggedTrips: 0,
  flaggedTripsLabel: formatCompactCount(0),
  nearestDepartureLabel: 'No upcoming low-occupancy trips.',
  openSeatVolume: 0,
  openSeatVolumeLabel: '0 seats',
  totalBookedSeats: 0,
  totalBookedSeatsLabel: formatCompactCount(0),
  totalCapacity: 0,
  totalCapacityLabel: formatCompactCount(0),
  worstTripLabel: 'No upcoming low-occupancy trips.',
})

export const normalizeLowOccupancyRow = (item, index = 0) => {
  const totalSeats = toNumber(item.total_seats)
  const bookedSeats = toNumber(item.booked_seats)
  const occupancyRate = toNumber(item.occupancy_rate)
  const openSeats = Math.max(totalSeats - bookedSeats, 0)
  const severity = resolveSeverity(occupancyRate)
  const departureDateLabel = formatDateLabel(item.departure_time)

  return {
    bookedSeats,
    bookedSeatsLabel: `${bookedSeats}`,
    departureDate: item.departure_time ?? '',
    departureDateLabel,
    id: item.trip_id ?? `${item.trip_name ?? 'trip'}-${index + 1}`,
    occupancyRate,
    occupancyRateLabel: `${occupancyRate}%`,
    openSeats,
    openSeatsLabel: `${openSeats}`,
    progressWidth: `${Math.min(Math.max(occupancyRate, 0), 100)}%`,
    severity,
    severityLabel: resolveSeverityLabel(severity),
    shortLabel: shortenLabel(item.trip_name, 22),
    totalSeats,
    totalSeatsLabel: `${totalSeats}`,
    tripName: normalizeText(item.trip_name, `Trip ${index + 1}`),
  }
}

export const buildLowOccupancySummary = (rows = []) => {
  const flaggedTrips = rows.length
  const totalCapacity = rows.reduce((sum, row) => sum + row.totalSeats, 0)
  const totalBookedSeats = rows.reduce((sum, row) => sum + row.bookedSeats, 0)
  const openSeatVolume = rows.reduce((sum, row) => sum + row.openSeats, 0)
  const averageOccupancy = flaggedTrips
    ? Math.round(rows.reduce((sum, row) => sum + row.occupancyRate, 0) / flaggedTrips)
    : 0
  const worstTrip = rows.reduce(
    (bestRow, row) => (row.occupancyRate < bestRow.occupancyRate ? row : bestRow),
    rows[0] ?? null,
  )
  const nearestDeparture = rows
    .filter((row) => dayjs(row.departureDate).isValid())
    .sort((firstRow, secondRow) => dayjs(firstRow.departureDate).valueOf() - dayjs(secondRow.departureDate).valueOf())[0] ?? null

  return {
    averageOccupancy,
    averageOccupancyLabel: `${averageOccupancy}%`,
    flaggedTrips,
    flaggedTripsLabel: formatCompactCount(flaggedTrips),
    nearestDepartureLabel: nearestDeparture
      ? `${nearestDeparture.tripName} • ${nearestDeparture.departureDateLabel}`
      : 'No upcoming low-occupancy trips.',
    openSeatVolume,
    openSeatVolumeLabel: `${openSeatVolume} seats`,
    totalBookedSeats,
    totalBookedSeatsLabel: formatCompactCount(totalBookedSeats),
    totalCapacity,
    totalCapacityLabel: formatCompactCount(totalCapacity),
    worstTripLabel: worstTrip
      ? `${worstTrip.tripName} • ${worstTrip.occupancyRateLabel}`
      : 'No upcoming low-occupancy trips.',
  }
}

export const buildLowOccupancyMetrics = (rows = []) => ({
  ...buildLowOccupancySummary(rows),
  chartItems: [...rows].sort((firstRow, secondRow) => firstRow.occupancyRate - secondRow.occupancyRate),
})

export const filterLowOccupancyRows = (rows = [], search = '') => {
  const normalizedSearch = search.trim().toLowerCase()

  if (!normalizedSearch) {
    return rows
  }

  return rows.filter((row) =>
    [row.tripName, row.departureDateLabel, row.occupancyRateLabel].some((value) =>
      String(value).toLowerCase().includes(normalizedSearch),
    ),
  )
}
