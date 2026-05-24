import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import {
  emptyHighCancellationPackagesData,
  getHighCancellationPackages,
} from '../service/highCancellationPackagesService'

export default function useHighCancellationPackages() {
  const toast = useToast()
  const [refreshToken, setRefreshToken] = useState(0)
  const [state, setState] = useState({
    data: emptyHighCancellationPackagesData,
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
      const data = await getHighCancellationPackages()
      setState({
        data,
        error: '',
        isLoading: false,
      })
    } catch (error) {
      const message = error.message || 'Unable to load high cancellation packages.'
      setState({
        data: emptyHighCancellationPackagesData,
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
