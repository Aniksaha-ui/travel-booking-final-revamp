import { APP_ROUTES } from './routes'

export const REPORT_CATALOG = [
  {
    key: 'account-balance',
    title: 'Account Balance',
    description: 'Review live balances and account positions in one place.',
    path: APP_ROUTES.accountBalance,
    order: 1000,
  },
  {
    key: 'account-history',
    title: 'Account History',
    description: 'Track account activity and balance movement over time.',
    path: APP_ROUTES.accountHistory,
    order: 1001,
  },
  {
    key: 'financial-report',
    title: 'Financial Report',
    description: 'Inspect revenue, expenses, and overall financial performance.',
    path: APP_ROUTES.financialReport,
    order: 1002,
  },
  {
    key: 'customer-value-report',
    title: 'Customer Value Report',
    description: 'Measure repeat value and contribution across customers.',
    path: APP_ROUTES.customerValueReport,
    order: 1003,
  },
  {
    key: 'avg-booking-value-report',
    title: 'Average Booking Value',
    description: 'Monitor average ticket and booking value trends.',
    path: APP_ROUTES.avgBookingValueReport,
    order: 1004,
  },
  {
    key: 'booking-summary-report',
    title: 'Booking Summary Report',
    description: 'Summarize booking volume, status, and totals quickly.',
    path: APP_ROUTES.bookingSummary,
    order: 1005,
  },
  {
    key: 'monthly-daily-balance',
    title: 'Monthly Daily Balance',
    description: 'Audit daily cash movement for the selected month.',
    path: APP_ROUTES.dailyBalance,
    order: 1006,
  },
  {
    key: 'monthly-running-balance',
    title: 'Monthly Running Balance',
    description: 'Follow month-to-date balance changes and rollups.',
    path: APP_ROUTES.monthRunningBalance,
    order: 1007,
  },
  {
    key: 'overall-sales',
    title: 'Overall Sales',
    description: 'See total sales performance across the business.',
    path: APP_ROUTES.overallSales,
    order: 1008,
  },
  {
    key: 'route-wise-sales',
    title: 'Route Wise Sales',
    description: 'Compare revenue and demand route by route.',
    path: APP_ROUTES.routeWiseSales,
    order: 1009,
  },
  {
    key: 'ticket-status-analysis',
    title: 'Ticket Status Analysis',
    description: 'Break down ticket states, trends, and fulfillment progress.',
    path: APP_ROUTES.ticketStatusReport,
    order: 1010,
  },
  {
    key: 'trip-performance',
    title: 'Trip Performance',
    description: 'Review occupancy, revenue, and outcomes by trip.',
    path: APP_ROUTES.tripPerformance,
    order: 1011,
  },
  {
    key: 'low-occupancy-report',
    title: 'Low Occupancy Report',
    description: 'Spot trips that need attention because seats remain unsold.',
    path: APP_ROUTES.lowOccupancyReport,
    order: 1012,
  },
  {
    key: 'low-performing-packages',
    title: 'Low Performing Packages',
    description: 'Identify packages that are lagging on conversion or sales.',
    path: APP_ROUTES.lowPerformingPackages,
    order: 1013,
  },
  {
    key: 'high-cancellation-packages',
    title: 'High Cancellation Packages',
    description: 'Find packages with unusually high cancellation pressure.',
    path: APP_ROUTES.highCancellationPackages,
    order: 1014,
  },
  {
    key: 'vehicle-tracking-report',
    title: 'Vehicle Tracking Report',
    description: 'Monitor route activity and movement from the vehicle side.',
    path: APP_ROUTES.vehicleTrackingReport,
    order: 1015,
  },
  {
    key: 'vehicle-wise-seat-report',
    title: 'Vehicle Wise Seat Report',
    description: 'Inspect seat availability and allocation by vehicle.',
    path: APP_ROUTES.vehicleWiseSeatReport,
    order: 1016,
  },
]

export const REPORT_ROUTE_SET = new Set(REPORT_CATALOG.map((report) => report.path))

export const REPORT_CATALOG_BY_PATH = Object.fromEntries(
  REPORT_CATALOG.map((report) => [report.path, report]),
)

export const REPORTS_MENU_FALLBACK_ITEM = {
  id: 'frontend-reports-hub',
  title: 'Reports',
  path: APP_ROUTES.reports,
  icon: 'ReportManagementIcon',
  order: 1000,
  children: [],
}

export const buildFallbackReportMenuItems = () =>
  REPORT_CATALOG.map((report) => ({
    id: `frontend-${report.key}`,
    title: report.title,
    path: report.path,
    icon: 'ReportManagementIcon',
    order: report.order,
    children: [],
  }))
