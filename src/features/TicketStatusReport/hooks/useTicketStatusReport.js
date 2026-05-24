import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import {
  emptyTicketStatusReportData,
  getTicketStatusReport,
} from '../service/ticketStatusReportService'

export default function useTicketStatusReport() {
  const toast = useToast()
  const [refreshToken, setRefreshToken] = useState(0)
  const [state, setState] = useState({
    data: emptyTicketStatusReportData,
    error: '',
    isLoading: true,
  })

  const loadReport = useCallback(async () => {
    try {
      const data = await getTicketStatusReport()
      setState({
        data,
        error: '',
        isLoading: false,
      })
    } catch (error) {
      const message = error.message || 'Unable to load ticket status report.'
      setState({
        data: emptyTicketStatusReportData,
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
