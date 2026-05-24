export const API_URLS = {
  auth: {
    login: "/login",
  },
  admin: {
    menu: "/admin/menu",
  },
  dashboard: {
    overview: "/admin/dashboard",
    currentMonthTripSales: "/admin/current-month-trip-sales-report",
    packageProfitMargin: "/admin/package-profit-margin",
  },
  reports: {
    dailyBalance: "/admin/monthlyDailyBalanceReport",
    dailyBalanceHistory: "/admin/monthly-daily-balance-reports",
    monthRunningBalance: "/admin/monthRunningBalance",
  },
  tickets: {
    list: "/admin/tickets",
    update: (ticketId) => `/admin/tickets/update/${ticketId}`,
  },
  refunds: {
    list: "/admin/refund",
    disburse: "/admin/refund/disburse",
  },
  resources: {
    guideDropdown: "/admin/guide/dropdown",
    packageCreate: "/admin/packages/create",
    packageDetails: (packageId) => `/packages/${packageId}`,
    packages: "/admin/packages",
    routes: "/admin/routes",
    routeDropdown: "/admin/routes/dropdown",
    vehicles: "/admin/vehicles",
    vehicleDropdown: "/admin/vehicles/dropdown",
    seats: "/admin/seat",
    trips: "/admin/trip",
    tripDropdown: "/admin/trip/dropdown",
    tripSingle: "/admin/single/trip",
    tripSummary: "/admin/tripsummery",
    tripUsers: "/admin/tripwiseBookingUsers",
    tripUpdate: (tripId) => `/admin/trip/update/${tripId}`,
  },
};
