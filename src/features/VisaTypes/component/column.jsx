export const visaTypesColumns = [
  {
    accessor: 'serial',
    id: 'serial',
    label: 'SL',
    width: '72px',
  },
  {
    id: 'country',
    label: 'Country',
    render: (item) => <span className="font-semibold text-white">{item.countryName}</span>,
    width: '180px',
  },
  {
    accessor: 'titleLabel',
    id: 'title',
    label: 'Title',
    width: '180px',
  },
  {
    id: 'visaName',
    label: 'Visa Name',
    render: (item) => <span className="font-semibold text-white">{item.visaName}</span>,
    width: '220px',
  },
  {
    accessor: 'feeLabel',
    id: 'fee',
    label: 'Fee',
    width: '150px',
  },
  {
    accessor: 'currency',
    id: 'currency',
    label: 'Currency',
    width: '110px',
  },
  {
    accessor: 'processingDaysLabel',
    id: 'processingDays',
    label: 'Processing Days',
    width: '150px',
  },
  {
    accessor: 'entryTypeLabel',
    id: 'entryType',
    label: 'Entry Type',
    width: '140px',
  },
  {
    id: 'status',
    label: 'Status',
    render: (item) => (
      <span
        className={`inline-flex min-w-[86px] justify-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${
          item.isActive
            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200'
            : 'border-rose-500/20 bg-rose-500/10 text-rose-200'
        }`}
      >
        {item.statusLabel}
      </span>
    ),
    width: '130px',
  },
]
