import { AlertTriangle, Printer, RefreshCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import AdminDataTable, { AdminTableButton } from '../../../components/ui/AdminDataTable'
import { ReportHubBackLink } from '../../Reports/component/ReportHubBackLink.jsx'
import { highCancellationPackagesColumns } from '../component/column.jsx'
import { HighCancellationPackagesOverview } from '../component/HighCancellationPackagesOverview.jsx'
import { HIGH_CANCELLATION_PACKAGES_COPY } from '../constants/highCancellationPackages.constants'
import useHighCancellationPackages from '../hooks/useHighCancellationPackages'
import { filterHighCancellationRows } from '../utils/highCancellationPackagesUtils'

export default function HighCancellationPackagesPage() {
  const { data, error, isLoading, refresh } = useHighCancellationPackages()
  const { rows, summary } = data
  const [search, setSearch] = useState('')
  const filteredRows = useMemo(() => filterHighCancellationRows(rows, search), [rows, search])

  return (
    <main className="routes-page">
      <div className="routes-page__inner">
        <ReportHubBackLink />
        <header className="routes-page__header">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="routes-page__title">
                <AlertTriangle size={20} color="#f59e0b" />
                <h1>{HIGH_CANCELLATION_PACKAGES_COPY.title}</h1>
              </div>
              <p className="routes-page__subtitle">{HIGH_CANCELLATION_PACKAGES_COPY.subtitle}</p>
            </div>

            <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#332d30] bg-[#171314] px-4 text-sm font-semibold text-[#fbd38d]">
              <AlertTriangle size={16} />
              <span>{summary.averageCancellationRateLabel} average cancellation rate</span>
            </div>
          </div>
        </header>

        <HighCancellationPackagesOverview isLoading={isLoading} rows={filteredRows} summary={summary} />
        {error ? <p className="month-balance-alert">{error}</p> : null}

        <AdminDataTable
          actions={
            <>
              <AdminTableButton className={isLoading ? 'opacity-60' : ''} disabled={isLoading} onClick={refresh}>
                <RefreshCcw size={14} />
                Refresh
              </AdminTableButton>
              <AdminTableButton onClick={() => window.print()}>
                <Printer size={14} />
                Print Report
              </AdminTableButton>
            </>
          }
          columns={highCancellationPackagesColumns}
          data={filteredRows}
          emptyMessage="No high cancellation data found."
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
              ? `Showing ${filteredRows.length} filtered packages from ${rows.length} cancellation records`
              : `Showing ${filteredRows.length} cancellation records`
          }
          search={search}
          searchPlaceholder={HIGH_CANCELLATION_PACKAGES_COPY.searchPlaceholder}
          onSearchChange={setSearch}
        />
      </div>
    </main>
  )
}
