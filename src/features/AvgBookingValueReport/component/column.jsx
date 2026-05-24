export const avgBookingValueColumns = [
  {
    id: 'bookingType',
    label: 'Booking Type',
    render: (item) => (
      <div className="flex items-center gap-3">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
        <span className="font-semibold text-white">{item.bookingTypeLabel}</span>
      </div>
    ),
    width: '260px',
  },
  {
    id: 'averageValue',
    label: 'Average Transaction Value',
    render: (item) => <span className="font-bold text-blue-200">{item.averageValueLabel}</span>,
    width: '240px',
  },
]
