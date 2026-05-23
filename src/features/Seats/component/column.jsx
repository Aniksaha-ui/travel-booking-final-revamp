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
