import { useEffect, useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import {
  emptyDailyBalanceHistory,
  getDailyBalanceHistory,
} from '../service/dailyBalanceService'

export default function useDailyBalanceHistory() {
  const toast = useToast()
  const [page, setPage] = useState(1)
  const [state, setState] = useState({
    data: emptyDailyBalanceHistory,
    error: null,
    isLoading: true,
  })

  useEffect(() => {
    let active = true

    getDailyBalanceHistory({ page })
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
            data: emptyDailyBalanceHistory,
            error: error.message || 'Unable to load previous reports.',
            isLoading: false,
          })
          toast.error(error.message || 'Unable to load previous reports.')
        }
      })

    return () => {
      active = false
    }
  }, [page, toast])

  return {
    ...state,
    page,
    setPage,
  }
}
