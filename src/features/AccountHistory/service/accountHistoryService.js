import { API_URLS } from '../../../constants/apiUrls'
import { apiRequest } from '../../../services/apiClient'
import { buildAccountHistoryMetrics, normalizeAccountHistoryRow } from '../utils/accountHistoryUtils'

const defaultPagination = {
  currentPage: 1,
  from: 0,
  lastPage: 1,
  to: 0,
  total: 0,
}

const toNumber = (value) => Number(value) || 0

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

const extractListContainer = (payload) =>
  payload?.data?.accountHistoryList ??
  payload?.data?.data?.accountHistoryList ??
  payload?.accountHistoryList ??
  payload?.data ??
  {}

const extractRows = (container) => {
  if (Array.isArray(container?.data)) {
    return container.data
  }

  if (Array.isArray(container)) {
    return container
  }

  return []
}

const normalizePagination = (meta, fallbackCount = 0) => ({
  currentPage: toNumber(meta?.current_page ?? meta?.currentPage) || 1,
  from: toNumber(meta?.from),
  lastPage: toNumber(meta?.last_page ?? meta?.lastPage) || 1,
  to: toNumber(meta?.to) || fallbackCount,
  total: toNumber(meta?.total) || fallbackCount,
})

export const getAccountHistoryReport = async ({
  endDate = '',
  page = 1,
  startDate = '',
} = {}) => {
  const payload = ensureSuccessfulPayload(
    await apiRequest(`${API_URLS.reports.accountHistorySearch}?page=${page}`, {
      method: 'POST',
      body: JSON.stringify({
        end_date: endDate,
        start_date: startDate,
      }),
    }),
    'Unable to load account history report.',
  )

  const listContainer = extractListContainer(payload)
  const rows = extractRows(listContainer)
  const pagination = normalizePagination(listContainer, rows.length)
  const normalizedRows = rows.map((item, index) => normalizeAccountHistoryRow(item, index, pagination))
  const creditedAmount = toNumber(
    payload?.data?.accountHistorySummary ??
      payload?.data?.data?.accountHistorySummary ??
      payload?.accountHistorySummary,
  )

  return {
    pagination,
    rows: normalizedRows,
    summary: buildAccountHistoryMetrics({
      creditedAmount,
      rows: normalizedRows,
    }),
  }
}

export const emptyAccountHistoryData = {
  pagination: defaultPagination,
  rows: [],
  summary: buildAccountHistoryMetrics({
    creditedAmount: 0,
    rows: [],
  }),
}

