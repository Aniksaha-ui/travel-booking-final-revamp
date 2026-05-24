import { RefundStatusBadge } from './RefundStatusBadge.jsx'

export const refundColumns = [
  {
    accessor: 'serial',
    id: 'serial',
    label: 'SL',
    width: '72px',
  },
  {
    accessor: 'bookingDateLabel',
    id: 'bookingDate',
    label: 'Booking Date',
    width: '150px',
  },
  {
    id: 'trip',
    label: 'Trip',
    render: (refund) => (
      <div>
        <div className="font-semibold text-white">{refund.tripName}</div>
        <div className="mt-1 text-xs text-[#8fa0bd]">{refund.seatCountLabel}</div>
      </div>
    ),
    width: '230px',
  },
  {
    id: 'seats',
    label: 'Seats',
    render: (refund) => (
      <span className="font-mono text-xs text-[#9ed5ff]">{refund.seatIds}</span>
    ),
    width: '180px',
  },
  {
    id: 'reason',
    label: 'Refund Reason',
    render: (refund) => <span className="text-[#b4c5df]">{refund.reasonPreview}</span>,
    width: '320px',
  },
  {
    accessor: 'amountLabel',
    id: 'amount',
    label: 'Amount',
    width: '140px',
  },
  {
    id: 'status',
    label: 'Status',
    render: (refund) => <RefundStatusBadge label={refund.statusLabel} status={refund.status} />,
    sortable: false,
    width: '120px',
  },
]
