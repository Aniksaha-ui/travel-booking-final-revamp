import { API_URLS } from '../../../constants/apiUrls'
import { apiRequest } from '../../../services/apiClient'
import { assertSuccessfulExecution } from '../../../services/resourceApi'
import {
  buildTicketStatusSummary,
  createEmptyTicketStatusSummary,
  normalizeTicketStatusRows,
} from '../utils/ticketStatusReportUtils'

export const emptyTicketStatusReportData = {
  rows: [],
  summary: createEmptyTicketStatusSummary(),
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

export const getTicketStatusReport = async () => {
  const payload = assertSuccessfulExecution(
    await apiRequest(API_URLS.reports.ticketStatusReport),
    'Unable to load ticket status report.',
  )
  const rows = normalizeTicketStatusRows(extractRows(payload))

  return {
    rows,
    summary: buildTicketStatusSummary(rows),
  }
}
