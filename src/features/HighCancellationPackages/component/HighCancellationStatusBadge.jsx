const toneClassNames = {
  danger: 'border-rose-500/25 bg-rose-500/10 text-rose-200',
  success: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-200',
  warning: 'border-amber-500/25 bg-amber-500/10 text-amber-100',
}

export function HighCancellationStatusBadge({ label, severity }) {
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${toneClassNames[severity]}`}>
      {label}
    </span>
  )
}
