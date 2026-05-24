import { useEffect, useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import {
  emptyTripPerformanceData,
  getTripPerformanceReport,
} from '../service/tripPerformanceService'

export default function useTripPerformanceReport() {
  const toast = useToast()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [refreshToken, setRefreshToken] = useState(0)
  const [state, setState] = useState({
    data: emptyTripPerformanceData,
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

    getTripPerformanceReport({ page, search })
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
            data: emptyTripPerformanceData,
            error: error.message || 'Unable to load trip performance report.',
            isLoading: false,
          })
          toast.error(error.message || 'Unable to load trip performance report.')
        }
      })

    return () => {
      active = false
    }
  }, [page, refreshToken, search, toast])

  return {
    ...state,
    page,
    refresh: () => {
      beginLoading()
      setRefreshToken((currentValue) => currentValue + 1)
    },
    search,
    setPage: (nextPage) => {
      beginLoading()
      setPage(nextPage)
    },
    setSearch: (nextSearch) => {
      beginLoading()
      setSearch(nextSearch)
    },
  }
}
