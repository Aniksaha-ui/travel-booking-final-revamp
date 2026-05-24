import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import { MONITORING_REFRESH_INTERVAL_MS } from '../constants/monitoring.constants'
import { emptyMonitoringData, getMonitoringData } from '../service/monitoringService'

export default function useMonitoring() {
  const toast = useToast()
  const [refreshToken, setRefreshToken] = useState(0)
  const [state, setState] = useState({
    data: emptyMonitoringData,
    error: '',
    isLoading: true,
    lastUpdatedAt: null,
  })

  const loadMonitoring = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setState((currentState) => ({
        ...currentState,
        error: '',
        isLoading: true,
      }))
    }

    try {
      const data = await getMonitoringData()
      setState({
        data,
        error: '',
        isLoading: false,
        lastUpdatedAt: new Date(),
      })
    } catch (error) {
      const message = error.message || 'Unable to load monitoring data.'
      setState((currentState) => ({
        ...currentState,
        error: message,
        isLoading: false,
      }))

      if (!silent) {
        toast.error(message)
      }
    }
  }, [toast])

  useEffect(() => {
    loadMonitoring()
  }, [loadMonitoring, refreshToken])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      loadMonitoring({ silent: true })
    }, MONITORING_REFRESH_INTERVAL_MS)

    return () => window.clearInterval(intervalId)
  }, [loadMonitoring])

  return {
    ...state,
    refresh: () => setRefreshToken((currentToken) => currentToken + 1),
  }
}
