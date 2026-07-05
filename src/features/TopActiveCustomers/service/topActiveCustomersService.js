import { API_URLS } from '../../../constants/apiUrls'
import { apiRequest } from '../../../services/apiClient'
import { normalizeTopActiveCustomerRow } from '../utils/topActiveCustomersUtils'

const ensureTopActiveCustomersPayload = (payload, fallbackMessage) => {
  const executionStatus =
    payload?.status ??
    payload?.isExecute ??
    payload?.isExecture ??
    payload?.data?.status ??
    payload?.data?.data?.status

  if (executionStatus === false) {
    throw new Error(payload?.message || fallbackMessage)
  }

  if (typeof executionStatus === 'string' && executionStatus.trim().toUpperCase() === 'FAILED') {
    throw new Error(payload?.message || fallbackMessage)
  }

  return payload
}

const extractRows = (payload) => {
  if (Array.isArray(payload?.data?.data)) {
    return payload.data.data
  }

  if (Array.isArray(payload?.data)) {
    return payload.data
  }

  if (Array.isArray(payload)) {
    return payload
  }

  return []
}

export const getTopActiveCustomers = async ({ search = '' } = {}) => {
  const query = search ? `&search=${encodeURIComponent(search)}` : ''
  const payload = ensureTopActiveCustomersPayload(
    await apiRequest(`${API_URLS.reports.topActiveCustomers}?limit=10${query}`),
    'Unable to load top active customers.',
  )
  const rows = extractRows(payload)

  return rows.map((item, index) => normalizeTopActiveCustomerRow(item, index))
}

export const emptyTopActiveCustomersCollection = []
