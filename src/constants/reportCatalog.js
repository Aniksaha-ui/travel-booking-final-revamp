import { APP_ROUTES } from './routes'

export const REPORT_CATALOG = [
  {
    category: 'Account Reports',
    key: 'account-balance',
    title: 'Account Balance',
    description: 'Review live balances and account positions in one place.',
    path: APP_ROUTES.accountBalance,
    order: 1000,
  },
  {
    category: 'Account Reports',
    key: 'account-history',
    title: 'Account History',
    description: 'Track account activity and balance movement over time.',
    path: APP_ROUTES.accountHistory,
    order: 1001,
  },
  {
    category: 'Account Reports',
    key: 'financial-report',
    title: 'Financial Report',
    description: 'Inspect revenue, expenses, and overall financial performance.',
    path: APP_ROUTES.financialReport,
    order: 1002,
  },
  {
    category: 'Customer Reports',
    key: 'customer-value-report',
    title: 'Customer Value Report',
    description: 'Measure repeat value and contribution across customers.',
    path: APP_ROUTES.customerValueReport,
    order: 1003,
  },
  {
    category: 'Customer Reports',
    key: 'top-active-customers',
    title: 'Top Active Customers',
    description: 'Rank customers by total activity across bookings, hotels, packages, and visas.',
    path: APP_ROUTES.topActiveCustomers,
    order: 1004,
  },
  {
    category: 'Booking Reports',
    key: 'avg-booking-value-report',
    title: 'Average Booking Value',
    description: 'Monitor average ticket and booking value trends.',
    path: APP_ROUTES.avgBookingValueReport,
    order: 1005,
  },
  {
    category: 'Booking Reports',
    key: 'booking-summary-report',
    title: 'Booking Summary Report',
    description: 'Summarize booking volume, status, and totals quickly.',
    path: APP_ROUTES.bookingSummary,
    order: 1006,
  },
  {
    category: 'Account Reports',
    key: 'monthly-daily-balance',
    title: 'Monthly Daily Balance',
    description: 'Audit daily cash movement for the selected month.',
    path: APP_ROUTES.dailyBalance,
    order: 1007,
  },
  {
    category: 'Account Reports',
    key: 'monthly-running-balance',
    title: 'Monthly Running Balance',
    description: 'Follow month-to-date balance changes and rollups.',
    path: APP_ROUTES.monthRunningBalance,
    order: 1008,
  },
  {
    category: 'Sales Reports',
    key: 'overall-sales',
    title: 'Overall Sales',
    description: 'See total sales performance across the business.',
    path: APP_ROUTES.overallSales,
    order: 1009,
  },
  {
    category: 'Sales Reports',
    key: 'route-wise-sales',
    title: 'Route Wise Sales',
    description: 'Compare revenue and demand route by route.',
    path: APP_ROUTES.routeWiseSales,
    order: 1010,
  },
  {
    category: 'Booking Reports',
    key: 'ticket-status-analysis',
    title: 'Ticket Status Analysis',
    description: 'Break down ticket states, trends, and fulfillment progress.',
    path: APP_ROUTES.ticketStatusReport,
    order: 1011,
  },
  {
    category: 'Trip Reports',
    key: 'trip-performance',
    title: 'Trip Performance',
    description: 'Review occupancy, revenue, and outcomes by trip.',
    path: APP_ROUTES.tripPerformance,
    order: 1012,
  },
  {
    category: 'Trip Reports',
    key: 'low-occupancy-report',
    title: 'Low Occupancy Report',
    description: 'Spot trips that need attention because seats remain unsold.',
    path: APP_ROUTES.lowOccupancyReport,
    order: 1013,
  },
  {
    category: 'Package Reports',
    key: 'low-performing-packages',
    title: 'Low Performing Packages',
    description: 'Identify packages that are lagging on conversion or sales.',
    path: APP_ROUTES.lowPerformingPackages,
    order: 1014,
  },
  {
    category: 'Package Reports',
    key: 'high-cancellation-packages',
    title: 'High Cancellation Packages',
    description: 'Find packages with unusually high cancellation pressure.',
    path: APP_ROUTES.highCancellationPackages,
    order: 1015,
  },
  {
    category: 'Vehicle Reports',
    key: 'vehicle-tracking-report',
    title: 'Vehicle Tracking Report',
    description: 'Monitor route activity and movement from the vehicle side.',
    path: APP_ROUTES.vehicleTrackingReport,
    order: 1016,
  },
  {
    category: 'Vehicle Reports',
    key: 'vehicle-wise-seat-report',
    title: 'Vehicle Wise Seat Report',
    description: 'Inspect seat availability and allocation by vehicle.',
    path: APP_ROUTES.vehicleWiseSeatReport,
    order: 1017,
  },
]

export const REPORT_ROUTE_SET = new Set(REPORT_CATALOG.map((report) => report.path))

export const REPORT_CATALOG_BY_PATH = Object.fromEntries(
  REPORT_CATALOG.map((report) => [report.path, report]),
)

export const slugifyReportCategory = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

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
