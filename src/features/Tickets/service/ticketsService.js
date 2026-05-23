import { API_URLS } from '../../../constants/apiUrls'
import { apiRequest } from '../../../services/apiClient'
import { normalizeTicket } from '../utils/ticketUtils'

const extractCollection = (payload) => {
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

const ensureTicketPayload = (payload, fallbackMessage) => {
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

const fetchTicketPage = async (page = 1) =>
  ensureTicketPayload(
    await apiRequest(`${API_URLS.tickets.list}?page=${page}`),
    'Unable to load tickets.',
  )

export const getTickets = async () => {
  const firstPayload = await fetchTicketPage(1)
  const { meta, rows } = extractCollection(firstPayload)
  const lastPage = Number(meta?.last_page ?? meta?.lastPage) || 1

  const remainingPayloads =
    lastPage > 1
      ? await Promise.all(
          Array.from({ length: lastPage - 1 }, (_, index) => fetchTicketPage(index + 2)),
        )
      : []

  const mergedRows = [...rows]

  remainingPayloads.forEach((payload) => {
    mergedRows.push(...extractCollection(payload).rows)
  })

  return mergedRows.map(normalizeTicket)
}

export const updateTicketStatus = async (ticketId, { resolvedRemarks = '', resolvedStatus, status }) => {
  const payload = ensureTicketPayload(
    await apiRequest(API_URLS.tickets.update(ticketId), {
      method: 'POST',
      body: JSON.stringify({
        resolved_remarks: resolvedRemarks || null,
        resolved_status: resolvedStatus,
        status,
      }),
    }),
    'Unable to update ticket.',
  )

  return {
    message:
      payload?.message ||
      payload?.data?.message ||
      payload?.data?.data?.message ||
      'Ticket updated successfully.',
  }
}
