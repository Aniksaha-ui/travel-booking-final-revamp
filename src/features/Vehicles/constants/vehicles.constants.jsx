export const VEHICLES_PAGE_COPY = {
  newButtonLabel: 'New Vehicle',
  searchPlaceholder: 'Search by vehicle, route, type',
  subtitle: 'Manage vehicles, assigned routes, and seat capacity.',
  title: 'Vehicles',
}

export const vehicleColumns = [
  {
    id: 'vehicle_name',
    label: 'Vehicle',
    width: '28%',
    render: (item) => (
      <div className="routes-table__name">
        <span className="routes-table__avatar">{item.vehicle_name?.charAt(0) ?? 'V'}</span>
        <span className="routes-table__name-text">{item.vehicle_name}</span>
      </div>
    ),
  },
  { id: 'vehicle_type', label: 'Vehicle Type', width: '18%' },
  { id: 'route_name', label: 'Route', width: '26%' },
  { id: 'total_seats', label: 'Total Seats', width: '14%', className: 'routes-table__muted' },
]

export const vehicleFields = [
  { name: 'vehicle_name', label: 'Vehicle Name', placeholder: 'Toyota Hiace', rules: { required: 'Vehicle name is required.' } },
  {
    name: 'vehicle_type',
    label: 'Vehicle Type',
    type: 'select',
    rules: { required: 'Vehicle type is required.' },
    options: [
      { value: 'flight', label: 'Flight' },
      { value: 'bus', label: 'Bus' },
      { value: 'train', label: 'Train' },
    ],
  },
  { name: 'total_seats', label: 'Total Seats', type: 'number', rules: { required: 'Total seats is required.', min: { value: 1, message: 'Total seats must be greater than 0.' } } },
  { name: 'route_id', label: 'Route ID', type: 'number', placeholder: '1', rules: { required: 'Route ID is required.' } },
]
