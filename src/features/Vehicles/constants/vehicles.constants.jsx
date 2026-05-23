import { vehicleFieldRules } from '../validation/vehicleValidation'

export const VEHICLES_PAGE_COPY = {
  newButtonLabel: 'New Vehicle',
  searchPlaceholder: 'Search by vehicle, route, type',
  subtitle: 'Manage vehicles, assigned routes, and seat capacity.',
  title: 'Vehicles',
}

export const vehicleFields = [
  { name: 'vehicle_name', label: 'Vehicle Name', placeholder: 'Toyota Hiace', rules: vehicleFieldRules.vehicle_name },
  {
    name: 'vehicle_type',
    label: 'Vehicle Type',
    type: 'select',
    rules: vehicleFieldRules.vehicle_type,
    options: [
      { value: 'flight', label: 'Flight' },
      { value: 'bus', label: 'Bus' },
      { value: 'train', label: 'Train' },
    ],
  },
  { name: 'total_seats', label: 'Total Seats', type: 'number', rules: vehicleFieldRules.total_seats },
  { name: 'route_id', label: 'Route', type: 'select', options: [], rules: vehicleFieldRules.route_id },
]
