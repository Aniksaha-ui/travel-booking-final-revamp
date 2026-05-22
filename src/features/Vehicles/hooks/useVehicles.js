import useResourceCrud from '../../../hooks/useResourceCrud'
import { vehiclesApi } from '../services/vehiclesService'

export default function useVehicles() {
  return useResourceCrud({ api: vehiclesApi, resourceName: 'Vehicle' })
}
