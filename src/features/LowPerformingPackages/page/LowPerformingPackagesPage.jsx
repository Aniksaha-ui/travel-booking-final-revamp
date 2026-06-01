import { AlertTriangle, Printer, RefreshCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import AdminDataTable, { AdminTableButton } from '../../../components/ui/AdminDataTable'
import { ReportHubBackLink } from '../../Reports/component/ReportHubBackLink.jsx'
import { lowPerformingPackagesColumns } from '../component/column.jsx'
import { LowPerformingPackagesOverview } from '../component/LowPerformingPackagesOverview.jsx'
import { LOW_PERFORMING_PACKAGES_COPY } from '../constants/lowPerformingPackages.constants'
import useLowPerformingPackages from '../hooks/useLowPerformingPackages'
import { filterLowPerformingPackages } from '../utils/lowPerformingPackagesUtils'

export default function LowPerformingPackagesPage() {
  const { data, error, isLoading, refresh } = useLowPerformingPackages()
  const { rows, summary } = data
  const [search, setSearch] = useState('')
  const filteredRows = useMemo(() => filterLowPerformingPackages(rows, search), [rows, search])

  return (
    <main className="routes-page">
      <div className="routes-page__inner">
        <ReportHubBackLink />
        <header className="routes-page__header">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="routes-page__title">
                <AlertTriangle size={20} color="#f59e0b" />
                <h1>{LOW_PERFORMING_PACKAGES_COPY.title}</h1>
              </div>
              <p className="routes-page__subtitle">{LOW_PERFORMING_PACKAGES_COPY.subtitle}</p>
            </div>

            <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#332d30] bg-[#171314] px-4 text-sm font-semibold text-[#fbd38d]">
              <AlertTriangle size={16} />
              <span>{summary.totalPackagesLabel} packages need attention</span>
            </div>
          </div>
        </header>

        <LowPerformingPackagesOverview isLoading={isLoading} rows={filteredRows} />
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
                Export Data
              </AdminTableButton>
            </>
          }
          columns={lowPerformingPackagesColumns}
          data={filteredRows}
          emptyMessage="No low-performing packages identified. All packages are meeting expectations."
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
              ? `Showing ${filteredRows.length} filtered packages from ${rows.length} low-performing packages`
              : `Showing ${filteredRows.length} low-performing packages`
          }
          search={search}
          searchPlaceholder={LOW_PERFORMING_PACKAGES_COPY.searchPlaceholder}
          onSearchChange={setSearch}
        />
      </div>
    </main>
  )
}
