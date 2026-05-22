export const ROUTES_PAGE_COPY = {
  newButtonLabel: 'New Route',
  searchPlaceholder: 'Search by route, origin, destination',
  subtitle: 'Manage travel routes, route codes, and availability.',
  title: 'Routes',
}

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

export const routeFields = [
  { name: 'origin', label: 'Origin', placeholder: 'Dhaka', rules: { required: 'Origin is required.' } },
  { name: 'destination', label: 'Destination', placeholder: 'Cox Bazar', rules: { required: 'Destination is required.' } },
  { name: 'route_name', label: 'Route Name', placeholder: "Dhaka - Cox's Bazar", rules: { required: 'Route name is required.' } },
]
