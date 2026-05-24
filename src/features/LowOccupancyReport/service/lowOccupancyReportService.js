import { API_URLS } from '../../../constants/apiUrls'
import { apiRequest } from '../../../services/apiClient'
import { isExecutionSuccessful } from '../../../services/resourceApi'
import {
  buildLowOccupancySummary,
  createEmptyLowOccupancySummary,
  normalizeLowOccupancyRow,
} from '../utils/lowOccupancyReportUtils'

export const emptyLowOccupancyReportData = {
  rows: [],
  summary: createEmptyLowOccupancySummary(),
}

export const getLowOccupancyReport = async () => {
  const payload = await apiRequest(API_URLS.reports.lowOccupancyTripReport)
  const isSuccessful = isExecutionSuccessful(payload)
  const rows = Array.isArray(payload?.data) ? payload.data : []

  if (!isSuccessful && rows.length === 0) {
    return emptyLowOccupancyReportData
  }

  if (!isSuccessful) {
    throw new Error(payload?.message || 'Unable to load low occupancy report.')
  }

  const normalizedRows = rows.map((item, index) => normalizeLowOccupancyRow(item, index))

  return {
    rows: normalizedRows,
    summary: buildLowOccupancySummary(normalizedRows),
  }
}
