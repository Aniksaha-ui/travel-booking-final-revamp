export const validateVehicleTrackingDateRange = ({ endDate, startDate }) => {
  if ((startDate && !endDate) || (!startDate && endDate)) {
    return 'Choose both a start date and an end date to filter the report.'
  }

  if (startDate && endDate && endDate < startDate) {
    return 'End date must be on or after the start date.'
  }

  return ''
}
