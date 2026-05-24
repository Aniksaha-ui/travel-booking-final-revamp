import { useEffect, useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import {
  emptyVehicleWiseSeatReportData,
  getVehicleSeatLayout,
  getVehicleWiseSeatReport,
} from '../service/vehicleWiseSeatReportService'

export default function useVehicleWiseSeatReport() {
  const toast = useToast()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [refreshToken, setRefreshToken] = useState(0)
  const [state, setState] = useState({
    data: emptyVehicleWiseSeatReportData,
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

    getVehicleWiseSeatReport({ page, search })
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
            data: emptyVehicleWiseSeatReportData,
            error: error.message || 'Unable to load vehicle wise seat report.',
            isLoading: false,
          })
          toast.error(error.message || 'Unable to load vehicle wise seat report.')
        }
      })

    return () => {
      active = false
    }
  }, [page, refreshToken, search, toast])

  return {
    ...state,
    fetchVehicleSeatLayout: getVehicleSeatLayout,
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
