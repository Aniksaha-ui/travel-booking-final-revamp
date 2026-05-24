import { API_URLS } from '../../../constants/apiUrls'
import { apiRequest } from '../../../services/apiClient'
import { assertSuccessfulExecution } from '../../../services/resourceApi'
import { createEmptyMonitoringData, normalizeMonitoringData } from '../utils/monitoringUtils'

export const emptyMonitoringData = createEmptyMonitoringData()

export const getMonitoringData = async () => {
  const payload = assertSuccessfulExecution(
    await apiRequest(API_URLS.reports.monitoring),
    'Unable to load monitoring data.',
  )

  return normalizeMonitoringData(payload?.data ?? payload)
}
