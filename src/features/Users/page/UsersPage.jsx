import { RefreshCcw, UsersRound } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminDataTable, { AdminTableButton } from '../../../components/ui/AdminDataTable'
import { APP_ROUTES } from '../../../constants/routes'
import { UsersOverview } from '../component/UsersOverview.jsx'
import { usersColumns } from '../component/column.jsx'
import { USERS_PAGE_COPY } from '../constants/users.constants'
import useUsers from '../hooks/useUsers'
import { buildUserMetrics, buildUserRoleFilters, filterUsersByRole } from '../utils/usersUtils'

export default function UsersPage() {
  const navigate = useNavigate()
  const apiState = useUsers()
  const [roleFilter, setRoleFilter] = useState('all')
  const roleFilters = useMemo(() => buildUserRoleFilters(apiState.items), [apiState.items])
  const visibleUsers = useMemo(
    () => filterUsersByRole(apiState.items, roleFilter),
    [apiState.items, roleFilter],
  )
  const metrics = useMemo(() => buildUserMetrics(apiState.items), [apiState.items])
  const columns = useMemo(
    () =>
      usersColumns({
        loadingUserId: apiState.loadingUserId,
        onViewProfile: (user) => navigate(APP_ROUTES.userProfile(user.id)),
      }),
    [apiState.loadingUserId, navigate],
  )

  useEffect(() => {
    if (!roleFilters.some((filter) => filter.key === roleFilter)) {
      setRoleFilter('all')
    }
  }, [roleFilter, roleFilters])

  const resultLabel = useMemo(() => {
    if (!apiState.pagination.total && !apiState.items.length) {
      return 'No users found.'
    }

    const filterLabel =
      roleFilters.find((filter) => filter.key === roleFilter)?.label.toLowerCase() ?? 'all users'
    const rangeLabel =
      apiState.pagination.from && apiState.pagination.to
        ? `${apiState.pagination.from}-${apiState.pagination.to}`
        : '0'

    return `Showing ${visibleUsers.length} ${filterLabel} on this page • ${rangeLabel} of ${apiState.pagination.total} matched accounts`
  }, [
    apiState.items.length,
    apiState.pagination.from,
    apiState.pagination.to,
    apiState.pagination.total,
    roleFilter,
    roleFilters,
    visibleUsers.length,
  ])

  return (
    <main className="routes-page">
      <div className="routes-page__inner">
        <header className="routes-page__header">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="routes-page__title">
                <UsersRound size={20} color="#4f83ff" />
                <h1>{USERS_PAGE_COPY.title}</h1>
              </div>
              <p className="routes-page__subtitle">{USERS_PAGE_COPY.subtitle}</p>
            </div>

            <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#332d30] bg-[#171314] px-4 text-sm font-semibold text-[#c5d9f7]">
              <UsersRound size={16} />
              <span>{apiState.pagination.total || apiState.items.length} matched accounts</span>
            </div>
          </div>
        </header>

        <UsersOverview isLoading={apiState.isLoading} metrics={metrics} />
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
          columns={columns}
          data={visibleUsers}
          emptyMessage={
            roleFilter === 'all'
              ? 'No users found.'
              : `No ${roleFilters.find((filter) => filter.key === roleFilter)?.label.toLowerCase()} on this page.`
          }
          filters={
            <div className="refund-filter-group">
              {roleFilters.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  className={`refund-filter-button ${roleFilter === filter.key ? 'is-active' : ''}`}
                  onClick={() => setRoleFilter(filter.key)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          }
          isLoading={apiState.isLoading}
          onPageChange={apiState.setPage}
          onSearchChange={(value) => {
            apiState.setPage(1)
            apiState.setSearch(value)
          }}
          pagination={apiState.pagination}
          resultLabel={resultLabel}
          search={apiState.search}
          searchPlaceholder={USERS_PAGE_COPY.searchPlaceholder}
        />
      </div>
    </main>
  )
}
