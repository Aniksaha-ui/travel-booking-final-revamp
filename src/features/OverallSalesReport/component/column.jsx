export const overallSalesColumns = [
  {
    id: 'source',
    label: 'Source',
    render: (item) => (
      <div className="flex items-center gap-3">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
        <span className="font-semibold text-white">{item.source}</span>
      </div>
    ),
    width: '260px',
  },
  {
    id: 'totalAmount',
    label: 'Total Sales',
    render: (item) => <span className="font-bold text-blue-200">{item.totalAmountLabel}</span>,
    width: '220px',
  },
  {
    id: 'share',
    label: 'Share of Total',
    render: (item) => <span className="font-semibold text-amber-200">{item.shareLabel}</span>,
    width: '160px',
  },
]
