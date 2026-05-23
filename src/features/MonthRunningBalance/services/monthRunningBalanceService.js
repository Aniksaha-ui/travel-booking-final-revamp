import { API_URLS } from '../../../constants/apiUrls'
import { apiRequest } from '../../../services/apiClient'
import { buildQueryPath, unwrapCollection } from '../../../services/resourceApi'

const formatCurrency = (value) =>
  `BDT ${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0)}`

const toNumber = (value) => Number(value) || 0

const getMonthLabel = (item, index) =>
  item.month ?? item.month_name ?? item.name ?? item.label ?? `Month ${index + 1}`

const createDefaultSummary = () => ({
  averageClosingBalance: 0,
  averageClosingBalanceLabel: formatCurrency(0),
  latestClosingBalance: 0,
  latestClosingBalanceLabel: formatCurrency(0),
  netChange: 0,
  netChangeLabel: formatCurrency(0),
  totalCredit: 0,
  totalCreditLabel: formatCurrency(0),
  totalDebit: 0,
  totalDebitLabel: formatCurrency(0),
  visibleMonths: 0,
})

export const getMonthRunningBalanceReport = async ({ page = 1, search = '' } = {}) => {
  const payload = await apiRequest(
    buildQueryPath(API_URLS.reports.monthRunningBalance, { page, search }),
  )
  const collection = unwrapCollection(payload, 'Unable to load monthly running balance.')
  const rows = collection.rows.map((item, index) => {
    const totalCredit = toNumber(item.total_credit)
    const totalDebit = toNumber(item.total_debit)
    const openingBalance = toNumber(item.opening_balance)
    const closingBalance = toNumber(item.closing_balance)

    return {
      id: item.id ?? `${getMonthLabel(item, index)}-${index}`,
      serial: (collection.pagination.from || 1) + index,
      month: getMonthLabel(item, index),
      totalCredit,
      totalCreditLabel: formatCurrency(totalCredit),
      totalDebit,
      totalDebitLabel: formatCurrency(totalDebit),
      openingBalance,
      openingBalanceLabel: formatCurrency(openingBalance),
      closingBalance,
      closingBalanceLabel: formatCurrency(closingBalance),
    }
  })

  const summary = rows.reduce(
    (result, row) => ({
      ...result,
      latestClosingBalance: row.closingBalance,
      netChange: result.netChange + (row.totalCredit - row.totalDebit),
      totalCredit: result.totalCredit + row.totalCredit,
      totalDebit: result.totalDebit + row.totalDebit,
      visibleMonths: result.visibleMonths + 1,
    }),
    createDefaultSummary(),
  )

  const averageClosingBalance = summary.visibleMonths
    ? rows.reduce((sum, row) => sum + row.closingBalance, 0) / summary.visibleMonths
    : 0

  const finalSummary = {
    ...summary,
    averageClosingBalance,
    averageClosingBalanceLabel: formatCurrency(averageClosingBalance),
    latestClosingBalanceLabel: formatCurrency(summary.latestClosingBalance),
    netChangeLabel: formatCurrency(summary.netChange),
    totalCreditLabel: formatCurrency(summary.totalCredit),
    totalDebitLabel: formatCurrency(summary.totalDebit),
  }

  return {
    chartItems: rows,
    pagination: collection.pagination,
    rows,
    summary: finalSummary,
  }
}
