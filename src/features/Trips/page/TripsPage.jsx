import { CheckCircle2, ClipboardList, Route, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import ResourceCrudPage from '../../../components/crud/ResourceCrudPage'
import { useToast } from '../../../components/common/Toaster'
import { fetchRouteDropdown } from '../../Routes/service/routesService'
import { fetchVehicleDropdown } from '../../Vehicles/service/vehiclesService'
import { tripColumns } from '../component/column.jsx'
import { TripUsersModal } from '../component/TripUserModal.jsx'
import { TripSummaryModal } from '../component/TripSummaryModal.jsx'
import { TRIPS_PAGE_COPY, toTripFormData, tripFields } from '../constants/trips.constants.jsx'
import useTrips from '../hooks/useTrips'

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
