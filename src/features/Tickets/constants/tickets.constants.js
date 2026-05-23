export const TICKET_PAGE_COPY = {
  subtitle:
    'Review incoming issues, approve actionable tickets, and move accepted work through a controlled resolution board.',
  title: 'Ticket Management',
}

export const TICKET_VIEW_OPTIONS = [
  {
    key: 'queue',
    label: 'Issue Queue',
  },
  {
    key: 'board',
    label: 'Workflow Board',
  },
]

export const TICKET_MAIN_STATUS_LABELS = ['Pending', 'Processing', 'Closed']
export const TICKET_RESOLUTION_STATUS_LABELS = ['Pending', 'Accepted', 'Declined']

export const TICKET_BOARD_COLUMNS = [
  {
    key: 'processing',
    title: 'Processing',
    description: 'Accepted tickets that are actively being handled by the operations team.',
    status: 1,
    resolvedStatus: 1,
    accentClassName: 'border-blue-500/25 bg-blue-500/10 text-blue-200',
    badgeClassName: 'bg-blue-500/10 text-blue-200 border-blue-500/20',
    dotClassName: 'bg-blue-400',
  },
  {
    key: 'closed',
    title: 'Closed',
    description: 'Resolved tickets that have already completed the delivery cycle.',
    status: 2,
    resolvedStatus: 1,
    accentClassName: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-200',
    badgeClassName: 'bg-emerald-500/10 text-emerald-200 border-emerald-500/20',
    dotClassName: 'bg-emerald-400',
  },
  {
    key: 'declined',
    title: 'Declined',
    description: 'Issues that were rejected, cancelled, or could not be moved forward.',
    status: 2,
    resolvedStatus: 2,
    accentClassName: 'border-rose-500/25 bg-rose-500/10 text-rose-200',
    badgeClassName: 'bg-rose-500/10 text-rose-200 border-rose-500/20',
    dotClassName: 'bg-rose-400',
  },
]

