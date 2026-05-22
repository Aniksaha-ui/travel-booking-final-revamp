export const TRIPS_PAGE_COPY = {
  newButtonLabel: 'New Trip',
  searchPlaceholder: 'Search by trip, route, vehicle',
  subtitle: 'Manage trip schedules, assigned vehicles, fares, and availability.',
  title: 'Trip Management',
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const formatTripDate = (value) => {
  if (!value) {
    return '-'
  }

  const dateParts = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/)

  if (dateParts) {
    const [, year, month, day] = dateParts
    return `${Number(day)} ${MONTH_NAMES[Number(month) - 1]} ${year}`
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return `${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`
}

export const tripColumns = [
  {
    id: 'trip_name',
    label: 'Trip',
    width: '19%',
    render: (item) => (
      <div className="routes-table__name">
        <span className="routes-table__avatar">{item.trip_name?.charAt(0) ?? 'T'}</span>
        <span className="routes-table__name-text">{item.trip_name}</span>
      </div>
    ),
  },
  { id: 'route_name', label: 'Route', width: '17%' },
  { id: 'vehicle_name', label: 'Vehicle', width: '15%' },
  {
    id: 'departure_time',
    label: 'Departure',
    width: '13%',
    className: 'routes-table__muted',
    render: (item) => formatTripDate(item.departure_time),
  },
  {
    id: 'arrival_time',
    label: 'Arrival',
    width: '13%',
    className: 'routes-table__muted',
    render: (item) => formatTripDate(item.arrival_time),
  },
  { id: 'price', label: 'Price', width: '9%', className: 'routes-table__muted', render: (item) => `BDT ${item.price}` },
  {
    id: 'is_active',
    label: 'Status',
    width: '8%',
    align: 'center',
    className: 'routes-table__status',
    render: (item) => {
      const active = Number(item.is_active) === 1

      return (
        <span className={`routes-status routes-status--${active ? 'active' : 'inactive'}`}>
          {active ? 'active' : 'completed'}
        </span>
      )
    },
  },
]

export const tripFields = [
  { name: 'vehicle_id', label: 'Vehicle', type: 'select', options: [], rules: { required: 'Vehicle is required.' } },
  { name: 'route_id', label: 'Route', type: 'select', options: [], rules: { required: 'Route is required.' } },
  { name: 'trip_name', label: 'Trip Name', rules: { required: 'Trip name is required.' } },
  { name: 'departure_time', label: 'Departure Date', type: 'date', rules: { required: 'Departure date is required.' } },
  { name: 'arrival_time', label: 'Arrival Date', type: 'date', rules: { required: 'Arrival date is required.' } },
  { name: 'departure_at', label: 'Departure Time', type: 'time', defaultValue: '00:00', rules: { required: 'Departure time is required.' } },
  { name: 'arrival_at', label: 'Arrival Time', type: 'time', defaultValue: '00:00', rules: { required: 'Arrival time is required.' } },
  { name: 'price', label: 'Trip Cost', type: 'number', rules: { required: 'Trip cost is required.', min: { value: 1, message: 'Trip cost must be greater than 0.' } } },
  { name: 'is_active', label: 'Status', type: 'select', defaultValue: '1', rules: { required: 'Status is required.' }, options: [{ value: '1', label: 'Active' }, { value: '0', label: 'Completed' }] },
  { name: 'image', label: 'Image', type: 'file', accept: '.png,.jpg,.jpeg' },
]

export const toTripFormData = (values, editingItem) => {
  const formData = new FormData()

  Object.entries(values).forEach(([key, value]) => {
    if (key === 'image') {
      const file = value?.[0]
      if (file) {
        formData.append(key, file)
      }
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
