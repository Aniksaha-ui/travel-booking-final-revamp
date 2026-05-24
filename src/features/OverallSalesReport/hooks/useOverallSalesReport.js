import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import {
  emptyOverallSalesReportData,
  getOverallSalesReport,
} from '../service/overallSalesReportService'

export default function useOverallSalesReport() {
  const toast = useToast()
  const [refreshToken, setRefreshToken] = useState(0)
  const [state, setState] = useState({
    data: emptyOverallSalesReportData,
    error: '',
    isLoading: true,
  })

  const loadReport = useCallback(async () => {
    try {
      const data = await getOverallSalesReport()
      setState({
        data,
        error: '',
        isLoading: false,
      })
    } catch (error) {
      const message = error.message || 'Unable to load overall sales report.'
      setState({
        data: emptyOverallSalesReportData,
        error: message,
        isLoading: false,
      })
      toast.error(message)
    }
  }, [toast])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadReport()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [loadReport, refreshToken])

  return {
    ...state,
    refresh: () => {
      setState((currentState) => ({
        ...currentState,
        error: '',
        isLoading: true,
      }))
      setRefreshToken((currentToken) => currentToken + 1)
    },
  }
}
