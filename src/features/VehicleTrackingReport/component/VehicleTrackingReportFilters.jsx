import { CalendarRange } from 'lucide-react'

export function VehicleTrackingReportFilters({
  draftEndDate,
  draftStartDate,
  hasActiveRange,
  isLoading,
  onApply,
  onClear,
  onEndDateChange,
  onStartDateChange,
}) {
  return (
    <div className="tracking-report-filter-group">
      <label className="tracking-report-date-field">
        <CalendarRange size={14} />
        <span>From</span>
        <input
          type="date"
          value={draftStartDate}
          onChange={(event) => onStartDateChange(event.target.value)}
        />
      </label>

      <label className="tracking-report-date-field">
        <CalendarRange size={14} />
        <span>To</span>
        <input
          type="date"
          value={draftEndDate}
          onChange={(event) => onEndDateChange(event.target.value)}
        />
      </label>

      <div className="tracking-report-filter-actions">
        <button
          type="button"
          className="routes-control routes-control--blue"
          disabled={isLoading}
          onClick={onApply}
        >
          Apply
        </button>
        <button
          type="button"
          className="routes-control"
          disabled={isLoading || !hasActiveRange}
          onClick={onClear}
        >
          Clear
        </button>
      </div>
    </div>
  )
}
