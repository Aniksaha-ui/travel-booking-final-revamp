import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import {
  emptyAvgBookingValueReportData,
  getAvgBookingValueReport,
} from '../service/avgBookingValueReportService'

export default function useAvgBookingValueReport() {
  const toast = useToast()
  const [refreshToken, setRefreshToken] = useState(0)
  const [state, setState] = useState({
    data: emptyAvgBookingValueReportData,
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
      const data = await getAvgBookingValueReport()
      setState({
        data,
        error: '',
        isLoading: false,
      })
    } catch (error) {
      const message = error.message || 'Unable to load average booking value report.'
      setState({
        data: emptyAvgBookingValueReportData,
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
