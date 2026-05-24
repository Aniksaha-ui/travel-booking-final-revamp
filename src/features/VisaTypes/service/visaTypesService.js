import { API_URLS } from '../../../constants/apiUrls'
import { apiRequest } from '../../../services/apiClient'
import { createResourceApi, fetchDropdown, unwrapResponseData } from '../../../services/resourceApi'

export const visaTypesApi = createResourceApi({
  endpoint: API_URLS.resources.visaTypes,
  updateEndpoint: API_URLS.resources.visaTypesUpdate,
})

export const fetchVisaTypeById = async (visaTypeId) => {
  const response = await apiRequest(API_URLS.resources.visaTypeById(visaTypeId))
  return unwrapResponseData(response, 'Unable to load visa type details.') ?? {}
}

export const fetchVisaCountryOptions = () => fetchDropdown(API_URLS.resources.visaCountriesDropdown)
