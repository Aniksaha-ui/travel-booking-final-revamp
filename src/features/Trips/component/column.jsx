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
  {
    id: 'price',
    label: 'Price',
    width: '9%',
    className: 'routes-table__muted',
    render: (item) => `BDT ${item.price}`,
  },
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
