import { API_URLS } from '../../../constants/apiUrls'
import { apiRequest } from '../../../services/apiClient'
import {
  assertSuccessfulExecution,
  buildQueryPath,
  unwrapCollection,
  unwrapResponseData,
} from '../../../services/resourceApi'
import { normalizeBlog, normalizeBlogDetails } from '../utils/blogsUtils'

const defaultPagination = {
  currentPage: 1,
  from: 0,
  lastPage: 1,
  to: 0,
  total: 0,
}

export const emptyBlogsCollection = {
  pagination: defaultPagination,
  rows: [],
}

export const getBlogs = async ({ page = 1, search = '' } = {}) => {
  const payload = await apiRequest(buildQueryPath(API_URLS.blogs.list, { page, search }))
  const collection = unwrapCollection(payload, 'Unable to load blogs.')

  return {
    pagination: collection.pagination,
    rows: collection.rows.map((item, index) => normalizeBlog(item, index, collection.pagination)),
  }
}

export const getBlogDetails = async (blogId) => {
  const payload = await apiRequest(API_URLS.blogs.byId(blogId))
  const data = unwrapResponseData(payload, 'Unable to load blog details.')
  return normalizeBlogDetails(data ?? {})
}

export const createBlog = async (payload) =>
  assertSuccessfulExecution(
    await apiRequest(API_URLS.blogs.list, {
      body: JSON.stringify(payload),
      method: 'POST',
    }),
    'Unable to create blog.',
  )

export const updateBlog = async (blogId, payload) =>
  assertSuccessfulExecution(
    await apiRequest(API_URLS.blogs.update(blogId), {
      body: JSON.stringify(payload),
      method: 'POST',
    }),
    'Unable to update blog.',
  )

export const deleteBlog = async (blogId) =>
  assertSuccessfulExecution(
    await apiRequest(API_URLS.blogs.byId(blogId), {
      method: 'DELETE',
    }),
    'Unable to delete blog.',
  )

