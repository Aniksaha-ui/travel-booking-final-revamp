import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import { emptyTopActiveCustomersCollection, getTopActiveCustomers } from '../service/topActiveCustomersService'

export default function useTopActiveCustomers() {
  const toast = useToast()
  const [items, setItems] = useState(emptyTopActiveCustomersCollection)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadTopActiveCustomers = useCallback(
    async (overrides = {}) => {
      const nextSearch = overrides.search ?? search

      setIsLoading(true)
      setError('')

      try {
        const response = await getTopActiveCustomers({ search: nextSearch })
        setItems(response)
      } catch (loadError) {
        const message = loadError.message || 'Unable to load top active customers.'
        setError(message)
        setItems(emptyTopActiveCustomersCollection)
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    },
    [search, toast],
  )

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadTopActiveCustomers()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [loadTopActiveCustomers])

  return {
    error,
    isLoading,
    items,
    refresh: loadTopActiveCustomers,
    search,
    setSearch,
  }
}
