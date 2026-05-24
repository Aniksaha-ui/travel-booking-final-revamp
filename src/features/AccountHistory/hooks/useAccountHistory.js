import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import { emptyAccountHistoryData, getAccountHistoryReport } from '../service/accountHistoryService'
import { createCurrentMonthDateRange } from '../utils/accountHistoryUtils'

export default function useAccountHistory() {
  const toast = useToast()
  const [data, setData] = useState(emptyAccountHistoryData)
  const [dateRange, setDateRange] = useState(createCurrentMonthDateRange())
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadReport = useCallback(
    async (overrides = {}) => {
      const nextPage = overrides.page ?? page
      const nextDateRange = {
        endDate: overrides.endDate ?? dateRange.endDate,
        startDate: overrides.startDate ?? dateRange.startDate,
      }

      setIsLoading(true)
      setError('')

      try {
        const response = await getAccountHistoryReport({
          endDate: nextDateRange.endDate,
          page: nextPage,
          startDate: nextDateRange.startDate,
        })
        setData(response)
      } catch (loadError) {
        const message = loadError.message || 'Unable to load account history report.'
        setError(message)
        setData(emptyAccountHistoryData)
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    },
    [dateRange.endDate, dateRange.startDate, page, toast],
  )

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadReport()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [loadReport])

  return {
    data,
    dateRange,
    error,
    isLoading,
    page,
    refresh: loadReport,
    setDateRange,
    setPage,
  }
}

