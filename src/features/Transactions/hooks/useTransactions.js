import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import { emptyTransactionsCollection, getTransactions } from '../service/transactionsService'

export default function useTransactions() {
  const toast = useToast()
  const [items, setItems] = useState(emptyTransactionsCollection.rows)
  const [pagination, setPagination] = useState(emptyTransactionsCollection.pagination)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [dateRange, setDateRangeState] = useState({
    endDate: '',
    startDate: '',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  const loadTransactions = useCallback(
    async (overrides = {}) => {
      const nextPage = overrides.page ?? page
      const nextSearch = overrides.search ?? search
      const nextStartDate = overrides.startDate ?? dateRange.startDate
      const nextEndDate = overrides.endDate ?? dateRange.endDate

      setIsLoading(true)
      setError('')

      try {
        const response = await getTransactions({
          fromDate: nextStartDate,
          page: nextPage,
          search: nextSearch,
          toDate: nextEndDate,
        })
        setItems(response.rows)
        setPagination(response.pagination)
      } catch (loadError) {
        const message = loadError.message || 'Unable to load transactions.'
        setError(message)
        setItems(emptyTransactionsCollection.rows)
        setPagination(emptyTransactionsCollection.pagination)
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    },
    [dateRange.endDate, dateRange.startDate, page, search, toast],
  )

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadTransactions()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [loadTransactions])

  const openDetails = (transaction) => {
    setSelectedTransaction(transaction)
    setDetailsOpen(true)
  }

  const closeDetails = () => {
    setSelectedTransaction(null)
    setDetailsOpen(false)
  }

  return {
    closeDetails,
    dateRange,
    detailsOpen,
    error,
    isLoading,
    items,
    openDetails,
    page,
    pagination,
    refresh: loadTransactions,
    search,
    selectedTransaction,
    setDateRange: (nextRange) => {
      setIsLoading(true)
      setDateRangeState(nextRange)
    },
    setPage,
    setSearch,
  }
}
