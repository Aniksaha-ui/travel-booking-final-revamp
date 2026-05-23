export const routeColumns = [
  {
    id: 'route_name',
    label: 'Route Name',
    width: '34%',
    render: (route) => (
      <div className="routes-table__name">
        <span className="routes-table__avatar">{route.route_name?.charAt(0) ?? 'R'}</span>
        <span className="routes-table__name-text">{route.route_name}</span>
      </div>
    ),
  },
  { id: 'origin', label: 'Origin', width: '24%' },
  { id: 'destination', label: 'Destination', width: '24%' },
]
