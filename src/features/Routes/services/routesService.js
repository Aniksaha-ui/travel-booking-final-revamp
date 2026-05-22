import { API_URLS } from '../../../constants/apiUrls'
import { createResourceApi, fetchDropdown } from '../../../services/resourceApi'

export const routesApi = createResourceApi({
  endpoint: API_URLS.resources.routes,
})

export const fetchRouteDropdown = () => fetchDropdown(API_URLS.resources.routeDropdown)
