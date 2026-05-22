import { Armchair } from 'lucide-react'
import ResourceCrudPage from '../../../components/crud/ResourceCrudPage'
import { SEATS_PAGE_COPY, seatColumns, seatFields } from '../constants/seats.constants.jsx'
import useSeats from '../hooks/useSeats'

export default function SeatManagementPage() {
  const apiState = useSeats()

  return (
    <ResourceCrudPage
      apiState={apiState}
      columns={seatColumns}
      fields={seatFields}
      icon={Armchair}
      {...SEATS_PAGE_COPY}
    />
  )
}
