import { tripFieldRules } from '../validation/tripValidation'

export const TRIPS_PAGE_COPY = {
  newButtonLabel: 'New Trip',
  searchPlaceholder: 'Search by trip, route, vehicle',
  subtitle: 'Manage trip schedules, assigned vehicles, fares, and availability.',
  title: 'Trip Management',
}

export const tripFields = [
  { name: 'vehicle_id', label: 'Vehicle', type: 'select', options: [], rules: tripFieldRules.vehicle_id },
  { name: 'route_id', label: 'Route', type: 'select', options: [], rules: tripFieldRules.route_id },
  { name: 'trip_name', label: 'Trip Name', rules: tripFieldRules.trip_name },
  { name: 'departure_time', label: 'Departure Date', type: 'date', rules: tripFieldRules.departure_time },
  { name: 'arrival_time', label: 'Arrival Date', type: 'date', rules: tripFieldRules.arrival_time },
  { name: 'departure_at', label: 'Departure Time', type: 'time', defaultValue: '00:00', rules: tripFieldRules.departure_at },
  { name: 'arrival_at', label: 'Arrival Time', type: 'time', defaultValue: '00:00', rules: tripFieldRules.arrival_at },
  { name: 'price', label: 'Trip Cost', type: 'number', rules: tripFieldRules.price },
  { name: 'is_active', label: 'Status', type: 'select', defaultValue: '1', rules: tripFieldRules.is_active, options: [{ value: '1', label: 'Active' }, { value: '0', label: 'Completed' }] },
  { name: 'image', label: 'Image', type: 'file', accept: '.png,.jpg,.jpeg' },
]

const tripPayloadFieldNames = [
  'vehicle_id',
  'route_id',
  'trip_name',
  'departure_time',
  'arrival_time',
  'departure_at',
  'arrival_at',
  'price',
  'is_active',
  'image',
]

const formatTimeForTripPayload = (value) => {
  if (!value) {
    return value
  }

  const normalizedValue = String(value).trim()

  if (/am|pm/i.test(normalizedValue)) {
    return normalizedValue
  }

  const timeMatch = normalizedValue.match(/^(\d{1,2}):(\d{2})/)

  if (!timeMatch) {
    return normalizedValue
  }

  let hour = Number(timeMatch[1])
  const minute = timeMatch[2]
  const period = hour >= 12 ? 'PM' : 'AM'

  if (hour === 0) {
    hour = 12
  } else if (hour > 12) {
    hour -= 12
  }

  return `${String(hour).padStart(2, '0')}:${minute} ${period}`
}

const getSelectedFile = (value) => {
  if (typeof File !== 'undefined' && value instanceof File) {
    return value
  }

  const candidate = value?.[0]

  if (typeof File !== 'undefined' && candidate instanceof File) {
    return candidate
  }

  if (candidate && typeof candidate === 'object' && typeof candidate.name === 'string') {
    return candidate
  }

  return null
}

export const toTripFormData = (values, editingItem) => {
  const formData = new FormData()

  tripPayloadFieldNames.forEach((key) => {
    const value = values[key]

    if (key === 'image') {
      const file = getSelectedFile(value)

      if (file) {
        formData.append(key, file)
      }

      return
    }

    if (key === 'departure_at' || key === 'arrival_at') {
      formData.append(key, formatTimeForTripPayload(value))
      return
    }

    if (value !== undefined && value !== null) {
      formData.append(key, value)
    }
  })

  if (editingItem?.id) {
    formData.append('id', editingItem.id)
  }

  return formData
}
