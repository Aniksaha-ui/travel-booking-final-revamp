export const bookingSummaryColumns = [
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
    accessor: 'totalBookingLabel',
    id: 'totalBooking',
    label: 'Total Booking',
    width: '160px',
  },
  {
    id: 'ratio',
    label: 'Share',
    render: (item) => (
      <div className="booking-summary-share">
        <div className="booking-summary-share__track">
          <div className="booking-summary-share__fill" style={{ backgroundColor: item.color, width: item.ratioLabel }} />
        </div>
        <span>{item.ratioLabel}</span>
      </div>
    ),
    sortable: false,
    width: '220px',
  },
]
