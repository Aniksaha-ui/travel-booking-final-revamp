import dayjs from 'dayjs'
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
  perPage: 0,
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
  perPage: Number(meta?.per_page ?? meta?.perPage) || fallbackCount,
  to: Number(meta?.to) || fallbackCount,
  total: Number(meta?.total) || fallbackCount,
})

const buildBookingsRequestPath = ({ fromDate = '', page = 1, search = '', toDate = '' } = {}) => {
  const params = new URLSearchParams()
  params.set('page', String(page))

  if (search) {
    params.set('search', search)
  }

  if (fromDate) {
    params.set('from_date', fromDate)
  }

  if (toDate) {
    params.set('to_date', toDate)
  }

  return `${API_URLS.bookings.list}?${params.toString()}`
}

const fetchBookingsPayload = async (options) =>
  ensureBookingPayload(
    await apiRequest(buildBookingsRequestPath(options)),
    'Unable to load bookings.',
  )

const parseBookingDate = (item = {}) => {
  const parsedDate = dayjs(item.created_at ?? item.booking_date ?? item.date)
  return parsedDate.isValid() ? parsedDate.startOf('day') : null
}

const isWithinSelectedRange = (item, startDate, endDate) => {
  const bookingDate = parseBookingDate(item)

  if (!bookingDate) {
    return false
  }

  const rangeStart = startDate ? dayjs(startDate).startOf('day') : null
  const rangeEnd = endDate ? dayjs(endDate).endOf('day') : null

  if (rangeStart?.isValid() && bookingDate.isBefore(rangeStart)) {
    return false
  }

  if (rangeEnd?.isValid() && bookingDate.isAfter(rangeEnd)) {
    return false
  }

  return true
}

const buildFilteredPagination = ({ currentPage, perPage, total }) => {
  const safePerPage = perPage || total || 1
  const safeTotal = total || 0
  const lastPage = Math.max(Math.ceil(safeTotal / safePerPage), 1)
  const normalizedPage = Math.min(Math.max(currentPage, 1), lastPage)
  const from = safeTotal ? (normalizedPage - 1) * safePerPage + 1 : 0
  const to = safeTotal ? Math.min(normalizedPage * safePerPage, safeTotal) : 0

  return {
    currentPage: normalizedPage,
    from,
    lastPage,
    perPage: safePerPage,
    to,
    total: safeTotal,
  }
}

const fetchAllFilteredBookings = async ({ fromDate = '', page = 1, search = '', toDate = '' } = {}) => {
  const firstPayload = await fetchBookingsPayload({
    fromDate,
    page: 1,
    search,
    toDate,
  })
  const { meta: firstMeta, rows: firstRows } = extractRowsAndMeta(firstPayload)
  const firstPagination = normalizePagination(firstMeta, firstRows.length)
  const additionalPageNumbers = Array.from(
    { length: Math.max(firstPagination.lastPage - 1, 0) },
    (_, index) => index + 2,
  )
  const additionalPayloads = await Promise.all(
    additionalPageNumbers.map((nextPage) =>
      fetchBookingsPayload({
        fromDate,
        page: nextPage,
        search,
        toDate,
      }),
    ),
  )
  const allRows = [
    ...firstRows,
    ...additionalPayloads.flatMap((payload) => extractRowsAndMeta(payload).rows),
  ]
  const filteredRows = allRows.filter((item) => isWithinSelectedRange(item, fromDate, toDate))
  const filteredPagination = buildFilteredPagination({
    currentPage: page,
    perPage: firstPagination.perPage || firstRows.length,
    total: filteredRows.length,
  })
  const startIndex = filteredPagination.from ? filteredPagination.from - 1 : 0
  const pagedRows = filteredRows.slice(startIndex, startIndex + filteredPagination.perPage)

  return {
    pagination: filteredPagination,
    rows: pagedRows.map((item, index) => normalizeBooking(item, index, filteredPagination)),
  }
}

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

export const getBookings = async ({ fromDate = '', page = 1, search = '', toDate = '' } = {}) => {
  if (fromDate || toDate) {
    return fetchAllFilteredBookings({
      fromDate,
      page,
      search,
      toDate,
    })
  }

  const payload = await fetchBookingsPayload({
    fromDate,
    page,
    search,
    toDate,
  })
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
