import { BusFront, Eye, RefreshCcw } from 'lucide-react'
import { useState } from 'react'
import AdminDataTable, { AdminTableButton } from '../../../components/ui/AdminDataTable'
import { useToast } from '../../../components/common/Toaster'
import { VehicleSeatLayoutModal } from '../component/VehicleSeatLayoutModal.jsx'
import { VehicleWiseSeatReportOverview } from '../component/VehicleWiseSeatReportOverview.jsx'
import { vehicleWiseSeatReportColumns } from '../component/column.jsx'
import { VEHICLE_WISE_SEAT_REPORT_COPY } from '../constants/vehicleWiseSeatReport.constants'
import useVehicleWiseSeatReport from '../hooks/useVehicleWiseSeatReport'

const emptySeatLayoutState = {
  isLoading: false,
  open: false,
  seats: [],
  vehicle: null,
}

export default function VehicleWiseSeatReportPage() {
  const toast = useToast()
  const { data, error, fetchVehicleSeatLayout, isLoading, page, refresh, search, setPage, setSearch } =
    useVehicleWiseSeatReport()
  const { pagination, rows, summary } = data
  const [seatLayoutState, setSeatLayoutState] = useState(emptySeatLayoutState)

  const handleOpenSeatLayout = async (vehicle) => {
    setSeatLayoutState({
      isLoading: true,
      open: true,
      seats: [],
      vehicle,
    })

    try {
      const response = await fetchVehicleSeatLayout(vehicle.vehicleId)
      setSeatLayoutState({
        isLoading: false,
        open: true,
        seats: response.seats,
        vehicle,
      })
    } catch (loadError) {
      toast.error(loadError.message || 'Unable to load vehicle seat layout.')
      setSeatLayoutState(emptySeatLayoutState)
    }
  }

  return (
    <main className="routes-page">
      <div className="routes-page__inner">
        <header className="routes-page__header">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="routes-page__title">
                <BusFront size={20} color="#4f83ff" />
                <h1>{VEHICLE_WISE_SEAT_REPORT_COPY.title}</h1>
              </div>
              <p className="routes-page__subtitle">{VEHICLE_WISE_SEAT_REPORT_COPY.subtitle}</p>
            </div>

            <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#332d30] bg-[#171314] px-4 text-sm font-semibold text-[#c5d9f7]">
              <BusFront size={16} />
              <span>{summary.totalSeatsLabel} on this page</span>
            </div>
          </div>
        </header>

        <VehicleWiseSeatReportOverview isLoading={isLoading} rows={rows} />
        {error ? <p className="month-balance-alert">{error}</p> : null}

        <AdminDataTable
          actions={
            <AdminTableButton className={isLoading ? 'opacity-60' : ''} disabled={isLoading} onClick={refresh}>
              <RefreshCcw size={14} />
              Refresh
            </AdminTableButton>
          }
          columns={vehicleWiseSeatReportColumns}
          data={rows}
          emptyMessage="No vehicle seat report records found."
          isLoading={isLoading}
          onPageChange={setPage}
          onSearchChange={(value) => {
            if (page !== 1) {
              setPage(1)
            }

            setSearch(value)
          }}
          pagination={pagination}
          renderRowActions={(vehicle) => (
            <div className="routes-table__actions">
              <button
                type="button"
                className="routes-icon-button"
                aria-label={`View seat layout for ${vehicle.vehicleName}`}
                onClick={() => handleOpenSeatLayout(vehicle)}
              >
                <Eye size={15} />
              </button>
            </div>
          )}
          resultLabel={
            pagination
              ? `Showing ${pagination.from}-${pagination.to} of ${pagination.total} vehicles`
              : `Showing ${rows.length} vehicles`
          }
          rowActionsWidth="64px"
          search={search}
          searchPlaceholder={VEHICLE_WISE_SEAT_REPORT_COPY.searchPlaceholder}
        />
      </div>

      {seatLayoutState.open ? (
        <VehicleSeatLayoutModal
          isLoading={seatLayoutState.isLoading}
          onClose={() => setSeatLayoutState(emptySeatLayoutState)}
          seats={seatLayoutState.seats}
          vehicle={seatLayoutState.vehicle}
          key={seatLayoutState.vehicle?.vehicleId ?? 'vehicle-seat-layout'}
        />
      ) : null}
    </main>
  )
}
