import { VehicleTrackingStatusBadge } from './VehicleTrackingStatusBadge.jsx'

export const vehicleTrackingReportColumns = [
  {
    accessor: 'serial',
    id: 'serial',
    label: 'SL',
    width: '72px',
  },
  {
    id: 'trip',
    label: 'Trip',
    render: (item) => (
      <div>
        <div className="font-semibold text-white">{item.tripName}</div>
        <div className="mt-1 text-xs text-[#8fa0bd]">{item.periodLabel}</div>
      </div>
    ),
    width: '220px',
  },
  {
    id: 'vehicle',
    label: 'Vehicle',
    render: (item) => (
      <div>
        <div className="font-semibold text-white">{item.vehicleName}</div>
        <div className="mt-1 text-xs text-[#8fa0bd]">{item.durationLabel}</div>
      </div>
    ),
    width: '200px',
  },
  {
    accessor: 'departureScheduleLabel',
    id: 'departure',
    label: 'Travel Start',
    width: '180px',
  },
  {
    accessor: 'arrivalScheduleLabel',
    id: 'arrival',
    label: 'Travel End',
    width: '180px',
  },
  {
    id: 'status',
    label: 'Status',
    render: (item) => <VehicleTrackingStatusBadge status={item.status} label={item.statusLabel} />,
    sortable: false,
    width: '120px',
  },
]
