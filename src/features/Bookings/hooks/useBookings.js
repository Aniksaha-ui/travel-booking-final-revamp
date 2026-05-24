import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import {
  emptyBookingInvoice,
  emptyBookingsCollection,
  getBookingInvoice,
  getBookings,
} from '../service/bookingsService'

export default function useBookings() {
  const toast = useToast()
  const [items, setItems] = useState(emptyBookingsCollection.rows)
  const [pagination, setPagination] = useState(emptyBookingsCollection.pagination)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [invoice, setInvoice] = useState(emptyBookingInvoice)
  const [invoiceError, setInvoiceError] = useState('')
  const [invoiceLoading, setInvoiceLoading] = useState(false)
  const [invoiceOpen, setInvoiceOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [loadingInvoiceBookingId, setLoadingInvoiceBookingId] = useState(null)

  const loadBookings = useCallback(
    async (overrides = {}) => {
      const nextPage = overrides.page ?? page
      const nextSearch = overrides.search ?? search

      setIsLoading(true)
      setError('')

      try {
        const response = await getBookings({ page: nextPage, search: nextSearch })
        setItems(response.rows)
        setPagination(response.pagination)
      } catch (loadError) {
        const message = loadError.message || 'Unable to load bookings.'
        setError(message)
        setItems(emptyBookingsCollection.rows)
        setPagination(emptyBookingsCollection.pagination)
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    },
    [page, search, toast],
  )

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadBookings()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [loadBookings])

  const openInvoice = async (booking) => {
    setSelectedBooking(booking)
    setInvoice(emptyBookingInvoice)
    setInvoiceError('')
    setInvoiceOpen(true)
    setInvoiceLoading(true)
    setLoadingInvoiceBookingId(booking.id)

    try {
      const response = await getBookingInvoice(booking.id)
      setInvoice(response)
    } catch (loadError) {
      const message = loadError.message || 'Unable to load booking invoice.'
      setInvoiceError(message)
      toast.error(message)
    } finally {
      setInvoiceLoading(false)
      setLoadingInvoiceBookingId(null)
    }
  }

  const closeInvoice = () => {
    setInvoice(emptyBookingInvoice)
    setInvoiceError('')
    setInvoiceLoading(false)
    setInvoiceOpen(false)
    setLoadingInvoiceBookingId(null)
    setSelectedBooking(null)
  }

  return {
    closeInvoice,
    error,
    invoice,
    invoiceError,
    invoiceLoading,
    invoiceOpen,
    isLoading,
    items,
    loadingInvoiceBookingId,
    openInvoice,
    page,
    pagination,
    refresh: loadBookings,
    search,
    selectedBooking,
    setPage,
    setSearch,
  }
}
