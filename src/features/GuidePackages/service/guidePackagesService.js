import { API_URLS } from '../../../constants/apiUrls'
import { apiRequest } from '../../../services/apiClient'
import { unwrapCollection, unwrapResponseData } from '../../../services/resourceApi'

const queryPath = (path, page, search) => {
  const params = new URLSearchParams({ page: String(page) })
  if (search) params.set('search', search)
  return `${path}?${params}`
}

const postCollection = async (path, { page = 1, search = '', payload = {} } = {}) =>
  unwrapCollection(await apiRequest(queryPath(path, page, search), { method: 'POST', body: JSON.stringify(payload) }))

export const getAssignedPackages = (options) => postCollection(API_URLS.guide.assignedPackages, options)
export const getPackageCostings = (packageId, options) => postCollection(API_URLS.guide.costingByPackage, { ...options, payload: { package_id: packageId } })
export const getPackageFeedback = (packageId, options) => postCollection(API_URLS.guide.feedbackByPackage, { ...options, payload: { package_id: packageId } })
export const getCostingById = async (costId) => unwrapResponseData(await apiRequest(API_URLS.guide.costingById(costId), { method: 'POST' }))
export const saveCosting = (payload, isUpdate) => apiRequest(isUpdate ? API_URLS.guide.costingUpdate : API_URLS.guide.costingCreate, { method: 'POST', body: payload })
