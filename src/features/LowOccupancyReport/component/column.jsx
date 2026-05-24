import { LowOccupancyStatusBadge } from './LowOccupancyStatusBadge.jsx'

export const lowOccupancyColumns = [
  {
    id: 'trip',
    label: 'Trip',
    render: (item) => (
      <div>
        <div className="font-semibold text-white">{item.tripName}</div>
        <div className="mt-1 text-xs text-[#8fa0bd]">{item.departureDateLabel}</div>
      </div>
    ),
    width: '240px',
  },
  {
    accessor: 'totalSeatsLabel',
    id: 'capacity',
    label: 'Capacity',
    width: '110px',
  },
  {
    accessor: 'bookedSeatsLabel',
    id: 'booked',
    label: 'Booked',
    width: '100px',
  },
  {
    accessor: 'openSeatsLabel',
    id: 'openSeats',
    label: 'Open Seats',
    width: '120px',
  },
  {
    id: 'occupancy',
    label: 'Occupancy',
    render: (item) => (
      <div className="occupancy-progress-cell">
        <div className="occupancy-progress">
          <div className={`occupancy-progress__fill is-${item.severity}`} style={{ width: item.progressWidth }} />
        </div>
        <span>{item.occupancyRateLabel}</span>
      </div>
    ),
    sortable: false,
    width: '180px',
  },
  {
    id: 'status',
    label: 'Severity',
    render: (item) => <LowOccupancyStatusBadge label={item.severityLabel} severity={item.severity} />,
    sortable: false,
    width: '120px',
  },
]
