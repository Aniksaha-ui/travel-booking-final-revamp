import { Bus } from 'lucide-react'
import ResourceCrudPage from '../../../components/crud/ResourceCrudPage'
import { VEHICLES_PAGE_COPY, vehicleColumns, vehicleFields } from '../constants/vehicles.constants.jsx'
import useVehicles from '../hooks/useVehicles'

export default function VehiclesPage() {
  const apiState = useVehicles()

  return (
    <ResourceCrudPage
      apiState={apiState}
      columns={vehicleColumns}
      fields={vehicleFields}
      icon={Bus}
      {...VEHICLES_PAGE_COPY}
    />
  )
}
