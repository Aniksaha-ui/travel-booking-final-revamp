import { TICKET_STATUS_REPORT_COLORS } from '../constants/ticketStatusReport.constants'

const compactFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  notation: 'compact',
})

const normalizeText = (value, fallback = '-') => {
  if (value === undefined || value === null) {
    return fallback
  }

  const normalizedValue = String(value).trim()
  return normalizedValue || fallback
}

const toNumber = (value) => {
  const parsedValue = Number(value)
  return Number.isNaN(parsedValue) ? 0 : parsedValue
}

const formatCompact = (value) => compactFormatter.format(toNumber(value))

const toStatusKey = (value) =>
  normalizeText(value, 'unknown')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const toTitleCase = (value) =>
  normalizeText(value, '')
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`)
    .join(' ')

export const createEmptyTicketStatusSummary = () => ({
  chartRows: [],
  resolutionRate: 0,
  resolutionRateLabel: '0%',
  topStatusLabel: 'No ticket statuses found.',
  topStatusName: 'No statuses',
  totalStatuses: 0,
  totalStatusesLabel: formatCompact(0),
  totalTickets: 0,
  totalTicketsLabel: formatCompact(0),
})

export const normalizeTicketStatusRows = (items = []) => {
  const totalTickets = items.reduce(
    (sum, item) => sum + toNumber(item.total_tickets ?? item.totalTickets),
    0,
  )

  return items.map((item = {}, index) => {
    const totalTicketCount = toNumber(item.total_tickets ?? item.totalTickets)
    const statusLabel = toTitleCase(item.status_label ?? item.statusLabel ?? `Status ${index + 1}`)
    const statusKey = toStatusKey(statusLabel)
    const share = totalTickets ? (totalTicketCount / totalTickets) * 100 : 0

    return {
      color: TICKET_STATUS_REPORT_COLORS[statusKey] ?? '#a78bfa',
      id: `${statusKey}-${index + 1}`,
      share,
      shareLabel: `${share.toFixed(1)}%`,
      statusKey,
      statusLabel,
      totalTickets: totalTicketCount,
      totalTicketsLabel: formatCompact(totalTicketCount),
    }
  })
}

export const buildTicketStatusSummary = (rows = []) => {
  if (!rows.length) {
    return createEmptyTicketStatusSummary()
  }

  const totalTickets = rows.reduce((sum, row) => sum + row.totalTickets, 0)
  const resolvedCount = rows
    .filter((row) => row.statusKey === 'resolved' || row.statusKey === 'accepted')
    .reduce((sum, row) => sum + row.totalTickets, 0)
  const topStatus = rows.reduce(
    (bestRow, row) => (row.totalTickets > bestRow.totalTickets ? row : bestRow),
    rows[0],
  )
  const resolutionRate = totalTickets ? (resolvedCount / totalTickets) * 100 : 0

  return {
    chartRows: rows,
    resolutionRate,
    resolutionRateLabel: `${resolutionRate.toFixed(1)}%`,
    topStatusLabel: `${topStatus.statusLabel} • ${topStatus.totalTicketsLabel}`,
    topStatusName: topStatus.statusLabel,
    totalStatuses: rows.length,
    totalStatusesLabel: formatCompact(rows.length),
    totalTickets,
    totalTicketsLabel: formatCompact(totalTickets),
  }
}

export const filterTicketStatusRows = (rows = [], search = '') => {
  const normalizedSearch = search.trim().toLowerCase()

  if (!normalizedSearch) {
    return rows
  }

  return rows.filter((row) =>
    [row.statusLabel, row.totalTicketsLabel, row.shareLabel].some((value) =>
      String(value).toLowerCase().includes(normalizedSearch),
    ),
  )
}
