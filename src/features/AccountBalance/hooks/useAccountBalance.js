import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import {
  emptyAccountBalanceCollection,
  emptyAccountHistoryCollection,
  getAccountBalanceReport,
  getAccountHistoryReport,
} from '../service/accountBalanceService'

export default function useAccountBalance() {
  const toast = useToast()
  const [items, setItems] = useState(emptyAccountBalanceCollection.rows)
  const [pagination, setPagination] = useState(emptyAccountBalanceCollection.pagination)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [historyOpen, setHistoryOpen] = useState(false)
  const [historyItems, setHistoryItems] = useState(emptyAccountHistoryCollection.rows)
  const [historySummary, setHistorySummary] = useState(emptyAccountHistoryCollection.summary)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState('')
  const [selectedTypeLabel, setSelectedTypeLabel] = useState('')

  const loadReport = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await getAccountBalanceReport()
      setItems(response.rows)
      setPagination(response.pagination)
    } catch (loadError) {
      const message = loadError.message || 'Unable to load account balance report.'
      setError(message)
      setItems(emptyAccountBalanceCollection.rows)
      setPagination(emptyAccountBalanceCollection.pagination)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadReport()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [loadReport])

  const openHistory = async (account) => {
    setSelectedTypeLabel(account.typeLabel)
    setHistoryItems(emptyAccountHistoryCollection.rows)
    setHistorySummary(emptyAccountHistoryCollection.summary)
    setHistoryError('')
    setHistoryOpen(true)
    setHistoryLoading(true)

    try {
      const response = await getAccountHistoryReport(account.historyType)
      setHistoryItems(response.rows)
      setHistorySummary(response.summary)
    } catch (loadError) {
      const message = loadError.message || 'Unable to load account history.'
      setHistoryError(message)
      toast.error(message)
    } finally {
      setHistoryLoading(false)
    }
  }

  const closeHistory = () => {
    setHistoryOpen(false)
    setHistoryItems(emptyAccountHistoryCollection.rows)
    setHistorySummary(emptyAccountHistoryCollection.summary)
    setHistoryError('')
    setHistoryLoading(false)
    setSelectedTypeLabel('')
  }

  return {
    closeHistory,
    error,
    historyError,
    historyItems,
    historyLoading,
    historyOpen,
    historySummary,
    isLoading,
    items,
    openHistory,
    pagination,
    refresh: loadReport,
    selectedTypeLabel,
  }
}

