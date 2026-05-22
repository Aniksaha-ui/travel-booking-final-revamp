import useResourceCrud from '../../../hooks/useResourceCrud'
import { routesApi } from '../services/routesService'

export default function useRoutes() {
  return useResourceCrud({ api: routesApi, resourceName: 'Route' })
}
