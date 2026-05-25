import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import {
  emptyOnlinePaymentConfigurationsCollection,
  getOnlinePaymentConfigurations,
} from '../service/onlinePaymentConfigService'

export default function useOnlinePaymentConfig() {
  const toast = useToast()
  const [items, setItems] = useState(emptyOnlinePaymentConfigurationsCollection.rows)
  const [pagination, setPagination] = useState(emptyOnlinePaymentConfigurationsCollection.pagination)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadConfigurations = useCallback(
    async (overrides = {}) => {
      const nextPage = overrides.page ?? page
      const nextSearch = overrides.search ?? search

      setIsLoading(true)
      setError('')

      try {
        const response = await getOnlinePaymentConfigurations({
          page: nextPage,
          search: nextSearch,
        })
        setItems(response.rows)
        setPagination(response.pagination)
      } catch (loadError) {
        const message = loadError.message || 'Unable to load online payment configurations.'
        setError(message)
        setItems(emptyOnlinePaymentConfigurationsCollection.rows)
        setPagination(emptyOnlinePaymentConfigurationsCollection.pagination)
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    },
    [page, search, toast],
  )

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadConfigurations()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [loadConfigurations])

  return {
    error,
    isLoading,
    items,
    page,
    pagination,
    refresh: loadConfigurations,
    search,
    setPage,
    setSearch,
  }
}

