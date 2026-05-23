import {
  ArrowDownCircle,
  ArrowUpCircle,
  CalendarRange,
  Landmark,
  Wallet,
} from 'lucide-react'
import AdminDataTable from '../../../components/ui/AdminDataTable'
import { DashboardMetricCard } from '../../../components/ui/DashboardMetricCard'
import { MonthBalanceManagementOverview } from '../component/MonthBalanceManagementOverview'
import { monthRunningBalanceColumns } from '../component/column.jsx'
import { MONTH_RUNNING_BALANCE_COPY } from '../constants/monthRunningBalance.constants.jsx'
import useMonthRunningBalance from '../hooks/useMonthRunningBalance'

function MonthRunningBalanceSummary({ summary }) {
  const items = [
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
      label: 'Latest Closing Balance',
      value: summary.latestClosingBalanceLabel,
      icon: Wallet,
      tone: 'blue',
    },
    {
      label: 'Average Closing Balance',
      value: summary.averageClosingBalanceLabel,
      icon: Landmark,
      tone: 'cyan',
    },
  ]

  return (
    <section className="month-balance-summary-grid" aria-label="Monthly balance summary">
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

export default function MonthRunningBalancePage() {
  const { data, error, isLoading, page, search, setPage, setSearch } = useMonthRunningBalance()
  const { pagination, rows, summary } = data

  return (
    <main className="routes-page">
      <div className="routes-page__inner">
        <header className="routes-page__header">
          <div className="routes-page__title">
            <CalendarRange size={20} color="#4f83ff" />
            <h1>{MONTH_RUNNING_BALANCE_COPY.title}</h1>
          </div>
          <p className="routes-page__subtitle">{MONTH_RUNNING_BALANCE_COPY.subtitle}</p>
        </header>

        <MonthRunningBalanceSummary summary={summary} />
        <MonthBalanceManagementOverview isLoading={isLoading} rows={rows} summary={summary} />

        {error ? <p className="month-balance-alert">{error}</p> : null}

        <AdminDataTable
          columns={monthRunningBalanceColumns}
          data={rows}
          emptyMessage="No monthly running balance records found."
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
              ? `Showing ${pagination.from}-${pagination.to} of ${pagination.total} months`
              : `Showing ${rows.length} months`
          }
          search={search}
          searchPlaceholder={MONTH_RUNNING_BALANCE_COPY.searchPlaceholder}
        />
      </div>
    </main>
  )
}
