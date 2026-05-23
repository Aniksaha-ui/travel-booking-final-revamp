import { useEffect, useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import {
  emptyDailyBalanceData,
  getDailyBalanceReport,
} from '../service/dailyBalanceService'

export default function useDailyBalanceReport() {
  const toast = useToast()
  const [page, setPage] = useState(1)
  const [state, setState] = useState({
    data: emptyDailyBalanceData,
    error: null,
    isLoading: true,
  })

  const beginLoading = () => {
    setState((currentState) => ({
      ...currentState,
      error: null,
      isLoading: true,
    }))
  }

  useEffect(() => {
    let active = true

    getDailyBalanceReport({ page })
      .then((data) => {
        if (active) {
          setState({
            data,
            error: null,
            isLoading: false,
          })
        }
      })
      .catch((error) => {
        if (active) {
          setState({
            data: emptyDailyBalanceData,
            error: error.message || 'Unable to load daily balance report.',
            isLoading: false,
          })
          toast.error(error.message || 'Unable to load daily balance report.')
        }
      })

    return () => {
      active = false
    }
  }, [page, toast])

  return {
    ...state,
    page,
    setPage: (nextPage) => {
      beginLoading()
      setPage(nextPage)
    },
  }
}
