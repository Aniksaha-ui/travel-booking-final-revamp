import dayjs from 'dayjs'
import { API_URLS } from '../../../constants/apiUrls'
import { apiRequest } from '../../../services/apiClient'
import { APP_CONFIG } from '../../../services/config'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})

const toNumber = (value) => Number(value) || 0

const defaultPagination = {
  from: 0,
  to: 0,
  total: 0,
  currentPage: 1,
  lastPage: 1,
  perPage: 0,
}

export const formatCurrency = (value) => `BDT ${currencyFormatter.format(toNumber(value))}`

const ensureSuccessfulPayload = (payload, fallbackMessage) => {
  const status = payload?.status ?? payload?.isExecute ?? payload?.isExecture

  if (status && String(status).trim().toUpperCase() !== 'SUCCESS') {
    throw new Error(payload?.message || fallbackMessage)
  }

  return payload
}

const extractRowsAndMeta = (payload) => {
  if (Array.isArray(payload?.data?.data)) {
    return {
      rows: payload.data.data,
      meta: payload.data,
    }
  }

  if (Array.isArray(payload?.data)) {
    return {
      rows: payload.data,
      meta: payload,
    }
  }

  if (Array.isArray(payload)) {
    return {
      rows: payload,
      meta: {},
    }
  }

  return {
    rows: [],
    meta: {},
  }
}

const normalizePagination = (meta, fallbackCount = 0) => ({
  from: toNumber(meta?.from),
  to: toNumber(meta?.to) || fallbackCount,
  total: toNumber(meta?.total) || fallbackCount,
  currentPage: toNumber(meta?.current_page ?? meta?.currentPage) || 1,
  lastPage: toNumber(meta?.last_page ?? meta?.lastPage) || 1,
  perPage: toNumber(meta?.per_page ?? meta?.perPage) || fallbackCount,
})

const normalizeDailyBalanceRow = (item, index) => {
  const parsedDate = dayjs(item.date ?? item.created_at)
  const safeDate = parsedDate.isValid() ? parsedDate : null
  const totalCredit = toNumber(item.total_credit)
  const totalDebit = toNumber(item.total_debit)
  const balance = toNumber(item.balance)
  const txCount = toNumber(item.tx_count ?? item.transaction_count)

  return {
    id: item.id ?? `${safeDate?.format('YYYY-MM-DD') ?? 'day'}-${index}`,
    date: safeDate?.format('YYYY-MM-DD') ?? '',
    dateLabel: safeDate?.format('MMM D, YYYY') ?? item.date ?? '-',
    shortDayLabel: safeDate?.format('DD') ?? String(index + 1),
    txCount,
    totalCredit,
    totalCreditLabel: formatCurrency(totalCredit),
    totalDebit,
    totalDebitLabel: formatCurrency(totalDebit),
    balance,
    balanceLabel: formatCurrency(balance),
  }
}

const fillMissingDates = (rows) => {
  const today = dayjs().startOf('day')
  const firstDay = today.startOf('month')
  const rowsByDate = new Map(rows.map((row) => [row.date, row]))
  const filledRows = []
  let lastBalance = 0

  for (let cursor = firstDay; cursor.isBefore(today, 'day') || cursor.isSame(today, 'day'); cursor = cursor.add(1, 'day')) {
    const dateKey = cursor.format('YYYY-MM-DD')
    const matchedRow = rowsByDate.get(dateKey)

    if (matchedRow) {
      lastBalance = matchedRow.balance
      filledRows.push(matchedRow)
      continue
    }

    filledRows.push({
      id: `daily-balance-${dateKey}`,
      date: dateKey,
      dateLabel: cursor.format('MMM D, YYYY'),
      shortDayLabel: cursor.format('DD'),
      txCount: 0,
      totalCredit: 0,
      totalCreditLabel: formatCurrency(0),
      totalDebit: 0,
      totalDebitLabel: formatCurrency(0),
      balance: lastBalance,
      balanceLabel: formatCurrency(lastBalance),
    })
  }

  return {
    firstDayLabel: firstDay.format('MMM D, YYYY'),
    rows: filledRows,
    todayLabel: today.format('MMM D, YYYY'),
  }
}

const buildSummary = (rows) => {
  const totals = rows.reduce(
    (result, row) => ({
      totalCredit: result.totalCredit + row.totalCredit,
      totalDebit: result.totalDebit + row.totalDebit,
      txCount: result.txCount + row.txCount,
    }),
    {
      totalCredit: 0,
      totalDebit: 0,
      txCount: 0,
    },
  )

  const currentBalance = rows.at(-1)?.balance ?? 0

  return {
    activeDays: rows.filter((row) => row.txCount > 0).length,
    currentBalance,
    currentBalanceLabel: formatCurrency(currentBalance),
    netFlow: totals.totalCredit - totals.totalDebit,
    netFlowLabel: formatCurrency(totals.totalCredit - totals.totalDebit),
    totalCredit: totals.totalCredit,
    totalCreditLabel: formatCurrency(totals.totalCredit),
    totalDebit: totals.totalDebit,
    totalDebitLabel: formatCurrency(totals.totalDebit),
    txCount: totals.txCount,
  }
}

const normalizeHistoryReportRow = (item, index) => {
  const reportMonth = dayjs(item.report_month)
  const createdAt = dayjs(item.created_at)

  return {
    id: item.id ?? `report-${index}`,
    createdAtLabel: createdAt.isValid() ? createdAt.format('MMM D, YYYY h:mm A') : '-',
    filePath: item.file_path ?? '',
    fileUrl: buildReportAssetUrl(item.file_path),
    reportMonthLabel: reportMonth.isValid() ? reportMonth.format('MMMM YYYY') : '-',
    reportName: item.report_name ?? `Report ${index + 1}`,
  }
}

export const buildReportAssetUrl = (filePath) => {
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

export const getDailyBalanceReport = async ({ page = 1 } = {}) => {
  const payload = ensureSuccessfulPayload(
    await apiRequest(`${API_URLS.reports.dailyBalance}?page=${page}`),
    'Unable to load daily balance report.',
  )
  const { meta, rows } = extractRowsAndMeta(payload)
  const normalizedRows = rows.map(normalizeDailyBalanceRow)
  const { firstDayLabel, rows: filledRows, todayLabel } = fillMissingDates(normalizedRows)

  return {
    pagination: normalizePagination(meta, filledRows.length),
    rows: filledRows,
    summary: buildSummary(filledRows),
    titleDateRange: `${firstDayLabel} - ${todayLabel}`,
  }
}

export const getDailyBalanceHistory = async ({ page = 1 } = {}) => {
  const payload = ensureSuccessfulPayload(
    await apiRequest(`${API_URLS.reports.dailyBalanceHistory}?page=${page}`),
    'Unable to load daily balance history.',
  )
  const { meta, rows } = extractRowsAndMeta(payload)
  const normalizedRows = rows.map(normalizeHistoryReportRow)

  return {
    pagination: normalizePagination(meta, normalizedRows.length),
    rows: normalizedRows,
  }
}

export const emptyDailyBalanceData = {
  pagination: defaultPagination,
  rows: [],
  summary: {
    activeDays: 0,
    currentBalance: 0,
    currentBalanceLabel: formatCurrency(0),
    netFlow: 0,
    netFlowLabel: formatCurrency(0),
    totalCredit: 0,
    totalCreditLabel: formatCurrency(0),
    totalDebit: 0,
    totalDebitLabel: formatCurrency(0),
    txCount: 0,
  },
  titleDateRange: '',
}

export const emptyDailyBalanceHistory = {
  pagination: defaultPagination,
  rows: [],
}
