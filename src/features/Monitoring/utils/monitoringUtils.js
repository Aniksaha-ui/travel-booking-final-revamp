const compactFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  notation: 'compact',
})

const toNumber = (value) => {
  const parsedValue = Number(value)
  return Number.isNaN(parsedValue) ? 0 : parsedValue
}

const normalizeText = (value, fallback = '-') => {
  if (value === undefined || value === null) {
    return fallback
  }

  const normalizedValue = String(value).trim()
  return normalizedValue || fallback
}

const formatCount = (value) => compactFormatter.format(toNumber(value))
const formatMilliseconds = (value) => `${toNumber(value)} ms`

const normalizeArray = (value) => (Array.isArray(value) ? value : [])

export const createEmptyMonitoringData = () => ({
  controllerReport: [],
  dailyReport: [],
  latestLogs: [],
  requestReport: [],
  routeReport: [],
  slowQueries: [],
  summary: {
    activeRoutes: 0,
    activeRoutesLabel: formatCount(0),
    latestRequestCount: 0,
    latestRequestCountLabel: formatCount(0),
    slowQueries: 0,
    slowQueriesLabel: formatCount(0),
    totalExecutionTime: 0,
    totalExecutionTimeLabel: formatMilliseconds(0),
    totalRequestsToday: 0,
    totalRequestsTodayLabel: formatCount(0),
  },
  userReport: [],
})

export const normalizeMonitoringData = (source = {}) => {
  const dailyReport = normalizeArray(source.daily_report)
  const routeReport = normalizeArray(source.route_report)
  const slowQueries = normalizeArray(source.slow_queries)
  const controllerReport = normalizeArray(source.controller_report)
  const userReport = normalizeArray(source.user_report)
  const requestReport = normalizeArray(source.request_report)
  const latestLogs = normalizeArray(source.latest_logs)
  const dailySummary = dailyReport[0] ?? {}
  const totalRequestsToday = toNumber(dailySummary.total_queries)
  const totalExecutionTime = toNumber(dailySummary.total_time)

  return {
    controllerReport: controllerReport.map((item, index) => ({
      controller: normalizeText(item.controller, `Controller ${index + 1}`),
      id: item.controller ?? `controller-${index + 1}`,
      lastSeen: normalizeText(item.last_seen),
      totalQueries: toNumber(item.total_queries),
      totalTime: toNumber(item.total_time),
      totalTimeLabel: formatMilliseconds(item.total_time),
    })),
    dailyReport: dailyReport.map((item, index) => ({
      date: normalizeText(item.date, `Day ${index + 1}`),
      id: item.date ?? `daily-${index + 1}`,
      totalQueries: toNumber(item.total_queries),
      totalTime: toNumber(item.total_time),
      totalTimeLabel: formatMilliseconds(item.total_time),
    })),
    latestLogs: latestLogs.map((item, index) => ({
      id: item.id ?? `log-${index + 1}`,
      isSlow: toNumber(item.time_ms) > 100,
      route: normalizeText(item.route),
      sql: normalizeText(item.sql),
      time: toNumber(item.time_ms),
      timeLabel: formatMilliseconds(item.time_ms),
      userId: normalizeText(item.user_id, 'Guest'),
    })),
    requestReport: requestReport.map((item, index) => ({
      controller: normalizeText(item.controller),
      id: item.request_id ?? `${item.route ?? 'request'}-${index + 1}`,
      lastSeen: normalizeText(item.last_seen),
      method: normalizeText(item.method),
      route: normalizeText(item.route),
      totalQueries: toNumber(item.total_queries),
      totalTime: toNumber(item.total_time_ms),
      totalTimeLabel: formatMilliseconds(item.total_time_ms),
    })),
    routeReport: routeReport.map((item, index) => ({
      averageTime: toNumber(item.avg_time),
      averageTimeLabel: formatMilliseconds(item.avg_time),
      id: item.route ?? `route-${index + 1}`,
      isSlow: toNumber(item.max_time) > 100,
      lastSeen: normalizeText(item.last_seen),
      maxTime: toNumber(item.max_time),
      maxTimeLabel: formatMilliseconds(item.max_time),
      route: normalizeText(item.route, `Route ${index + 1}`),
      totalQueries: toNumber(item.total_queries),
    })),
    slowQueries,
    summary: {
      activeRoutes: routeReport.length,
      activeRoutesLabel: formatCount(routeReport.length),
      latestRequestCount: latestLogs.length,
      latestRequestCountLabel: formatCount(latestLogs.length),
      slowQueries: slowQueries.length,
      slowQueriesLabel: formatCount(slowQueries.length),
      totalExecutionTime,
      totalExecutionTimeLabel: formatMilliseconds(totalExecutionTime),
      totalRequestsToday,
      totalRequestsTodayLabel: formatCount(totalRequestsToday),
    },
    userReport: userReport.map((item, index) => ({
      id: item.user_id ?? `user-${index + 1}`,
      lastSeen: normalizeText(item.last_seen),
      totalQueries: toNumber(item.total_queries),
      totalTime: toNumber(item.total_time),
      totalTimeLabel: formatMilliseconds(item.total_time),
      userId: normalizeText(item.user_id, 'Guest'),
    })),
  }
}
