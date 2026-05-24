import dayjs from 'dayjs'
import { REFUND_STATUS_LABELS } from '../constants/refunds.constants'

const compactCountFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  notation: 'compact',
})

const currencyFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
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

const truncateText = (value, maxLength = 110) => {
  const normalizedValue = normalizeText(value, '')

  if (normalizedValue.length <= maxLength) {
    return normalizedValue
  }

  return `${normalizedValue.slice(0, maxLength - 1).trimEnd()}...`
}

const formatDateLabel = (value) => {
  const parsedDate = dayjs(value)
  return parsedDate.isValid() ? parsedDate.format('DD MMMM YYYY') : '-'
}

const normalizeRefundStatus = (value) => {
  const normalizedValue = String(value ?? 'pending').trim().toLowerCase()
  return normalizedValue === 'disbursed' ? 'disbursed' : 'pending'
}

const formatCurrency = (value) => `BDT ${currencyFormatter.format(toNumber(value))}`

export const formatCompactCount = (value) => compactCountFormatter.format(toNumber(value))

export const normalizeRefund = (item, index = 0, pagination = {}) => {
  const amount = toNumber(item.amount)
  const status = normalizeRefundStatus(item.status)
  const seatIds = normalizeText(item.seat_ids, '-')
  const seatList = seatIds === '-' ? [] : seatIds.split(',').map((seat) => seat.trim()).filter(Boolean)
  const serialSeed = pagination.from || 1

  return {
    amount,
    amountLabel: formatCurrency(amount),
    bookingDateLabel: formatDateLabel(item.booking_date ?? item.created_at),
    id: item.id ?? `refund-${index + 1}`,
    reason: normalizeText(item.reason, 'No reason provided.'),
    reasonPreview: truncateText(item.reason, 76) || 'No reason provided.',
    seatCount: seatList.length,
    seatCountLabel: seatList.length ? `${seatList.length} seats` : 'No seats',
    seatIds,
    serial: serialSeed + index,
    status,
    statusLabel: REFUND_STATUS_LABELS[status] ?? normalizeText(status, 'Pending'),
    tripName: normalizeText(item.trip_name, 'Unknown trip'),
  }
}

export const filterRefundsByStatus = (refunds = [], statusFilter = 'all') => {
  if (statusFilter === 'all') {
    return refunds
  }

  return refunds.filter((refund) => refund.status === statusFilter)
}

export const buildRefundMetrics = (refunds = []) => {
  const totalRefunds = refunds.length
  const pendingRefunds = refunds.filter((refund) => refund.status === 'pending')
  const disbursedRefunds = refunds.filter((refund) => refund.status === 'disbursed')
  const totalAmount = refunds.reduce((sum, refund) => sum + refund.amount, 0)
  const pendingAmount = pendingRefunds.reduce((sum, refund) => sum + refund.amount, 0)
  const disbursedAmount = disbursedRefunds.reduce((sum, refund) => sum + refund.amount, 0)
  const averageAmount = totalRefunds ? totalAmount / totalRefunds : 0
  const largestRefund = refunds.reduce((largestAmount, refund) => Math.max(largestAmount, refund.amount), 0)

  const reasonCounts = refunds.reduce((counts, refund) => {
    const reasonKey = refund.reason || 'No reason provided.'
    counts[reasonKey] = (counts[reasonKey] ?? 0) + 1
    return counts
  }, {})

  const topReasonEntry = Object.entries(reasonCounts).sort((firstEntry, secondEntry) => secondEntry[1] - firstEntry[1])[0]

  return {
    averageAmount,
    averageAmountLabel: formatCurrency(averageAmount),
    chartItems: [
      {
        amount: pendingAmount,
        amountLabel: formatCurrency(pendingAmount),
        fill: '#f59e0b',
        key: 'Pending',
        total: pendingRefunds.length,
      },
      {
        amount: disbursedAmount,
        amountLabel: formatCurrency(disbursedAmount),
        fill: '#10b981',
        key: 'Disbursed',
        total: disbursedRefunds.length,
      },
    ],
    disbursedAmount,
    disbursedAmountLabel: formatCurrency(disbursedAmount),
    disbursedCount: disbursedRefunds.length,
    disbursedCountLabel: formatCompactCount(disbursedRefunds.length),
    largestRefund,
    largestRefundLabel: formatCurrency(largestRefund),
    pendingAmount,
    pendingAmountLabel: formatCurrency(pendingAmount),
    pendingCount: pendingRefunds.length,
    pendingCountLabel: formatCompactCount(pendingRefunds.length),
    topReasonLabel: topReasonEntry
      ? `${truncateText(topReasonEntry[0], 44)} (${topReasonEntry[1]})`
      : 'No refund reasons recorded.',
    totalAmount,
    totalAmountLabel: formatCurrency(totalAmount),
    totalRefunds,
    totalRefundsLabel: formatCompactCount(totalRefunds),
  }
}
