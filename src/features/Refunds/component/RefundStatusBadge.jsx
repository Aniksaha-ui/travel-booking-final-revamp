export function RefundStatusBadge({ label, status }) {
  return (
    <span className={`refund-status-badge ${status === 'disbursed' ? 'is-disbursed' : 'is-pending'}`}>
      {label}
    </span>
  )
}
