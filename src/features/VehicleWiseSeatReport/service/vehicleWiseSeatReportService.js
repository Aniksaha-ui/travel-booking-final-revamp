import { API_URLS } from '../../../constants/apiUrls'
import { apiRequest } from '../../../services/apiClient'
import {
  buildQueryPath,
  unwrapCollection,
  unwrapResponseData,
} from '../../../services/resourceApi'
import {
  buildVehicleSeatLayoutSummary,
  buildVehicleWiseSeatSummary,
  normalizeVehicleSeat,
  normalizeVehicleWiseSeatRow,
} from '../utils/vehicleWiseSeatReportUtils'

const defaultPagination = {
  currentPage: 1,
  from: 0,
  lastPage: 1,
  to: 0,
  total: 0,
}

export const emptyVehicleWiseSeatReportData = {
  pagination: defaultPagination,
  rows: [],
  summary: buildVehicleWiseSeatSummary([]),
}

export const getVehicleWiseSeatReport = async ({ page = 1, search = '' } = {}) => {
  const payload = await apiRequest(
    buildQueryPath(API_URLS.reports.vehicleWiseSeatTotal, { page, search }),
  )
  const collection = unwrapCollection(payload, 'Unable to load vehicle wise seat report.')
  const rows = collection.rows.map((item, index) =>
    normalizeVehicleWiseSeatRow(item, index, collection.pagination),
  )

  return {
    pagination: collection.pagination,
    rows,
    summary: buildVehicleWiseSeatSummary(rows),
  }
}

export const getVehicleSeatLayout = async (vehicleId) => {
  const payload = await apiRequest(API_URLS.reports.vehicleWiseSeatDetails(vehicleId))
  const rows = unwrapResponseData(payload, 'Unable to load vehicle seat layout.')
  const seats = (Array.isArray(rows) ? rows : []).map((item, index) => normalizeVehicleSeat(item, index))

  return {
    seats,
    summary: buildVehicleSeatLayoutSummary(seats),
  }
}
