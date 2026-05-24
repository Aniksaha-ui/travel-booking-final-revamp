import dayjs from 'dayjs'

const compactCountFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  notation: 'compact',
})

const currencyFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})

const typeColorMap = {
  bank: '#60a5fa',
  bkash: '#f472b6',
  card: '#22d3ee',
  cash: '#34d399',
  nagad: '#fb923c',
  rocket: '#c084fc',
  other: '#94a3b8',
}

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

const toKey = (value) =>
  normalizeText(value, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const formatCompactCount = (value) => compactCountFormatter.format(toNumber(value))
export const formatCurrency = (value) => `BDT ${currencyFormatter.format(toNumber(value))}`

const formatDateTimeLabel = (value) => {
  const parsedDate = dayjs(value)
  return parsedDate.isValid() ? parsedDate.format('DD MMM YYYY, hh:mm A') : normalizeText(value)
}

const resolveTypeMeta = (value) => {
  const rawValue = normalizeText(value, '')
  const normalizedValue = rawValue.toLowerCase()

  if (normalizedValue.includes('bkash')) {
    return {
      color: typeColorMap.bkash,
      key: 'bkash',
      label: 'Bkash',
      toneClassName: 'border-pink-500/20 bg-pink-500/10 text-pink-200',
    }
  }

  if (normalizedValue.includes('nagad')) {
    return {
      color: typeColorMap.nagad,
      key: 'nagad',
      label: 'Nagad',
      toneClassName: 'border-orange-500/20 bg-orange-500/10 text-orange-200',
    }
  }

  if (normalizedValue.includes('rocket')) {
    return {
      color: typeColorMap.rocket,
      key: 'rocket',
      label: 'Rocket',
      toneClassName: 'border-purple-500/20 bg-purple-500/10 text-purple-200',
    }
  }

  if (normalizedValue.includes('bank')) {
    return {
      color: typeColorMap.bank,
      key: 'bank',
      label: toTitleCase(rawValue),
      toneClassName: 'border-blue-500/20 bg-blue-500/10 text-blue-200',
    }
  }

  if (
    normalizedValue.includes('card') ||
    normalizedValue.includes('visa') ||
    normalizedValue.includes('master') ||
    normalizedValue.includes('amex')
  ) {
    return {
      color: typeColorMap.card,
      key: 'card',
      label: toTitleCase(rawValue),
      toneClassName: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-200',
    }
  }

  if (normalizedValue.includes('cash')) {
    return {
      color: typeColorMap.cash,
      key: 'cash',
      label: 'Cash',
      toneClassName: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200',
    }
  }

  return {
    color: typeColorMap.other,
    key: toKey(rawValue) || 'other',
    label: toTitleCase(rawValue) || 'Other',
    toneClassName: 'border-slate-500/20 bg-slate-500/10 text-slate-200',
  }
}

export const normalizeAccountBalanceRow = (item = {}, index = 0) => {
  const accountName = normalizeText(item.account_name, `Account ${index + 1}`)
  const accountNumber = normalizeText(item.account_number)
  const amount = toNumber(item.amount)
  const typeMeta = resolveTypeMeta(item.type)
  const typeValueRaw = normalizeText(item.type, '')

  return {
    accountName,
    accountNumber,
    amount,
    amountLabel: formatCurrency(amount),
    historyType: typeValueRaw || typeMeta.label,
    id: `${accountName}-${accountNumber}-${typeMeta.key}-${index}`,
    serial: index + 1,
    typeColor: typeMeta.color,
    typeKey: typeMeta.key,
    typeLabel: typeMeta.label,
    typeToneClassName: typeMeta.toneClassName,
  }
}

export const normalizeAccountHistoryRow = (item = {}, index = 0) => {
  const amount = toNumber(item.amount)
  const transactionDate = dayjs(item.tran_date ?? item.created_at)

  return {
    amount,
    amountLabel: formatCurrency(amount),
    gatewayLabel: toTitleCase(item.getaway ?? item.gateway) || '-',
    id: item.id ?? `${normalizeText(item.transaction_reference, 'history')}-${index}`,
    purposeLabel: toTitleCase(item.purpose) || '-',
    transactionDateLabel: formatDateTimeLabel(item.tran_date ?? item.created_at),
    transactionDateValue: transactionDate.isValid() ? transactionDate.valueOf() : 0,
    transactionReference: normalizeText(item.transaction_reference),
    userAccountNumber: normalizeText(item.user_account_no ?? item.account_number),
  }
}

export const buildAccountBalanceMetrics = (rows = []) => {
  const totalAccounts = rows.length
  const totalAmount = rows.reduce((sum, row) => sum + row.amount, 0)
  const topAccount = [...rows].sort((firstRow, secondRow) => secondRow.amount - firstRow.amount)[0]

  const typeChartItems = Object.values(
    rows.reduce((collection, row) => {
      if (!collection[row.typeKey]) {
        collection[row.typeKey] = {
          amount: 0,
          color: row.typeColor,
          count: 0,
          key: row.typeKey,
          label: row.typeLabel,
          toneClassName: row.typeToneClassName,
        }
      }

      collection[row.typeKey].amount += row.amount
      collection[row.typeKey].count += 1
      return collection
    }, {}),
  )
    .sort((firstItem, secondItem) => secondItem.amount - firstItem.amount)
    .map((item) => ({
      ...item,
      amountLabel: formatCurrency(item.amount),
      countLabel: formatCompactCount(item.count),
    }))

  const dominantType = typeChartItems[0]
  const accountChartItems = [...rows]
    .sort((firstRow, secondRow) => secondRow.amount - firstRow.amount)
    .slice(0, 8)
    .map((row) => ({
      accountName: row.accountName,
      amount: row.amount,
      amountLabel: row.amountLabel,
      typeLabel: row.typeLabel,
      typeToneClassName: row.typeToneClassName,
    }))
    .reverse()

  return {
    accountChartItems,
    dominantTypeLabel: dominantType ? `${dominantType.label} · ${dominantType.amountLabel}` : 'No type data',
    largestAccountAmountLabel: topAccount?.amountLabel ?? formatCurrency(0),
    largestAccountNameLabel: topAccount?.accountName ?? 'No account data',
    totalAccounts,
    totalAccountsLabel: formatCompactCount(totalAccounts),
    totalAmount,
    totalAmountLabel: formatCurrency(totalAmount),
    totalTypesLabel: formatCompactCount(typeChartItems.length),
    typeChartItems,
  }
}

export const buildAccountHistorySummary = (rows = []) => {
  const totalTransactions = rows.length
  const totalAmount = rows.reduce((sum, row) => sum + row.amount, 0)
  const latestTransaction = [...rows]
    .filter((row) => row.transactionDateValue > 0)
    .sort((firstRow, secondRow) => secondRow.transactionDateValue - firstRow.transactionDateValue)[0]
  const uniqueAccounts = new Set(rows.map((row) => row.userAccountNumber).filter((value) => value && value !== '-')).size

  return {
    latestTransactionLabel: latestTransaction?.transactionDateLabel ?? 'No transaction date',
    totalAmount,
    totalAmountLabel: formatCurrency(totalAmount),
    totalTransactions,
    totalTransactionsLabel: formatCompactCount(totalTransactions),
    uniqueAccountsLabel: formatCompactCount(uniqueAccounts),
  }
}
