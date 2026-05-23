import { routeFieldRules } from '../validation/routeValidation'

export const ROUTES_PAGE_COPY = {
  newButtonLabel: 'New Route',
  searchPlaceholder: 'Search by route, origin, destination',
  subtitle: 'Manage travel routes, route codes, and availability.',
  title: 'Routes',
}

export const routeFields = [
  { name: 'origin', label: 'Origin', placeholder: 'Dhaka', rules: routeFieldRules.origin },
  { name: 'destination', label: 'Destination', placeholder: 'Cox Bazar', rules: routeFieldRules.destination },
  { name: 'route_name', label: 'Route Name', placeholder: "Dhaka - Cox's Bazar", rules: routeFieldRules.route_name },
]
