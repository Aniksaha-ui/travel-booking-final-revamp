import dayjs from 'dayjs'

const compactCountFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  notation: 'compact',
})

const currencyFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
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

const toKey = (value) =>
  normalizeText(value, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const toTitleCase = (value) =>
  normalizeText(value, '')
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`)
    .join(' ')

const formatCompactCount = (value) => compactCountFormatter.format(toNumber(value))
const formatCurrency = (value) => `BDT ${currencyFormatter.format(toNumber(value))}`

const formatDateLabel = (value) => {
  const parsedDate = dayjs(value)
  return parsedDate.isValid() ? parsedDate.format('DD MMM YYYY') : normalizeText(value)
}

const formatDateTimeLabel = (value) => {
  const parsedDate = dayjs(value)
  return parsedDate.isValid() ? parsedDate.format('DD MMM YYYY, hh:mm A') : normalizeText(value)
}

const resolvePaymentMethodMeta = (value) => {
  const rawValue = normalizeText(value, '')
  const normalizedValue = rawValue.toLowerCase()

  if (!normalizedValue) {
    return {
      key: 'unknown',
      label: '-',
      toneClassName: 'border-slate-500/20 bg-slate-500/10 text-slate-200',
    }
  }

  if (normalizedValue.includes('bkash')) {
    return {
      key: 'bkash',
      label: 'Bkash',
      toneClassName: 'border-pink-500/20 bg-pink-500/10 text-pink-200',
    }
  }

  if (normalizedValue.includes('nagad')) {
    return {
      key: 'nagad',
      label: 'Nagad',
      toneClassName: 'border-orange-500/20 bg-orange-500/10 text-orange-200',
    }
  }

  if (normalizedValue.includes('rocket')) {
    return {
      key: 'rocket',
      label: 'Rocket',
      toneClassName: 'border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-200',
    }
  }

  if (
    normalizedValue.includes('card') ||
    normalizedValue.includes('visa') ||
    normalizedValue.includes('master') ||
    normalizedValue.includes('amex')
  ) {
    return {
      key: 'card',
      label: toTitleCase(rawValue),
      toneClassName: 'border-blue-500/20 bg-blue-500/10 text-blue-200',
    }
  }

  if (normalizedValue.includes('bank')) {
    return {
      key: 'bank',
      label: toTitleCase(rawValue),
      toneClassName: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-200',
    }
  }

  if (normalizedValue.includes('cash')) {
    return {
      key: 'cash',
      label: 'Cash',
      toneClassName: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200',
    }
  }

  return {
    key: toKey(rawValue) || 'other',
    label: toTitleCase(rawValue),
    toneClassName: 'border-slate-500/20 bg-slate-500/10 text-slate-200',
  }
}

const resolveSettlementStatus = (value) => {
  const rawValue = normalizeText(value, '')
  const normalizedValue = rawValue.toLowerCase()

  if (!normalizedValue) {
    return {
      key: 'unknown',
      label: 'Unknown',
      toneClassName: 'border-slate-500/20 bg-slate-500/10 text-slate-200',
    }
  }

  if (
    normalizedValue.includes('settled') ||
    normalizedValue.includes('complete') ||
    normalizedValue.includes('success')
  ) {
    return {
      key: 'settled',
      label: toTitleCase(rawValue),
      toneClassName: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200',
    }
  }

  if (normalizedValue.includes('partial')) {
    return {
      key: 'partial',
      label: toTitleCase(rawValue),
      toneClassName: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-200',
    }
  }

  if (normalizedValue.includes('pending') || normalizedValue.includes('hold') || normalizedValue.includes('process')) {
    return {
      key: 'pending',
      label: toTitleCase(rawValue),
      toneClassName: 'border-amber-500/20 bg-amber-500/10 text-amber-200',
    }
  }

  if (normalizedValue.includes('fail') || normalizedValue.includes('cancel') || normalizedValue.includes('reject')) {
    return {
      key: 'failed',
      label: toTitleCase(rawValue),
      toneClassName: 'border-rose-500/20 bg-rose-500/10 text-rose-200',
    }
  }

  return {
    key: toKey(rawValue) || 'unknown',
    label: toTitleCase(rawValue),
    toneClassName: 'border-slate-500/20 bg-slate-500/10 text-slate-200',
  }
}

export const normalizeTransaction = (item = {}, index = 0, pagination = {}) => {
  const transactionId = normalizeText(item.transaction_id ?? item.id, `TX-${index + 1}`)
  const paymentMethod = resolvePaymentMethodMeta(item.payment_method)
  const settlementStatus = resolveSettlementStatus(item.settlement_status)
  const amount = toNumber(item.amount)
  const settledAmount = toNumber(item.settled_amount)
  const customerPaidAmount = toNumber(item.customer_paid_amount)
  const serialSeed = pagination.from || 1

  return {
    amount,
    amountLabel: formatCurrency(amount),
    bankApprovalId: normalizeText(item.bank_approval_id),
    bankTransactionId: normalizeText(item.bank_transaction_id),
    bookingId: normalizeText(item.booking_id),
    bookingIdLabel: normalizeText(item.booking_id),
    cardBrand: normalizeText(item.card_brand),
    cardType: normalizeText(item.card_type),
    createdAt: item.created_at ?? '',
    customerEmail: normalizeText(item.cus_email ?? item.customer_email ?? item.email),
    customerName: normalizeText(item.customer_name ?? item.cus_name ?? item.name, 'Guest User'),
    customerPaidAmount,
    customerPaidAmountLabel: formatCurrency(customerPaidAmount),
    id: `${transactionId}-${serialSeed + index}`,
    paymentId: normalizeText(item.payment_id),
    paymentIdLabel: normalizeText(item.payment_id),
    paymentMethodKey: paymentMethod.key,
    paymentMethodLabel: paymentMethod.label,
    paymentMethodToneClassName: paymentMethod.toneClassName,
    purpose: normalizeText(item.purpose),
    purposeLabel: toTitleCase(item.purpose) || '-',
    riskTitle: normalizeText(item.risk_title),
    serial: serialSeed + index,
    settledAmount,
    settledAmountLabel: formatCurrency(settledAmount),
    settlementStatusKey: settlementStatus.key,
    settlementStatusLabel: settlementStatus.label,
    settlementStatusToneClassName: settlementStatus.toneClassName,
    transactionDateLabel: formatDateLabel(item.created_at),
    transactionDateTimeLabel: formatDateTimeLabel(item.created_at),
    transactionId,
    transactionIdLabel: transactionId,
    transactionReference: normalizeText(item.transaction_reference),
  }
}

export const buildTransactionMetrics = (rows = []) => {
  const totalTransactions = rows.length
  const totalAmount = rows.reduce((sum, row) => sum + row.amount, 0)
  const settledAmount = rows.reduce((sum, row) => sum + row.settledAmount, 0)
  const uniqueBookings = new Set(rows.map((row) => row.bookingId).filter((value) => value && value !== '-')).size
  const distinctPurposes = new Set(rows.map((row) => row.purposeLabel).filter((value) => value && value !== '-')).size
  const latestTransaction = [...rows]
    .filter((row) => dayjs(row.createdAt).isValid())
    .sort((firstRow, secondRow) => dayjs(secondRow.createdAt).valueOf() - dayjs(firstRow.createdAt).valueOf())[0]

  const paymentMethodBreakdown = Object.values(
    rows.reduce((collection, row) => {
      if (!collection[row.paymentMethodKey]) {
        collection[row.paymentMethodKey] = {
          count: 0,
          key: row.paymentMethodKey,
          label: row.paymentMethodLabel,
          toneClassName: row.paymentMethodToneClassName,
          totalAmount: 0,
        }
      }

      collection[row.paymentMethodKey].count += 1
      collection[row.paymentMethodKey].totalAmount += row.amount
      return collection
    }, {}),
  )
    .sort((firstItem, secondItem) => secondItem.count - firstItem.count || secondItem.totalAmount - firstItem.totalAmount)
    .map((item) => ({
      ...item,
      amountLabel: formatCurrency(item.totalAmount),
      countLabel: formatCompactCount(item.count),
      width: `${totalTransactions ? (item.count / totalTransactions) * 100 : 0}%`,
    }))

  const settlementBreakdown = Object.values(
    rows.reduce((collection, row) => {
      if (!collection[row.settlementStatusKey]) {
        collection[row.settlementStatusKey] = {
          count: 0,
          key: row.settlementStatusKey,
          label: row.settlementStatusLabel,
          toneClassName: row.settlementStatusToneClassName,
        }
      }

      collection[row.settlementStatusKey].count += 1
      return collection
    }, {}),
  )
    .sort((firstItem, secondItem) => secondItem.count - firstItem.count)
    .map((item) => ({
      ...item,
      countLabel: formatCompactCount(item.count),
    }))

  const topPaymentMethod = paymentMethodBreakdown[0]

  return {
    distinctPurposes,
    distinctPurposesLabel: formatCompactCount(distinctPurposes),
    latestTransactionLabel: latestTransaction?.transactionDateTimeLabel ?? 'No recent transaction',
    linkedBookingsLabel: formatCompactCount(uniqueBookings),
    paymentMethodBreakdown,
    pendingSettlementAmount: Math.max(totalAmount - settledAmount, 0),
    pendingSettlementAmountLabel: formatCurrency(Math.max(totalAmount - settledAmount, 0)),
    settlementBreakdown,
    settledAmount,
    settledAmountLabel: formatCurrency(settledAmount),
    topPaymentMethodLabel: topPaymentMethod?.label ?? 'No data',
    totalAmount,
    totalAmountLabel: formatCurrency(totalAmount),
    totalTransactions,
    totalTransactionsLabel: formatCompactCount(totalTransactions),
  }
}

