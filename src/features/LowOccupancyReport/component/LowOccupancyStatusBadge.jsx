export function LowOccupancyStatusBadge({ label, severity }) {
  return <span className={`occupancy-status-badge is-${severity}`}>{label}</span>
}
