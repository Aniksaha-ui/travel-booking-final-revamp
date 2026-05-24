import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import { disburseRefund, emptyRefundCollection, getRefunds } from '../service/refundsService'

export default function useRefunds() {
  const toast = useToast()
  const [items, setItems] = useState(emptyRefundCollection.rows)
  const [pagination, setPagination] = useState(emptyRefundCollection.pagination)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isMutating, setIsMutating] = useState(false)
  const [mutatingRefundId, setMutatingRefundId] = useState(null)
  const [error, setError] = useState('')

  const loadRefunds = useCallback(
    async (overrides = {}) => {
      const nextPage = overrides.page ?? page
      const nextSearch = overrides.search ?? search

      setIsLoading(true)
      setError('')

      try {
        const response = await getRefunds({ page: nextPage, search: nextSearch })
        setItems(response.rows)
        setPagination(response.pagination)
      } catch (loadError) {
        const message = loadError.message || 'Unable to load refunds.'
        setError(message)
        setItems(emptyRefundCollection.rows)
        setPagination(emptyRefundCollection.pagination)
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    },
    [page, search, toast],
  )

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadRefunds()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [loadRefunds])

  const disburseItem = async (refundId) => {
    setIsMutating(true)
    setMutatingRefundId(refundId)

    try {
      const response = await disburseRefund(refundId)
      setItems((currentItems) =>
        currentItems.map((refund) =>
          String(refund.id) === String(refundId)
            ? {
                ...refund,
                status: 'disbursed',
                statusLabel: 'Disbursed',
              }
            : refund,
        ),
      )
      toast.success(response.message || 'Refund disbursed successfully.')
      return true
    } catch (mutationError) {
      toast.error(mutationError.message || 'Unable to disburse refund.')
      return false
    } finally {
      setIsMutating(false)
      setMutatingRefundId(null)
    }
  }

  return {
    disburseItem,
    error,
    isLoading,
    isMutating,
    items,
    mutatingRefundId,
    page,
    pagination,
    refresh: loadRefunds,
    search,
    setPage,
    setSearch,
  }
}
