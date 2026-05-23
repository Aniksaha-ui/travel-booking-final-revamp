import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import { getTickets, updateTicketStatus } from '../service/ticketsService'
import { applyTicketTransition, buildTicketMutationPayload, sortTicketsByNewest } from '../utils/ticketUtils'

export default function useTickets() {
  const toast = useToast()
  const [tickets, setTickets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMutating, setIsMutating] = useState(false)
  const [error, setError] = useState('')

  const loadTickets = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await getTickets()
      setTickets(sortTicketsByNewest(response))
    } catch (loadError) {
      const message = loadError.message || 'Unable to load tickets.'
      setError(message)
      setTickets([])
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadTickets()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [loadTickets])

  const moveTicket = useCallback(
    async (ticket, workflowKey, resolvedRemarks = '') => {
      const mutationPayload = buildTicketMutationPayload(workflowKey)

      if (
        ticket.status === mutationPayload.status &&
        ticket.resolvedStatus === mutationPayload.resolvedStatus
      ) {
        return true
      }

      setIsMutating(true)

      try {
        const response = await updateTicketStatus(ticket.id, {
          ...mutationPayload,
          resolvedRemarks,
        })

        setTickets((currentTickets) =>
          sortTicketsByNewest(
            currentTickets.map((currentTicket) =>
              String(currentTicket.id) === String(ticket.id)
                ? applyTicketTransition(currentTicket, {
                    ...mutationPayload,
                    resolvedRemarks,
                  })
                : currentTicket,
            ),
          ),
        )

        toast.success(response.message || mutationPayload.successMessage)
        return true
      } catch (mutationError) {
        toast.error(mutationError.message || 'Unable to update ticket.')
        return false
      } finally {
        setIsMutating(false)
      }
    },
    [toast],
  )

  const approveTicket = useCallback(
    (ticket) => moveTicket(ticket, 'processing'),
    [moveTicket],
  )

  const declineTicket = useCallback(
    (ticket, resolvedRemarks = '') => moveTicket(ticket, 'declined', resolvedRemarks),
    [moveTicket],
  )

  return {
    approveTicket,
    declineTicket,
    error,
    isLoading,
    isMutating,
    moveTicket,
    refresh: loadTickets,
    tickets,
  }
}
