import { API_URLS } from '../../../constants/apiUrls'
import { apiRequest } from '../../../services/apiClient'
import { buildQueryPath, unwrapCollection } from '../../../services/resourceApi'
import {
  buildTripPerformanceSummary,
  createEmptyTripPerformanceSummary,
  normalizeTripPerformanceRow,
} from '../utils/tripPerformanceUtils'

const defaultPagination = {
  currentPage: 1,
  from: 0,
  lastPage: 1,
  to: 0,
  total: 0,
}

export const emptyTripPerformanceData = {
  pagination: defaultPagination,
  rows: [],
  summary: createEmptyTripPerformanceSummary(),
}

export const getTripPerformanceReport = async ({ page = 1, search = '' } = {}) => {
  const payload = await apiRequest(buildQueryPath(API_URLS.reports.tripPerformance, { page, search }))
  const collection = unwrapCollection(payload, 'Unable to load trip performance report.')
  const rows = collection.rows.map((item, index) =>
    normalizeTripPerformanceRow(item, index, collection.pagination),
  )

  return {
    pagination: collection.pagination,
    rows,
    summary: buildTripPerformanceSummary(rows),
  }
}
