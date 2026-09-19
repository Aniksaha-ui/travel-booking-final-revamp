import useResourceCrud from '../../../hooks/useResourceCrud'
import { visaRequirementsApi } from '../service/visaRequirementsService'
import { normalizeVisaRequirement } from '../utils/visaRequirementsUtils'

export default function useVisaRequirements() {
  const apiState = useResourceCrud({ api: visaRequirementsApi, resourceName: 'Visa requirement' })
  return { ...apiState, items: apiState.items.map((item, index) => normalizeVisaRequirement(item, index, apiState.pagination)) }
}
