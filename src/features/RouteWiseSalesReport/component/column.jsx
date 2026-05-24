export const routeWiseSalesColumns = [
  {
    id: 'routeName',
    label: 'Route Name',
    render: (item) => <span className="font-semibold text-white">{item.routeName}</span>,
    width: '260px',
  },
  {
    id: 'totalBookings',
    label: 'Total Bookings',
    render: (item) => <span className="text-[#c5d9f7]">{item.totalBookingsLabel}</span>,
    width: '160px',
  },
  {
    id: 'totalRevenue',
    label: 'Total Revenue',
    render: (item) => <span className="font-bold text-emerald-200">{item.totalRevenueLabel}</span>,
    width: '180px',
  },
  {
    id: 'averageRevenue',
    label: 'Avg. Revenue / Booking',
    render: (item) => <span className="text-amber-200">{item.averageRevenueLabel}</span>,
    width: '200px',
  },
]
