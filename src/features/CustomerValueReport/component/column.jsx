export const customerValueColumns = [
  { id: 'serial', label: 'SL', width: '7%', className: 'routes-table__muted' },
  {
    id: 'customerName',
    label: 'Customer Name',
    width: '25%',
    render: (item) => (
      <div className="routes-table__name">
        <span className="routes-table__avatar">{item.customerInitials}</span>
        <span className="routes-table__name-text">{item.customerName}</span>
      </div>
    ),
  },
  { id: 'totalTripBookingsLabel', label: 'Total Trips Booking', width: '14%' },
  { id: 'totalPackageBookingsLabel', label: 'Total Package Booking', width: '16%' },
  { id: 'totalPaidLabel', label: 'Total Paid', width: '14%' },
  { id: 'totalRefundedLabel', label: 'Total Refunded', width: '14%', className: 'routes-table__muted' },
  {
    id: 'netSpentLabel',
    label: 'Total Net Amount Spent',
    width: '18%',
    render: (item) => <span className="font-bold text-emerald-300">{item.netSpentLabel}</span>,
  },
]

