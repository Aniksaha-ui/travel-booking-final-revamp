import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import {
  emptyLowPerformingPackagesData,
  getLowPerformingPackages,
} from '../service/lowPerformingPackagesService'

export default function useLowPerformingPackages() {
  const toast = useToast()
  const [refreshToken, setRefreshToken] = useState(0)
  const [state, setState] = useState({
    data: emptyLowPerformingPackagesData,
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
      const data = await getLowPerformingPackages()
      setState({
        data,
        error: '',
        isLoading: false,
      })
    } catch (error) {
      const message = error.message || 'Unable to load low-performing packages.'
      setState({
        data: emptyLowPerformingPackagesData,
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
