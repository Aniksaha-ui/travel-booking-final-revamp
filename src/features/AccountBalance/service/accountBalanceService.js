import { API_URLS } from '../../../constants/apiUrls'
import { apiRequest } from '../../../services/apiClient'
import { buildAccountHistorySummary, normalizeAccountBalanceRow, normalizeAccountHistoryRow } from '../utils/accountBalanceUtils'

const defaultPagination = {
  currentPage: 1,
  from: 0,
  lastPage: 1,
  to: 0,
  total: 0,
}

const ensureSuccessfulPayload = (payload, fallbackMessage) => {
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
  if (Array.isArray(payload?.data?.data?.data)) {
    return payload.data.data.data
  }

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

export const getAccountBalanceReport = async () => {
  const payload = ensureSuccessfulPayload(
    await apiRequest(API_URLS.reports.accountBalance),
    'Unable to load account balance report.',
  )
  const rows = extractRows(payload).map((item, index) => normalizeAccountBalanceRow(item, index))

  return {
    pagination: {
      ...defaultPagination,
      from: rows.length ? 1 : 0,
      to: rows.length,
      total: rows.length,
    },
    rows,
  }
}

export const getAccountHistoryReport = async (type) => {
  const payload = ensureSuccessfulPayload(
    await apiRequest(API_URLS.reports.accountBalanceHistory(type)),
    'Unable to load account history.',
  )
  const rows = extractRows(payload).map((item, index) => normalizeAccountHistoryRow(item, index))

  return {
    rows,
    summary: buildAccountHistorySummary(rows),
  }
}

export const emptyAccountBalanceCollection = {
  pagination: defaultPagination,
  rows: [],
}

export const emptyAccountHistoryCollection = {
  rows: [],
  summary: buildAccountHistorySummary([]),
}

