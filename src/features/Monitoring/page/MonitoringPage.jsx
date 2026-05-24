import {
  Activity,
  Clock3,
  Database,
  History,
  RefreshCcw,
  Route,
  ServerCog,
  ShieldCheck,
  Users,
} from 'lucide-react'
import dayjs from 'dayjs'
import { AdminTableButton } from '../../../components/ui/AdminDataTable'
import { MONITORING_COPY } from '../constants/monitoring.constants'
import useMonitoring from '../hooks/useMonitoring'
import { MonitoringOverview } from '../component/MonitoringOverview.jsx'
import { MonitoringTable } from '../component/MonitoringTable.jsx'
import {
  controllerReportColumns,
  dailyReportColumns,
  requestHistoryColumns,
  routePerformanceColumns,
  sqlLogColumns,
  userReportColumns,
} from '../component/monitoringColumns.jsx'

export default function MonitoringPage() {
  const { data, error, isLoading, lastUpdatedAt, refresh } = useMonitoring()
  const latestCount = data.summary.latestRequestCount
  const lastUpdatedLabel = lastUpdatedAt ? dayjs(lastUpdatedAt).format('h:mm:ss A') : 'Not refreshed yet'

  return (
    <main className="routes-page">
      <div className="routes-page__inner">
        <header className="routes-page__header">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="routes-page__title">
                <ShieldCheck size={20} color="#4f83ff" />
                <h1>
                  {MONITORING_COPY.title} based on last {latestCount} request(s)
                </h1>
              </div>
              <p className="routes-page__subtitle">{MONITORING_COPY.subtitle}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex h-10 items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 text-sm font-semibold text-emerald-200">
                <Activity size={16} />
                {MONITORING_COPY.liveBadge}
              </span>
              <AdminTableButton className={isLoading ? 'opacity-60' : ''} disabled={isLoading} onClick={refresh}>
                <RefreshCcw size={14} />
                Refresh
              </AdminTableButton>
            </div>
          </div>
        </header>

        <MonitoringOverview isLoading={isLoading} summary={data.summary} />

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#332d30] bg-[#171314] px-5 py-3 text-sm text-[#9fb2d0]">
          <span className="font-semibold text-[#c5d9f7]">Last updated: {lastUpdatedLabel}</span>
          <span>{data.summary.slowQueriesLabel} slow queries currently tracked</span>
        </div>

        {error ? <p className="month-balance-alert">{error}</p> : null}

        <MonitoringTable
          columns={dailyReportColumns}
          emptyMessage="No daily monitoring summary found."
          icon={<Clock3 size={16} className="text-blue-400" />}
          rows={data.dailyReport}
          title="Daily Summary"
        />

        <MonitoringTable
          columns={routePerformanceColumns}
          emptyMessage="No route performance records found."
          getRowClassName={(row) => (row.isSlow ? 'is-warning' : '')}
          icon={<Route size={16} className="text-emerald-300" />}
          rows={data.routeReport}
          title="Route Performance"
        />

        <MonitoringTable
          columns={controllerReportColumns}
          emptyMessage="No controller load records found."
          icon={<ServerCog size={16} className="text-cyan-300" />}
          rows={data.controllerReport}
          title="Controller Load"
        />

        <MonitoringTable
          columns={userReportColumns}
          emptyMessage="No user activity records found."
          icon={<Users size={16} className="text-amber-300" />}
          rows={data.userReport}
          title="User Activity"
        />

        <MonitoringTable
          columns={requestHistoryColumns}
          emptyMessage="No recent request history found."
          icon={<History size={16} className="text-blue-300" />}
          rows={data.requestReport}
          title="Recent Requests"
        />

        <MonitoringTable
          columns={sqlLogColumns}
          emptyMessage="No SQL logs found."
          getRowClassName={(row) => (row.isSlow ? 'is-warning' : '')}
          icon={<Database size={16} className="text-rose-300" />}
          rows={data.latestLogs}
          title="Latest SQL Logs"
        />
      </div>
    </main>
  )
}
