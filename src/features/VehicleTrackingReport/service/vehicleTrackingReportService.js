import { API_URLS } from '../../../constants/apiUrls'
import { apiRequest } from '../../../services/apiClient'
import { buildQueryPath, unwrapCollection } from '../../../services/resourceApi'
import {
  buildVehicleTrackingSummary,
  createEmptyVehicleTrackingSummary,
  normalizeVehicleTrackingRow,
} from '../utils/vehicleTrackingReportUtils'

const defaultPagination = {
  currentPage: 1,
  from: 0,
  lastPage: 1,
  to: 0,
  total: 0,
}

export const emptyVehicleTrackingReportData = {
  pagination: defaultPagination,
  rows: [],
  summary: createEmptyVehicleTrackingSummary(),
}

export const getVehicleTrackingReport = async ({
  page = 1,
  search = '',
  startDate = '',
  endDate = '',
} = {}) => {
  const payload = await apiRequest(buildQueryPath(API_URLS.reports.vehicleTracking, { page, search }), {
    method: 'POST',
    body: JSON.stringify({
      end_date: endDate,
      start_date: startDate,
    }),
  })
  const collection = unwrapCollection(payload, 'Unable to load vehicle tracking report.')
  const rows = collection.rows.map((item, index) =>
    normalizeVehicleTrackingRow(item, index, collection.pagination),
  )

  return {
    pagination: collection.pagination,
    rows,
    summary: buildVehicleTrackingSummary(rows),
  }
}
