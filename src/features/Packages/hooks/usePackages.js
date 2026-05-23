import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import {
  createPackage,
  emptyPackagesCollection,
  getPackageDetails,
  getPackages,
} from '../service/packagesService'

export default function usePackages() {
  const toast = useToast()
  const [items, setItems] = useState(emptyPackagesCollection.rows)
  const [pagination, setPagination] = useState(emptyPackagesCollection.pagination)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isMutating, setIsMutating] = useState(false)
  const [error, setError] = useState('')

  const loadPackages = useCallback(
    async (overrides = {}) => {
      const nextPage = overrides.page ?? page
      const nextSearch = overrides.search ?? search

      setIsLoading(true)
      setError('')

      try {
        const response = await getPackages({ page: nextPage, search: nextSearch })
        setItems(response.rows)
        setPagination(response.pagination)
      } catch (loadError) {
        const message = loadError.message || 'Unable to load packages.'
        setError(message)
        setItems(emptyPackagesCollection.rows)
        setPagination(emptyPackagesCollection.pagination)
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    },
    [page, search, toast],
  )

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadPackages()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [loadPackages])

  const createItem = async (payload) => {
    setIsMutating(true)

    try {
      await createPackage(payload)
      toast.success('Package created successfully.')
      setPage(1)
      await loadPackages({ page: 1 })
      return true
    } catch (error) {
      toast.error(error.message || 'Unable to create package.')
      return false
    } finally {
      setIsMutating(false)
    }
  }

  const fetchDetails = async (packageId) => getPackageDetails(packageId)

  return {
    createItem,
    error,
    fetchDetails,
    isLoading,
    isMutating,
    items,
    page,
    pagination,
    refresh: loadPackages,
    search,
    setPage,
    setSearch,
  }
}
