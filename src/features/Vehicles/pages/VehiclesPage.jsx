import { useEffect, useMemo, useState } from 'react'
import { Bus } from 'lucide-react'
import ResourceCrudPage from '../../../components/crud/ResourceCrudPage'
import { useToast } from '../../../components/common/Toaster'
import { fetchRouteDropdown } from '../../Routes/services/routesService'
import { VEHICLES_PAGE_COPY, vehicleColumns, vehicleFields } from '../constants/vehicles.constants.jsx'
import useVehicles from '../hooks/useVehicles'

export default function VehiclesPage() {
  const toast = useToast()
  const apiState = useVehicles()
  const [routes, setRoutes] = useState([])

  useEffect(() => {
    let mounted = true

    const loadRoutes = async () => {
      try {
        const routeOptions = await fetchRouteDropdown()

        if (!mounted) {
          return
        }

        setRoutes(routeOptions)
      } catch (error) {
        toast.error(error.message || 'Unable to load vehicle routes.')
      }
    }

    loadRoutes()

    return () => {
      mounted = false
    }
  }, [toast])

  const resolvedFields = useMemo(
    () =>
      vehicleFields.map((field) =>
        field.name === 'route_id'
          ? {
              ...field,
              options: routes.map((route) => ({
                value: String(route.id),
                label: route.route_name,
              })),
            }
          : field,
      ),
    [routes],
  )

  const resolveRouteId = (routeId, routeName) => {
    if (routeId !== undefined && routeId !== null && routeId !== '') {
      return String(routeId)
    }

    const matchedRoute = routes.find((route) => route.route_name === routeName)
    return matchedRoute?.id ? String(matchedRoute.id) : ''
  }

  return (
    <ResourceCrudPage
      apiState={apiState}
      columns={vehicleColumns}
      fields={resolvedFields}
      icon={Bus}
      loadEditingItem={(vehicle) => ({
        ...vehicle,
        route_id: resolveRouteId(vehicle.route_id, vehicle.route_name),
      })}
      {...VEHICLES_PAGE_COPY}
    />
  )
}
