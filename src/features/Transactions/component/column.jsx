export const transactionsColumns = [
  {
    accessor: 'transactionDateLabel',
    id: 'transactionDate',
    label: 'Transaction Date',
    width: '150px',
  },
  {
    id: 'transactionId',
    label: 'Transaction ID',
    render: (item) => <span className="font-semibold text-white">{item.transactionIdLabel}</span>,
    width: '160px',
  },
  {
    accessor: 'paymentIdLabel',
    id: 'paymentId',
    label: 'Payment ID',
    width: '150px',
  },
  {
    accessor: 'bookingIdLabel',
    id: 'bookingId',
    label: 'Booking ID',
    width: '130px',
  },
  {
    accessor: 'transactionReference',
    id: 'transactionReference',
    label: 'Reference',
    width: '200px',
  },
  {
    accessor: 'purposeLabel',
    id: 'purpose',
    label: 'Purpose',
    width: '170px',
  },
  {
    id: 'paymentMethod',
    label: 'Payment Method',
    render: (item) => (
      <span
        className={`inline-flex min-w-[86px] justify-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${item.paymentMethodToneClassName}`}
      >
        {item.paymentMethodLabel}
      </span>
    ),
    width: '160px',
  },
  {
    id: 'amount',
    label: 'Amount',
    render: (item) => <span className="font-semibold text-white">{item.amountLabel}</span>,
    width: '140px',
  },
]

