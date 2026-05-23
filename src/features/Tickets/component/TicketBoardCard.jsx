import { CalendarClock, GripVertical, MessageSquareText, UserRound } from 'lucide-react'
import { TicketStatusBadge } from './TicketStatusBadge.jsx'

export function TicketBoardCard({ disabled, isDragging, onDragEnd, onOpen, onStartDrag, ticket }) {
  return (
    <article
      className={`rounded-lg border border-[#332d30] bg-[#171314] p-4 shadow-sm transition ${
        isDragging ? 'opacity-50 ring-2 ring-blue-400/30' : 'hover:border-[#4a4348] hover:bg-[#1d181a]'
      }`}
      draggable={!disabled}
      onClick={() => onOpen(ticket)}
      onDragEnd={onDragEnd}
      onDragStart={(event) => onStartDrag(event, ticket)}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-bold uppercase text-[#7ea1ff]">#{ticket.id}</div>
          <h3 className="mt-1 text-sm font-semibold text-white">{ticket.title}</h3>
        </div>
        <GripVertical size={16} className="mt-0.5 shrink-0 text-[#62718c]" />
      </div>

      <p className="mt-3 text-sm leading-6 text-[#b4c5df]">{ticket.remarks}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <TicketStatusBadge ticket={ticket} />
        <span className="inline-flex items-center rounded-full border border-[#332d30] px-2.5 py-1 text-[11px] font-semibold text-[#c5d9f7]">
          {ticket.ageLabel}
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-xs text-[#8fa0bd]">
        <div className="flex items-center gap-2">
          <UserRound size={14} />
          <span className="truncate">{ticket.customerName}</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarClock size={14} />
          <span>{ticket.createdAtLabel}</span>
        </div>
        {ticket.resolvedRemarks ? (
          <div className="flex items-start gap-2">
            <MessageSquareText size={14} className="mt-0.5 shrink-0" />
            <span className="line-clamp-2">{ticket.resolvedRemarks}</span>
          </div>
        ) : null}
      </div>
    </article>
  )
}
