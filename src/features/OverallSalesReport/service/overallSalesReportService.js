import { API_URLS } from '../../../constants/apiUrls'
import { apiRequest } from '../../../services/apiClient'
import { assertSuccessfulExecution } from '../../../services/resourceApi'
import {
  buildOverallSalesSummary,
  createEmptyOverallSalesSummary,
  normalizeOverallSalesRows,
} from '../utils/overallSalesReportUtils'

export const emptyOverallSalesReportData = {
  rows: [],
  summary: createEmptyOverallSalesSummary(),
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

export const getOverallSalesReport = async () => {
  const payload = assertSuccessfulExecution(
    await apiRequest(API_URLS.reports.overallSales),
    'Unable to load overall sales report.',
  )
  const rows = normalizeOverallSalesRows(extractRows(payload))

  return {
    rows,
    summary: buildOverallSalesSummary(rows),
  }
}
