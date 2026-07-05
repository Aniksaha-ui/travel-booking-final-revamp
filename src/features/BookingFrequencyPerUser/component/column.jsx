export const bookingFrequencyColumns = [
  { id: 'serial', label: 'SL', width: '7%', className: 'routes-table__muted' },
  {
    id: 'customerName',
    label: 'Customer',
    width: '28%',
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
    id: 'bookingCountLabel',
    label: 'Booking Count',
    width: '15%',
    render: (item) => <span className="font-bold text-emerald-300">{item.bookingCountLabel}</span>,
  },
  { id: 'firstBookingLabel', label: 'First Booking', width: '17%' },
  { id: 'lastBookingLabel', label: 'Last Booking', width: '17%' },
  { id: 'activeDaysLabel', label: 'Active Days', width: '14%' },
]
