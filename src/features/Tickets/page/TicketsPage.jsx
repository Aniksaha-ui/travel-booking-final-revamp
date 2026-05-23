import { LifeBuoy } from 'lucide-react'
import { useMemo, useState } from 'react'
import { TICKET_PAGE_COPY } from '../constants/tickets.constants'
import useTickets from '../hooks/useTickets'
import {
  filterTicketsBySearch,
  isPendingApprovalTicket,
  sortTicketsByNewest,
} from '../utils/ticketUtils'
import { TicketApprovalTable } from '../component/TicketApprovalTable.jsx'
import { TicketKanbanBoard } from '../component/TicketKanbanBoard.jsx'
import { TicketManagementOverview } from '../component/TicketManagementOverview.jsx'
import { TicketWorkflowDetailModal } from '../component/TicketWorkflowDetailModal.jsx'
import { TicketWorkspaceToolbar } from '../component/TicketWorkspaceToolbar.jsx'

export default function TicketsPage() {
  const [activeView, setActiveView] = useState('queue')
  const [search, setSearch] = useState('')
  const [selectedTicketId, setSelectedTicketId] = useState(null)
  const {
    approveTicket,
    declineTicket,
    error,
    isLoading,
    isMutating,
    moveTicket,
    tickets,
  } = useTickets()

  const filteredTickets = useMemo(() => filterTicketsBySearch(tickets, search), [search, tickets])
  const pendingTickets = useMemo(
    () => sortTicketsByNewest(filteredTickets.filter(isPendingApprovalTicket)),
    [filteredTickets],
  )
  const boardTickets = useMemo(
    () => sortTicketsByNewest(filteredTickets.filter((ticket) => !isPendingApprovalTicket(ticket))),
    [filteredTickets],
  )
  const selectedTicket = useMemo(
    () => tickets.find((ticket) => String(ticket.id) === String(selectedTicketId)) ?? null,
    [selectedTicketId, tickets],
  )

  const handleApprove = async (ticket) => {
    const wasSuccessful = await approveTicket(ticket)

    if (wasSuccessful) {
      setActiveView('board')
      setSelectedTicketId(null)
    }
  }

  const handleDecline = async (ticket, resolvedRemarks = '') => {
    const wasSuccessful = await declineTicket(ticket, resolvedRemarks)

    if (wasSuccessful) {
      setSelectedTicketId(null)
    }
  }

  const handleMove = async (ticket, workflowKey, resolvedRemarks = '') => {
    const wasSuccessful = await moveTicket(ticket, workflowKey, resolvedRemarks)

    if (wasSuccessful) {
      setSelectedTicketId(null)
    }
  }

  return (
    <main className="routes-page">
      <div className="routes-page__inner">
        <header className="routes-page__header">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="routes-page__title">
                <LifeBuoy size={20} color="#4f83ff" />
                <h1>{TICKET_PAGE_COPY.title}</h1>
              </div>
              <p className="routes-page__subtitle">{TICKET_PAGE_COPY.subtitle}</p>
            </div>

            <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#332d30] bg-[#171314] px-4 text-sm font-semibold text-[#c5d9f7]">
              <LifeBuoy size={16} />
              <span>{pendingTickets.length} awaiting approval</span>
            </div>
          </div>
        </header>

        <TicketManagementOverview isLoading={isLoading} tickets={tickets} />

        {error ? <p className="month-balance-alert">{error}</p> : null}

        <TicketWorkspaceToolbar
          activeView={activeView}
          boardCount={boardTickets.length}
          pendingCount={pendingTickets.length}
          search={search}
          setActiveView={setActiveView}
          setSearch={setSearch}
        />

        {activeView === 'queue' ? (
          <TicketApprovalTable
            isLoading={isLoading}
            isMutating={isMutating}
            onApprove={handleApprove}
            onDecline={handleDecline}
            onOpen={(ticket) => setSelectedTicketId(ticket.id)}
            tickets={pendingTickets}
          />
        ) : (
          <TicketKanbanBoard
            isLoading={isLoading}
            isMutating={isMutating}
            onMoveTicket={handleMove}
            onOpenTicket={(ticket) => setSelectedTicketId(ticket.id)}
            tickets={boardTickets}
          />
        )}
      </div>

      {selectedTicket ? (
        <TicketWorkflowDetailModal
          isMutating={isMutating}
          onApprove={handleApprove}
          onClose={() => setSelectedTicketId(null)}
          onDecline={handleDecline}
          onMove={handleMove}
          ticket={selectedTicket}
          key={selectedTicket.id}
        />
      ) : null}
    </main>
  )
}
