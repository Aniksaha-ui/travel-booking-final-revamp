import { API_URLS } from '../../../constants/apiUrls'
import { apiRequest } from '../../../services/apiClient'
import { assertSuccessfulExecution, createResourceApi, unwrapResponseData } from '../../../services/resourceApi'

export const tripsApi = createResourceApi({
  endpoint: API_URLS.resources.trips,
  updateEndpoint: API_URLS.resources.tripUpdate,
})

export const fetchTripSummary = async (tripId) => {
  const response = await apiRequest(API_URLS.resources.tripSummary, {
    method: 'POST',
    body: JSON.stringify({ trip_id: tripId }),
  })

  return unwrapResponseData(response, 'Unable to load trip summary.') ?? {
    tripSummaries: [],
    seat_layout: [],
  }
}

export const fetchTripUsers = async (tripId) => {
  const response = await apiRequest(`${API_URLS.resources.tripUsers}/${tripId}`)
  const data = unwrapResponseData(response, 'Unable to load trip users.')
  return Array.isArray(data) ? data : data?.data ?? []
}

export const fetchTripById = async (tripId) => {
  const response = await apiRequest(`${API_URLS.resources.tripSingle}/${tripId}`)
  return unwrapResponseData(response, 'Unable to load trip details.') ?? {}
}

export const markTripCompleted = async (tripId) =>
  assertSuccessfulExecution(await apiRequest(`${API_URLS.resources.trips}/${tripId}`), 'Unable to mark trip as completed.')
