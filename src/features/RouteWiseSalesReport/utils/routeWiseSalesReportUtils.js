import { ROUTE_WISE_SALES_COLORS } from '../constants/routeWiseSalesReport.constants'

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
export const formatRouteWiseSalesCurrency = (value) => `BDT ${currencyFormatter.format(toNumber(value))}`

export const createEmptyRouteWiseSalesSummary = () => ({
  averageRevenuePerBooking: 0,
  averageRevenuePerBookingLabel: formatRouteWiseSalesCurrency(0),
  chartRows: [],
  topRouteLabel: 'No routes found.',
  topRouteName: 'No routes',
  totalBookings: 0,
  totalBookingsLabel: formatCompact(0),
  totalRevenue: 0,
  totalRevenueLabel: formatRouteWiseSalesCurrency(0),
  totalRoutes: 0,
  totalRoutesLabel: formatCompact(0),
})

export const normalizeRouteWiseSalesRows = (items = []) =>
  items.map((item = {}, index) => {
    const routeName = normalizeText(item.route_name ?? item.routeName, `Route ${index + 1}`)
    const totalBookings = toNumber(item.total_bookings ?? item.totalBookings)
    const totalRevenue = toNumber(item.total_revenue ?? item.totalRevenue)
    const averageRevenue = totalBookings ? totalRevenue / totalBookings : 0

    return {
      averageRevenue,
      averageRevenueLabel: formatRouteWiseSalesCurrency(averageRevenue),
      color: ROUTE_WISE_SALES_COLORS[index % ROUTE_WISE_SALES_COLORS.length],
      id: `${routeName}-${index + 1}`,
      routeName,
      totalBookings,
      totalBookingsLabel: formatCompact(totalBookings),
      totalRevenue,
      totalRevenueLabel: formatRouteWiseSalesCurrency(totalRevenue),
    }
  })

export const buildRouteWiseSalesSummary = (rows = []) => {
  if (!rows.length) {
    return createEmptyRouteWiseSalesSummary()
  }

  const totalBookings = rows.reduce((sum, row) => sum + row.totalBookings, 0)
  const totalRevenue = rows.reduce((sum, row) => sum + row.totalRevenue, 0)
  const averageRevenuePerBooking = totalBookings ? totalRevenue / totalBookings : 0
  const topRoute = rows.reduce(
    (bestRow, row) => (row.totalRevenue > bestRow.totalRevenue ? row : bestRow),
    rows[0],
  )

  return {
    averageRevenuePerBooking,
    averageRevenuePerBookingLabel: formatRouteWiseSalesCurrency(averageRevenuePerBooking),
    chartRows: [...rows].sort((firstRow, secondRow) => secondRow.totalRevenue - firstRow.totalRevenue),
    topRouteLabel: `${topRoute.routeName} • ${topRoute.totalRevenueLabel}`,
    topRouteName: topRoute.routeName,
    totalBookings,
    totalBookingsLabel: formatCompact(totalBookings),
    totalRevenue,
    totalRevenueLabel: formatRouteWiseSalesCurrency(totalRevenue),
    totalRoutes: rows.length,
    totalRoutesLabel: formatCompact(rows.length),
  }
}

export const filterRouteWiseSalesRows = (rows = [], search = '') => {
  const normalizedSearch = search.trim().toLowerCase()

  if (!normalizedSearch) {
    return rows
  }

  return rows.filter((row) =>
    [row.routeName, row.totalBookingsLabel, row.totalRevenueLabel, row.averageRevenueLabel].some((value) =>
      String(value).toLowerCase().includes(normalizedSearch),
    ),
  )
}
