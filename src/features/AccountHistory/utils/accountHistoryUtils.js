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

const toTitleCase = (value) =>
  normalizeText(value, '')
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`)
    .join(' ')

const formatCompactCount = (value) => compactCountFormatter.format(toNumber(value))
export const formatCurrency = (value) => `BDT ${currencyFormatter.format(toNumber(value))}`

const formatDateTimeLabel = (value) => {
  const parsedDate = dayjs(value)
  return parsedDate.isValid() ? parsedDate.format('DD MMM YYYY, hh:mm A') : normalizeText(value)
}

const formatDateLabel = (value) => {
  const parsedDate = dayjs(value)
  return parsedDate.isValid() ? parsedDate.format('DD MMM YYYY') : normalizeText(value)
}

const resolveTransactionTypeMeta = (value) => {
  const normalizedValue = String(value ?? '').trim().toLowerCase()

  if (normalizedValue === 'c' || normalizedValue.includes('credit')) {
    return {
      key: 'credit',
      label: 'Credit',
      toneClassName: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200',
    }
  }

  if (normalizedValue === 'd' || normalizedValue.includes('debit')) {
    return {
      key: 'debit',
      label: 'Debit',
      toneClassName: 'border-amber-500/20 bg-amber-500/10 text-amber-200',
    }
  }

  return {
    key: 'other',
    label: 'Other',
    toneClassName: 'border-slate-500/20 bg-slate-500/10 text-slate-200',
  }
}

const resolveGatewayMeta = (value) => {
  const rawValue = normalizeText(value, '')
  const normalizedValue = rawValue.toLowerCase()

  if (normalizedValue.includes('bkash')) {
    return {
      color: '#f472b6',
      label: 'Bkash',
    }
  }

  if (normalizedValue.includes('nagad')) {
    return {
      color: '#fb923c',
      label: 'Nagad',
    }
  }

  if (normalizedValue.includes('rocket')) {
    return {
      color: '#c084fc',
      label: 'Rocket',
    }
  }

  if (normalizedValue.includes('bank')) {
    return {
      color: '#60a5fa',
      label: toTitleCase(rawValue),
    }
  }

  if (
    normalizedValue.includes('card') ||
    normalizedValue.includes('visa') ||
    normalizedValue.includes('master') ||
    normalizedValue.includes('amex')
  ) {
    return {
      color: '#22d3ee',
      label: toTitleCase(rawValue),
    }
  }

  return {
    color: '#94a3b8',
    label: toTitleCase(rawValue) || '-',
  }
}

export const createCurrentMonthDateRange = () => ({
  endDate: dayjs().format('YYYY-MM-DD'),
  startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
})

export const normalizeAccountHistoryRow = (item = {}, index = 0, pagination = {}) => {
  const amount = toNumber(item.amount)
  const transactionType = resolveTransactionTypeMeta(item.transaction_type)
  const gateway = resolveGatewayMeta(item.getaway ?? item.gateway)
  const transactionDate = item.tran_date ?? item.created_at
  const serialSeed = pagination.from || 1

  return {
    amount,
    amountLabel: formatCurrency(amount),
    companyAccountNumber: normalizeText(item.com_account_no),
    dateLabel: formatDateLabel(transactionDate),
    gatewayColor: gateway.color,
    gatewayLabel: gateway.label,
    id: item.id ?? `${normalizeText(item.transaction_reference, 'account-history')}-${index + 1}`,
    purposeLabel: toTitleCase(item.purpose) || '-',
    serial: serialSeed + index,
    transactionDateLabel: formatDateTimeLabel(transactionDate),
    transactionReference: normalizeText(item.transaction_reference),
    transactionTypeKey: transactionType.key,
    transactionTypeLabel: transactionType.label,
    transactionTypeToneClassName: transactionType.toneClassName,
    userAccountNumber: normalizeText(item.user_account_no),
  }
}

export const buildAccountHistoryMetrics = ({ creditedAmount = 0, rows = [] } = {}) => {
  const transactionCount = rows.length
  const pageTotalAmount = rows.reduce((sum, row) => sum + row.amount, 0)
  const creditRows = rows.filter((row) => row.transactionTypeKey === 'credit')
  const debitRows = rows.filter((row) => row.transactionTypeKey === 'debit')
  const latestTransaction = [...rows]
    .filter((row) => row.transactionDateLabel && row.transactionDateLabel !== '-')
    .sort((firstRow, secondRow) => dayjs(secondRow.transactionDateLabel).valueOf() - dayjs(firstRow.transactionDateLabel).valueOf())[0]

  const gatewayBreakdown = Object.values(
    rows.reduce((collection, row) => {
      if (!collection[row.gatewayLabel]) {
        collection[row.gatewayLabel] = {
          amount: 0,
          color: row.gatewayColor,
          count: 0,
          label: row.gatewayLabel,
        }
      }

      collection[row.gatewayLabel].amount += row.amount
      collection[row.gatewayLabel].count += 1
      return collection
    }, {}),
  )
    .sort((firstItem, secondItem) => secondItem.amount - firstItem.amount)
    .map((item) => ({
      ...item,
      amountLabel: formatCurrency(item.amount),
      countLabel: formatCompactCount(item.count),
      width: `${pageTotalAmount ? (item.amount / pageTotalAmount) * 100 : 0}%`,
    }))

  const topGateway = gatewayBreakdown[0]
  const largestTransfer = [...rows].sort((firstRow, secondRow) => secondRow.amount - firstRow.amount)[0]

  return {
    creditCountLabel: formatCompactCount(creditRows.length),
    creditedAmount,
    creditedAmountLabel: formatCurrency(creditedAmount),
    debitCountLabel: formatCompactCount(debitRows.length),
    gatewayBreakdown,
    latestTransactionLabel: latestTransaction?.transactionDateLabel ?? 'No transaction available',
    largestTransferLabel: largestTransfer
      ? `${largestTransfer.amountLabel} · ${largestTransfer.gatewayLabel}`
      : 'No transfer available',
    pageTotalAmount,
    pageTotalAmountLabel: formatCurrency(pageTotalAmount),
    topGatewayLabel: topGateway ? `${topGateway.label} · ${topGateway.amountLabel}` : 'No gateway data',
    transactionCount,
    transactionCountLabel: formatCompactCount(transactionCount),
    uniqueAccountsLabel: formatCompactCount(
      new Set(rows.map((row) => row.userAccountNumber).filter((value) => value && value !== '-')).size,
    ),
  }
}

