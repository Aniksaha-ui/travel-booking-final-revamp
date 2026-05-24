import { API_URLS } from '../../../constants/apiUrls'
import { apiRequest } from '../../../services/apiClient'
import { createResourceApi, unwrapResponseData } from '../../../services/resourceApi'

export const visaCountriesApi = createResourceApi({
  endpoint: API_URLS.resources.visaCountries,
  updateEndpoint: API_URLS.resources.visaCountriesUpdate,
})

export const fetchVisaCountryById = async (countryId) => {
  const response = await apiRequest(API_URLS.resources.visaCountryById(countryId))
  return unwrapResponseData(response, 'Unable to load visa country details.') ?? {}
}
