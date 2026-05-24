import { API_URLS } from '../../../constants/apiUrls'
import { apiRequest } from '../../../services/apiClient'
import { assertSuccessfulExecution } from '../../../services/resourceApi'
import {
  buildHighCancellationSummary,
  createEmptyHighCancellationSummary,
  normalizeHighCancellationRows,
} from '../utils/highCancellationPackagesUtils'

export const emptyHighCancellationPackagesData = {
  rows: [],
  summary: createEmptyHighCancellationSummary(),
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

export const getHighCancellationPackages = async () => {
  const payload = assertSuccessfulExecution(
    await apiRequest(API_URLS.reports.highCancellationPackages),
    'Unable to load high cancellation packages.',
  )
  const rows = normalizeHighCancellationRows(extractRows(payload))

  return {
    rows,
    summary: buildHighCancellationSummary(rows),
  }
}
