import { HighCancellationStatusBadge } from './HighCancellationStatusBadge.jsx'

export const highCancellationPackagesColumns = [
  {
    id: 'package',
    label: 'Package Name',
    render: (item) => <span className="font-semibold text-white">{item.packageName}</span>,
    width: '280px',
  },
  {
    accessor: 'totalBookingsLabel',
    id: 'totalBookings',
    label: 'Total Bookings',
    width: '150px',
  },
  {
    id: 'cancellations',
    label: 'Cancellations',
    render: (item) => <span className="font-bold text-rose-200">{item.cancelledCountLabel}</span>,
    width: '150px',
  },
  {
    id: 'cancellationRate',
    label: 'Cancellation Rate',
    render: (item) => (
      <div className="cancellation-rate-cell">
        <div className="cancellation-rate">
          <div className={`cancellation-rate__fill is-${item.severity}`} style={{ width: item.progressWidth }} />
        </div>
        <span>{item.cancellationRateLabel}</span>
      </div>
    ),
    sortable: false,
    width: '220px',
  },
  {
    id: 'status',
    label: 'Risk',
    render: (item) => <HighCancellationStatusBadge label={item.severityLabel} severity={item.severity} />,
    sortable: false,
    width: '130px',
  },
]
