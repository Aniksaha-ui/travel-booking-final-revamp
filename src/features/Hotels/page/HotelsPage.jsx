import { Eye, Hotel, Pencil, Plus, RefreshCcw } from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminDataTable, { AdminTableButton } from '../../../components/ui/AdminDataTable'
import { APP_ROUTES } from '../../../constants/routes'
import { hotelColumns } from '../component/column.jsx'
import { HotelDetailsModal } from '../component/HotelDetailsModal.jsx'
import { HotelsOverview } from '../component/HotelsOverview.jsx'
import { HOTELS_PAGE_COPY } from '../constants/hotels.constants'
import useHotels from '../hooks/useHotels'
import { buildHotelMetrics } from '../utils/hotelsUtils'

export default function HotelsPage() {
  const navigate = useNavigate()
  const apiState = useHotels()
  const metrics = useMemo(() => buildHotelMetrics(apiState.items), [apiState.items])

  const resultLabel = useMemo(() => {
    if (!apiState.pagination.total && !apiState.items.length) {
      return 'No hotels found.'
    }

    const rangeLabel =
      apiState.pagination.from && apiState.pagination.to
        ? `${apiState.pagination.from}-${apiState.pagination.to}`
        : `${apiState.items.length}`

    return `Showing ${rangeLabel} of ${apiState.pagination.total || apiState.items.length} hotels`
  }, [apiState.items.length, apiState.pagination.from, apiState.pagination.to, apiState.pagination.total])

  return (
    <main className="routes-page">
      <div className="routes-page__inner">
        <header className="routes-page__header">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="routes-page__title">
                <Hotel size={20} color="#4f83ff" />
                <h1>{HOTELS_PAGE_COPY.title}</h1>
              </div>
              <p className="routes-page__subtitle">{HOTELS_PAGE_COPY.subtitle}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#332d30] bg-[#171314] px-4 text-sm font-semibold text-[#c5d9f7]">
                <Hotel size={16} />
                <span>{apiState.pagination.total || apiState.items.length} matched hotels</span>
              </div>

              <button
                type="button"
                className="routes-new-button"
                onClick={() => navigate(`${APP_ROUTES.hotels}/add`)}
              >
                <Plus size={15} />
                {HOTELS_PAGE_COPY.newButtonLabel}
              </button>
            </div>
          </div>
        </header>

        <HotelsOverview isLoading={apiState.isLoading} metrics={metrics} />
        {apiState.error ? <p className="month-balance-alert">{apiState.error}</p> : null}

        <AdminDataTable
          actions={
            <>
              <AdminTableButton
                className={apiState.isLoading ? 'opacity-60' : ''}
                disabled={apiState.isLoading}
                onClick={() => apiState.refresh()}
              >
                <RefreshCcw size={14} />
                Refresh
              </AdminTableButton>
              <button
                type="button"
                className="routes-new-button"
                onClick={() => navigate(`${APP_ROUTES.hotels}/add`)}
              >
                <Plus size={15} />
                {HOTELS_PAGE_COPY.newButtonLabel}
              </button>
            </>
          }
          columns={hotelColumns}
          data={apiState.items}
          emptyMessage="No hotels found."
          isLoading={apiState.isLoading}
          onPageChange={apiState.setPage}
          onSearchChange={(value) => {
            apiState.setPage(1)
            apiState.setSearch(value)
          }}
          pagination={apiState.pagination}
          renderRowActions={(hotelItem) => (
            <div className="routes-table__actions">
              <button
                type="button"
                className="routes-icon-button"
                aria-label={`View ${hotelItem.name}`}
                disabled={apiState.loadingHotelId === hotelItem.id}
                onClick={() => apiState.openDetails(hotelItem)}
              >
                <Eye size={15} />
              </button>
              <button
                type="button"
                className="routes-icon-button"
                aria-label={`Edit ${hotelItem.name}`}
                onClick={() => navigate(`${APP_ROUTES.hotels}/update/${hotelItem.id}`)}
              >
                <Pencil size={15} />
              </button>
            </div>
          )}
          resultLabel={resultLabel}
          rowActionsWidth="88px"
          search={apiState.search}
          searchPlaceholder={HOTELS_PAGE_COPY.searchPlaceholder}
        />
      </div>

      {apiState.detailsOpen ? (
        <HotelDetailsModal
          error={apiState.detailsError}
          fallbackHotel={apiState.selectedHotel}
          hotel={apiState.details}
          isLoading={apiState.detailsLoading}
          onClose={apiState.closeDetails}
        />
      ) : null}
    </main>
  )
}
