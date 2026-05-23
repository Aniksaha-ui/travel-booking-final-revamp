import useResourceCrud from '../../../hooks/useResourceCrud'
import { seatsApi } from '../service/seatsService'

export default function useSeats() {
  return useResourceCrud({ api: seatsApi, resourceName: 'Seat' })
}
