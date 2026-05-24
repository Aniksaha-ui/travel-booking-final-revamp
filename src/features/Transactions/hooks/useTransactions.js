import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import { emptyTransactionsCollection, getTransactions } from '../service/transactionsService'

export default function useTransactions() {
  const toast = useToast()
  const [items, setItems] = useState(emptyTransactionsCollection.rows)
  const [pagination, setPagination] = useState(emptyTransactionsCollection.pagination)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  const loadTransactions = useCallback(
    async (overrides = {}) => {
      const nextPage = overrides.page ?? page
      const nextSearch = overrides.search ?? search

      setIsLoading(true)
      setError('')

      try {
        const response = await getTransactions({ page: nextPage, search: nextSearch })
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
    [page, search, toast],
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
    setPage,
    setSearch,
  }
}

