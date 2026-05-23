import { Check, Eye, X } from 'lucide-react'
import { DashboardSection } from '../../../components/ui/DashboardSection'
import { ticketApprovalColumns } from './column.jsx'
import { TicketStatusBadge } from './TicketStatusBadge.jsx'

function EmptyState({ message }) {
  return (
    <div className="flex min-h-[180px] items-center justify-center px-5 py-8 text-center text-sm font-medium text-[#8fa0bd]">
      {message}
    </div>
  )
}

export function TicketApprovalTable({
  isLoading,
  isMutating,
  onApprove,
  onDecline,
  onOpen,
  tickets,
}) {
  return (
    <DashboardSection
      title="Incoming Issues"
      icon={<Eye size={16} className="text-amber-300" />}
      action={
        <span className="rounded-full border border-[#332d30] bg-[#171314] px-2.5 py-1 text-[11px] font-bold text-[#9fb2d0]">
          {tickets.length} waiting
        </span>
      }
      bodyClassName="border-t border-[#2d282b]"
    >
      {isLoading ? (
        <EmptyState message="Loading the issue queue..." />
      ) : tickets.length ? (
        <div className="overflow-x-auto">
          <table className="routes-table">
            <thead>
              <tr>
                {ticketApprovalColumns.map((column) => (
                  <th
                    key={column.key}
                    className={column.key === 'action' ? 'text-right' : undefined}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="w-[120px]">
                    <div className="text-sm font-bold text-white">#{ticket.id}</div>
                    <div className="mt-1 text-xs text-[#8fa0bd]">{ticket.createdAtLabel}</div>
                  </td>
                  <td className="w-[34%]">
                    <div className="font-semibold text-white">{ticket.title}</div>
                    <div className="mt-1 text-sm text-[#b4c5df]">{ticket.remarks}</div>
                  </td>
                  <td className="w-[180px]">
                    <div className="flex flex-col items-start gap-2">
                      <TicketStatusBadge ticket={ticket} />
                      <span className="text-xs font-medium text-[#8fa0bd]">
                        Resolution {ticket.resolvedStatusLabel}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="font-semibold text-white">{ticket.customerName}</div>
                    <div className="mt-1 text-xs text-[#8fa0bd]">Updated {ticket.updatedAtLabel}</div>
                  </td>
                  <td className="w-[90px] text-[#b4c5df]">{ticket.ageLabel}</td>
                  <td className="w-[180px]">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#332d30] bg-[#171314] text-[#c5d9f7] transition hover:bg-white/5 hover:text-white"
                        onClick={() => onOpen(ticket)}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-9 items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={isMutating}
                        onClick={() => onApprove(ticket)}
                      >
                        <Check size={16} />
                        Accept
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-9 items-center gap-1 rounded-md border border-rose-500/20 bg-rose-500/10 px-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={isMutating}
                        onClick={() => onDecline(ticket)}
                      >
                        <X size={16} />
                        Decline
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState message="No issues are waiting for approval." />
      )}
    </DashboardSection>
  )
}

