import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import { emptyBookingSummaryData, getBookingSummary } from '../service/bookingSummaryService'

export default function useBookingSummary() {
  const toast = useToast()
  const [refreshToken, setRefreshToken] = useState(0)
  const [state, setState] = useState({
    data: emptyBookingSummaryData,
    error: '',
    isLoading: true,
  })

  const loadReport = useCallback(async () => {
    setState((currentState) => ({
      ...currentState,
      error: '',
      isLoading: true,
    }))

    try {
      const data = await getBookingSummary()
      setState({
        data,
        error: '',
        isLoading: false,
      })
    } catch (error) {
      const message = error.message || 'Unable to load booking summary report.'
      setState({
        data: emptyBookingSummaryData,
        error: message,
        isLoading: false,
      })
      toast.error(message)
    }
  }, [toast])

  useEffect(() => {
    loadReport()
  }, [loadReport, refreshToken])

  return {
    ...state,
    refresh: () => setRefreshToken((currentToken) => currentToken + 1),
  }
}
