import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import {
  emptyRouteWiseSalesReportData,
  getRouteWiseSalesReport,
} from '../service/routeWiseSalesReportService'

export default function useRouteWiseSalesReport() {
  const toast = useToast()
  const [refreshToken, setRefreshToken] = useState(0)
  const [state, setState] = useState({
    data: emptyRouteWiseSalesReportData,
    error: '',
    isLoading: true,
  })

  const loadReport = useCallback(async () => {
    try {
      const data = await getRouteWiseSalesReport()
      setState({
        data,
        error: '',
        isLoading: false,
      })
    } catch (error) {
      const message = error.message || 'Unable to load route wise sales report.'
      setState({
        data: emptyRouteWiseSalesReportData,
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
