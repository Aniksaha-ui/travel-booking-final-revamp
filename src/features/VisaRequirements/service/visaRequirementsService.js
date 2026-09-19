import { API_URLS } from '../../../constants/apiUrls'
import { apiRequest } from '../../../services/apiClient'
import { createResourceApi, fetchDropdown, unwrapResponseData } from '../../../services/resourceApi'

export const visaRequirementsApi = createResourceApi({
  endpoint: API_URLS.resources.visaRequirements,
  updateEndpoint: API_URLS.resources.visaRequirementsUpdate,
})

export const fetchVisaRequirementById = async (id) =>
  unwrapResponseData(await apiRequest(API_URLS.resources.visaRequirementById(id)), 'Unable to load visa requirement details.') ?? {}

export const fetchVisaTypeOptions = () => fetchDropdown(API_URLS.resources.visaTypes)
