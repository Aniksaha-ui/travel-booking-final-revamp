import { API_URLS } from '../../../constants/apiUrls'
import { apiRequest } from '../../../services/apiClient'
import { normalizeOnlinePaymentConfig } from '../utils/onlinePaymentConfigUtils'

const defaultPagination = {
  currentPage: 1,
  from: 0,
  lastPage: 1,
  to: 0,
  total: 0,
}

const ensureOnlinePaymentPayload = (payload, fallbackMessage) => {
  const executionStatus =
    payload?.status ??
    payload?.isExecute ??
    payload?.isExecture ??
    payload?.data?.status ??
    payload?.data?.data?.status

  if (executionStatus === false || payload?.data === false || payload?.data?.data === false) {
    throw new Error(payload?.message || fallbackMessage)
  }

  if (typeof executionStatus === 'string' && executionStatus.trim().toUpperCase() === 'FAILED') {
    throw new Error(payload?.message || fallbackMessage)
  }

  return payload
}

const extractRowsAndMeta = (payload) => {
  if (Array.isArray(payload?.data?.data?.data)) {
    return {
      meta: payload.data.data,
      rows: payload.data.data.data,
    }
  }

  if (Array.isArray(payload?.data?.data)) {
    return {
      meta: payload.data,
      rows: payload.data.data,
    }
  }

  if (Array.isArray(payload?.data)) {
    return {
      meta: {},
      rows: payload.data,
    }
  }

  if (Array.isArray(payload)) {
    return {
      meta: {},
      rows: payload,
    }
  }

  return {
    meta: {},
    rows: [],
  }
}

const normalizePagination = (meta, fallbackCount = 0) => ({
  currentPage: Number(meta?.current_page ?? meta?.currentPage) || 1,
  from: Number(meta?.from) || 0,
  lastPage: Number(meta?.last_page ?? meta?.lastPage) || 1,
  to: Number(meta?.to) || fallbackCount,
  total: Number(meta?.total) || fallbackCount,
})

const extractConfigurationRecord = (payload) =>
  payload?.data?.data ??
  payload?.data ??
  payload?.configuration ??
  payload ??
  {}

export const getOnlinePaymentConfigurations = async ({ page = 1, search = '' } = {}) => {
  const query = search ? `&search=${encodeURIComponent(search)}` : ''
  const payload = ensureOnlinePaymentPayload(
    await apiRequest(`${API_URLS.onlinePaymentConfig.list}?page=${page}${query}`),
    'Unable to load online payment configurations.',
  )
  const { meta, rows } = extractRowsAndMeta(payload)
  const pagination = normalizePagination(meta, rows.length)

  return {
    pagination,
    rows: rows.map((item, index) => normalizeOnlinePaymentConfig(item, index, pagination)),
  }
}

export const getOnlinePaymentConfigurationById = async (configurationId) => {
  const payload = ensureOnlinePaymentPayload(
    await apiRequest(API_URLS.onlinePaymentConfig.byId(configurationId)),
    'Unable to load online payment configuration.',
  )

  return normalizeOnlinePaymentConfig(extractConfigurationRecord(payload))
}

export const createOnlinePaymentConfiguration = async (payload) =>
  ensureOnlinePaymentPayload(
    await apiRequest(API_URLS.onlinePaymentConfig.list, {
      body: payload,
      method: 'POST',
    }),
    'Unable to create online payment configuration.',
  )

export const updateOnlinePaymentConfiguration = async (payload) =>
  ensureOnlinePaymentPayload(
    await apiRequest(API_URLS.onlinePaymentConfig.update, {
      body: payload,
      method: 'POST',
    }),
    'Unable to update online payment configuration.',
  )

export const emptyOnlinePaymentConfigurationsCollection = {
  pagination: defaultPagination,
  rows: [],
}

