import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import {
  emptyHotelDetails,
  emptyHotelsCollection,
  getHotelDetails,
  getHotels,
} from '../service/hotelsService'

export default function useHotels() {
  const toast = useToast()
  const [items, setItems] = useState(emptyHotelsCollection.rows)
  const [pagination, setPagination] = useState(emptyHotelsCollection.pagination)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [details, setDetails] = useState(emptyHotelDetails)
  const [detailsError, setDetailsError] = useState('')
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [loadingHotelId, setLoadingHotelId] = useState(null)

  const loadHotels = useCallback(
    async (overrides = {}) => {
      const nextPage = overrides.page ?? page
      const nextSearch = overrides.search ?? search

      setIsLoading(true)
      setError('')

      try {
        const response = await getHotels({ page: nextPage, search: nextSearch })
        setItems(response.rows)
        setPagination(response.pagination)
      } catch (loadError) {
        const message = loadError.message || 'Unable to load hotels.'
        setError(message)
        setItems(emptyHotelsCollection.rows)
        setPagination(emptyHotelsCollection.pagination)
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    },
    [page, search, toast],
  )

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadHotels()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [loadHotels])

  const openDetails = async (hotel) => {
    setSelectedHotel(hotel)
    setDetails(emptyHotelDetails)
    setDetailsError('')
    setDetailsOpen(true)
    setDetailsLoading(true)
    setLoadingHotelId(hotel.id)

    try {
      const response = await getHotelDetails(hotel.id)
      setDetails(response)
    } catch (loadError) {
      const message = loadError.message || 'Unable to load hotel details.'
      setDetailsError(message)
      toast.error(message)
    } finally {
      setDetailsLoading(false)
      setLoadingHotelId(null)
    }
  }

  const closeDetails = () => {
    setDetails(emptyHotelDetails)
    setDetailsError('')
    setDetailsLoading(false)
    setDetailsOpen(false)
    setLoadingHotelId(null)
    setSelectedHotel(null)
  }

  return {
    closeDetails,
    details,
    detailsError,
    detailsLoading,
    detailsOpen,
    error,
    isLoading,
    items,
    loadingHotelId,
    openDetails,
    page,
    pagination,
    refresh: loadHotels,
    search,
    selectedHotel,
    setPage,
    setSearch,
  }
}
