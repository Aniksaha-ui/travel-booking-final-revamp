import { API_URLS } from '../../../constants/apiUrls'
import { apiRequest } from '../../../services/apiClient'
import { normalizePackageDetails, normalizePackageListItem } from '../utils/packageUtils'

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
      meta: payload,
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

const extractDetailsPayload = (payload) =>
  payload?.data?.data ?? payload?.data ?? payload

const extractDropdownItems = (payload) => {
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

const normalizeGuideDropdownItem = (item = {}, index = 0) => ({
  id: item.id ?? item.user_id ?? item.guide_id ?? '',
  name: item.name ?? item.guide_name ?? `Guide ${index + 1}`,
})

const normalizeTripDropdownItem = (item = {}, index = 0) => ({
  ...item,
  id: item.id ?? item.trip_id ?? '',
  name: item.name ?? item.trip_name ?? `Trip ${index + 1}`,
})

export const getPackages = async ({ page = 1, search = '' } = {}) => {
  const payload = ensureSuccessfulPayload(
    await apiRequest(API_URLS.resources.packages, {
      body: JSON.stringify({
        page,
        search,
      }),
      method: 'POST',
    }),
    'Unable to load packages.',
  )
  const { meta, rows } = extractRowsAndMeta(payload)
  const pagination = normalizePagination(meta, rows.length)

  return {
    pagination,
    rows: rows.map((item, index) => normalizePackageListItem(item, index, pagination)),
  }
}

export const createPackage = async (payload) =>
  ensureSuccessfulPayload(
    await apiRequest(API_URLS.resources.packageCreate, {
      body: payload,
      method: 'POST',
    }),
    'Unable to create package.',
  )

export const getPackageDetails = async (packageId) => {
  const payload = ensureSuccessfulPayload(
    await apiRequest(API_URLS.resources.packageDetails(packageId)),
    'Unable to load package details.',
  )

  return normalizePackageDetails(extractDetailsPayload(payload))
}

export const fetchPackageTripDropdown = async () => {
  const payload = ensureSuccessfulPayload(
    await apiRequest(API_URLS.resources.tripDropdown),
    'Unable to load trip options.',
  )

  return extractDropdownItems(payload).map(normalizeTripDropdownItem)
}

export const fetchPackageGuideDropdown = async () => {
  const payload = ensureSuccessfulPayload(
    await apiRequest(API_URLS.resources.guideDropdown),
    'Unable to load guide options.',
  )

  return extractDropdownItems(payload).map(normalizeGuideDropdownItem)
}

export const emptyPackagesCollection = {
  pagination: defaultPagination,
  rows: [],
}
