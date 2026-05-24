import dayjs from 'dayjs'
import { BusFront, RefreshCcw } from 'lucide-react'
import { useState } from 'react'
import AdminDataTable, { AdminTableButton } from '../../../components/ui/AdminDataTable'
import { useToast } from '../../../components/common/Toaster'
import { vehicleTrackingReportColumns } from '../component/column.jsx'
import { VehicleTrackingReportFilters } from '../component/VehicleTrackingReportFilters.jsx'
import { VehicleTrackingReportOverview } from '../component/VehicleTrackingReportOverview.jsx'
import { VEHICLE_TRACKING_REPORT_COPY } from '../constants/vehicleTrackingReport.constants'
import useVehicleTrackingReport from '../hooks/useVehicleTrackingReport'
import { validateVehicleTrackingDateRange } from '../validation/vehicleTrackingReportValidation'

const formatHeaderDate = (value) => {
  const parsedDate = dayjs(value)
  return parsedDate.isValid() ? parsedDate.format('DD MMM YYYY') : value
}

export default function VehicleTrackingReportPage() {
  const toast = useToast()
  const { data, dateRange, error, isLoading, page, refresh, search, setDateRange, setPage, setSearch } =
    useVehicleTrackingReport()
  const { pagination, rows, summary } = data
  const [draftStartDate, setDraftStartDate] = useState(dateRange.startDate)
  const [draftEndDate, setDraftEndDate] = useState(dateRange.endDate)

  const hasActiveRange = Boolean(dateRange.startDate || dateRange.endDate)
  const headerWindowLabel = hasActiveRange
    ? `${formatHeaderDate(dateRange.startDate)} - ${formatHeaderDate(dateRange.endDate)}`
    : summary.coverageWindowLabel

  const handleApplyFilters = () => {
    const validationMessage = validateVehicleTrackingDateRange({
      endDate: draftEndDate,
      startDate: draftStartDate,
    })

    if (validationMessage) {
      toast.error(validationMessage)
      return
    }

    if (page !== 1) {
      setPage(1)
    }

    setDateRange({
      endDate: draftEndDate,
      startDate: draftStartDate,
    })
  }

  const handleClearFilters = () => {
    setDraftStartDate('')
    setDraftEndDate('')

    if (page !== 1) {
      setPage(1)
    }

    setDateRange({
      endDate: '',
      startDate: '',
    })
  }

  return (
    <main className="routes-page">
      <div className="routes-page__inner">
        <header className="routes-page__header">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="routes-page__title">
                <BusFront size={20} color="#4f83ff" />
                <h1>{VEHICLE_TRACKING_REPORT_COPY.title}</h1>
              </div>
              <p className="routes-page__subtitle">{VEHICLE_TRACKING_REPORT_COPY.subtitle}</p>
            </div>

            <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#332d30] bg-[#171314] px-4 text-sm font-semibold text-[#c5d9f7]">
              <BusFront size={16} />
              <span>{headerWindowLabel}</span>
            </div>
          </div>
        </header>

        <VehicleTrackingReportOverview isLoading={isLoading} rows={rows} />
        {error ? <p className="month-balance-alert">{error}</p> : null}

        <AdminDataTable
          actions={
            <AdminTableButton className={isLoading ? 'opacity-60' : ''} disabled={isLoading} onClick={refresh}>
              <RefreshCcw size={14} />
              Refresh
            </AdminTableButton>
          }
          columns={vehicleTrackingReportColumns}
          data={rows}
          emptyMessage="No vehicle tracking records found for this filter."
          filters={
            <VehicleTrackingReportFilters
              draftEndDate={draftEndDate}
              draftStartDate={draftStartDate}
              hasActiveRange={hasActiveRange}
              isLoading={isLoading}
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
              onEndDateChange={setDraftEndDate}
              onStartDateChange={setDraftStartDate}
            />
          }
          isLoading={isLoading}
          onPageChange={setPage}
          onSearchChange={(value) => {
            if (page !== 1) {
              setPage(1)
            }

            setSearch(value)
          }}
          pagination={pagination}
          resultLabel={
            pagination
              ? `Showing ${pagination.from}-${pagination.to} of ${pagination.total} tracking entries`
              : `Showing ${rows.length} tracking entries`
          }
          search={search}
          searchPlaceholder={VEHICLE_TRACKING_REPORT_COPY.searchPlaceholder}
        />
      </div>
    </main>
  )
}
