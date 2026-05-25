import {
  Activity,
  ArrowDownCircle,
  ArrowUpCircle,
  CalendarRange,
  Wallet,
} from 'lucide-react'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import { DashboardMetricCard } from '../../../components/ui/DashboardMetricCard'
import { DailyBalanceMonthFilter } from '../component/DailyBalanceMonthFilter'
import { DailyBalanceHistoryTable } from '../component/DailyBalanceHistoryTable'
import { DailyBalanceLedger } from '../component/DailyBalanceLedger'
import { DailyBalanceOverview } from '../component/DailyBalanceOverview'
import { DailyBalanceReportViewer } from '../component/DailyBalanceReportViewer'
import useDailyBalanceHistory from '../hooks/useDailyBalanceHistory'
import useDailyBalanceReport from '../hooks/useDailyBalanceReport'
import { getCurrentDailyBalanceMonth } from '../service/dailyBalanceService'

function DailyBalanceSummary({ summary }) {
  const items = [
    {
      label: 'Current Balance',
      value: summary.currentBalanceLabel,
      icon: Wallet,
      tone: 'blue',
    },
    {
      label: 'Total Credit',
      value: summary.totalCreditLabel,
      icon: ArrowUpCircle,
      tone: 'emerald',
    },
    {
      label: 'Total Debit',
      value: summary.totalDebitLabel,
      icon: ArrowDownCircle,
      tone: 'amber',
    },
    {
      label: 'Transactions',
      value: String(summary.txCount),
      icon: Activity,
      tone: 'cyan',
    },
  ]

  return (
    <section className="month-balance-summary-grid" aria-label="Daily balance summary">
      {items.map((item) => (
        <DashboardMetricCard
          key={item.label}
          icon={item.icon}
          label={item.label}
          tone={item.tone}
          value={item.value}
        />
      ))}
    </section>
  )
}

export default function DailyBalancePage() {
  const toast = useToast()
  const [selectedMonth, setSelectedMonth] = useState(getCurrentDailyBalanceMonth())
  const [draftMonth, setDraftMonth] = useState(selectedMonth)
  const [selectedReport, setSelectedReport] = useState(null)
  const {
    data: reportData,
    error: reportError,
    isLoading: isReportLoading,
  } = useDailyBalanceReport(selectedMonth)
  const {
    data: historyData,
    error: historyError,
    isLoading: isHistoryLoading,
    page: historyPage,
    setPage: setHistoryPage,
  } = useDailyBalanceHistory()
  const hasMonthChanges = draftMonth !== selectedMonth

  const handleApplyMonth = () => {
    if (!draftMonth || !dayjs(`${draftMonth}-01`).isValid()) {
      toast.error('Please select a valid month.')
      return
    }

    setSelectedMonth(draftMonth)
  }

  const handleResetMonth = () => {
    const currentMonth = getCurrentDailyBalanceMonth()
    setDraftMonth(currentMonth)
    setSelectedMonth(currentMonth)
  }

  return (
    <main className="routes-page">
      <div className="routes-page__inner">
        <header className="routes-page__header">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="routes-page__title">
                <CalendarRange size={20} color="#4f83ff" />
                <h1>Monthly Daily Balance</h1>
              </div>
              <p className="routes-page__subtitle">
                Daily financial movement for the selected month, with previous-month report history.
              </p>
            </div>

            <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#332d30] bg-[#171314] px-4 text-sm font-semibold text-[#c5d9f7]">
              <CalendarRange size={16} />
              <span>{reportData.titleDateRange || reportData.monthLabel || 'Current month'}</span>
            </div>
          </div>
        </header>

        <section className="routes-table-card mb-6">
          <div className="routes-table-toolbar !h-auto !justify-between gap-4 px-4 py-3">
            <DailyBalanceMonthFilter
              draftMonth={draftMonth}
              hasChanges={hasMonthChanges}
              isLoading={isReportLoading}
              onApply={handleApplyMonth}
              onMonthChange={setDraftMonth}
              onReset={handleResetMonth}
            />
          </div>
        </section>

        <DailyBalanceSummary summary={reportData.summary} />
        <DailyBalanceOverview
          isLoading={isReportLoading}
          rows={reportData.rows}
          summary={reportData.summary}
        />
        {reportError ? <p className="month-balance-alert">{reportError}</p> : null}

        <div className="space-y-6">
          <DailyBalanceLedger
            error={reportError}
            isLoading={isReportLoading}
            rows={reportData.rows}
            summary={reportData.summary}
          />

          <DailyBalanceHistoryTable
            error={historyError}
            isLoading={isHistoryLoading}
            onPreview={setSelectedReport}
            page={historyPage}
            pagination={historyData.pagination}
            reports={historyData.rows}
            setPage={setHistoryPage}
          />
        </div>
      </div>

      {selectedReport ? (
        <DailyBalanceReportViewer
          onClose={() => setSelectedReport(null)}
          report={selectedReport}
        />
      ) : null}
    </main>
  )
}
