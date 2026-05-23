export const vehicleFieldRules = {
  route_id: {
    required: 'Route is required.',
  },
  total_seats: {
    min: {
      message: 'Total seats must be greater than 0.',
      value: 1,
    },
    required: 'Total seats is required.',
  },
  vehicle_name: {
    required: 'Vehicle name is required.',
  },
  vehicle_type: {
    required: 'Vehicle type is required.',
  },
}
