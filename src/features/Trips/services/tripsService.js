import { API_URLS } from '../../../constants/apiUrls'
import { apiRequest } from '../../../services/apiClient'
import { createResourceApi } from '../../../services/resourceApi'

export const tripsApi = createResourceApi({
  endpoint: API_URLS.resources.trips,
  updateEndpoint: API_URLS.resources.tripUpdate,
})

export const fetchTripSummary = async (tripId) => {
  const response = await apiRequest(API_URLS.resources.tripSummary, {
    method: 'POST',
    body: JSON.stringify({ trip_id: tripId }),
  })

  return response?.data ?? {
    tripSummaries: [],
    seat_layout: [],
  }
}

export const fetchTripUsers = async (tripId) => {
  const response = await apiRequest(`${API_URLS.resources.tripUsers}/${tripId}`)
  const data = response?.data ?? response ?? []
  return Array.isArray(data) ? data : data?.data ?? []
}

export const fetchTripById = async (tripId) => {
  const response = await apiRequest(`${API_URLS.resources.tripSingle}/${tripId}`)
  return response?.data ?? response ?? {}
}

export const markTripCompleted = async (tripId) => apiRequest(`${API_URLS.resources.trips}/${tripId}`)
