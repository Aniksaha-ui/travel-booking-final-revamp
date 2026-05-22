export const SEATS_PAGE_COPY = {
  newButtonLabel: 'New Seat',
  searchPlaceholder: 'Search by seat, vehicle, class',
  subtitle: 'Manage vehicle seats, classes, types, and availability.',
  title: 'Seat Management',
}

export const seatColumns = [
  {
    id: 'seat_number',
    label: 'Seat Number',
    width: '22%',
    render: (item) => (
      <div className="routes-table__name">
        <span className="routes-table__avatar">{item.seat_number?.charAt(0) ?? 'S'}</span>
        <span className="routes-table__name-text">{item.seat_number}</span>
      </div>
    ),
  },
  { id: 'vehicle_name', label: 'Vehicle', width: '26%' },
  { id: 'seat_class', label: 'Class', width: '18%' },
  { id: 'seat_type', label: 'Type', width: '18%' },
  {
    id: 'is_available',
    label: 'Status',
    width: '10%',
    align: 'center',
    className: 'routes-table__status',
    render: (item) => (
      <span className={`routes-status routes-status--${Number(item.is_available) === 1 ? 'active' : 'inactive'}`}>
        {Number(item.is_available) === 1 ? 'available' : 'booked'}
      </span>
    ),
  },
]

export const seatFields = [
  { name: 'vehicle_id', label: 'Vehicle ID', type: 'number', rules: { required: 'Vehicle ID is required.' } },
  { name: 'seat_number', label: 'Seat Number', placeholder: 'A1', rules: { required: 'Seat number is required.' } },
  {
    name: 'seat_class',
    label: 'Seat Class',
    type: 'select',
    rules: { required: 'Seat class is required.' },
    options: [
      { value: 'economy', label: 'Economy' },
      { value: 'business', label: 'Business' },
      { value: 'first_class', label: 'First Class' },
    ],
  },
  {
    name: 'seat_type',
    label: 'Seat Type',
    type: 'select',
    rules: { required: 'Seat type is required.' },
    options: [
      { value: 'window', label: 'Window' },
      { value: 'aisle', label: 'Aisle' },
      { value: 'middle', label: 'Middle' },
    ],
  },
  {
    name: 'is_available',
    label: 'Availability',
    type: 'select',
    defaultValue: '1',
    rules: { required: 'Availability is required.' },
    options: [
      { value: '1', label: 'Available' },
      { value: '0', label: 'Booked' },
    ],
  },
]
