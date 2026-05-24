import { API_URLS } from '../../../constants/apiUrls'
import { apiRequest } from '../../../services/apiClient'
import { assertSuccessfulExecution } from '../../../services/resourceApi'
import {
  buildBookingSummary,
  createEmptyBookingSummary,
  normalizeBookingSummaryRows,
} from '../utils/bookingSummaryUtils'

export const emptyBookingSummaryData = {
  rows: [],
  summary: createEmptyBookingSummary(),
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

export const getBookingSummary = async () => {
  const payload = assertSuccessfulExecution(
    await apiRequest(API_URLS.reports.bookingSummary),
    'Unable to load booking summary report.',
  )
  const rows = normalizeBookingSummaryRows(extractRows(payload))

  return {
    rows,
    summary: buildBookingSummary(rows),
  }
}
