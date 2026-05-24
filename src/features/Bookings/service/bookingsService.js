import { API_URLS } from '../../../constants/apiUrls'
import { apiRequest } from '../../../services/apiClient'
import {
  createEmptyBookingInvoice,
  normalizeBooking,
  normalizeBookingInvoice,
} from '../utils/bookingsUtils'

const defaultPagination = {
  currentPage: 1,
  from: 0,
  lastPage: 1,
  to: 0,
  total: 0,
}

const ensureBookingPayload = (payload, fallbackMessage) => {
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

const extractInvoiceRecord = (payload) => {
  if (Array.isArray(payload?.data?.data)) {
    return payload.data.data[0] ?? {}
  }

  if (Array.isArray(payload?.data)) {
    return payload.data[0] ?? {}
  }

  if (Array.isArray(payload)) {
    return payload[0] ?? {}
  }

  if (payload?.data && typeof payload.data === 'object') {
    return payload.data
  }

  if (payload && typeof payload === 'object') {
    return payload
  }

  return {}
}

export const getBookings = async ({ page = 1, search = '' } = {}) => {
  const query = search ? `&search=${encodeURIComponent(search)}` : ''
  const payload = ensureBookingPayload(
    await apiRequest(`${API_URLS.bookings.list}?page=${page}${query}`),
    'Unable to load bookings.',
  )
  const { meta, rows } = extractRowsAndMeta(payload)
  const pagination = normalizePagination(meta, rows.length)

  return {
    pagination,
    rows: rows.map((item, index) => normalizeBooking(item, index, pagination)),
  }
}

export const getBookingInvoice = async (bookingId) => {
  const payload = ensureBookingPayload(
    await apiRequest(API_URLS.bookings.invoice, {
      body: JSON.stringify({ bookingId }),
      method: 'POST',
    }),
    'Unable to load booking invoice.',
  )

  return normalizeBookingInvoice(extractInvoiceRecord(payload))
}

export const emptyBookingsCollection = {
  pagination: defaultPagination,
  rows: [],
}

export const emptyBookingInvoice = createEmptyBookingInvoice()
