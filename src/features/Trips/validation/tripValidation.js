export const tripFieldRules = {
  arrival_at: {
    required: 'Arrival time is required.',
  },
  arrival_time: {
    required: 'Arrival date is required.',
  },
  departure_at: {
    required: 'Departure time is required.',
  },
  departure_time: {
    required: 'Departure date is required.',
  },
  is_active: {
    required: 'Status is required.',
  },
  price: {
    min: {
      message: 'Trip cost must be greater than 0.',
      value: 1,
    },
    required: 'Trip cost is required.',
  },
  route_id: {
    required: 'Route is required.',
  },
  trip_name: {
    required: 'Trip name is required.',
  },
  vehicle_id: {
    required: 'Vehicle is required.',
  },
}
