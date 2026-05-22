import { API_URLS } from '../../../constants/apiUrls'
import { createResourceApi } from '../../../services/resourceApi'

export const seatsApi = createResourceApi({
  endpoint: API_URLS.resources.seats,
})
