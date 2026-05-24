const methodStyles = {
  DELETE: 'border-rose-500/25 bg-rose-500/10 text-rose-200',
  GET: 'border-blue-500/25 bg-blue-500/10 text-blue-200',
  PATCH: 'border-amber-500/25 bg-amber-500/10 text-amber-100',
  POST: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-200',
  PUT: 'border-cyan-500/25 bg-cyan-500/10 text-cyan-200',
}

export const methodBadge = (method) => (
  <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${methodStyles[method] ?? methodStyles.GET}`}>
    {method}
  </span>
)

export const dailyReportColumns = [
  { accessor: 'date', id: 'date', label: 'Date', minWidth: '150px' },
  { accessor: 'totalQueries', id: 'totalQueries', label: 'Total Queries', minWidth: '140px' },
  { accessor: 'totalTimeLabel', id: 'totalTime', label: 'Total Time (ms)', minWidth: '150px' },
]

export const routePerformanceColumns = [
  { accessor: 'route', className: 'monitoring-table__path', id: 'route', label: 'Route', minWidth: '280px' },
  { accessor: 'totalQueries', id: 'totalQueries', label: 'Total Queries', minWidth: '140px' },
  { accessor: 'averageTimeLabel', id: 'averageTime', label: 'Avg Time (ms)', minWidth: '140px' },
  {
    id: 'maxTime',
    label: 'Max Time (ms)',
    minWidth: '140px',
    render: (row) => (
      <span className={row.isSlow ? 'font-bold text-rose-300' : 'text-white'}>{row.maxTimeLabel}</span>
    ),
  },
  { accessor: 'lastSeen', id: 'lastSeen', label: 'Last Seen', minWidth: '180px' },
]

export const controllerReportColumns = [
  {
    accessor: 'controller',
    className: 'monitoring-table__path',
    id: 'controller',
    label: 'Controller',
    minWidth: '320px',
  },
  { accessor: 'totalQueries', id: 'totalQueries', label: 'Total Queries', minWidth: '140px' },
  { accessor: 'totalTimeLabel', id: 'totalTime', label: 'Total Time (ms)', minWidth: '150px' },
  { accessor: 'lastSeen', id: 'lastSeen', label: 'Last Seen', minWidth: '180px' },
]

export const userReportColumns = [
  { accessor: 'userId', id: 'userId', label: 'User ID', minWidth: '120px' },
  { accessor: 'totalQueries', id: 'totalQueries', label: 'Total Queries', minWidth: '140px' },
  { accessor: 'totalTimeLabel', id: 'totalTime', label: 'Total Time (ms)', minWidth: '150px' },
  { accessor: 'lastSeen', id: 'lastSeen', label: 'Last Seen', minWidth: '180px' },
]

export const requestHistoryColumns = [
  { id: 'method', label: 'Method', minWidth: '110px', render: (row) => methodBadge(row.method) },
  { accessor: 'route', className: 'monitoring-table__path', id: 'route', label: 'Route', minWidth: '260px' },
  {
    accessor: 'controller',
    className: 'monitoring-table__path',
    id: 'controller',
    label: 'Controller',
    minWidth: '300px',
  },
  { accessor: 'totalQueries', id: 'totalQueries', label: 'Queries', minWidth: '110px' },
  { accessor: 'totalTimeLabel', id: 'time', label: 'Time (ms)', minWidth: '120px' },
  { accessor: 'lastSeen', id: 'lastSeen', label: 'Last Seen', minWidth: '180px' },
]

export const sqlLogColumns = [
  { accessor: 'route', className: 'monitoring-table__path', id: 'route', label: 'Route', minWidth: '220px' },
  { accessor: 'sql', className: 'monitoring-table__sql', id: 'sql', label: 'SQL', minWidth: '420px' },
  {
    id: 'time',
    label: 'Time (ms)',
    minWidth: '120px',
    render: (row) => (
      <span className={row.isSlow ? 'font-bold text-amber-200' : 'text-white'}>{row.timeLabel}</span>
    ),
  },
  { accessor: 'userId', id: 'userId', label: 'User', minWidth: '100px' },
]
