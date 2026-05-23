import useResourceCrud from '../../../hooks/useResourceCrud'
import { fetchTripById, fetchTripSummary, fetchTripUsers, markTripCompleted, tripsApi } from '../service/tripsService'

export default function useTrips() {
  const crudState = useResourceCrud({ api: tripsApi, resourceName: 'Trip' })

  return {
    ...crudState,
    fetchTripById,
    fetchTripSummary,
    fetchTripUsers,
    markTripCompleted,
  }
}
