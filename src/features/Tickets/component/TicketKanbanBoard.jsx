import { Boxes } from 'lucide-react'
import { useMemo, useState } from 'react'
import { DashboardSection } from '../../../components/ui/DashboardSection'
import { TICKET_BOARD_COLUMNS } from '../constants/tickets.constants'
import { TicketBoardColumn } from './TicketBoardColumn.jsx'

function EmptyState({ message }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center px-5 py-8 text-center text-sm font-medium text-[#8fa0bd]">
      {message}
    </div>
  )
}

export function TicketKanbanBoard({
  isLoading,
  isMutating,
  onMoveTicket,
  onOpenTicket,
  tickets,
}) {
  const [activeDragId, setActiveDragId] = useState(null)

  const groupedTickets = useMemo(
    () =>
      TICKET_BOARD_COLUMNS.reduce((result, column) => {
        result[column.key] = tickets.filter((ticket) => ticket.workflowKey === column.key)
        return result
      }, {}),
    [tickets],
  )

  const activeTicket = tickets.find((ticket) => String(ticket.id) === String(activeDragId)) ?? null

  const handleDropTicket = async (targetColumnKey) => {
    if (!activeTicket) {
      return
    }

    if (activeTicket.workflowKey !== targetColumnKey) {
      await onMoveTicket(activeTicket, targetColumnKey)
    }

    setActiveDragId(null)
  }

  const handleStartDrag = (event, ticket) => {
    event.dataTransfer.effectAllowed = 'move'
    setActiveDragId(ticket.id)
  }

  return (
    <DashboardSection
      title="Resolution Workflow"
      icon={<Boxes size={16} className="text-blue-400" />}
      action={
        <span className="rounded-full border border-[#332d30] bg-[#171314] px-2.5 py-1 text-[11px] font-bold text-[#9fb2d0]">
          {tickets.length} on board
        </span>
      }
      bodyClassName="border-t border-[#2d282b] p-4"
    >
      {isLoading ? (
        <EmptyState message="Loading the workflow board..." />
      ) : tickets.length ? (
        <div className="grid gap-4 xl:grid-cols-3">
          {TICKET_BOARD_COLUMNS.map((column) => (
            <TicketBoardColumn
              key={column.key}
              activeDragId={activeDragId}
              column={column}
              disabled={isMutating}
              onDragEnd={() => setActiveDragId(null)}
              onDropTicket={handleDropTicket}
              onOpenTicket={onOpenTicket}
              onStartDrag={handleStartDrag}
              tickets={groupedTickets[column.key] ?? []}
            />
          ))}
        </div>
      ) : (
        <EmptyState message="Accepted tickets will appear here once the queue starts moving." />
      )}
    </DashboardSection>
  )
}
