import { Eye, Package, Plus } from 'lucide-react'
import { useState } from 'react'
import AdminDataTable from '../../../components/ui/AdminDataTable'
import { useToast } from '../../../components/common/Toaster'
import { packageColumns } from '../component/column.jsx'
import { PackageDetailsModal } from '../component/PackageDetailsModal.jsx'
import { PackageFormModal } from '../component/PackageFormModal.jsx'
import { PackageManagementOverview } from '../component/PackageManagementOverview.jsx'
import { PACKAGES_PAGE_COPY, EMPTY_PACKAGE_DETAILS } from '../constants/packages.constants.jsx'
import usePackageFormOptions from '../hooks/usePackageFormOptions'
import usePackages from '../hooks/usePackages'
import { toPackageFormData } from '../utils/packageUtils'

export default function PackagesPage() {
  const toast = useToast()
  const apiState = usePackages()
  const optionsState = usePackageFormOptions()
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [detailsState, setDetailsState] = useState({
    details: EMPTY_PACKAGE_DETAILS,
    isLoading: false,
    open: false,
    packageItem: null,
  })

  const handleOpenDetails = async (packageItem) => {
    setDetailsState({
      details: EMPTY_PACKAGE_DETAILS,
      isLoading: true,
      open: true,
      packageItem,
    })

    try {
      const details = await apiState.fetchDetails(packageItem.id)
      setDetailsState({
        details,
        isLoading: false,
        open: true,
        packageItem,
      })
    } catch (error) {
      toast.error(error.message || 'Unable to load package details.')
      setDetailsState({
        details: EMPTY_PACKAGE_DETAILS,
        isLoading: false,
        open: false,
        packageItem: null,
      })
    }
  }

  const handleCreatePackage = async (values) => {
    const wasCreated = await apiState.createItem(toPackageFormData(values))

    if (wasCreated) {
      setCreateModalOpen(false)
    }
  }

  return (
    <main className="routes-page">
      <div className="routes-page__inner">
        <header className="routes-page__header">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="routes-page__title">
                <Package size={20} color="#4f83ff" />
                <h1>{PACKAGES_PAGE_COPY.title}</h1>
              </div>
              <p className="routes-page__subtitle">{PACKAGES_PAGE_COPY.subtitle}</p>
            </div>

            <button type="button" className="routes-new-button" onClick={() => setCreateModalOpen(true)}>
              <Plus size={15} />
              {PACKAGES_PAGE_COPY.newButtonLabel}
            </button>
          </div>
        </header>

        <PackageManagementOverview packages={apiState.items} />
        {apiState.error ? <p className="month-balance-alert">{apiState.error}</p> : null}

        <AdminDataTable
          actions={
            <button type="button" className="routes-new-button" onClick={() => setCreateModalOpen(true)}>
              <Plus size={15} />
              {PACKAGES_PAGE_COPY.newButtonLabel}
            </button>
          }
          columns={packageColumns}
          data={apiState.items}
          isLoading={apiState.isLoading}
          onPageChange={apiState.setPage}
          onSearchChange={(value) => {
            apiState.setPage(1)
            apiState.setSearch(value)
          }}
          pagination={apiState.pagination}
          renderRowActions={(packageItem) => (
            <div className="routes-table__actions">
              <button
                type="button"
                className="routes-icon-button"
                aria-label={`View ${packageItem.name}`}
                onClick={() => handleOpenDetails(packageItem)}
              >
                <Eye size={15} />
              </button>
            </div>
          )}
          resultLabel={`Showing ${apiState.pagination.from}-${apiState.pagination.to} of ${apiState.pagination.total} package results`}
          rowActionsWidth="64px"
          search={apiState.search}
          searchPlaceholder={PACKAGES_PAGE_COPY.searchPlaceholder}
        />
      </div>

      {createModalOpen ? (
        <PackageFormModal
          guideOptions={optionsState.guides}
          isMutating={apiState.isMutating}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={handleCreatePackage}
          optionsLoading={optionsState.isLoading}
          tripOptions={optionsState.trips}
        />
      ) : null}

      {detailsState.open ? (
        <PackageDetailsModal
          details={detailsState.details}
          isLoading={detailsState.isLoading}
          onClose={() =>
            setDetailsState({
              details: EMPTY_PACKAGE_DETAILS,
              isLoading: false,
              open: false,
              packageItem: null,
            })
          }
          packageItem={detailsState.packageItem}
        />
      ) : null}
    </main>
  )
}
