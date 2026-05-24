import { AlertTriangle, RefreshCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import AdminDataTable, { AdminTableButton } from '../../../components/ui/AdminDataTable'
import { lowOccupancyColumns } from '../component/column.jsx'
import { LowOccupancyReportOverview } from '../component/LowOccupancyReportOverview.jsx'
import { LOW_OCCUPANCY_REPORT_COPY } from '../constants/lowOccupancyReport.constants'
import useLowOccupancyReport from '../hooks/useLowOccupancyReport'
import { filterLowOccupancyRows } from '../utils/lowOccupancyReportUtils'

export default function LowOccupancyReportPage() {
  const { data, error, isLoading, refresh } = useLowOccupancyReport()
  const { rows, summary } = data
  const [search, setSearch] = useState('')

  const filteredRows = useMemo(() => filterLowOccupancyRows(rows, search), [rows, search])

  return (
    <main className="routes-page">
      <div className="routes-page__inner">
        <header className="routes-page__header">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="routes-page__title">
                <AlertTriangle size={20} color="#f59e0b" />
                <h1>{LOW_OCCUPANCY_REPORT_COPY.title}</h1>
              </div>
              <p className="routes-page__subtitle">{LOW_OCCUPANCY_REPORT_COPY.subtitle}</p>
            </div>

            <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#332d30] bg-[#171314] px-4 text-sm font-semibold text-[#fbd38d]">
              <AlertTriangle size={16} />
              <span>{summary.flaggedTripsLabel} trips need attention</span>
            </div>
          </div>
        </header>

        <LowOccupancyReportOverview isLoading={isLoading} rows={filteredRows} />
        {error ? <p className="month-balance-alert">{error}</p> : null}

        <AdminDataTable
          actions={
            <AdminTableButton className={isLoading ? 'opacity-60' : ''} disabled={isLoading} onClick={refresh}>
              <RefreshCcw size={14} />
              Refresh
            </AdminTableButton>
          }
          columns={lowOccupancyColumns}
          data={filteredRows}
          emptyMessage="No low occupancy trips are currently identified."
          isLoading={isLoading}
          pagination={{
            currentPage: 1,
            from: filteredRows.length ? 1 : 0,
            lastPage: 1,
            to: filteredRows.length,
            total: filteredRows.length,
          }}
          resultLabel={
            search
              ? `Showing ${filteredRows.length} filtered trips from ${rows.length} flagged trips`
              : `Showing ${filteredRows.length} flagged trips`
          }
          search={search}
          searchPlaceholder={LOW_OCCUPANCY_REPORT_COPY.searchPlaceholder}
          onSearchChange={setSearch}
        />
      </div>
    </main>
  )
}
