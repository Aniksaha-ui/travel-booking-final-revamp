import { apiRequest } from './apiClient'

export const unwrapResponseData = (payload) => payload?.data ?? payload ?? []

export const unwrapCollection = (payload) => {
  const data = unwrapResponseData(payload)

  if (Array.isArray(data)) {
    return {
      rows: data,
      pagination: {
        from: data.length ? 1 : 0,
        to: data.length,
        total: data.length,
        currentPage: 1,
        lastPage: 1,
      },
    }
  }

  if (Array.isArray(data?.data)) {
    return {
      rows: data.data,
      pagination: {
        from: data.from ?? 0,
        to: data.to ?? data.data.length,
        total: data.total ?? data.data.length,
        currentPage: data.current_page ?? 1,
        lastPage: data.last_page ?? 1,
      },
    }
  }

  return {
    rows: [],
    pagination: {
      from: 0,
      to: 0,
      total: 0,
      currentPage: 1,
      lastPage: 1,
    },
  }
}

export const buildQueryPath = (endpoint, { page = 1, search = '' } = {}) => {
  const params = new URLSearchParams()

  if (page) {
    params.set('page', page)
  }

  if (search) {
    params.set('search', search)
  }

  const query = params.toString()
  return query ? `${endpoint}?${query}` : endpoint
}

export const createResourceApi = ({ endpoint, updateEndpoint }) => ({
  list: async ({ page, search } = {}) => unwrapCollection(await apiRequest(buildQueryPath(endpoint, { page, search }))),
  create: async (payload) => apiRequest(endpoint, { method: 'POST', body: payload instanceof FormData ? payload : JSON.stringify(payload) }),
  update: async (id, payload) =>
    apiRequest(updateEndpoint ? updateEndpoint(id) : `${endpoint}/update/${id}`, {
      method: 'POST',
      body: payload instanceof FormData ? payload : JSON.stringify(payload),
    }),
  delete: async (id) => apiRequest(`${endpoint}/${id}`, { method: 'DELETE' }),
})

export const fetchDropdown = async (endpoint) => {
  const payload = await apiRequest(endpoint)
  const data = unwrapResponseData(payload)
  return Array.isArray(data) ? data : data?.data ?? []
}
