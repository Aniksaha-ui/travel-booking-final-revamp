export const visaCountriesColumns = [
  {
    accessor: 'serial',
    id: 'serial',
    label: 'SL',
    width: '72px',
  },
  {
    id: 'name',
    label: 'Name',
    render: (item) => (
      <div className="space-y-2">
        <div className="font-semibold text-white">{item.name}</div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${
              item.isPopular
                ? 'border-blue-500/20 bg-blue-500/10 text-blue-200'
                : 'border-slate-500/20 bg-slate-500/10 text-slate-300'
            }`}
          >
            {item.isPopular ? 'Popular' : 'Standard'}
          </span>
          {item.flag ? <span className="text-xs text-[#8fa0bd]">Flag linked</span> : null}
        </div>
      </div>
    ),
    width: '240px',
  },
  {
    accessor: 'isoCodeLabel',
    id: 'isoCode',
    label: 'ISO Code',
    width: '120px',
  },
  {
    accessor: 'nationalityName',
    id: 'nationality',
    label: 'Nationality',
    width: '190px',
  },
  {
    accessor: 'displayOrderLabel',
    id: 'displayOrder',
    label: 'Display Order',
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
    width: '140px',
  },
]
