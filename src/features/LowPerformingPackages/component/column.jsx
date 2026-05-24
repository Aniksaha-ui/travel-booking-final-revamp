import { LowPerformingPackageStatusBadge } from './LowPerformingPackageStatusBadge.jsx'

export const lowPerformingPackagesColumns = [
  {
    accessor: 'idLabel',
    id: 'id',
    label: 'ID',
    width: '100px',
  },
  {
    id: 'package',
    label: 'Package Name',
    render: (item) => <span className="font-semibold text-white">{item.packageName}</span>,
    width: '280px',
  },
  {
    id: 'recentBookings',
    label: 'Recent Bookings',
    render: (item) => (
      <span className="inline-flex min-w-12 items-center justify-center rounded-full border border-rose-500/25 bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-100">
        {item.recentBookingCountLabel}
      </span>
    ),
    sortable: false,
    width: '160px',
  },
  {
    id: 'status',
    label: 'Status',
    render: (item) => <LowPerformingPackageStatusBadge label={item.statusLabel} />,
    sortable: false,
    width: '170px',
  },
]
