import useResourceCrud from '../../../hooks/useResourceCrud'
import { routesApi } from '../service/routesService'

export default function useRoutes() {
  return useResourceCrud({ api: routesApi, resourceName: 'Route' })
}
