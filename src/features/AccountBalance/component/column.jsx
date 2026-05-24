export const accountBalanceColumns = [
  {
    id: 'accountName',
    label: 'Account Name',
    render: (item) => <span className="font-semibold text-white">{item.accountName}</span>,
    width: '240px',
  },
  {
    id: 'accountNumber',
    label: 'Account Number',
    render: (item) => <span className="font-mono text-[#c5d9f7]">{item.accountNumber}</span>,
    width: '180px',
  },
  {
    id: 'amount',
    label: 'Amount',
    render: (item) => <span className="font-semibold text-white">{item.amountLabel}</span>,
    width: '150px',
  },
  {
    id: 'type',
    label: 'Type',
    render: (item) => (
      <span
        className={`inline-flex min-w-[96px] justify-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${item.typeToneClassName}`}
      >
        {item.typeLabel}
      </span>
    ),
    width: '150px',
  },
]

