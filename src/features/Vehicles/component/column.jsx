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
