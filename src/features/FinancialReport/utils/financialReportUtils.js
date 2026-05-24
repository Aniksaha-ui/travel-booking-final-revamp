import dayjs from 'dayjs'

const compactCountFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  notation: 'compact',
})

const currencyFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})

const toNumber = (value) => {
  const parsedValue = Number(value)
  return Number.isNaN(parsedValue) ? 0 : parsedValue
}

const formatCompactCount = (value) => compactCountFormatter.format(toNumber(value))
export const formatCurrency = (value) => `BDT ${currencyFormatter.format(toNumber(value))}`

const formatFinancialYearLabel = (startValue, endValue, fallback = '-') => {
  const parsedStart = dayjs(startValue)
  const parsedEnd = dayjs(endValue)

  if (parsedStart.isValid() && parsedEnd.isValid()) {
    return `${parsedStart.format('YYYY')} - ${parsedEnd.format('YYYY')}`
  }

  if (parsedStart.isValid()) {
    return parsedStart.format('YYYY')
  }

  return fallback
}

export const normalizeFinancialReportRow = (item = {}, index = 0, pagination = {}) => {
  const paymentAmount = toNumber(item.payment_amount)
  const refundAmount = toNumber(item.refund)
  const costingAmount = toNumber(item.costing)
  const netAmount = paymentAmount - refundAmount - costingAmount
  const serialSeed = pagination.from || 1
  const financialYearLabel = formatFinancialYearLabel(item.fy_start, item.fy_end, `FY ${index + 1}`)
  const parsedStart = dayjs(item.fy_start)

  return {
    costingAmount,
    costingAmountLabel: formatCurrency(costingAmount),
    financialYearLabel,
    fyEnd: item.fy_end ?? '',
    fyStart: item.fy_start ?? '',
    id: item.id ?? `${financialYearLabel}-${index}`,
    netAmount,
    netAmountLabel: formatCurrency(netAmount),
    paymentAmount,
    paymentAmountLabel: formatCurrency(paymentAmount),
    refundAmount,
    refundAmountLabel: formatCurrency(refundAmount),
    serial: serialSeed + index,
    sortValue: parsedStart.isValid() ? parsedStart.valueOf() : index,
    yearAvatar: financialYearLabel.slice(2, 4) || 'FY',
  }
}

export const buildFinancialReportMetrics = (rows = []) => {
  const totalYears = rows.length
  const totalPaymentAmount = rows.reduce((sum, row) => sum + row.paymentAmount, 0)
  const totalRefundAmount = rows.reduce((sum, row) => sum + row.refundAmount, 0)
  const totalCostingAmount = rows.reduce((sum, row) => sum + row.costingAmount, 0)
  const totalNetAmount = rows.reduce((sum, row) => sum + row.netAmount, 0)

  const sortedRows = [...rows].sort((firstRow, secondRow) => firstRow.sortValue - secondRow.sortValue)
  const highestPaymentYear = [...rows].sort((firstRow, secondRow) => secondRow.paymentAmount - firstRow.paymentAmount)[0]
  const highestRefundYear = [...rows].sort((firstRow, secondRow) => secondRow.refundAmount - firstRow.refundAmount)[0]
  const highestCostingYear = [...rows].sort((firstRow, secondRow) => secondRow.costingAmount - firstRow.costingAmount)[0]

  return {
    averageNetAmountLabel: formatCurrency(totalYears ? totalNetAmount / totalYears : 0),
    chartItems: sortedRows.map((row) => ({
      costingAmount: row.costingAmount,
      financialYearLabel: row.financialYearLabel,
      netAmount: row.netAmount,
      paymentAmount: row.paymentAmount,
      refundAmount: row.refundAmount,
      shortLabel: row.financialYearLabel.replace(' - ', '/'),
    })),
    highestCostingYearLabel: highestCostingYear
      ? `${highestCostingYear.financialYearLabel} · ${highestCostingYear.costingAmountLabel}`
      : 'No costing data',
    highestPaymentYearLabel: highestPaymentYear
      ? `${highestPaymentYear.financialYearLabel} · ${highestPaymentYear.paymentAmountLabel}`
      : 'No payment data',
    highestRefundYearLabel: highestRefundYear
      ? `${highestRefundYear.financialYearLabel} · ${highestRefundYear.refundAmountLabel}`
      : 'No refund data',
    totalCostingAmount,
    totalCostingAmountLabel: formatCurrency(totalCostingAmount),
    totalNetAmount,
    totalNetAmountLabel: formatCurrency(totalNetAmount),
    totalPaymentAmount,
    totalPaymentAmountLabel: formatCurrency(totalPaymentAmount),
    totalRefundAmount,
    totalRefundAmountLabel: formatCurrency(totalRefundAmount),
    totalYears,
    totalYearsLabel: formatCompactCount(totalYears),
  }
}
