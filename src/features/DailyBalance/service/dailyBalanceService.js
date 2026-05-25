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

export const getCurrentDailyBalanceMonth = () => dayjs().format('YYYY-MM')

const normalizeMonthValue = (value) => {
  const parsedMonth = dayjs(`${String(value || '').trim()}-01`)
  return parsedMonth.isValid() ? parsedMonth.format('YYYY-MM') : getCurrentDailyBalanceMonth()
}

const resolveMonthWindow = (monthValue) => {
  const normalizedMonth = normalizeMonthValue(monthValue)
  const monthStart = dayjs(`${normalizedMonth}-01`).startOf('month')
  const today = dayjs().startOf('day')
  const monthEnd = monthStart.isSame(today, 'month') ? today : monthStart.endOf('month').startOf('day')

  return {
    monthEnd,
    monthLabel: monthStart.format('MMMM YYYY'),
    monthStart,
    monthValue: normalizedMonth,
  }
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

const resolveOpeningBalance = (rows, firstDay) => {
  const priorRows = rows
    .filter((row) => row.date && dayjs(row.date).isValid() && dayjs(row.date).isBefore(firstDay, 'day'))
    .sort((firstRow, secondRow) => firstRow.date.localeCompare(secondRow.date))

  return priorRows.at(-1)?.balance ?? 0
}

const fillMissingDates = (rows, monthValue, sourceRows = rows) => {
  const { monthEnd, monthStart } = resolveMonthWindow(monthValue)
  const rowsByDate = new Map(rows.map((row) => [row.date, row]))
  const filledRows = []
  let lastBalance = resolveOpeningBalance(sourceRows, monthStart)

  for (let cursor = monthStart; cursor.isBefore(monthEnd, 'day') || cursor.isSame(monthEnd, 'day'); cursor = cursor.add(1, 'day')) {
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
    firstDayLabel: monthStart.format('MMM D, YYYY'),
    rows: filledRows,
    lastDayLabel: monthEnd.format('MMM D, YYYY'),
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

const buildDailyBalanceRequestPath = ({ monthValue, page = 1 } = {}) => {
  const { monthEnd, monthStart, monthValue: normalizedMonth } = resolveMonthWindow(monthValue)
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('month', normalizedMonth)
  params.set('from_date', monthStart.format('YYYY-MM-DD'))
  params.set('to_date', monthEnd.format('YYYY-MM-DD'))

  return `${API_URLS.reports.dailyBalance}?${params.toString()}`
}

const fetchDailyBalancePayload = async ({ monthValue, page = 1 } = {}) =>
  ensureSuccessfulPayload(
    await apiRequest(buildDailyBalanceRequestPath({ monthValue, page })),
    'Unable to load daily balance report.',
  )

const mergeDailyBalanceRows = (payloads) => {
  const mergedRows = []

  payloads.forEach((payload) => {
    const { rows } = extractRowsAndMeta(payload)
    mergedRows.push(...rows)
  })

  const rowsByDate = new Map()

  mergedRows
    .map(normalizeDailyBalanceRow)
    .sort((firstRow, secondRow) => firstRow.date.localeCompare(secondRow.date))
    .forEach((row) => {
      rowsByDate.set(row.date, row)
    })

  return [...rowsByDate.values()]
}

export const getDailyBalanceReport = async ({ monthValue = '' } = {}) => {
  const resolvedMonth = normalizeMonthValue(monthValue)
  const { monthEnd, monthLabel, monthStart } = resolveMonthWindow(resolvedMonth)
  const firstPayload = await fetchDailyBalancePayload({ monthValue: resolvedMonth, page: 1 })
  const { meta } = extractRowsAndMeta(firstPayload)
  const lastPage = toNumber(meta?.last_page ?? meta?.lastPage) || 1
  const additionalPayloads =
    lastPage > 1
      ? await Promise.all(
          Array.from({ length: lastPage - 1 }, (_, index) =>
            fetchDailyBalancePayload({ monthValue: resolvedMonth, page: index + 2 }),
          ),
        )
      : []
  const normalizedRows = mergeDailyBalanceRows([firstPayload, ...additionalPayloads])
  const filteredRows = normalizedRows.filter((row) => {
    if (!row.date || !dayjs(row.date).isValid()) {
      return false
    }

    const rowDate = dayjs(row.date)
    return (
      (rowDate.isAfter(monthStart, 'day') || rowDate.isSame(monthStart, 'day')) &&
      (rowDate.isBefore(monthEnd, 'day') || rowDate.isSame(monthEnd, 'day'))
    )
  })
  const { firstDayLabel, lastDayLabel, rows: filledRows } = fillMissingDates(
    filteredRows,
    resolvedMonth,
    normalizedRows,
  )

  return {
    monthLabel,
    monthValue: resolvedMonth,
    pagination: {
      ...defaultPagination,
      from: filledRows.length ? 1 : 0,
      to: filledRows.length,
      total: filledRows.length,
      perPage: filledRows.length,
    },
    rows: filledRows,
    summary: buildSummary(filledRows),
    titleDateRange: `${firstDayLabel} - ${lastDayLabel}`,
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
  monthLabel: dayjs().format('MMMM YYYY'),
  monthValue: getCurrentDailyBalanceMonth(),
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
