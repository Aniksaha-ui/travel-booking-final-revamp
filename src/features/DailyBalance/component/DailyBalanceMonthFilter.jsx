import { CalendarRange } from 'lucide-react'

export function DailyBalanceMonthFilter({
  draftMonth,
  hasChanges,
  isLoading,
  onApply,
  onMonthChange,
  onReset,
}) {
  return (
    <div className="tracking-report-filter-group">
      <label className="tracking-report-date-field">
        <CalendarRange size={14} />
        <span>Month</span>
        <input
          type="month"
          value={draftMonth}
          onChange={(event) => onMonthChange(event.target.value)}
        />
      </label>

      <div className="tracking-report-filter-actions">
        <button
          type="button"
          className="routes-control routes-control--blue"
          disabled={isLoading || !hasChanges}
          onClick={onApply}
        >
          Apply
        </button>
        <button
          type="button"
          className="routes-control"
          disabled={isLoading}
          onClick={onReset}
        >
          This Month
        </button>
      </div>
    </div>
  )
}
