import dayjs from 'dayjs'
import { VEHICLE_TRACKING_STATUS_LABELS } from '../constants/vehicleTrackingReport.constants'

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

const formatDateLabel = (value) => {
  const parsedDate = dayjs(value)
  return parsedDate.isValid() ? parsedDate.format('DD MMM YYYY') : '-'
}

const toNumber = (value) => {
  const parsedValue = Number(value)
  return Number.isNaN(parsedValue) ? 0 : parsedValue
}

const formatDurationLabel = (value) => {
  const totalDays = toNumber(value)
  return `${totalDays} day${totalDays === 1 ? '' : 's'}`
}

const formatScheduleLabel = (dateLabel, timeLabel) => {
  if (dateLabel === '-') {
    return '-'
  }

  return timeLabel && timeLabel !== '-' ? `${dateLabel} · ${timeLabel}` : dateLabel
}

const resolveTrackingStatus = (startDate, endDate) => {
  if (!startDate.isValid() || !endDate.isValid()) {
    return 'scheduled'
  }

  const today = dayjs().startOf('day')

  if (endDate.isBefore(today, 'day')) {
    return 'completed'
  }

  if (startDate.isAfter(today, 'day')) {
    return 'scheduled'
  }

  return 'active'
}

const shortenLabel = (value, maxLength = 18) => {
  const normalizedValue = normalizeText(value, '')

  if (normalizedValue.length <= maxLength) {
    return normalizedValue
  }

  return `${normalizedValue.slice(0, maxLength - 1).trimEnd()}...`
}

const formatCompactCount = (value) => compactCountFormatter.format(toNumber(value))

export const createEmptyVehicleTrackingSummary = () => ({
  activeCount: 0,
  activeCountLabel: formatCompactCount(0),
  averageTravelWindowDays: 0,
  averageTravelWindowLabel: formatDurationLabel(0),
  coverageWindowLabel: 'No schedules available.',
  totalAssignments: 0,
  totalAssignmentsLabel: formatCompactCount(0),
  totalTrackedDays: 0,
  totalTrackedDaysLabel: formatDurationLabel(0),
  uniqueTrips: 0,
  uniqueTripsLabel: formatCompactCount(0),
  uniqueVehicles: 0,
  uniqueVehiclesLabel: formatCompactCount(0),
})

export const normalizeVehicleTrackingRow = (item, index = 0, pagination = {}) => {
  const startDate = dayjs(item.travel_start_date)
  const endDate = dayjs(item.travel_end_date)
  const durationDays =
    startDate.isValid() && endDate.isValid()
      ? Math.max(endDate.diff(startDate, 'day') + 1, 1)
      : 0
  const departureTime = normalizeText(item.departure_at, '-')
  const arrivalTime = normalizeText(item.arrival_at, '-')
  const travelStartDateLabel = formatDateLabel(item.travel_start_date)
  const travelEndDateLabel = formatDateLabel(item.travel_end_date)
  const status = resolveTrackingStatus(startDate, endDate)
  const serialSeed = pagination.from || 1

  return {
    arrivalScheduleLabel: formatScheduleLabel(travelEndDateLabel, arrivalTime),
    arrivalTime,
    durationDays,
    durationLabel: formatDurationLabel(durationDays),
    id: item.id ?? `tracking-${index + 1}`,
    periodLabel:
      travelStartDateLabel === '-' && travelEndDateLabel === '-'
        ? '-'
        : `${travelStartDateLabel} - ${travelEndDateLabel}`,
    serial: serialSeed + index,
    status,
    statusLabel: VEHICLE_TRACKING_STATUS_LABELS[status] ?? 'Scheduled',
    travelEndDate: item.travel_end_date ?? '',
    travelEndDateLabel,
    travelStartDate: item.travel_start_date ?? '',
    travelStartDateLabel,
    tripName: normalizeText(item.trip_name, `Trip ${index + 1}`),
    vehicleName: normalizeText(item.vehicle_name, `Vehicle ${index + 1}`),
    vehicleNameShort: shortenLabel(item.vehicle_name, 20),
    departureScheduleLabel: formatScheduleLabel(travelStartDateLabel, departureTime),
    departureTime,
  }
}

