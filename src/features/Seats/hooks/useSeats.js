import useResourceCrud from '../../../hooks/useResourceCrud'
import { seatsApi } from '../services/seatsService'

export default function useSeats() {
  return useResourceCrud({ api: seatsApi, resourceName: 'Seat' })
}
