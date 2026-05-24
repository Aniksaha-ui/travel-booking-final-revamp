import dayjs from 'dayjs'
import { CalendarRange, RefreshCcw } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import { AdminTableButton } from '../../../components/ui/AdminDataTable'
import { AccountHistoryFilters } from '../component/AccountHistoryFilters.jsx'
import { AccountHistoryLedger } from '../component/AccountHistoryLedger.jsx'
import { AccountHistoryOverview } from '../component/AccountHistoryOverview.jsx'
import { ACCOUNT_HISTORY_COPY } from '../constants/accountHistory.constants'
import useAccountHistory from '../hooks/useAccountHistory'
import { createCurrentMonthDateRange } from '../utils/accountHistoryUtils'
import { validateAccountHistoryDateRange } from '../validation/accountHistoryValidation'

const formatHeaderDate = (value) => {
  const parsedDate = dayjs(value)
  return parsedDate.isValid() ? parsedDate.format('DD MMM YYYY') : value
}

export default function AccountHistoryPage() {
  const toast = useToast()
  const { data, dateRange, error, isLoading, page, refresh, setDateRange, setPage } = useAccountHistory()
  const [draftStartDate, setDraftStartDate] = useState(dateRange.startDate)
  const [draftEndDate, setDraftEndDate] = useState(dateRange.endDate)
  const { pagination, rows, summary } = data

  const hasChanges = draftStartDate !== dateRange.startDate || draftEndDate !== dateRange.endDate
  const headerWindowLabel = `${formatHeaderDate(dateRange.startDate)} - ${formatHeaderDate(dateRange.endDate)}`

  const handleApplyFilters = () => {
    const validationMessage = validateAccountHistoryDateRange({
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

  const handleResetFilters = () => {
    const currentMonthRange = createCurrentMonthDateRange()

    setDraftStartDate(currentMonthRange.startDate)
    setDraftEndDate(currentMonthRange.endDate)

    if (page !== 1) {
      setPage(1)
    }

    setDateRange(currentMonthRange)
  }

  return (
    <main className="routes-page">
      <div className="routes-page__inner">
        <header className="routes-page__header">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="routes-page__title">
                <CalendarRange size={20} color="#4f83ff" />
                <h1>{ACCOUNT_HISTORY_COPY.title}</h1>
              </div>
              <p className="routes-page__subtitle">{ACCOUNT_HISTORY_COPY.subtitle}</p>
            </div>

            <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#332d30] bg-[#171314] px-4 text-sm font-semibold text-[#c5d9f7]">
              <CalendarRange size={16} />
              <span>{headerWindowLabel}</span>
            </div>
          </div>
        </header>

        <AccountHistoryOverview isLoading={isLoading} summary={summary} />
        {error ? <p className="month-balance-alert">{error}</p> : null}

        <section className="routes-table-card mb-6">
          <div className="routes-table-toolbar !h-auto !justify-between gap-4 px-4 py-3">
            <AccountHistoryFilters
              draftEndDate={draftEndDate}
              draftStartDate={draftStartDate}
              hasChanges={hasChanges}
              isLoading={isLoading}
              onApply={handleApplyFilters}
              onEndDateChange={setDraftEndDate}
              onReset={handleResetFilters}
              onStartDateChange={setDraftStartDate}
            />

            <AdminTableButton className={isLoading ? 'opacity-60' : ''} disabled={isLoading} onClick={() => refresh()}>
              <RefreshCcw size={14} />
              Refresh
            </AdminTableButton>
          </div>
        </section>

        <AccountHistoryLedger
          isLoading={isLoading}
          onPageChange={setPage}
          page={page}
          pagination={pagination}
          rows={rows}
        />
      </div>
    </main>
  )
}
