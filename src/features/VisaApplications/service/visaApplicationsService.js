import { API_URLS } from '../../../constants/apiUrls'
import { apiRequest } from '../../../services/apiClient'
import { APP_CONFIG } from '../../../services/config'
import {
  assertSuccessfulExecution,
  buildQueryPath,
  unwrapCollection,
  unwrapResponseData,
} from '../../../services/resourceApi'
import {
  normalizeOfficer,
  normalizeVisaApplication,
  normalizeVisaApplicationDetails,
} from '../utils/visaApplicationsUtils'

const defaultPagination = {
  currentPage: 1,
  from: 0,
  lastPage: 1,
  to: 0,
  total: 0,
}

const buildAbsoluteUrl = (path) => {
  if (/^https?:\/\//i.test(path)) {
    return path
  }

  const baseUrl = APP_CONFIG.apiBaseUrl.replace(/\/+$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${normalizedPath}`
}

const getAuthToken = () => {
  const rawSession = window.localStorage.getItem(APP_CONFIG.authStorageKey)

  if (!rawSession) {
    return null
  }

  try {
    return JSON.parse(rawSession)?.token ?? null
  } catch {
    window.localStorage.removeItem(APP_CONFIG.authStorageKey)
    return null
  }
}

const extractNestedRowsAndMeta = (payload) => {
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

export const emptyVisaApplicationsCollection = {
  pagination: defaultPagination,
  rows: [],
}

export const getVisaApplications = async ({ page = 1, search = '' } = {}) => {
  const payload = await apiRequest(buildQueryPath(API_URLS.visaApplications.list, { page, search }))
  const collection = unwrapCollection(payload, 'Unable to load visa applications.')

  return {
    pagination: collection.pagination,
    rows: collection.rows.map((item, index) => normalizeVisaApplication(item, index, collection.pagination)),
  }
}

export const getVisaApplicationById = async (applicationId) => {
  const payload = await apiRequest(API_URLS.visaApplications.byId(applicationId))
  const data = unwrapResponseData(payload, 'Unable to load visa application details.')
  return normalizeVisaApplicationDetails(data ?? {})
}

export const assignVisaApplication = async (payload) =>
  assertSuccessfulExecution(
    await apiRequest(API_URLS.visaApplications.assign, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    'Unable to assign visa application.',
  )

export const updateVisaApplication = async (applicationId, payload) =>
  assertSuccessfulExecution(
    await apiRequest(API_URLS.visaApplications.update(applicationId), {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    'Unable to update visa application.',
  )

export const updateVisaApplicationStatus = async (payload) =>
  assertSuccessfulExecution(
    await apiRequest(API_URLS.visaApplications.statusUpdate, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    'Unable to update visa application status.',
  )

export const verifyVisaApplicationDocument = async (payload) =>
  assertSuccessfulExecution(
    await apiRequest(API_URLS.visaApplications.documentVerify, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    'Unable to verify visa document.',
  )

export const fetchVisaApplicationOfficers = async () => {
  const allRows = []
  let currentPage = 1

  while (true) {
    const payload = assertSuccessfulExecution(
      await apiRequest(`${API_URLS.admin.users}?page=${currentPage}&perPage=200`),
      'Unable to load officers.',
    )
    const { meta, rows } = extractNestedRowsAndMeta(payload)
    allRows.push(...rows)
    const lastPage = Number(meta?.last_page ?? meta?.lastPage) || 1

    if (currentPage >= lastPage) {
      break
    }

    currentPage += 1
  }

  return allRows.map(normalizeOfficer)
}

export const printVisaApplicationPdf = async (applicationId) => {
  const token = getAuthToken()
  const response = await fetch(buildAbsoluteUrl(API_URLS.visaApplications.print(applicationId)), {
    headers: {
      Accept: 'application/pdf',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (!response.ok) {
    throw new Error('Unable to open visa application PDF.')
  }

  return response.blob()
}
