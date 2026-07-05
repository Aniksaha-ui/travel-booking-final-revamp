import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import {
  emptyBookingFrequencyCollection,
  getBookingFrequencyPerUser,
} from '../service/bookingFrequencyPerUserService'

export default function useBookingFrequencyPerUser() {
  const toast = useToast()
  const [items, setItems] = useState(emptyBookingFrequencyCollection.rows)
  const [pagination, setPagination] = useState(emptyBookingFrequencyCollection.pagination)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadBookingFrequency = useCallback(
    async (overrides = {}) => {
      const nextPage = overrides.page ?? page
      const nextSearch = overrides.search ?? search

      setIsLoading(true)
      setError('')

      try {
        const response = await getBookingFrequencyPerUser({ page: nextPage, search: nextSearch })
        setItems(response.rows)
        setPagination(response.pagination)
      } catch (loadError) {
        const message = loadError.message || 'Unable to load booking frequency report.'
        setError(message)
        setItems(emptyBookingFrequencyCollection.rows)
        setPagination(emptyBookingFrequencyCollection.pagination)
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    },
    [page, search, toast],
  )

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadBookingFrequency()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [loadBookingFrequency])

  return {
    error,
    isLoading,
    items,
    page,
    pagination,
    refresh: loadBookingFrequency,
    search,
    setPage,
    setSearch,
  }
}
