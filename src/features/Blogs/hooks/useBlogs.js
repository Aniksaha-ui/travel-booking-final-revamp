import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import { emptyBlogsCollection, getBlogs } from '../service/blogsService'

export default function useBlogs() {
  const toast = useToast()
  const [items, setItems] = useState(emptyBlogsCollection.rows)
  const [pagination, setPagination] = useState(emptyBlogsCollection.pagination)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadBlogs = useCallback(
    async (overrides = {}) => {
      const nextPage = overrides.page ?? page
      const nextSearch = overrides.search ?? search

      setIsLoading(true)
      setError('')

      try {
        const response = await getBlogs({ page: nextPage, search: nextSearch })
        setItems(response.rows)
        setPagination(response.pagination)
      } catch (loadError) {
        const message = loadError.message || 'Unable to load blogs.'
        setError(message)
        setItems(emptyBlogsCollection.rows)
        setPagination(emptyBlogsCollection.pagination)
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    },
    [page, search, toast],
  )

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadBlogs()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [loadBlogs])

  return {
    error,
    isLoading,
    items,
    page,
    pagination,
    refresh: loadBlogs,
    search,
    setPage,
    setSearch,
  }
}

