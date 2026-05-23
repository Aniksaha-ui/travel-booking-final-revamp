import { ExternalLink, RefreshCcw, ShieldCheck, X, XCircle } from 'lucide-react'
import { useState } from 'react'
import { TicketStatusBadge } from './TicketStatusBadge.jsx'

export function TicketWorkflowDetailModal({
  isMutating,
  onApprove,
  onClose,
  onDecline,
  onMove,
  ticket,
}) {
  const [remarks, setRemarks] = useState(ticket?.resolvedRemarks || '')

  if (!ticket) {
    return null
  }

  const isPendingApproval = ticket.workflowKey === 'pendingApproval'
  const isProcessing = ticket.workflowKey === 'processing'
  const isTerminal = ticket.workflowKey === 'closed' || ticket.workflowKey === 'declined'

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/65 p-4">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-[#332d30] bg-[#171314] shadow-2xl shadow-black/40">
        <header className="flex items-start justify-between gap-4 border-b border-[#2d282b] px-6 py-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase text-[#7ea1ff]">#{ticket.id}</span>
              <TicketStatusBadge ticket={ticket} />
            </div>
            <h2 className="mt-3 text-xl font-bold text-white">{ticket.title}</h2>
            <p className="mt-2 text-sm leading-6 text-[#b4c5df]">{ticket.remarks}</p>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#332d30] bg-[#231f21] text-[#c5d9f7] transition hover:bg-white/5 hover:text-white"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </header>

        <div className="grid gap-6 px-6 py-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.85fr)]">
          <section className="space-y-6">
            <article className="rounded-lg border border-[#332d30] bg-[#231f21] p-5">
              <p className="text-[11px] font-bold uppercase text-[#7ea1ff]">Description</p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#d5e1f4]">
                {ticket.description}
              </p>
            </article>

            <article className="rounded-lg border border-[#332d30] bg-[#231f21] p-5">
              <p className="text-[11px] font-bold uppercase text-[#7ea1ff]">Resolution Notes</p>
              <textarea
                className="mt-3 min-h-[140px] w-full rounded-lg border border-[#332d30] bg-[#171314] px-3 py-3 text-sm text-white outline-none transition placeholder:text-[#70798a] focus:border-blue-500/40"
                onChange={(event) => setRemarks(event.target.value)}
                placeholder="Add closure or decline notes so the board keeps a clean audit trail."
                value={remarks}
              />
            </article>
          </section>

          <aside className="space-y-4">
            <article className="rounded-lg border border-[#332d30] bg-[#231f21] p-5">
              <p className="text-[11px] font-bold uppercase text-[#7ea1ff]">Ticket Details</p>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="text-[#8fa0bd]">Raised By</dt>
                  <dd className="mt-1 font-semibold text-white">{ticket.customerName}</dd>
                </div>
                <div>
                  <dt className="text-[#8fa0bd]">Created</dt>
                  <dd className="mt-1 font-semibold text-white">{ticket.createdAtLabel}</dd>
                </div>
                <div>
                  <dt className="text-[#8fa0bd]">Last Updated</dt>
                  <dd className="mt-1 font-semibold text-white">{ticket.updatedAtLabel}</dd>
                </div>
                <div>
                  <dt className="text-[#8fa0bd]">Resolution Status</dt>
                  <dd className="mt-1 font-semibold text-white">{ticket.resolvedStatusLabel}</dd>
                </div>
                <div>
                  <dt className="text-[#8fa0bd]">Resolved By</dt>
                  <dd className="mt-1 font-semibold text-white">{ticket.resolvedByName}</dd>
                </div>
                {ticket.attachmentUrl ? (
                  <div>
                    <dt className="text-[#8fa0bd]">Attachment</dt>
                    <dd className="mt-2">
                      <a
                        className="inline-flex items-center gap-2 rounded-md border border-[#332d30] bg-[#171314] px-3 py-2 text-sm font-semibold text-[#c5d9f7] transition hover:bg-white/5 hover:text-white"
                        href={ticket.attachmentUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        View file
                        <ExternalLink size={14} />
                      </a>
                    </dd>
                  </div>
                ) : null}
              </dl>
            </article>

            <article className="rounded-lg border border-[#332d30] bg-[#231f21] p-5">
              <p className="text-[11px] font-bold uppercase text-[#7ea1ff]">Actions</p>

              <div className="mt-4 flex flex-col gap-3">
                {isPendingApproval ? (
                  <>
                    <button
                      type="button"
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={isMutating}
                      onClick={() => onApprove(ticket)}
                    >
                      <ShieldCheck size={16} />
                      Accept and Move to Board
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={isMutating}
                      onClick={() => onDecline(ticket, remarks)}
                    >
                      <XCircle size={16} />
                      Decline Issue
                    </button>
                  </>
                ) : null}

                {isProcessing ? (
                  <>
                    <button
                      type="button"
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={isMutating}
                      onClick={() => onMove(ticket, 'closed', remarks)}
                    >
                      <ShieldCheck size={16} />
                      Mark as Closed
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={isMutating}
                      onClick={() => onMove(ticket, 'declined', remarks)}
                    >
                      <XCircle size={16} />
                      Move to Declined
                    </button>
                  </>
                ) : null}

                {isTerminal ? (
                  <button
                    type="button"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 text-sm font-semibold text-blue-200 transition hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isMutating}
                    onClick={() => onMove(ticket, 'processing', remarks)}
                  >
                    <RefreshCcw size={16} />
                    Reopen to Processing
                  </button>
                ) : null}

                <button
                  type="button"
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-[#332d30] bg-[#171314] text-sm font-semibold text-[#c5d9f7] transition hover:bg-white/5 hover:text-white"
                  onClick={onClose}
                >
                  Close Panel
                </button>
              </div>
            </article>
          </aside>
        </div>
      </div>
    </div>
  )
}
