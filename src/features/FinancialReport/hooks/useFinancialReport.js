import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import { emptyFinancialReportCollection, getFinancialReport } from '../service/financialReportService'

export default function useFinancialReport() {
  const toast = useToast()
  const [items, setItems] = useState(emptyFinancialReportCollection.rows)
  const [pagination, setPagination] = useState(emptyFinancialReportCollection.pagination)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadFinancialReport = useCallback(
    async (overrides = {}) => {
      const nextPage = overrides.page ?? page
      const nextSearch = overrides.search ?? search

      setIsLoading(true)
      setError('')

      try {
        const response = await getFinancialReport({ page: nextPage, search: nextSearch })
        setItems(response.rows)
        setPagination(response.pagination)
      } catch (loadError) {
        const message = loadError.message || 'Unable to load financial report.'
        setError(message)
        setItems(emptyFinancialReportCollection.rows)
        setPagination(emptyFinancialReportCollection.pagination)
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    },
    [page, search, toast],
  )

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadFinancialReport()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [loadFinancialReport])

  return {
    error,
    isLoading,
    items,
    page,
    pagination,
    refresh: loadFinancialReport,
    search,
    setPage,
    setSearch,
  }
}

