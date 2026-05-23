import dayjs from 'dayjs'
import { APP_CONFIG } from '../../../services/config'
import {
  TICKET_BOARD_COLUMNS,
  TICKET_MAIN_STATUS_LABELS,
  TICKET_RESOLUTION_STATUS_LABELS,
} from '../constants/tickets.constants'

const compactNumberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  notation: 'compact',
})

const toNumber = (value) => {
  const parsedValue = Number(value)
  return Number.isNaN(parsedValue) ? 0 : parsedValue
}

const normalizeText = (value, fallback = '-') => {
  if (value === undefined || value === null) {
    return fallback
  }

  const normalizedValue = String(value).trim()
  return normalizedValue || fallback
}

export const buildTicketAttachmentUrl = (filePath) => {
  if (!filePath) {
    return ''
  }

  if (/^https?:\/\//i.test(filePath)) {
    return filePath
  }

  const baseUrl = APP_CONFIG.imageBaseUrl.replace(/\/+$/, '')
  const normalizedPath = String(filePath).replace(/^\/+/, '')

  return `${baseUrl}/${normalizedPath}`
}

export const resolveTicketWorkflowKey = ({ status, resolvedStatus }) => {
  if (resolvedStatus === 2) {
    return 'declined'
  }

  if (resolvedStatus === 1 && status === 2) {
    return 'closed'
  }

  if (resolvedStatus === 1 || status === 1) {
    return 'processing'
  }

  return 'pendingApproval'
}

export const getTicketBoardColumn = (key) =>
  TICKET_BOARD_COLUMNS.find((column) => column.key === key) ?? TICKET_BOARD_COLUMNS[0]

export const formatTicketDateTime = (value) => {
  const parsedDate = dayjs(value)
  return parsedDate.isValid() ? parsedDate.format('MMM D, YYYY h:mm A') : '-'
}

export const formatTicketAge = (value) => {
  const parsedDate = dayjs(value)

  if (!parsedDate.isValid()) {
    return '-'
  }

  const ageInDays = Math.max(dayjs().startOf('day').diff(parsedDate.startOf('day'), 'day'), 0)

  if (ageInDays === 0) {
    return 'Today'
  }

  if (ageInDays < 7) {
    return `${ageInDays}d`
  }

  if (ageInDays < 30) {
    return `${Math.floor(ageInDays / 7)}w`
  }

  return `${Math.floor(ageInDays / 30)}m`
}

export const formatCompactCount = (value) => compactNumberFormatter.format(toNumber(value))

export const normalizeTicket = (item, index = 0) => {
  const ticketId = item.id ?? item.ticket_id ?? `ticket-${index + 1}`
  const createdAt = item.created_at ?? item.createdAt ?? item.date ?? ''
  const updatedAt = item.updated_at ?? item.updatedAt ?? createdAt
  const status = toNumber(item.status)
  const resolvedStatus = toNumber(item.resolved_status ?? item.resloved_status ?? item.resolvedStatus)
  const createdDate = dayjs(createdAt)
  const ageInDays = createdDate.isValid()
    ? Math.max(dayjs().startOf('day').diff(createdDate.startOf('day'), 'day'), 0)
    : 0
  const workflowKey = resolveTicketWorkflowKey({ resolvedStatus, status })
  const boardColumn = workflowKey === 'pendingApproval' ? null : getTicketBoardColumn(workflowKey)
  const attachment = item.attachment ?? item.file_path ?? item.filePath ?? ''

  return {
    id: ticketId,
    title: normalizeText(item.title, `Ticket ${ticketId}`),
    remarks: normalizeText(item.remarks, 'No remarks shared.'),
    description: normalizeText(item.description, 'No description shared.'),
    customerName: normalizeText(
      item.generate_by_name ?? item.customerName ?? item.generated_by_name ?? item.created_by_name,
      'Unknown requester',
    ),
    resolvedByName: normalizeText(
      item.resolved_user_name ?? item.resolvedByName ?? item.checked_by_name ?? item.checkedByName,
      'Not assigned',
    ),
    createdAt,
    createdAtLabel: formatTicketDateTime(createdAt),
    createdAtTimestamp: createdDate.isValid() ? createdDate.valueOf() : 0,
    updatedAt,
    updatedAtLabel: formatTicketDateTime(updatedAt),
    ageInDays,
    ageLabel: formatTicketAge(createdAt),
    status,
    mainStatusLabel: TICKET_MAIN_STATUS_LABELS[status] ?? 'Unknown',
    resolvedStatus,
    resolvedStatusLabel: TICKET_RESOLUTION_STATUS_LABELS[resolvedStatus] ?? 'Unknown',
    workflowKey,
    workflowLabel:
      workflowKey === 'pendingApproval'
        ? 'Pending Approval'
        : boardColumn?.title ?? TICKET_MAIN_STATUS_LABELS[status] ?? 'Unknown',
    resolvedRemarks: normalizeText(item.resolved_remarks ?? item.resolvedRemarks, ''),
    attachment,
    attachmentUrl: buildTicketAttachmentUrl(attachment),
    boardColumn,
  }
}

