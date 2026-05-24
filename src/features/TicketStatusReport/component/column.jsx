export const ticketStatusReportColumns = [
  {
    id: 'status',
    label: 'Status',
    render: (item) => (
      <div className="flex items-center gap-3">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
        <span className="font-semibold text-white">{item.statusLabel}</span>
      </div>
    ),
    width: '220px',
  },
  {
    id: 'totalTickets',
    label: 'Ticket Count',
    render: (item) => <span className="font-bold text-blue-200">{item.totalTicketsLabel}</span>,
    width: '160px',
  },
  {
    id: 'share',
    label: 'Share of Total',
    render: (item) => <span className="text-amber-200">{item.shareLabel}</span>,
    width: '160px',
  },
]
