import { OVERALL_SALES_REPORT_COLORS } from '../constants/overallSalesReport.constants'

const compactFormatter = new Intl.NumberFormat('en-US', {
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

const formatCompact = (value) => compactFormatter.format(toNumber(value))

export const formatOverallSalesCurrency = (value) => `BDT ${currencyFormatter.format(toNumber(value))}`

export const createEmptyOverallSalesSummary = () => ({
  averageSourceSales: 0,
  averageSourceSalesLabel: formatOverallSalesCurrency(0),
  chartRows: [],
  topSourceAmountLabel: formatOverallSalesCurrency(0),
  topSourceLabel: 'No sales sources found.',
  topSourceName: 'No sources',
  topSourceShareLabel: '0.0%',
  totalSales: 0,
  totalSalesLabel: formatOverallSalesCurrency(0),
  totalSources: 0,
  totalSourcesLabel: formatCompact(0),
})

export const normalizeOverallSalesRows = (items = []) => {
  const totalSales = items.reduce(
    (sum, item) => sum + toNumber(item.total_amount ?? item.totalAmount),
    0,
  )

  return items.map((item = {}, index) => {
    const totalAmount = toNumber(item.total_amount ?? item.totalAmount)
    const share = totalSales ? (totalAmount / totalSales) * 100 : 0
    const source = normalizeText(item.source, `Source ${index + 1}`)

    return {
      color: OVERALL_SALES_REPORT_COLORS[index % OVERALL_SALES_REPORT_COLORS.length],
      id: `${source}-${index + 1}`,
      progressWidth: `${Math.min(Math.max(share, 0), 100)}%`,
      share,
      shareLabel: `${share.toFixed(1)}%`,
      source,
      totalAmount,
      totalAmountLabel: formatOverallSalesCurrency(totalAmount),
    }
  })
}

export const buildOverallSalesSummary = (rows = []) => {
  if (!rows.length) {
    return createEmptyOverallSalesSummary()
  }

  const totalSales = rows.reduce((sum, row) => sum + row.totalAmount, 0)
  const totalSources = rows.length
  const averageSourceSales = totalSources ? totalSales / totalSources : 0
  const topSource = rows.reduce(
    (bestRow, row) => (row.totalAmount > bestRow.totalAmount ? row : bestRow),
    rows[0],
  )

  return {
    averageSourceSales,
    averageSourceSalesLabel: formatOverallSalesCurrency(averageSourceSales),
    chartRows: rows.map((row) => ({
      ...row,
      label: row.source,
      value: row.totalAmount,
    })),
    topSourceAmountLabel: topSource.totalAmountLabel,
    topSourceLabel: `${topSource.source} • ${topSource.totalAmountLabel}`,
    topSourceName: topSource.source,
    topSourceShareLabel: topSource.shareLabel,
    totalSales,
    totalSalesLabel: formatOverallSalesCurrency(totalSales),
    totalSources,
    totalSourcesLabel: formatCompact(totalSources),
  }
}

export const filterOverallSalesRows = (rows = [], search = '') => {
  const normalizedSearch = search.trim().toLowerCase()

  if (!normalizedSearch) {
    return rows
  }

  return rows.filter((row) =>
    [row.source, row.totalAmountLabel, row.shareLabel].some((value) =>
      String(value).toLowerCase().includes(normalizedSearch),
    ),
  )
}
