import { MapPinned } from 'lucide-react'
import ResourceCrudPage from '../../../components/crud/ResourceCrudPage'
import { routeColumns } from '../component/column.jsx'
import { ROUTES_PAGE_COPY, routeFields } from '../constants/routes.constants.jsx'
import useRoutes from '../hooks/useRoutes'

export default function RoutePage() {
  const apiState = useRoutes()

  return (
    <ResourceCrudPage
      apiState={apiState}
      columns={routeColumns}
      fields={routeFields}
      icon={MapPinned}
      {...ROUTES_PAGE_COPY}
    />
  )
}
