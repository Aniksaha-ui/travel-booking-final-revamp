import useResourceCrud from '../../../hooks/useResourceCrud'
import { visaCountriesApi } from '../service/visaCountriesService'
import { normalizeVisaCountry } from '../utils/visaCountriesUtils'

export default function useVisaCountries() {
  const apiState = useResourceCrud({
    api: visaCountriesApi,
    resourceName: 'Visa country',
  })

  return {
    ...apiState,
    items: apiState.items.map((item, index) => normalizeVisaCountry(item, index, apiState.pagination)),
  }
}
