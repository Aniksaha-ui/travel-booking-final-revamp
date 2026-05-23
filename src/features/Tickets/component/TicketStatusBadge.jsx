import { getTicketStatusTone } from '../utils/ticketUtils'

export function TicketStatusBadge({ ticket }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase ${getTicketStatusTone(ticket)}`}
    >
      {ticket.workflowLabel}
    </span>
  )
}

