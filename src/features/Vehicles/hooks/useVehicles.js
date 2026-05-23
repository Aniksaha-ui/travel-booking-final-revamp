import useResourceCrud from '../../../hooks/useResourceCrud'
import { vehiclesApi } from '../service/vehiclesService'

export default function useVehicles() {
  return useResourceCrud({ api: vehiclesApi, resourceName: 'Vehicle' })
}
