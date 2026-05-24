import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import { emptyCustomerValueCollection, getCustomerValueReport } from '../service/customerValueReportService'

export default function useCustomerValueReport() {
  const toast = useToast()
  const [items, setItems] = useState(emptyCustomerValueCollection.rows)
  const [pagination, setPagination] = useState(emptyCustomerValueCollection.pagination)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadCustomerValueReport = useCallback(
    async (overrides = {}) => {
      const nextPage = overrides.page ?? page
      const nextSearch = overrides.search ?? search

      setIsLoading(true)
      setError('')

      try {
        const response = await getCustomerValueReport({ page: nextPage, search: nextSearch })
        setItems(response.rows)
        setPagination(response.pagination)
      } catch (loadError) {
        const message = loadError.message || 'Unable to load customer value report.'
        setError(message)
        setItems(emptyCustomerValueCollection.rows)
        setPagination(emptyCustomerValueCollection.pagination)
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    },
    [page, search, toast],
  )

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadCustomerValueReport()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [loadCustomerValueReport])

  return {
    error,
    isLoading,
    items,
    page,
    pagination,
    refresh: loadCustomerValueReport,
    search,
    setPage,
    setSearch,
  }
}

