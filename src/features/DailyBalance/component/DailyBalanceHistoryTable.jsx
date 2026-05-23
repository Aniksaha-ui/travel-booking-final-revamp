import { Eye, FileSpreadsheet } from 'lucide-react'
import { DashboardSection } from '../../../components/ui/DashboardSection'
import { HistoryColumns } from './column.jsx'
import { DailyBalancePagination } from './DailyBalancePagination'

function HistoryMobileCard({ onPreview, report }) {
  return (
    <article className="rounded-lg border border-[#332d30] bg-[#231f21] p-4">
      <p className="text-sm font-bold text-white">{report.reportName}</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8fa0bd]">Month</p>
          <p className="mt-1 text-sm text-white">{report.reportMonthLabel}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8fa0bd]">Created At</p>
          <p className="mt-1 text-sm text-white">{report.createdAtLabel}</p>
        </div>
      </div>
      <button
        type="button"
        className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg border border-[#1e40af] bg-[#17214a] px-3 text-sm font-semibold text-[#bfdbfe]"
        onClick={() => onPreview(report)}
      >
        <Eye size={16} />
        View report
      </button>
    </article>
  )
}

export function DailyBalanceHistoryTable({
  error,
  isLoading,
  onPreview,
  page,
  pagination,
  reports,
  setPage,
}) {
  return (
    <DashboardSection
      title="History of Previous Months"
      icon={<FileSpreadsheet size={16} className="text-cyan-400" />}
      className="min-w-0"
      bodyClassName="border-t border-[#2d282b]"
    >
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="routes-table">
            <thead>
              <HistoryColumns />
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="routes-table__empty">
                    Loading previous reports...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="routes-table__empty">
                    {error}
                  </td>
                </tr>
              ) : reports.length ? (
                reports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.reportName}</td>
                    <td className="routes-table__muted">{report.reportMonthLabel}</td>
                    <td className="routes-table__muted">{report.createdAtLabel}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="inline-flex h-8 items-center gap-2 rounded-lg border border-[#1e40af] bg-[#17214a] px-3 text-xs font-semibold text-[#bfdbfe]"
                        onClick={() => onPreview(report)}
                      >
                        <Eye size={14} />
                        Preview
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="routes-table__empty">
                    No previous reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 p-4 md:hidden">
        {isLoading ? (
          <div className="rounded-lg border border-[#332d30] bg-[#231f21] px-4 py-5 text-center text-sm font-medium text-[#8fa0bd]">
            Loading previous reports...
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-900/60 bg-red-950/20 px-4 py-5 text-center text-sm font-medium text-red-200">
            {error}
          </div>
        ) : reports.length ? (
          reports.map((report) => (
            <HistoryMobileCard key={report.id} onPreview={onPreview} report={report} />
          ))
        ) : (
          <div className="rounded-lg border border-[#332d30] bg-[#231f21] px-4 py-5 text-center text-sm font-medium text-[#8fa0bd]">
            No previous reports found.
          </div>
        )}
      </div>

      <div className="routes-table-footer">
        <p>
          Showing {pagination.from || 1}-{pagination.to || reports.length} of {pagination.total || reports.length} reports
        </p>
        <DailyBalancePagination
          isLoading={isLoading}
          page={page}
          pagination={pagination}
          setPage={setPage}
        />
      </div>
    </DashboardSection>
  )
}
