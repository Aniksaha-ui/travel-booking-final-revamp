export function VehicleTrackingStatusBadge({ status, label }) {
  return (
    <span className={`tracking-status-badge is-${status}`}>
      {label}
    </span>
  )
}
