import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../../../components/common/Toaster'

const emptyPagination = { from: 0, to: 0, total: 0, currentPage: 1, lastPage: 1 }
export function useGuideCollection(load, errorMessage) {
  const toast = useToast(); const [items, setItems] = useState([]); const [page, setPage] = useState(1); const [search, setSearch] = useState(''); const [pagination, setPagination] = useState(emptyPagination); const [isLoading, setIsLoading] = useState(true)
  const refresh = useCallback(async () => { setIsLoading(true); try { const response = await load({ page, search }); setItems(response.rows); setPagination(response.pagination) } catch (error) { setItems([]); setPagination(emptyPagination); toast.error(error.message || errorMessage) } finally { setIsLoading(false) } }, [errorMessage, load, page, search, toast])
  useEffect(() => { void refresh() }, [refresh])
  return { items, page, setPage, search, setSearch, pagination, isLoading, refresh }
}
