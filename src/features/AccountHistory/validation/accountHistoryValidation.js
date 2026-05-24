export const validateAccountHistoryDateRange = ({ endDate, startDate }) => {
  if (!startDate || !endDate) {
    return 'Start date and end date are required.'
  }

  if (endDate < startDate) {
    return 'End date must be on or after the start date.'
  }

  return ''
}

