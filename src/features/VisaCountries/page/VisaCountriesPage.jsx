import { Globe2, Pencil, Plus, RefreshCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import AdminDataTable, { AdminTableButton } from '../../../components/ui/AdminDataTable'
import { useToast } from '../../../components/common/Toaster'
import { VisaCountriesOverview } from '../component/VisaCountriesOverview.jsx'
import { VisaCountryFormModal } from '../component/VisaCountryFormModal.jsx'
import { visaCountriesColumns } from '../component/column.jsx'
import { VISA_COUNTRIES_PAGE_COPY } from '../constants/visaCountries.constants'
import useVisaCountries from '../hooks/useVisaCountries'
import { fetchVisaCountryById } from '../service/visaCountriesService'
import { buildVisaCountryMetrics, buildVisaCountryPayload } from '../utils/visaCountriesUtils'

const INITIAL_MODAL_STATE = {
  country: null,
  countryId: null,
  isLoading: false,
  mode: 'create',
  open: false,
}

export default function VisaCountriesPage() {
  const toast = useToast()
  const apiState = useVisaCountries()
  const [modalState, setModalState] = useState(INITIAL_MODAL_STATE)

  const metrics = useMemo(() => buildVisaCountryMetrics(apiState.items), [apiState.items])

  const resultLabel = useMemo(() => {
    if (!apiState.pagination.total && !apiState.items.length) {
      return 'No visa countries found.'
    }

    const rangeLabel =
      apiState.pagination.from && apiState.pagination.to
        ? `${apiState.pagination.from}-${apiState.pagination.to}`
        : `${apiState.items.length}`

    return `Showing ${rangeLabel} of ${apiState.pagination.total || apiState.items.length} visa countries`
  }, [apiState.items.length, apiState.pagination.from, apiState.pagination.to, apiState.pagination.total])

  const closeModal = () => {
    setModalState(INITIAL_MODAL_STATE)
  }

  const openCreateModal = () => {
    setModalState({
      country: null,
      countryId: null,
      isLoading: false,
      mode: 'create',
      open: true,
    })
  }

  const openEditModal = async (country) => {
    setModalState({
      country: null,
      countryId: country.id,
      isLoading: true,
      mode: 'edit',
      open: true,
    })

    try {
      const visaCountry = await fetchVisaCountryById(country.id)
      setModalState({
        country: visaCountry,
        countryId: country.id,
        isLoading: false,
        mode: 'edit',
        open: true,
      })
    } catch (error) {
      toast.error(error.message || 'Unable to load visa country details.')
      setModalState(INITIAL_MODAL_STATE)
    }
  }

  const handleSubmit = async (values) => {
    try {
      const payload = buildVisaCountryPayload(values, modalState.mode)

      if (modalState.mode === 'edit' && modalState.countryId) {
        await apiState.updateItem(modalState.countryId, payload)
      } else {
        await apiState.createItem(payload)
      }

      closeModal()
    } catch (error) {
      toast.error(error.message || 'Unable to save visa country.')
    }
  }

  return (
    <main className="routes-page">
      <div className="routes-page__inner">
        <header className="routes-page__header">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="routes-page__title">
                <Globe2 size={20} color="#4f83ff" />
                <h1>{VISA_COUNTRIES_PAGE_COPY.title}</h1>
              </div>
              <p className="routes-page__subtitle">{VISA_COUNTRIES_PAGE_COPY.subtitle}</p>
            </div>

            <button type="button" className="routes-new-button" onClick={openCreateModal}>
              <Plus size={15} />
              {VISA_COUNTRIES_PAGE_COPY.newButtonLabel}
            </button>
          </div>
        </header>

        <VisaCountriesOverview metrics={metrics} pagination={apiState.pagination} />

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

              <button type="button" className="routes-new-button" onClick={openCreateModal}>
                <Plus size={15} />
                {VISA_COUNTRIES_PAGE_COPY.newButtonLabel}
              </button>
            </>
          }
          columns={visaCountriesColumns}
          data={apiState.items}
          emptyMessage="No visa countries found."
          isLoading={apiState.isLoading}
          onPageChange={apiState.setPage}
          onSearchChange={(value) => {
            apiState.setPage(1)
            apiState.setSearch(value)
          }}
          pagination={apiState.pagination}
          renderRowActions={(country) => (
            <div className="routes-table__actions">
              <button
                type="button"
                className="routes-icon-button"
                aria-label={`Edit ${country.name}`}
                onClick={() => openEditModal(country)}
              >
                <Pencil size={15} />
              </button>
            </div>
          )}
          resultLabel={resultLabel}
          rowActionsWidth="72px"
          search={apiState.search}
          searchPlaceholder={VISA_COUNTRIES_PAGE_COPY.searchPlaceholder}
        />
      </div>

      {modalState.open ? (
        <VisaCountryFormModal
          country={modalState.country}
          isLoading={modalState.isLoading}
          isMutating={apiState.isMutating}
          mode={modalState.mode}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      ) : null}
    </main>
  )
}
