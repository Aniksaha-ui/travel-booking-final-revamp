import { useEffect, useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import { getMonthRunningBalanceReport } from '../service/monthRunningBalanceService'

const defaultState = {
  chartItems: [],
  pagination: {
    from: 0,
    to: 0,
    total: 0,
    currentPage: 1,
    lastPage: 1,
  },
  rows: [],
  summary: {
    averageClosingBalance: 0,
    averageClosingBalanceLabel: 'BDT 0',
    latestClosingBalance: 0,
    latestClosingBalanceLabel: 'BDT 0',
    netChange: 0,
    netChangeLabel: 'BDT 0',
    totalCredit: 0,
    totalCreditLabel: 'BDT 0',
    totalDebit: 0,
    totalDebitLabel: 'BDT 0',
    visibleMonths: 0,
  },
}

export default function useMonthRunningBalance() {
  const toast = useToast()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [state, setState] = useState({
    data: defaultState,
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

    getMonthRunningBalanceReport({ page, search })
      .then((data) => {
        if (active) {
          setState({ data, error: null, isLoading: false })
        }
      })
      .catch((error) => {
        if (active) {
          setState({
            data: defaultState,
            error: error.message || 'Unable to load monthly running balance.',
            isLoading: false,
          })
          toast.error(error.message || 'Unable to load monthly running balance.')
        }
      })

    return () => {
      active = false
    }
  }, [page, search, toast])

  return {
    ...state,
    page,
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
