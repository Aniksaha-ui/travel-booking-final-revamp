import useResourceCrud from '../../../hooks/useResourceCrud'
import { visaTypesApi } from '../service/visaTypesService'
import { normalizeVisaType } from '../utils/visaTypesUtils'

export default function useVisaTypes() {
  const apiState = useResourceCrud({
    api: visaTypesApi,
    resourceName: 'Visa type',
  })

  return {
    ...apiState,
    items: apiState.items.map((item, index) => normalizeVisaType(item, index, apiState.pagination)),
  }
}
