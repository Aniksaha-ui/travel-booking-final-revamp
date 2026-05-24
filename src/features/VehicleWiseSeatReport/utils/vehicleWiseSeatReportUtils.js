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

const formatSeatCount = (value) => {
  const count = toNumber(value)
  return `${count} seat${count === 1 ? '' : 's'}`
}

const shortenVehicleName = (value, maxLength = 18) => {
  const normalizedValue = normalizeText(value, '')

  if (normalizedValue.length <= maxLength) {
    return normalizedValue
  }

  return `${normalizedValue.slice(0, maxLength - 1).trimEnd()}...`
}

const buildDistribution = (items, accessor) =>
  Object.entries(
    items.reduce((result, item) => {
      const key = normalizeText(accessor(item), 'Unspecified')
      result[key] = (result[key] ?? 0) + 1
      return result
    }, {}),
  )
    .map(([label, count]) => ({ count, label }))
    .sort((firstItem, secondItem) => secondItem.count - firstItem.count)

export const formatCompactCount = (value) => compactCountFormatter.format(toNumber(value))

export const createEmptyVehicleWiseSeatSummary = () => ({
  averageSeatsPerVehicle: 0,
  averageSeatsPerVehicleLabel: formatSeatCount(0),
  highestCapacityVehicleLabel: 'No fleet data available.',
  totalSeats: 0,
  totalSeatsLabel: formatSeatCount(0),
  totalVehicles: 0,
  totalVehiclesLabel: formatCompactCount(0),
  uniqueVehicleTypes: 0,
  uniqueVehicleTypesLabel: formatCompactCount(0),
})

export const normalizeVehicleWiseSeatRow = (item, index = 0, pagination = {}) => {
  const seatCapacity = toNumber(item.available_seats)
  const serialSeed = pagination.from || 1
  const vehicleType = normalizeText(item.vehicle_type, 'Unspecified')

  return {
    id: item.vehicle_id ?? item.id ?? `vehicle-report-${index + 1}`,
    seatCapacity,
    seatCapacityLabel: formatSeatCount(seatCapacity),
    serial: serialSeed + index,
    vehicleId: item.vehicle_id ?? item.id ?? null,
    vehicleName: normalizeText(item.vehicle_name, `Vehicle ${index + 1}`),
    vehicleNameShort: shortenVehicleName(item.vehicle_name, 24),
    vehicleType,
  }
}

export const buildVehicleWiseSeatSummary = (rows = []) => {
  const totalVehicles = rows.length
  const totalSeats = rows.reduce((sum, row) => sum + row.seatCapacity, 0)
  const averageSeatsPerVehicle = totalVehicles ? totalSeats / totalVehicles : 0
  const uniqueVehicleTypes = new Set(rows.map((row) => row.vehicleType)).size
  const highestCapacityVehicle = rows.reduce(
    (bestRow, row) => (row.seatCapacity > bestRow.seatCapacity ? row : bestRow),
    rows[0] ?? null,
  )

  return {
    averageSeatsPerVehicle,
    averageSeatsPerVehicleLabel: `${averageSeatsPerVehicle.toFixed(totalVehicles ? 1 : 0)} seats`,
    highestCapacityVehicleLabel: highestCapacityVehicle
      ? `${highestCapacityVehicle.vehicleName} • ${highestCapacityVehicle.seatCapacityLabel}`
      : 'No fleet data available.',
    totalSeats,
    totalSeatsLabel: formatSeatCount(totalSeats),
    totalVehicles,
    totalVehiclesLabel: formatCompactCount(totalVehicles),
    uniqueVehicleTypes,
    uniqueVehicleTypesLabel: formatCompactCount(uniqueVehicleTypes),
  }
}

export const buildVehicleWiseSeatMetrics = (rows = []) => {
  const summary = buildVehicleWiseSeatSummary(rows)
  const typeDistribution = buildDistribution(rows, (row) => row.vehicleType)
  const topVehicles = [...rows]
    .sort((firstRow, secondRow) => secondRow.seatCapacity - firstRow.seatCapacity)
    .slice(0, 8)
    .map((row) => ({
      key: row.vehicleId ?? row.id,
      label: row.vehicleName,
      seatCapacity: row.seatCapacity,
      shortLabel: shortenVehicleName(row.vehicleName),
      type: row.vehicleType,
    }))

  return {
    ...summary,
    chartItems: topVehicles,
    typeDistribution,
  }
}

export const normalizeVehicleSeat = (item, index = 0) => {
  const seatNumber = normalizeText(item.seat_number, `Seat ${index + 1}`)
  const isAvailable = Number(item.is_available) === 1

  return {
    id: item.id ?? `${seatNumber}-${index + 1}`,
    isAvailable,
    is_available: isAvailable ? 1 : 0,
    seat_class: normalizeText(item.seat_class, 'General'),
    seatClass: normalizeText(item.seat_class, 'General'),
    seatType: normalizeText(item.seat_type, 'Standard'),
    seat_number: seatNumber,
    seat_type: normalizeText(item.seat_type, 'Standard'),
    statusLabel: isAvailable ? 'Available' : 'Booked',
  }
}

export const buildVehicleSeatLayoutSummary = (seats = []) => {
  const totalSeats = seats.length
  const availableSeats = seats.filter((seat) => seat.isAvailable).length
  const bookedSeats = totalSeats - availableSeats
  const availabilityRatio = totalSeats ? Math.round((availableSeats / totalSeats) * 100) : 0

  return {
    availabilityRatio,
    availabilityRatioLabel: `${availabilityRatio}% available`,
    availableSeats,
    availableSeatsLabel: formatSeatCount(availableSeats),
    bookedSeats,
    bookedSeatsLabel: formatSeatCount(bookedSeats),
    classDistribution: buildDistribution(seats, (seat) => seat.seatClass),
    totalSeats,
    totalSeatsLabel: formatSeatCount(totalSeats),
    typeDistribution: buildDistribution(seats, (seat) => seat.seatType),
  }
}
