import { API_URLS } from '../../../constants/apiUrls'
import { apiRequest } from '../../../services/apiClient'
import { isExecutionSuccessful } from '../../../services/resourceApi'
import {
  buildLowPerformingPackagesSummary,
  createEmptyLowPerformingPackagesSummary,
  normalizeLowPerformingPackage,
} from '../utils/lowPerformingPackagesUtils'

export const emptyLowPerformingPackagesData = {
  rows: [],
  summary: createEmptyLowPerformingPackagesSummary(),
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

export const getLowPerformingPackages = async () => {
  const payload = await apiRequest(API_URLS.reports.lowPerformingPackages)
  const rows = extractRows(payload)

  if (!isExecutionSuccessful(payload) && rows.length === 0) {
    return emptyLowPerformingPackagesData
  }

  if (!isExecutionSuccessful(payload)) {
    throw new Error(payload?.message || 'Unable to load low-performing packages.')
  }

  const normalizedRows = rows.map((item, index) => normalizeLowPerformingPackage(item, index))

  return {
    rows: normalizedRows,
    summary: buildLowPerformingPackagesSummary(normalizedRows),
  }
}
