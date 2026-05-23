import { API_URLS } from '../../../constants/apiUrls'
import { createResourceApi, fetchDropdown } from '../../../services/resourceApi'

export const vehiclesApi = createResourceApi({
  endpoint: API_URLS.resources.vehicles,
})

export const fetchVehicleDropdown = () => fetchDropdown(API_URLS.resources.vehicleDropdown)
