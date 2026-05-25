import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import { emptyUsersCollection, getUsers } from '../service/usersService'

export default function useUsers() {
  const toast = useToast()
  const [items, setItems] = useState(emptyUsersCollection.rows)
  const [pagination, setPagination] = useState(emptyUsersCollection.pagination)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadUsers = useCallback(
    async (overrides = {}) => {
      const nextPage = overrides.page ?? page
      const nextSearch = overrides.search ?? search

      setIsLoading(true)
      setError('')

      try {
        const response = await getUsers({ page: nextPage, search: nextSearch })
        setItems(response.rows)
        setPagination(response.pagination)
      } catch (loadError) {
        const message = loadError.message || 'Unable to load users.'
        setError(message)
        setItems(emptyUsersCollection.rows)
        setPagination(emptyUsersCollection.pagination)
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    },
    [page, search, toast],
  )

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadUsers()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [loadUsers])

  return {
    error,
    isLoading,
    items,
    page,
    pagination,
    refresh: loadUsers,
    search,
    setPage,
    setSearch,
  }
}

