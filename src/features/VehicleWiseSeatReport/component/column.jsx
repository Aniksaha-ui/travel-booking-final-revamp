export const vehicleWiseSeatReportColumns = [
  {
    accessor: 'serial',
    id: 'serial',
    label: 'SL',
    width: '72px',
  },
  {
    id: 'vehicle',
    label: 'Vehicle',
    render: (item) => (
      <div className="routes-table__name">
        <span className="routes-table__avatar">{item.vehicleName.charAt(0)}</span>
        <div>
          <div className="routes-table__name-text">{item.vehicleName}</div>
          <div className="mt-1 text-xs text-[#8fa0bd]">ID #{item.vehicleId ?? '-'}</div>
        </div>
      </div>
    ),
    width: '240px',
  },
  {
    id: 'vehicleType',
    label: 'Vehicle Type',
    render: (item) => <span className="vehicle-seat-report__type-badge">{item.vehicleType}</span>,
    width: '180px',
  },
  {
    id: 'seatCapacity',
    label: 'Seat Capacity',
    render: (item) => (
      <div>
        <div className="font-semibold text-white">{item.seatCapacityLabel}</div>
        <div className="mt-1 text-xs text-[#8fa0bd]">Registered seats</div>
      </div>
    ),
    width: '170px',
  },
]
