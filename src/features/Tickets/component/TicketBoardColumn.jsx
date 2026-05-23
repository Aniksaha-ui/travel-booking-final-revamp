import { TicketBoardCard } from './TicketBoardCard.jsx'

export function TicketBoardColumn({
  activeDragId,
  column,
  disabled,
  onDragEnd,
  onDropTicket,
  onOpenTicket,
  onStartDrag,
  tickets,
}) {
  const handleDrop = async (event) => {
    event.preventDefault()
    await onDropTicket(column.key)
  }

  return (
    <section
      className="flex min-h-[520px] flex-col rounded-lg border border-[#332d30] bg-[#231f21]"
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
    >
      <header className="border-b border-[#2d282b] px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${column.dotClassName}`} />
              <h3 className="text-sm font-bold text-white">{column.title}</h3>
            </div>
            <p className="mt-2 text-xs leading-5 text-[#8fa0bd]">{column.description}</p>
          </div>
          <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${column.badgeClassName}`}>
            {tickets.length}
          </span>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-3 p-4">
        {tickets.length ? (
          tickets.map((ticket) => (
            <TicketBoardCard
              key={ticket.id}
              disabled={disabled}
              isDragging={String(activeDragId) === String(ticket.id)}
              onDragEnd={onDragEnd}
              onOpen={onOpenTicket}
              onStartDrag={onStartDrag}
              ticket={ticket}
            />
          ))
        ) : (
          <div className="flex min-h-[160px] flex-1 items-center justify-center rounded-lg border border-dashed border-[#332d30] bg-[#171314] px-5 py-8 text-center text-sm font-medium text-[#8fa0bd]">
            Drop a ticket here when its status changes.
          </div>
        )}
      </div>
    </section>
  )
}
