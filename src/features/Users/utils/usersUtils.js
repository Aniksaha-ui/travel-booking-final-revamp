import dayjs from 'dayjs'
import { USERS_EMPTY_STATE } from '../constants/users.constants'

const compactCountFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  notation: 'compact',
})

const integerFormatter = new Intl.NumberFormat('en-US')

const normalizeText = (value, fallback = '-') => {
  if (value === undefined || value === null) {
    return fallback
  }

  const normalizedValue = String(value).trim()
  return normalizedValue || fallback
}

const toNumber = (value) => {
  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) ? parsedValue : 0
}

const formatDateLabel = (value, fallback = '-') => {
  const parsedValue = dayjs(value)
  return parsedValue.isValid() ? parsedValue.format('DD MMM YYYY') : fallback
}

const formatDateTimeLabel = (value, fallback = '-') => {
  const parsedValue = dayjs(value)
  return parsedValue.isValid() ? parsedValue.format('DD MMM YYYY, hh:mm A') : fallback
}

const toTitleCase = (value) =>
  normalizeText(value, '')
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`)
    .join(' ')

const normalizeRoleKey = (value) =>
  normalizeText(value, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

export const formatUserRoleLabel = (value) => {
  const normalizedValue = normalizeText(value, '')
  return normalizedValue ? toTitleCase(normalizedValue) : USERS_EMPTY_STATE.noRole
}

export const getUserRoleToneClassName = (role) => {
  const roleKey = normalizeRoleKey(role)

  if (roleKey.includes('super') && roleKey.includes('admin')) {
    return 'border-violet-500/20 bg-violet-500/10 text-violet-100'
  }

  if (roleKey.includes('admin')) {
    return 'border-blue-500/20 bg-blue-500/10 text-blue-100'
  }

  if (roleKey.includes('manager') || roleKey.includes('operator')) {
    return 'border-cyan-500/20 bg-cyan-500/10 text-cyan-100'
  }

  if (roleKey.includes('staff') || roleKey.includes('agent')) {
    return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-100'
  }

  return 'border-amber-500/20 bg-amber-500/10 text-amber-100'
}

const buildInitials = (name, email) => {
  const source = normalizeText(name, '').trim() || normalizeText(email, '').trim()

  if (!source) {
    return 'U'
  }

  const words = source.split(/[\s@._-]+/).filter(Boolean)

  if (!words.length) {
    return 'U'
  }

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
}

export const normalizeUser = (item = {}, index = 0, pagination = {}) => {
  const serial = (pagination.from || 0) + index + 1
  const email = normalizeText(item.email, USERS_EMPTY_STATE.noEmail)
  const name = normalizeText(item.name, USERS_EMPTY_STATE.noName)
  const role = normalizeText(item.role, USERS_EMPTY_STATE.noRole)
  const roleKey = normalizeRoleKey(role)
  const emailVerifiedAt = item.email_verified_at ?? item.emailVerifiedAt ?? ''
  const createdAt = item.created_at ?? item.createdAt ?? ''
  const isVerified = Boolean(emailVerifiedAt)

  return {
    createdAt,
    createdAtLabel: formatDateLabel(createdAt, '-'),
    createdAtTimeLabel: formatDateTimeLabel(createdAt, '-'),
    email,
    emailVerifiedAt,
    id: item.id ?? `user-${serial}`,
    initials: buildInitials(name, email),
    isVerified,
    name,
    role,
    roleKey,
    roleLabel: formatUserRoleLabel(role),
    serial,
    verifiedLabel: isVerified ? formatDateLabel(emailVerifiedAt, 'Verified') : USERS_EMPTY_STATE.notVerified,
  }
}

export const buildUserMetrics = (rows = []) => {
  const adminCount = rows.filter((row) => row.roleKey.includes('admin')).length
  const verifiedCount = rows.filter((row) => row.isVerified).length
  const roleCount = new Set(rows.map((row) => row.roleKey).filter(Boolean)).size
  const teamCount = rows.length - adminCount

  return {
    adminCount,
    adminCountLabel: compactCountFormatter.format(adminCount),
    roleCount,
    roleCountLabel: integerFormatter.format(roleCount),
    teamCount,
    teamCountLabel: compactCountFormatter.format(teamCount),
    totalCount: rows.length,
    totalCountLabel: compactCountFormatter.format(rows.length),
    verifiedCount,
    verifiedCountLabel: compactCountFormatter.format(verifiedCount),
  }
}

export const buildUserRoleFilters = (rows = []) => {
  const roleMap = new Map()

  rows.forEach((row) => {
    if (!row.roleKey) {
      return
    }

    if (!roleMap.has(row.roleKey)) {
      roleMap.set(row.roleKey, row.roleLabel)
    }
  })

  return [
    { key: 'all', label: 'All Users' },
    ...[...roleMap.entries()]
      .sort((firstEntry, secondEntry) => firstEntry[1].localeCompare(secondEntry[1]))
      .map(([key, label]) => ({ key, label })),
  ]
}

export const filterUsersByRole = (rows = [], roleFilter = 'all') => {
  if (roleFilter === 'all') {
    return rows
  }

  return rows.filter((row) => row.roleKey === roleFilter)
}

