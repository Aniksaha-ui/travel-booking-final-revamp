import { RefreshCcw, Users2 } from 'lucide-react'
import { useState } from 'react'
import AdminDataTable, { AdminTableButton } from '../../../components/ui/AdminDataTable'
import { useToast } from '../../../components/common/Toaster'
import { ReportHubBackLink } from '../../Reports/component/ReportHubBackLink.jsx'
import { TripPerformanceUsersDrawer } from '../component/TripPerformanceUsersDrawer.jsx'
import { fetchTripUsers } from '../../Trips/service/tripsService'
import { tripPerformanceColumns } from '../component/column.jsx'
import { TripPerformanceOverview } from '../component/TripPerformanceOverview.jsx'
import { TRIP_PERFORMANCE_COPY } from '../constants/tripPerformance.constants'
import useTripPerformanceReport from '../hooks/useTripPerformanceReport'

const emptyUsersState = {
  loading: false,
  open: false,
  trip: null,
  users: [],
}

export default function TripPerformancePage() {
  const toast = useToast()
  const { data, error, isLoading, page, refresh, search, setPage, setSearch } = useTripPerformanceReport()
  const { pagination, rows, summary } = data
  const [usersState, setUsersState] = useState(emptyUsersState)

  const handleOpenUsers = async (trip) => {
    setUsersState({
      loading: true,
      open: true,
      trip: {
        trip_id: trip.tripId,
        trip_name: trip.tripName,
      },
      users: [],
    })

    try {
      const users = await fetchTripUsers(trip.tripId)
      setUsersState({
        loading: false,
        open: true,
        trip: {
          trip_id: trip.tripId,
          trip_name: trip.tripName,
        },
        users,
      })
    } catch (loadError) {
      toast.error(loadError.message || 'Unable to load trip users.')
      setUsersState(emptyUsersState)
    }
  }

  return (
    <main className="routes-page">
      <div className="routes-page__inner">
        <ReportHubBackLink />
        <header className="routes-page__header">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="routes-page__title">
                <Users2 size={20} color="#4f83ff" />
                <h1>{TRIP_PERFORMANCE_COPY.title}</h1>
              </div>
              <p className="routes-page__subtitle">{TRIP_PERFORMANCE_COPY.subtitle}</p>
            </div>

            <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#332d30] bg-[#171314] px-4 text-sm font-semibold text-[#c5d9f7]">
              <Users2 size={16} />
              <span>{summary.totalRevenueLabel} gross revenue</span>
            </div>
          </div>
        </header>

        <TripPerformanceOverview isLoading={isLoading} rows={rows} />
        {error ? <p className="month-balance-alert">{error}</p> : null}

        <AdminDataTable
          actions={
            <AdminTableButton className={isLoading ? 'opacity-60' : ''} disabled={isLoading} onClick={refresh}>
              <RefreshCcw size={14} />
              Refresh
            </AdminTableButton>
          }
          columns={tripPerformanceColumns}
          data={rows}
          emptyMessage="No trip performance records found."
          isLoading={isLoading}
          onPageChange={setPage}
          onSearchChange={(value) => {
            if (page !== 1) {
              setPage(1)
            }

            setSearch(value)
          }}
          pagination={pagination}
          renderRowActions={(trip) => (
            <div className="routes-table__actions">
              <button
                type="button"
                className="routes-icon-button"
                aria-label={`View booked users for ${trip.tripName}`}
                onClick={() => handleOpenUsers(trip)}
              >
                <Users2 size={15} />
              </button>
            </div>
          )}
          resultLabel={
            pagination
              ? `Showing ${pagination.from}-${pagination.to} of ${pagination.total} trips`
              : `Showing ${rows.length} trips`
          }
          rowActionsWidth="64px"
          search={search}
          searchPlaceholder={TRIP_PERFORMANCE_COPY.searchPlaceholder}
        />
      </div>

      {usersState.open ? (
        <TripPerformanceUsersDrawer
          loading={usersState.loading}
          onClose={() => setUsersState(emptyUsersState)}
          trip={usersState.trip}
          users={usersState.users}
        />
      ) : null}
    </main>
  )
}
