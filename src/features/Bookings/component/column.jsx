export const bookingsColumns = [
  {
    accessor: 'bookingIdLabel',
    id: 'bookingId',
    label: 'Booking ID',
    width: '130px',
  },
  {
    id: 'userName',
    label: 'Customer',
    render: (item) => <span className="font-semibold text-white">{item.userName}</span>,
    width: '190px',
  },
  {
    id: 'tripName',
    label: 'Trip Name',
    render: (item) => <span className="text-[#d5def0]">{item.tripNameLabel}</span>,
    width: '220px',
  },
  {
    id: 'bookingType',
    label: 'Booking Type',
    render: (item) => (
      <div className="flex items-center gap-3">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.typeColor }} />
        <span className="font-semibold text-white">{item.bookingTypeLabel}</span>
      </div>
    ),
    width: '180px',
  },
  {
    id: 'productName',
    label: 'Package / Hotel',
    render: (item) => <span className="text-[#c5d9f7]">{item.productNameLabel}</span>,
    width: '220px',
  },
  {
    id: 'paymentStatus',
    label: 'Payment Status',
    render: (item) => (
      <span
        className={`inline-flex min-w-[86px] justify-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${item.paymentStatusToneClassName}`}
      >
        {item.paymentStatusLabel}
      </span>
    ),
    width: '160px',
  },
  {
    accessor: 'seatCountLabel',
    id: 'seatCount',
    label: 'Seats',
    width: '120px',
  },
  {
    accessor: 'bookingDateLabel',
    id: 'bookingDate',
    label: 'Booking Date',
    width: '150px',
  },
]