export const applyTicketTransition = (ticket, { status, resolvedStatus, resolvedRemarks }) =>
  normalizeTicket(
    {
      ...ticket,
      customerName: ticket.customerName,
      generate_by_name: ticket.customerName,
      resolvedByName: ticket.resolvedByName,
      resolved_user_name: ticket.resolvedByName,
      createdAt: ticket.createdAt,
      created_at: ticket.createdAt,
      description: ticket.description,
      remarks: ticket.remarks,
      resolvedRemarks: resolvedRemarks ?? ticket.resolvedRemarks,
      resolved_remarks: resolvedRemarks ?? ticket.resolvedRemarks,
      resloved_status: resolvedStatus,
      resolved_status: resolvedStatus,
      status,
      updated_at: new Date().toISOString(),
    },
    0,
  )

export const filterTicketsBySearch = (tickets, search) => {
  if (!search.trim()) {
    return tickets
  }

  const normalizedSearch = search.trim().toLowerCase()

  return tickets.filter((ticket) =>
    [
      ticket.id,
      ticket.title,
      ticket.remarks,
      ticket.description,
      ticket.customerName,
      ticket.workflowLabel,
      ticket.resolvedRemarks,
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(normalizedSearch)),
  )
}

export const sortTicketsByNewest = (tickets) =>
  [...tickets].sort((firstTicket, secondTicket) => secondTicket.createdAtTimestamp - firstTicket.createdAtTimestamp)

export const buildTicketMetrics = (tickets) => {
  const pendingTickets = tickets.filter((ticket) => ticket.workflowKey === 'pendingApproval')
  const processingTickets = tickets.filter((ticket) => ticket.workflowKey === 'processing')
  const closedTickets = tickets.filter((ticket) => ticket.workflowKey === 'closed')
  const declinedTickets = tickets.filter((ticket) => ticket.workflowKey === 'declined')
  const totalTickets = tickets.length
  const acceptedTickets = processingTickets.length + closedTickets.length
  const acceptedRatio = totalTickets ? (acceptedTickets / totalTickets) * 100 : 0
  const closureRatio = acceptedTickets ? (closedTickets.length / acceptedTickets) * 100 : 0
  const oldestPendingTicket = pendingTickets.reduce(
    (oldestTicket, ticket) => (ticket.ageInDays > oldestTicket.ageInDays ? ticket : oldestTicket),
    pendingTickets[0] ?? null,
  )
  const oldestProcessingTicket = processingTickets.reduce(
    (oldestTicket, ticket) => (ticket.ageInDays > oldestTicket.ageInDays ? ticket : oldestTicket),
    processingTickets[0] ?? null,
  )

  return {
    acceptedRatio,
    acceptedRatioLabel: `${acceptedRatio.toFixed(1)}%`,
    boardVolume: processingTickets.length + closedTickets.length + declinedTickets.length,
    closedCount: closedTickets.length,
    closureRatio,
    closureRatioLabel: `${closureRatio.toFixed(1)}%`,
    declinedCount: declinedTickets.length,
    oldestPendingLabel: oldestPendingTicket
      ? `${oldestPendingTicket.ageLabel} · ${oldestPendingTicket.title}`
      : 'Queue is clear',
    oldestProcessingLabel: oldestProcessingTicket
      ? `${oldestProcessingTicket.ageLabel} · ${oldestProcessingTicket.title}`
      : 'No active work item',
    pendingCount: pendingTickets.length,
    processingCount: processingTickets.length,
    totalTickets,
    chartItems: [
      {
        key: 'Pending',
        total: pendingTickets.length,
        fill: '#f59e0b',
      },
      {
        key: 'Processing',
        total: processingTickets.length,
        fill: '#60a5fa',
      },
      {
        key: 'Closed',
        total: closedTickets.length,
        fill: '#10b981',
      },
      {
        key: 'Declined',
        total: declinedTickets.length,
        fill: '#fb7185',
      },
    ],
  }
}

export const buildTicketMutationPayload = (workflowKey) => {
  const boardColumn = getTicketBoardColumn(workflowKey)

  return {
    resolvedStatus: boardColumn.resolvedStatus,
    status: boardColumn.status,
    successMessage:
      workflowKey === 'processing'
        ? 'Ticket accepted and moved to processing.'
        : workflowKey === 'closed'
          ? 'Ticket marked as closed.'
          : 'Ticket declined successfully.',
  }
}

export const getTicketStatusTone = (ticket) => {
  if (ticket.workflowKey === 'processing') {
    return 'border-blue-500/20 bg-blue-500/10 text-blue-200'
  }

  if (ticket.workflowKey === 'closed') {
    return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200'
  }

  if (ticket.workflowKey === 'declined') {
    return 'border-rose-500/20 bg-rose-500/10 text-rose-200'
  }

  return 'border-amber-500/20 bg-amber-500/10 text-amber-100'
}

export const isPendingApprovalTicket = (ticket) => ticket.workflowKey === 'pendingApproval'

