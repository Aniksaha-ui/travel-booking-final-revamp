import { Armchair, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { SeatLayout } from '../../Trips/component/SeatLayout'
import { VEHICLE_SEAT_STATUS_FILTERS } from '../constants/vehicleWiseSeatReport.constants'
import { buildVehicleSeatLayoutSummary } from '../utils/vehicleWiseSeatReportUtils'

export function VehicleSeatLayoutModal({ isLoading, onClose, seats, vehicle }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const fullSummary = useMemo(() => buildVehicleSeatLayoutSummary(seats), [seats])
  const visibleSeats = useMemo(
    () =>
      seats.filter((seat) => {
        const matchesSearch = seat.seat_number.toLowerCase().includes(search.trim().toLowerCase())

        if (!matchesSearch) {
          return false
        }

        if (statusFilter === 'available') {
          return seat.isAvailable
        }

        if (statusFilter === 'booked') {
          return !seat.isAvailable
        }

        return true
      }),
    [search, seats, statusFilter],
  )
  const filteredSummary = useMemo(() => buildVehicleSeatLayoutSummary(visibleSeats), [visibleSeats])

  return (
    <div className="crud-modal" role="dialog" aria-modal="true">
      <button type="button" className="crud-modal__backdrop" aria-label="Close seat layout" onClick={onClose} />
      <section className="crud-modal__panel vehicle-seat-modal__panel">
        <header className="crud-modal__header">
          <div>
            <p className="crud-modal__eyebrow">Seat layout</p>
            <h2>{vehicle?.vehicleName ?? 'Vehicle Seat Layout'}</h2>
            <p className="mt-2 text-sm text-[#8fa0bd]">{vehicle?.vehicleType ?? 'Unspecified vehicle type'}</p>
          </div>
          <button type="button" className="vehicle-seat-modal__close" onClick={onClose}>
            <X size={16} />
            Close
          </button>
        </header>

        <div className="vehicle-seat-modal__body">
          {isLoading ? (
            <div className="trip-summary-empty">Loading vehicle seat layout...</div>
          ) : (
            <>
              <section className="vehicle-seat-modal__stats">
                <article className="vehicle-seat-modal__stat">
                  <p>Total Seats</p>
                  <strong>{fullSummary.totalSeatsLabel}</strong>
                </article>
                <article className="vehicle-seat-modal__stat">
                  <p>Available</p>
                  <strong className="text-emerald-300">{fullSummary.availableSeatsLabel}</strong>
                </article>
                <article className="vehicle-seat-modal__stat">
                  <p>Booked</p>
                  <strong className="text-amber-300">{fullSummary.bookedSeatsLabel}</strong>
                </article>
                <article className="vehicle-seat-modal__stat">
                  <p>Availability</p>
                  <strong>{fullSummary.availabilityRatioLabel}</strong>
                </article>
              </section>

              <section className="vehicle-seat-modal__content">
                <div className="vehicle-seat-modal__main">
                  <div className="vehicle-seat-modal__toolbar">
                    <label className="vehicle-seat-modal__search">
                      <Search size={15} />
                      <input
                        type="search"
                        placeholder="Filter by seat number"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                      />
                    </label>

                    <div className="vehicle-seat-modal__filters">
                      {VEHICLE_SEAT_STATUS_FILTERS.map((filter) => (
                        <button
                          key={filter.key}
                          type="button"
                          className={`refund-filter-button ${statusFilter === filter.key ? 'is-active' : ''}`}
                          onClick={() => setStatusFilter(filter.key)}
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="vehicle-seat-modal__layout-card">
                    <div className="vehicle-seat-modal__layout-header">
                      <div className="flex items-center gap-2 text-sm font-semibold text-white">
                        <Armchair size={16} className="text-blue-400" />
                        <span>Seat Layout</span>
                      </div>
                      <span className="text-xs font-semibold text-[#8fa0bd]">
                        Showing {filteredSummary.totalSeats} of {fullSummary.totalSeats}
                      </span>
                    </div>
                    <SeatLayout seats={visibleSeats} />
                  </div>
                </div>

                <aside className="vehicle-seat-modal__sidebar">
                  <article className="vehicle-seat-modal__sidebar-card">
                    <p className="vehicle-seat-modal__sidebar-eyebrow">Seat Classes</p>
                    <div className="vehicle-seat-modal__distribution">
                      {fullSummary.classDistribution.length ? (
                        fullSummary.classDistribution.map((item) => (
                          <div key={item.label} className="vehicle-seat-modal__distribution-row">
                            <span>{item.label}</span>
                            <strong>{item.count}</strong>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-[#8fa0bd]">No seat class data found.</p>
                      )}
                    </div>
                  </article>

                  <article className="vehicle-seat-modal__sidebar-card">
                    <p className="vehicle-seat-modal__sidebar-eyebrow">Seat Types</p>
                    <div className="vehicle-seat-modal__distribution">
                      {fullSummary.typeDistribution.length ? (
                        fullSummary.typeDistribution.map((item) => (
                          <div key={item.label} className="vehicle-seat-modal__distribution-row">
                            <span>{item.label}</span>
                            <strong>{item.count}</strong>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-[#8fa0bd]">No seat type data found.</p>
                      )}
                    </div>
                  </article>
                </aside>
              </section>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
