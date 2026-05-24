import { BriefcaseBusiness, RefreshCcw } from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminDataTable, { AdminTableButton } from '../../../components/ui/AdminDataTable'
import { APP_ROUTES } from '../../../constants/routes'
import { visaApplicationsColumns } from '../component/column.jsx'
import { VisaApplicationsOverview } from '../component/VisaApplicationsOverview.jsx'
import { VISA_APPLICATIONS_PAGE_COPY } from '../constants/visaApplications.constants'
import useVisaApplications from '../hooks/useVisaApplications'
import { buildVisaApplicationMetrics } from '../utils/visaApplicationsUtils'

export default function VisaApplicationsPage() {
  const navigate = useNavigate()
  const apiState = useVisaApplications()
  const metrics = useMemo(() => buildVisaApplicationMetrics(apiState.items), [apiState.items])

  const resultLabel = useMemo(() => {
    if (!apiState.pagination.total && !apiState.items.length) {
      return 'No visa applications found.'
    }

    const rangeLabel =
      apiState.pagination.from && apiState.pagination.to
        ? `${apiState.pagination.from}-${apiState.pagination.to}`
        : `${apiState.items.length}`

    return `Showing ${rangeLabel} of ${apiState.pagination.total || apiState.items.length} visa applications`
  }, [apiState.items.length, apiState.pagination.from, apiState.pagination.to, apiState.pagination.total])

  return (
    <main className="routes-page">
      <div className="routes-page__inner">
        <header className="routes-page__header">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="routes-page__title">
                <BriefcaseBusiness size={20} color="#4f83ff" />
                <h1>{VISA_APPLICATIONS_PAGE_COPY.title}</h1>
              </div>
              <p className="routes-page__subtitle">{VISA_APPLICATIONS_PAGE_COPY.subtitle}</p>
            </div>

            <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#332d30] bg-[#171314] px-4 text-sm font-semibold text-[#c5d9f7]">
              <BriefcaseBusiness size={16} />
              <span>{apiState.pagination.total || apiState.items.length} matched applications</span>
            </div>
          </div>
        </header>

        <VisaApplicationsOverview metrics={metrics} pagination={apiState.pagination} />
        {apiState.error ? <p className="month-balance-alert">{apiState.error}</p> : null}

        <AdminDataTable
          actions={
            <AdminTableButton
              className={apiState.isLoading ? 'opacity-60' : ''}
              disabled={apiState.isLoading}
              onClick={() => apiState.refresh()}
            >
              <RefreshCcw size={14} />
              Refresh
            </AdminTableButton>
          }
          columns={visaApplicationsColumns}
          data={apiState.items}
          emptyMessage="No visa applications found."
          isLoading={apiState.isLoading}
          onPageChange={apiState.setPage}
          onSearchChange={(value) => {
            apiState.setPage(1)
            apiState.setSearch(value)
          }}
          pagination={apiState.pagination}
          renderRowActions={(application) => (
            <button
              type="button"
              className="refund-action-button"
              onClick={() => navigate(`${APP_ROUTES.visaApplications}/${application.id}`)}
            >
              View
            </button>
          )}
          resultLabel={resultLabel}
          rowActionsWidth="88px"
          search={apiState.search}
          searchPlaceholder={VISA_APPLICATIONS_PAGE_COPY.searchPlaceholder}
        />
      </div>
    </main>
  )
}
