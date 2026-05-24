import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import {
  emptyVisaApplicationsCollection,
  getVisaApplications,
} from '../service/visaApplicationsService'

export default function useVisaApplications() {
  const toast = useToast()
  const [items, setItems] = useState(emptyVisaApplicationsCollection.rows)
  const [pagination, setPagination] = useState(emptyVisaApplicationsCollection.pagination)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadApplications = useCallback(
    async (overrides = {}) => {
      const nextPage = overrides.page ?? page
      const nextSearch = overrides.search ?? search

      setIsLoading(true)
      setError('')

      try {
        const response = await getVisaApplications({ page: nextPage, search: nextSearch })
        setItems(response.rows)
        setPagination(response.pagination)
      } catch (loadError) {
        const message = loadError.message || 'Unable to load visa applications.'
        setError(message)
        setItems(emptyVisaApplicationsCollection.rows)
        setPagination(emptyVisaApplicationsCollection.pagination)
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    },
    [page, search, toast],
  )

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadApplications()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [loadApplications])

  return {
    error,
    isLoading,
    items,
    page,
    pagination,
    refresh: loadApplications,
    search,
    setPage,
    setSearch,
  }
}
