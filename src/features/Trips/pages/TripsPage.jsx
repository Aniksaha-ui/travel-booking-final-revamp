import { CheckCircle2, ClipboardList, Route, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import ResourceCrudPage from '../../../components/crud/ResourceCrudPage'
import { useToast } from '../../../components/common/Toaster'
import { fetchRouteDropdown } from '../../Routes/services/routesService'
import { fetchVehicleDropdown } from '../../Vehicles/services/vehiclesService'
import { TRIPS_PAGE_COPY, toTripFormData, tripColumns, tripFields } from '../constants/trips.constants.jsx'
import useTrips from '../hooks/useTrips'

function TripSummaryTable({ rows }) {
  return (
    <table className="trip-summary-table">
      <thead>
        <tr>
          <th>Route Name</th>
          <th>Total Seat</th>
          <th>Available Seat</th>
          <th>Booked Seat</th>
          <th>Revenue</th>
        </tr>
      </thead>
      <tbody>
        {rows.length ? (
          rows.map((row, index) => (
            <tr key={`${row.route_name}-${index}`}>
              <td>{row.route_name}</td>
              <td>{row.total_seats}</td>
              <td>{row.available_seats}</td>
              <td>{row.booked_seats}</td>
              <td>BDT {row.revenue ?? 0}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5}>No trip summary is available.</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

function SeatLayout({ seats }) {
  const groups = seats.reduce((groupedSeats, seat) => {
    const key = seat.seat_class ?? 'uncategorized'
    groupedSeats[key] = groupedSeats[key] ?? []
    groupedSeats[key].push(seat)
    return groupedSeats
  }, {})

  if (!seats.length) {
    return <div className="trip-summary-empty">No seat layout is available.</div>
  }

  return (
    <div className="trip-seat-layout">
      {Object.entries(groups).map(([seatClass, groupSeats]) => (
        <section key={seatClass}>
          <h3>{seatClass.replaceAll('_', ' ')} Class</h3>
          <div className="trip-seat-layout__grid">
            {groupSeats.map((seat) => {
              const available = Number(seat.is_available) === 1

              return (
                <article key={seat.id ?? `${seat.seat_number}-${seat.seat_type}`} className={available ? 'is-available' : 'is-booked'}>
                  <strong>{seat.seat_number}</strong>
                  <span>{seat.seat_type}</span>
                </article>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}

function TripSummaryModal({ data, loading, onClose, trip }) {
  return (
    <div className="crud-modal" role="dialog" aria-modal="true">
      <button type="button" className="crud-modal__backdrop" aria-label="Close summary" onClick={onClose} />
      <section className="crud-modal__panel trip-summary-modal">
        <header className="crud-modal__header">
          <div>
            <p className="crud-modal__eyebrow">Booking summary</p>
            <h2>{trip?.trip_name ?? 'Trip Summary'}</h2>
          </div>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </header>

        <div className="trip-summary-modal__body">
          {loading ? (
            <div className="trip-summary-empty">Loading trip summary...</div>
          ) : (
            <>
              <TripSummaryTable rows={data.tripSummaries ?? []} />
              <SeatLayout seats={data.seat_layout ?? []} />
            </>
          )}
        </div>
      </section>
    </div>
  )
}

const calculateBookingTotal = (seatIds, price) => {
  if (!seatIds) {
    return 0
  }

  const seatCount = String(seatIds)
    .split(',')
    .filter((seatId) => seatId.trim() !== '').length

  return seatCount * (Number(price) || 0)
}

function TripUsersModal({ loading, onClose, trip, users }) {
  const totalRevenue = users.reduce((sum, user) => sum + calculateBookingTotal(user.seat_ids, user.price), 0)

  return (
    <div className="crud-modal" role="dialog" aria-modal="true">
      <button type="button" className="crud-modal__backdrop" aria-label="Close users" onClick={onClose} />
      <section className="crud-modal__panel trip-summary-modal">
        <header className="crud-modal__header">
          <div>
            <p className="crud-modal__eyebrow">Booked users</p>
            <h2>{trip?.trip_name ?? 'Trip Users'}</h2>
          </div>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </header>

        <div className="trip-summary-modal__body">
          {loading ? (
            <div className="trip-summary-empty">Loading trip users...</div>
          ) : (
            <>
              <div className="trip-users-summary">
                <article>
                  <span>Total users</span>
                  <strong>{users.length}</strong>
                </article>
                <article>
                  <span>Total booking value</span>
                  <strong>BDT {new Intl.NumberFormat('en-US').format(totalRevenue)}</strong>
                </article>
              </div>

              <table className="trip-summary-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Seats</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length ? (
                    users.map((user, index) => {
                      const rowTotal = calculateBookingTotal(user.seat_ids, user.price)

                      return (
                        <tr key={user.booking_id ?? user.id ?? index}>
                          <td>{user.user_name ?? user.name ?? 'Guest User'}</td>
                          <td>{user.user_email ?? user.email ?? '-'}</td>
                          <td>{user.seat_ids ?? '-'}</td>
                          <td>BDT {user.price ?? 0}</td>
                          <td>BDT {new Intl.NumberFormat('en-US').format(rowTotal)}</td>
                          <td>{user.booking_status ?? user.status ?? '-'}</td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={6}>No users found for this trip.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

const formatDateInputValue = (value) => {
  if (!value) {
    return ''
  }

  const dateParts = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/)

  if (dateParts) {
    return `${dateParts[1]}-${dateParts[2]}-${dateParts[3]}`
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const formatTimeInputValue = (value) => {
  if (!value) {
    return ''
  }

  const timeValue = String(value).trim()
  const twelveHourMatch = timeValue.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i)

  if (twelveHourMatch) {
    const [, hourValue, minute, period] = twelveHourMatch
    let hour = Number(hourValue)

    if (period.toUpperCase() === 'AM' && hour === 12) {
      hour = 0
    } else if (period.toUpperCase() === 'PM' && hour !== 12) {
      hour += 12
    }

    return `${String(hour).padStart(2, '0')}:${minute}`
  }

  const twentyFourHourMatch = timeValue.match(/^(\d{1,2}):(\d{2})/)

  if (twentyFourHourMatch) {
    return `${twentyFourHourMatch[1].padStart(2, '0')}:${twentyFourHourMatch[2]}`
  }

  return ''
}

export default function TripsPage() {
  const toast = useToast()
  const apiState = useTrips()
  const [formOptions, setFormOptions] = useState({
    routes: [],
    vehicles: [],
  })
  const [summaryState, setSummaryState] = useState({
    data: { tripSummaries: [], seat_layout: [] },
    loading: false,
    open: false,
    trip: null,
  })
  const [usersState, setUsersState] = useState({
    loading: false,
    open: false,
    trip: null,
    users: [],
  })

  useEffect(() => {
    let mounted = true

    const loadFormOptions = async () => {
      try {
        const [vehicles, routes] = await Promise.all([fetchVehicleDropdown(), fetchRouteDropdown()])

        if (!mounted) {
          return
        }

        setFormOptions({
          routes,
          vehicles,
        })
      } catch (error) {
        toast.error(error.message || 'Unable to load trip form dropdowns.')
      }
    }

    loadFormOptions()

    return () => {
      mounted = false
    }
  }, [toast])

  const resolvedTripFields = useMemo(
    () =>
      tripFields.map((field) => {
        if (field.name === 'vehicle_id') {
          return {
            ...field,
            options: formOptions.vehicles.map((vehicle) => ({
              value: vehicle.id,
              label: vehicle.vehicle_name,
            })),
          }
        }

        if (field.name === 'route_id') {
          return {
            ...field,
            options: formOptions.routes.map((route) => ({
              value: route.id,
              label: route.route_name,
            })),
          }
        }

        return field
      }),
    [formOptions.routes, formOptions.vehicles],
  )

  const resolveOptionId = (items, id, name, nameKey) => {
    if (id !== undefined && id !== null && id !== '') {
      return String(id)
    }

    const matchedItem = items.find((item) => item[nameKey] === name)
    return matchedItem?.id ? String(matchedItem.id) : ''
  }

  const loadEditingTrip = async (trip) => {
    const tripData = await apiState.fetchTripById(trip.id)

    return {
      ...trip,
      ...tripData,
      vehicle_id: resolveOptionId(formOptions.vehicles, tripData.vehicle_id ?? trip.vehicle_id, tripData.vehicle_name ?? trip.vehicle_name, 'vehicle_name'),
      route_id: resolveOptionId(formOptions.routes, tripData.route_id ?? trip.route_id, tripData.route_name ?? trip.route_name, 'route_name'),
      departure_time: formatDateInputValue(tripData.departure_time ?? trip.departure_time),
      arrival_time: formatDateInputValue(tripData.arrival_time ?? trip.arrival_time),
      departure_at: formatTimeInputValue(tripData.departure_at ?? trip.departure_at),
      arrival_at: formatTimeInputValue(tripData.arrival_at ?? trip.arrival_at),
      is_active: String(tripData.is_active ?? trip.is_active ?? '1'),
    }
  }

  const handleOpenSummary = async (trip) => {
    setSummaryState({
      data: { tripSummaries: [], seat_layout: [] },
      loading: true,
      open: true,
      trip,
    })

    try {
      const data = await apiState.fetchTripSummary(trip.id)
      setSummaryState({ data, loading: false, open: true, trip })
    } catch (error) {
      toast.error(error.message || 'Unable to load trip summary.')
      setSummaryState((currentState) => ({ ...currentState, loading: false }))
    }
  }

  const handleMarkCompleted = async (trip) => {
    try {
      await apiState.markTripCompleted(trip.id)
      toast.success('Trip marked as completed successfully.')
      await apiState.refresh()
    } catch (error) {
      toast.error(error.message || 'Unable to mark trip as completed.')
    }
  }

  const handleOpenUsers = async (trip) => {
    setUsersState({
      loading: true,
      open: true,
      trip,
      users: [],
    })

    try {
      const users = await apiState.fetchTripUsers(trip.id)
      setUsersState({ loading: false, open: true, trip, users })
    } catch (error) {
      toast.error(error.message || 'Unable to load trip users.')
      setUsersState((currentState) => ({ ...currentState, loading: false }))
    }
  }

  return (
    <>
      <ResourceCrudPage
        apiState={apiState}
        columns={tripColumns}
        fields={resolvedTripFields}
        formatSubmitValues={toTripFormData}
        icon={Route}
        loadEditingItem={loadEditingTrip}
        renderExtraRowActions={(trip) => (
          <>
            <button
              type="button"
              className="routes-icon-button"
              aria-label={`View summary for ${trip.trip_name}`}
              onClick={() => handleOpenSummary(trip)}
            >
              <ClipboardList size={15} />
            </button>
            {Number(trip.is_active) === 1 ? (
              <button
                type="button"
                className="routes-icon-button"
                aria-label={`Mark ${trip.trip_name} as completed`}
                onClick={() => handleMarkCompleted(trip)}
              >
                <CheckCircle2 size={15} />
              </button>
            ) : null}
            <button
              type="button"
              className="routes-icon-button"
              aria-label={`View users for ${trip.trip_name}`}
              onClick={() => handleOpenUsers(trip)}
            >
              <Users size={15} />
            </button>
          </>
        )}
        rowActionsWidth="148px"
        {...TRIPS_PAGE_COPY}
      />

      {summaryState.open ? (
        <TripSummaryModal
          data={summaryState.data}
          loading={summaryState.loading}
          onClose={() => setSummaryState((currentState) => ({ ...currentState, open: false }))}
          trip={summaryState.trip}
        />
      ) : null}

      {usersState.open ? (
        <TripUsersModal
          loading={usersState.loading}
          onClose={() => setUsersState((currentState) => ({ ...currentState, open: false }))}
          trip={usersState.trip}
          users={usersState.users}
        />
      ) : null}
    </>
  )
}
