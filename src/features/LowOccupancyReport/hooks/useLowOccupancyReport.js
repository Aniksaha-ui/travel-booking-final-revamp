import { useEffect, useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import {
  emptyLowOccupancyReportData,
  getLowOccupancyReport,
} from '../service/lowOccupancyReportService'

export default function useLowOccupancyReport() {
  const toast = useToast()
  const [refreshToken, setRefreshToken] = useState(0)
  const [state, setState] = useState({
    data: emptyLowOccupancyReportData,
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

    getLowOccupancyReport()
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
            data: emptyLowOccupancyReportData,
            error: error.message || 'Unable to load low occupancy report.',
            isLoading: false,
          })
          toast.error(error.message || 'Unable to load low occupancy report.')
        }
      })

    return () => {
      active = false
    }
  }, [refreshToken, toast])

  return {
    ...state,
    refresh: () => {
      beginLoading()
      setRefreshToken((currentValue) => currentValue + 1)
    },
  }
}
