import { API_URLS } from '../../../constants/apiUrls'
import { apiRequest } from '../../../services/apiClient'
import { assertSuccessfulExecution } from '../../../services/resourceApi'
import {
  buildRouteWiseSalesSummary,
  createEmptyRouteWiseSalesSummary,
  normalizeRouteWiseSalesRows,
} from '../utils/routeWiseSalesReportUtils'

export const emptyRouteWiseSalesReportData = {
  rows: [],
  summary: createEmptyRouteWiseSalesSummary(),
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

export const getRouteWiseSalesReport = async () => {
  const payload = assertSuccessfulExecution(
    await apiRequest(API_URLS.reports.routeWiseSales),
    'Unable to load route wise sales report.',
  )
  const rows = normalizeRouteWiseSalesRows(extractRows(payload))

  return {
    rows,
    summary: buildRouteWiseSalesSummary(rows),
  }
}
