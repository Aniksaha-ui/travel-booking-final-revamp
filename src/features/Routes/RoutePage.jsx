import { Mail, MapPinned, Pencil, Plus, SlidersHorizontal, Trash2 } from 'lucide-react'
import AdminDataTable, {
  AdminTableButton,
  AdminTableSelectButton,
} from '../../components/ui/AdminDataTable'

const routes = [
  {
    id: 1,
    name: "Dhaka to Cox's Bazar",
    code: 'RT-001',
    origin: 'Dhaka',
    destination: "Cox's Bazar",
    distance: '390 km',
    status: 'active',
  },
  {
    id: 2,
    name: 'Dhaka to Sylhet',
    code: 'RT-002',
    origin: 'Dhaka',
    destination: 'Sylhet',
    distance: '245 km',
    status: 'active',
  },
  {
    id: 3,
    name: 'Chattogram to Bandarban',
    code: 'RT-003',
    origin: 'Chattogram',
    destination: 'Bandarban',
    distance: '92 km',
    status: 'active',
  },
  {
    id: 4,
    name: 'Dhaka to Rangamati',
    code: 'RT-004',
    origin: 'Dhaka',
    destination: 'Rangamati',
    distance: '318 km',
    status: 'inactive',
  },
  {
    id: 5,
    name: 'Khulna to Kuakata',
    code: 'RT-005',
    origin: 'Khulna',
    destination: 'Kuakata',
    distance: '278 km',
    status: 'active',
  },
]

const routeColumns = [
  {
    id: 'name',
    label: 'Name',
    width: '31%',
    render: (route) => (
      <div className="routes-table__name">
        <span className="routes-table__avatar">{route.name.charAt(0)}</span>
        <span className="routes-table__name-text">{route.name}</span>
      </div>
    ),
  },
  {
    id: 'code',
    label: 'Route Code',
    width: '15%',
    className: 'routes-table__code',
    render: (route) => route.code,
  },
  {
    id: 'origin',
    label: 'Origin',
    width: '16%',
    render: (route) => route.origin,
  },
  {
    id: 'destination',
    label: 'Destination',
    width: '16%',
    render: (route) => route.destination,
  },
  {
    id: 'distance',
    label: 'Distance',
    width: '10%',
    className: 'routes-table__muted',
    render: (route) => route.distance,
  },
  {
    id: 'status',
    label: 'Status',
    width: '7%',
    align: 'center',
    className: 'routes-table__status',
    render: (route) => <StatusPill status={route.status} />,
  },
]

function StatusPill({ status }) {
  return <span className={`routes-status routes-status--${status}`}>{status}</span>
}

function RouteActions({ route }) {
  return (
    <div className="routes-table__actions">
      <button type="button" className="routes-icon-button" aria-label={`Edit ${route.name}`}>
        <Pencil size={15} />
      </button>
      <button type="button" className="routes-icon-button" aria-label={`Delete ${route.name}`}>
        <Trash2 size={15} />
      </button>
    </div>
  )
}

export default function RoutePage() {
  return (
    <main className="routes-page">
      <div className="routes-page__inner">
        <header className="routes-page__header">
          <div className="routes-page__title">
            <MapPinned size={20} color="#4f83ff" />
            <h1>Routes</h1>
          </div>
          <p className="routes-page__subtitle">Manage travel routes, route codes, and availability.</p>
        </header>

        <AdminDataTable
          columns={routeColumns}
          data={routes}
          searchPlaceholder="Search by route, code, city"
          filters={
            <>
              <AdminTableSelectButton>Status</AdminTableSelectButton>
              <AdminTableSelectButton>Origin</AdminTableSelectButton>
              <AdminTableSelectButton>Destination</AdminTableSelectButton>
              <AdminTableButton>
                <SlidersHorizontal size={14} />
                Filters
              </AdminTableButton>
            </>
          }
          actions={
            <>
              <AdminTableButton variant="blue">
                <Mail size={14} />
                Invite
              </AdminTableButton>
              <button type="button" className="routes-new-button">
                <Plus size={15} />
                New Route
              </button>
            </>
          }
          renderRowActions={(route) => <RouteActions route={route} />}
          resultLabel={`Showing ${routes.length} result's`}
        />
      </div>
    </main>
  )
}
