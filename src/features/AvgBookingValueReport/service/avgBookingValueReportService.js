import { API_URLS } from '../../../constants/apiUrls'
import { apiRequest } from '../../../services/apiClient'
import { assertSuccessfulExecution } from '../../../services/resourceApi'
import {
  buildAvgBookingValueSummary,
  createEmptyAvgBookingValueSummary,
  normalizeAvgBookingValueRows,
} from '../utils/avgBookingValueReportUtils'

export const emptyAvgBookingValueReportData = {
  rows: [],
  summary: createEmptyAvgBookingValueSummary(),
}

const extractRows = (payload) => {
  if (Array.isArray(payload?.data)) {
    return payload.data
  }

  if (Array.isArray(payload?.data?.data)) {
    return payload.data.data
  }

  if (Array.isArray(payload)) {
    return payload
  }

  return []
}

export const getAvgBookingValueReport = async () => {
  const payload = assertSuccessfulExecution(
    await apiRequest(API_URLS.reports.avgBookingValue),
    'Unable to load average booking value report.',
  )
  const rows = normalizeAvgBookingValueRows(extractRows(payload))

  return {
    rows,
    summary: buildAvgBookingValueSummary(rows),
  }
}
