import { formatUserRoleLabel, getUserRoleToneClassName } from '../utils/usersUtils'

export const usersColumns = ({ loadingUserId = null, onViewProfile } = {}) => [
  {
    id: 'serial',
    label: 'SL',
    accessor: 'serial',
    width: '76px',
  },
  {
    id: 'name',
    label: 'Name',
    render: (user) => (
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#17214a] text-xs font-bold text-[#7ea1ff]">
          {user.initials}
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold text-white">{user.name}</p>
          <p className="truncate text-xs text-[#7d8ca5]">User ID: {user.id}</p>
        </div>
      </div>
    ),
    width: '28%',
  },
  {
    id: 'email',
    label: 'Email',
    render: (user) => (
      <div className="space-y-1">
        <p className="truncate text-sm text-[#dbe7fb]">{user.email}</p>
        <p className="text-xs text-[#7d8ca5]">{user.verifiedLabel}</p>
      </div>
    ),
    width: '30%',
  },
  {
    id: 'role',
    label: 'Role',
    render: (user) => (
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getUserRoleToneClassName(
          user.role,
        )}`}
      >
        {formatUserRoleLabel(user.role)}
      </span>
    ),
    width: '16%',
  },
  {
    id: 'createdAtLabel',
    label: 'Joined',
    accessor: 'createdAtLabel',
    width: '14%',
  },
  {
    id: 'profileAction',
    label: 'Profile',
    width: '160px',
    sortable: false,
    render: (user) => (
      <button
        type="button"
        className="routes-control routes-control--blue"
        disabled={loadingUserId === user.id}
        onClick={() => onViewProfile?.(user)}
      >
        Show Profile
      </button>
    ),
  },
  {
    id: 'verifiedStatus',
    label: 'Verification',
    defaultHidden: true,
    render: (user) => (
      <span className="text-sm text-[#9fb2d0]">{user.isVerified ? 'Verified' : 'Unverified'}</span>
    ),
    width: '14%',
  },
]
