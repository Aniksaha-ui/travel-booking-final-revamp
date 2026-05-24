import { CalendarRange } from 'lucide-react'

export function AccountHistoryFilters({
  draftEndDate,
  draftStartDate,
  hasChanges,
  isLoading,
  onApply,
  onEndDateChange,
  onReset,
  onStartDateChange,
}) {
  return (
    <div className="tracking-report-filter-group">
      <label className="tracking-report-date-field">
        <CalendarRange size={14} />
        <span>From</span>
        <input type="date" value={draftStartDate} onChange={(event) => onStartDateChange(event.target.value)} />
      </label>

      <label className="tracking-report-date-field">
        <CalendarRange size={14} />
        <span>To</span>
        <input type="date" value={draftEndDate} onChange={(event) => onEndDateChange(event.target.value)} />
      </label>

      <div className="tracking-report-filter-actions">
        <button type="button" className="routes-control routes-control--blue" disabled={isLoading} onClick={onApply}>
          Search
        </button>
        <button type="button" className="routes-control" disabled={isLoading || !hasChanges} onClick={onReset}>
          This Month
        </button>
      </div>
    </div>
  )
}

