import { seatFieldRules } from '../validation/seatValidation'

export const SEATS_PAGE_COPY = {
  newButtonLabel: 'New Seat',
  searchPlaceholder: 'Search by seat, vehicle, class',
  subtitle: 'Manage vehicle seats, classes, types, and availability.',
  title: 'Seat Management',
}

export const seatFields = [
  { name: 'vehicle_id', label: 'Vehicle ID', type: 'number', rules: seatFieldRules.vehicle_id },
  { name: 'seat_number', label: 'Seat Number', placeholder: 'A1', rules: seatFieldRules.seat_number },
  {
    name: 'seat_class',
    label: 'Seat Class',
    type: 'select',
    rules: seatFieldRules.seat_class,
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
    rules: seatFieldRules.seat_type,
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
    rules: seatFieldRules.is_available,
    options: [
      { value: '1', label: 'Available' },
      { value: '0', label: 'Booked' },
    ],
  },
]
