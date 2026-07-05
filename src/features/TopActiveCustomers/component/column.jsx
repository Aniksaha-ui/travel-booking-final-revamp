export const topActiveCustomersColumns = [
  { id: 'serial', label: 'SL', width: '7%', className: 'routes-table__muted' },
  {
    id: 'customerName',
    label: 'Customer',
    width: '26%',
    render: (item) => (
      <div className="routes-table__name">
        <span className="routes-table__avatar">{item.customerInitials}</span>
        <span className="routes-table__name-text">
          <span className="block font-semibold text-white">{item.customerName}</span>
          <span className="block text-xs font-medium text-[#8fa0bd]">{item.customerEmail}</span>
        </span>
      </div>
    ),
  },
  {
    id: 'activityScoreLabel',
    label: 'Activity Score',
    width: '15%',
    render: (item) => <span className="font-bold text-emerald-300">{item.activityScoreLabel}</span>,
  },
  { id: 'bookingsCountLabel', label: 'Bookings', width: '13%' },
  { id: 'hotelBookingsCountLabel', label: 'Hotel Bookings', width: '15%' },
  { id: 'packageBookingsCountLabel', label: 'Package Bookings', width: '16%' },
  { id: 'visaApplicationsCountLabel', label: 'Visa Applications', width: '16%' },
]
