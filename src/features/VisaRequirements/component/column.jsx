const Flag = ({ children, enabled, tone = 'blue' }) => {
  const activeClass = tone === 'emerald'
    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200'
    : 'border-blue-500/20 bg-blue-500/10 text-blue-200'
  return <span className={`inline-flex min-w-[56px] justify-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[.08em] ${enabled ? activeClass : 'border-slate-500/20 bg-slate-500/10 text-slate-300'}`}>{children}</span>
}

export const visaRequirementsColumns = [
  { id: 'serial', label: 'SL', accessor: 'serial', width: '64px' },
  { id: 'document', label: 'Document', width: '210px', render: (row) => <div><p className="font-semibold text-white">{row.documentName}</p><p className="mt-1 text-xs text-[#8fa0bd]">{row.instructions}</p></div> },
  { id: 'country', label: 'Country', accessor: 'countryName', width: '160px' },
  { id: 'visa', label: 'Visa Type', accessor: 'visaName', width: '170px' },
  { id: 'required', label: 'Required', width: '110px', render: (row) => <Flag enabled={row.isRequired} tone="emerald">{row.isRequired ? 'Yes' : 'No'}</Flag> },
  { id: 'multiple', label: 'Multiple', width: '115px', render: (row) => <Flag enabled={row.allowMultiple}>{row.allowMultiple ? 'Yes' : 'No'}</Flag> },
  { id: 'order', label: 'Order', accessor: 'sortOrder', width: '80px' },
]