export const buildVehicleTrackingSummary = (rows = []) => {
  const totalAssignments = rows.length
  const totalTrackedDays = rows.reduce((sum, row) => sum + row.durationDays, 0)
  const averageTravelWindowDays = totalAssignments ? totalTrackedDays / totalAssignments : 0
  const uniqueVehicles = new Set(rows.map((row) => row.vehicleName)).size
  const uniqueTrips = new Set(rows.map((row) => row.tripName)).size
  const activeCount = rows.filter((row) => row.status === 'active').length

  const validStartDates = rows
    .map((row) => dayjs(row.travelStartDate))
    .filter((dateValue) => dateValue.isValid())
  const validEndDates = rows
    .map((row) => dayjs(row.travelEndDate))
    .filter((dateValue) => dateValue.isValid())

  const earliestStart = validStartDates.length
    ? validStartDates.reduce((bestDate, dateValue) => (dateValue.isBefore(bestDate) ? dateValue : bestDate))
    : null
  const latestEnd = validEndDates.length
    ? validEndDates.reduce((bestDate, dateValue) => (dateValue.isAfter(bestDate) ? dateValue : bestDate))
    : null

  return {
    activeCount,
    activeCountLabel: formatCompactCount(activeCount),
    averageTravelWindowDays,
    averageTravelWindowLabel: `${averageTravelWindowDays.toFixed(totalAssignments ? 1 : 0)} days`,
    coverageWindowLabel:
      earliestStart && latestEnd
        ? `${earliestStart.format('DD MMM YYYY')} - ${latestEnd.format('DD MMM YYYY')}`
        : 'No schedules available.',
    totalAssignments,
    totalAssignmentsLabel: formatCompactCount(totalAssignments),
    totalTrackedDays,
    totalTrackedDaysLabel: formatDurationLabel(totalTrackedDays),
    uniqueTrips,
    uniqueTripsLabel: formatCompactCount(uniqueTrips),
    uniqueVehicles,
    uniqueVehiclesLabel: formatCompactCount(uniqueVehicles),
  }
}

export const buildVehicleTrackingMetrics = (rows = []) => {
  const summary = buildVehicleTrackingSummary(rows)

  const byVehicle = Object.values(
    rows.reduce((result, row) => {
      const key = row.vehicleName

      if (!result[key]) {
        result[key] = {
          assignments: 0,
          key,
          label: row.vehicleName,
          shortLabel: row.vehicleNameShort,
          totalDays: 0,
        }
      }

      result[key].assignments += 1
      result[key].totalDays += row.durationDays
      return result
    }, {}),
  )
    .sort((firstRow, secondRow) => {
      if (secondRow.assignments === firstRow.assignments) {
        return secondRow.totalDays - firstRow.totalDays
      }

      return secondRow.assignments - firstRow.assignments
    })
    .slice(0, 8)
    .map((row) => ({
      ...row,
      totalDaysLabel: formatDurationLabel(row.totalDays),
    }))

  const busiestVehicle = byVehicle[0] ?? null
  const longestAssignment = rows.reduce(
    (bestRow, row) => (row.durationDays > bestRow.durationDays ? row : bestRow),
    rows[0] ?? null,
  )
  const completedCount = rows.filter((row) => row.status === 'completed').length
  const scheduledCount = rows.filter((row) => row.status === 'scheduled').length

  return {
    ...summary,
    busiestVehicleLabel: busiestVehicle
      ? `${busiestVehicle.label} • ${busiestVehicle.assignments} assignments`
      : 'No vehicle assignments available.',
    chartItems: byVehicle,
    completedCount,
    completedCountLabel: formatCompactCount(completedCount),
    longestAssignmentLabel: longestAssignment
      ? `${longestAssignment.tripName} • ${longestAssignment.durationLabel}`
      : 'No tracked trip windows available.',
    scheduledCount,
    scheduledCountLabel: formatCompactCount(scheduledCount),
  }
}
