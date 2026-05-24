import { useEffect, useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import {
  emptyVehicleTrackingReportData,
  getVehicleTrackingReport,
} from '../service/vehicleTrackingReportService'

export default function useVehicleTrackingReport() {
  const toast = useToast()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [dateRange, setDateRangeState] = useState({
    endDate: '',
    startDate: '',
  })
  const [refreshToken, setRefreshToken] = useState(0)
  const [state, setState] = useState({
    data: emptyVehicleTrackingReportData,
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

    getVehicleTrackingReport({
      endDate: dateRange.endDate,
      page,
      search,
      startDate: dateRange.startDate,
    })
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
            data: emptyVehicleTrackingReportData,
            error: error.message || 'Unable to load vehicle tracking report.',
            isLoading: false,
          })
          toast.error(error.message || 'Unable to load vehicle tracking report.')
        }
      })

    return () => {
      active = false
    }
  }, [dateRange.endDate, dateRange.startDate, page, refreshToken, search, toast])

  return {
    ...state,
    dateRange,
    page,
    refresh: () => {
      beginLoading()
      setRefreshToken((currentValue) => currentValue + 1)
    },
    search,
    setDateRange: (nextRange) => {
      beginLoading()
      setDateRangeState(nextRange)
    },
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
