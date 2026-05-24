import { FileText, Pencil, Plus, RefreshCcw } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import AdminDataTable, { AdminTableButton } from '../../../components/ui/AdminDataTable'
import { useToast } from '../../../components/common/Toaster'
import { visaTypesColumns } from '../component/column.jsx'
import { VisaTypeFormModal } from '../component/VisaTypeFormModal.jsx'
import { VisaTypesOverview } from '../component/VisaTypesOverview.jsx'
import { VISA_TYPES_PAGE_COPY } from '../constants/visaTypes.constants'
import useVisaTypes from '../hooks/useVisaTypes'
import { fetchVisaCountryOptions, fetchVisaTypeById } from '../service/visaTypesService'
import { buildVisaTypeMetrics, buildVisaTypePayload } from '../utils/visaTypesUtils'

const INITIAL_MODAL_STATE = {
  isLoading: false,
  mode: 'create',
  open: false,
  visaType: null,
  visaTypeId: null,
}

export default function VisaTypesPage() {
  const toast = useToast()
  const apiState = useVisaTypes()
  const [countries, setCountries] = useState([])
  const [countriesLoading, setCountriesLoading] = useState(true)
  const [modalState, setModalState] = useState(INITIAL_MODAL_STATE)

  useEffect(() => {
    let mounted = true

    const loadCountries = async () => {
      setCountriesLoading(true)

      try {
        const options = await fetchVisaCountryOptions()

        if (!mounted) {
          return
        }

        setCountries(options)
      } catch (error) {
        if (!mounted) {
          return
        }

        setCountries([])
        toast.error(error.message || 'Unable to load visa country options.')
      } finally {
        if (mounted) {
          setCountriesLoading(false)
        }
      }
    }

    void loadCountries()

    return () => {
      mounted = false
    }
  }, [toast])

  const metrics = useMemo(() => buildVisaTypeMetrics(apiState.items), [apiState.items])

  const resultLabel = useMemo(() => {
    if (!apiState.pagination.total && !apiState.items.length) {
      return 'No visa types found.'
    }

    const rangeLabel =
      apiState.pagination.from && apiState.pagination.to
        ? `${apiState.pagination.from}-${apiState.pagination.to}`
        : `${apiState.items.length}`

    return `Showing ${rangeLabel} of ${apiState.pagination.total || apiState.items.length} visa types`
  }, [apiState.items.length, apiState.pagination.from, apiState.pagination.to, apiState.pagination.total])

  const closeModal = () => {
    setModalState(INITIAL_MODAL_STATE)
  }

  const openCreateModal = () => {
    setModalState({
      isLoading: false,
      mode: 'create',
      open: true,
      visaType: null,
      visaTypeId: null,
    })
  }

  const openEditModal = async (visaType) => {
    setModalState({
      isLoading: true,
      mode: 'edit',
      open: true,
      visaType: null,
      visaTypeId: visaType.id,
    })

    try {
      const details = await fetchVisaTypeById(visaType.id)
      setModalState({
        isLoading: false,
        mode: 'edit',
        open: true,
        visaType: details,
        visaTypeId: visaType.id,
      })
    } catch (error) {
      toast.error(error.message || 'Unable to load visa type details.')
      setModalState(INITIAL_MODAL_STATE)
    }
  }

  const handleSubmit = async (values) => {
    try {
      const payload = buildVisaTypePayload(values)

      if (modalState.mode === 'edit' && modalState.visaTypeId) {
        await apiState.updateItem(modalState.visaTypeId, payload)
      } else {
        await apiState.createItem(payload)
      }

      closeModal()
    } catch (error) {
      toast.error(error.message || 'Unable to save visa type.')
    }
  }

  return (
    <main className="routes-page">
      <div className="routes-page__inner">
        <header className="routes-page__header">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="routes-page__title">
                <FileText size={20} color="#4f83ff" />
                <h1>{VISA_TYPES_PAGE_COPY.title}</h1>
              </div>
              <p className="routes-page__subtitle">{VISA_TYPES_PAGE_COPY.subtitle}</p>
            </div>

            <button type="button" className="routes-new-button" onClick={openCreateModal}>
              <Plus size={15} />
              {VISA_TYPES_PAGE_COPY.newButtonLabel}
            </button>
          </div>
        </header>

        <VisaTypesOverview metrics={metrics} pagination={apiState.pagination} />

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
                {VISA_TYPES_PAGE_COPY.newButtonLabel}
              </button>
            </>
          }
          columns={visaTypesColumns}
          data={apiState.items}
          emptyMessage="No visa types found."
          isLoading={apiState.isLoading}
          onPageChange={apiState.setPage}
          onSearchChange={(value) => {
            apiState.setPage(1)
            apiState.setSearch(value)
          }}
          pagination={apiState.pagination}
          renderRowActions={(visaType) => (
            <div className="routes-table__actions">
              <button
                type="button"
                className="routes-icon-button"
                aria-label={`Edit ${visaType.visaName}`}
                onClick={() => openEditModal(visaType)}
              >
                <Pencil size={15} />
              </button>
            </div>
          )}
          resultLabel={resultLabel}
          rowActionsWidth="72px"
          search={apiState.search}
          searchPlaceholder={VISA_TYPES_PAGE_COPY.searchPlaceholder}
        />
      </div>

      {modalState.open ? (
        <VisaTypeFormModal
          countries={countries}
          countriesLoading={countriesLoading}
          isLoading={modalState.isLoading}
          isMutating={apiState.isMutating}
          mode={modalState.mode}
          onClose={closeModal}
          onSubmit={handleSubmit}
          visaType={modalState.visaType}
        />
      ) : null}
    </main>
  )
}
